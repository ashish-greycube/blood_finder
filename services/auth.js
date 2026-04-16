import * as AuthSession from "expo-auth-session";
import { makeRedirectUri } from "expo-auth-session";
import * as Linking from "expo-linking";
import * as SecureStore from "expo-secure-store";
import { FrappeApp } from "frappe-js-sdk";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { AppState } from "react-native"; // <-- Added AppState from solution
import {
  OAUTH_CLIENT_ID as client_id,
  SECURE_AUTH_STATE_KEY,
  BASE_URI as url,
} from "../constants/constant";

const AuthContext = createContext({});

// ─── Constants synced with solution logic ────────────────────────
const REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes buffer
const REFRESH_POLL_INTERVAL_MS = 5 * 60 * 1000; // Poll every 5 mins
const DEFAULT_EXPIRES_IN_SECONDS = 3600;
const MAX_RETRY_ATTEMPTS = 3;

const AuthProvider = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [expiresIn, setExpiresIn] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);

  const discovery = useMemo(() => ({
    authorizationEndpoint: `${url}/api/method/frappe.integrations.oauth2.authorize`,
    tokenEndpoint: `${url}/api/method/frappe.integrations.oauth2.get_token`,
    revocationEndpoint: `${url}/api/method/frappe.integrations.oauth2.revoke_token`,
  }), [url]);

  const isExchangingCode = useRef(false);
  const lastExchangedCode = useRef(null);
  const isRefreshing = useRef(false);
  const tokenRef = useRef({ accessToken, refreshToken, expiresIn });

  useEffect(() => {
    tokenRef.current = { accessToken, refreshToken, expiresIn };
  }, [accessToken, refreshToken, expiresIn]);

  const redirectUri = useMemo(() => makeRedirectUri({ native: "bloodfinder:" }), []);
  console.log("AuthProvider initialized with redirect URI:", redirectUri);

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: client_id,
      redirectUri,
      responseType: "code",
      scopes: ["all", "openid"],
      usePKCE: false,
    },
    discovery
  );

  // ─── Storage Helpers ───────────────────────────────────────────

  const saveAuthState = useCallback(async (authData) => {
    try {
      const expirationTime = new Date();
      const expiresInSeconds = authData.expiresIn || DEFAULT_EXPIRES_IN_SECONDS;
      expirationTime.setSeconds(expirationTime.getSeconds() + Number(expiresInSeconds));

      const isoExpiry = expirationTime.toISOString();

      const storageValue = JSON.stringify({
        accessToken: authData.accessToken,
        refreshToken: authData.refreshToken,
        expiresIn: isoExpiry,
      });

      await SecureStore.setItemAsync(SECURE_AUTH_STATE_KEY, storageValue);

      setAccessToken(authData.accessToken);
      setRefreshToken(authData.refreshToken);
      setExpiresIn(isoExpiry);
      setIsAuthenticated(true);
      setError(null);
    } catch (e) {
      console.error("Failed to save auth state:", e);
      setError("Failed to save authentication state");
    }
  }, []);

  const clearAuthState = useCallback(async () => {
    try {
      await SecureStore.deleteItemAsync(SECURE_AUTH_STATE_KEY);
    } catch (e) {
      console.error("Failed to clear secure store:", e);
    }
    setIsAuthenticated(false);
    setAccessToken(null);
    setRefreshToken(null);
    setExpiresIn(null);
    setUserInfo(null);

    // ─── FIX: Wipe refs to prevent multiple-click bug ───
    lastExchangedCode.current = null;
    isExchangingCode.current = false;
    isRefreshing.current = false;
  }, []);

  // ─── Token Validation (Adapted from Solution) ─────────────────

  const shouldRefreshToken = useCallback(() => {
    const { expiresIn: exp } = tokenRef.current;
    if (!exp) return true;

    const expirationTime = new Date(exp).getTime();
    const currentTime = Date.now();
    const timeUntilExpiry = expirationTime - currentTime;

    return timeUntilExpiry <= REFRESH_THRESHOLD_MS;
  }, []);

  const isTokenExpired = useCallback(() => {
    const { expiresIn: exp } = tokenRef.current;
    if (!exp) return true;

    const expirationTime = new Date(exp).getTime();
    const currentTime = Date.now();

    return expirationTime <= currentTime;
  }, []);

  // ─── Revoke Token ─────────────────────────────────────────────

  const revokeToken = useCallback(async (token) => {
    const tokenToRevoke = token || tokenRef.current.accessToken;
    if (!tokenToRevoke) return;
    try {
      await AuthSession.revokeAsync(
        { token: tokenToRevoke },
        { revocationEndpoint: discovery.revocationEndpoint }
      );
    } catch (e) {
      console.error("Failed to revoke token:", e);
    }
  }, [discovery]);

  // ─── Refresh Token ────────────────────────────────────────────

  const refreshAccessToken = useCallback(
    async (retryCount = 0) => {
      if (isRefreshing.current) return tokenRef.current.accessToken;

      // 1. Capture BOTH the refresh token and the old access token before we overwrite them
      const {
        refreshToken: currentRefreshToken,
        accessToken: oldAccessToken
      } = tokenRef.current;

      if (!currentRefreshToken) {
        await clearAuthState();
        return null;
      }

      isRefreshing.current = true;

      try {
        const res = await AuthSession.refreshAsync(
          {
            clientId: client_id,
            refreshToken: currentRefreshToken,
          },
          { tokenEndpoint: discovery.tokenEndpoint }
        );

        await saveAuthState({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken || currentRefreshToken,
          expiresIn: res.expiresIn,
        });

        console.log("Token refreshed successfully");

        if (oldAccessToken) {
          console.log("Cleaning up old token in Frappe...");
          revokeToken(oldAccessToken);
        }

        return res.accessToken;
      } catch (err) {
        console.error(`Refresh failed:`, err);

        if (retryCount < MAX_RETRY_ATTEMPTS - 1) {
          isRefreshing.current = false;
          return await refreshAccessToken(retryCount + 1);
        }

        await clearAuthState();
        return null;
      } finally {
        isRefreshing.current = false;
      }
    },
    [clearAuthState, saveAuthState, revokeToken, discovery, client_id]
  );

  const getValidToken = useCallback(async () => {
    const { accessToken: currentToken } = tokenRef.current;
    if (!currentToken) return null;
    if (!isTokenExpired()) return currentToken;
    return await refreshAccessToken();
  }, [isTokenExpired, refreshAccessToken]);

  const getFrappeClient = useCallback(() => {
    return new FrappeApp(url, {
      useToken: true,
      type: "Bearer",
      token: () => tokenRef.current.accessToken,
    });
  }, [url]);

  const fetchUserInfo = useCallback(async () => {
    const token = await getValidToken();
    if (!token) return null;

    try {
      const frappe = getFrappeClient();
      const call = frappe.call();
      const info = await call.get("frappe.integrations.oauth2.openid_profile");
      setUserInfo(info);
      return info;
    } catch (e) {
      console.error("Failed to fetch user info:", e);
      const newToken = await refreshAccessToken();
      if (newToken) {
        try {
          const frappe = getFrappeClient();
          const call = frappe.call();
          const info = await call.get("frappe.integrations.oauth2.openid_profile");
          setUserInfo(info);
          return info;
        } catch (retryError) {
          await clearAuthState();
        }
      }
      return null;
    }
  }, [getValidToken, getFrappeClient, refreshAccessToken, clearAuthState]);

  const exchangeCode = useCallback(
    async (code) => {
      if (isExchangingCode.current || lastExchangedCode.current === code) return false;

      isExchangingCode.current = true;
      lastExchangedCode.current = code;

      try {
        const res = await AuthSession.exchangeCodeAsync(
          {
            clientId: client_id,
            redirectUri,
            code,
          },
          { tokenEndpoint: discovery.tokenEndpoint }
        );

        await saveAuthState({
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
          expiresIn: res.expiresIn,
        });

        return true;
      } catch (err) {
        console.error("[Auth] exchangeCode error:", err?.message, err?.status, JSON.stringify(err?.body ?? err));
        setError("Authentication failed during code exchange");
        return false;
      } finally {
        isExchangingCode.current = false;
      }
    },
    [redirectUri, saveAuthState, discovery, client_id]
  );

  const logout = useCallback(async () => {
    await revokeToken();
    await clearAuthState();
  }, [revokeToken, clearAuthState]);

  // ─── Initialize: Restore session (Safe Startup) ─────────────────

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const result = await SecureStore.getItemAsync(SECURE_AUTH_STATE_KEY);
        if (result) {
          const parsed = JSON.parse(result);

          tokenRef.current = {
            accessToken: parsed.accessToken,
            refreshToken: parsed.refreshToken,
            expiresIn: parsed.expiresIn
          };

          // ─── FIX: Block login if expired on load ───
          if (isTokenExpired() || shouldRefreshToken()) {
            const newToken = await refreshAccessToken();
            if (newToken) {
              setIsAuthenticated(true);
            } else {
              await clearAuthState();
            }
          } else {
            setAccessToken(parsed.accessToken);
            setRefreshToken(parsed.refreshToken);
            setExpiresIn(parsed.expiresIn);
            setIsAuthenticated(true);
          }
        }
      } catch (e) {
        console.error("Failed to restore session:", e);
      } finally {
        setIsLoading(false);
      }
    };

    restoreSession();
  }, []);

  const exchangeCodeRef = useRef(exchangeCode);
  useEffect(() => { exchangeCodeRef.current = exchangeCode; }, [exchangeCode]);

  useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      if (code) exchangeCodeRef.current(code);
    } else if (response?.type === "error") {
      setError(response.error?.message || "Authentication failed");
    }
  }, [response]); // only fires on new OAuth response, not on URL/discovery changes

  useEffect(() => {
    const subscription = Linking.addEventListener("url", ({ url }) => {
      if (!url.startsWith(redirectUri)) return;
      const match = url.match(/[?&]code=([^&]+)/);
      if (match?.[1]) exchangeCode(match[1]);
    });
    return () => subscription.remove();
  }, [redirectUri, exchangeCode]);

  useEffect(() => {
    if (accessToken && isAuthenticated) {
      fetchUserInfo();
    }
  }, [accessToken, isAuthenticated]);

  // ─── Auto-refresh & AppState Listeners (From Solution) ─────────

  useEffect(() => {
    if (!isAuthenticated || !expiresIn) return;

    const checkAndRefresh = async () => {
      if (shouldRefreshToken()) {
        await refreshAccessToken();
      }
    };

    // Polling Interval
    const interval = setInterval(checkAndRefresh, REFRESH_POLL_INTERVAL_MS);

    // AppState listener to check when app comes to foreground
    const focusSubscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        checkAndRefresh();
      }
    });

    return () => {
      clearInterval(interval);
      focusSubscription.remove();
    };
  }, [isAuthenticated, expiresIn, shouldRefreshToken, refreshAccessToken]);

  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      accessToken,
      refreshToken,
      userInfo,
      error,
      request,
      promptAsync,
      logout,
      refreshAccessToken,
      fetchUserInfo,
      getValidToken,
      getFrappeClient,
    }),
    [
      isAuthenticated, isLoading, accessToken, refreshToken,
      userInfo, error, request, promptAsync, logout,
      refreshAccessToken, fetchUserInfo, getValidToken, getFrappeClient,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {props.children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };

