import { ThemeProvider } from "@/context/ThemeContext";
import { AuthContext, AuthProvider } from "@/services/auth";
import { FrappeProvider } from "@/services/backend";
import { config } from "@gluestack-ui/config";
import { GluestackUIProvider } from "@gluestack-ui/themed";
import { Stack, useRouter, useSegments } from "expo-router";
import { useContext, useEffect } from "react";

function NavigationGuard() {
  const { isAuthenticated, isLoading } = useContext(AuthContext);
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    const inProtected = segments[0] === "(Screens)";
    if (inProtected && !isAuthenticated) {
      router.replace("/Login");
    }
  }, [isAuthenticated, isLoading, segments]);

  return null;
}

export default function RootLayout() {
  return (
    <GluestackUIProvider config={config}>
      <ThemeProvider>
        <AuthProvider>
          <FrappeProvider>
            <NavigationGuard />
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </FrappeProvider>
        </AuthProvider>
      </ThemeProvider>
    </GluestackUIProvider>
  );
}
