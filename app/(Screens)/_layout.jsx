import { COLORS, TYPOGRAPHY } from '@/constants/theme';
import { ThemeContext } from '@/context/ThemeContext';
import { AuthContext } from '@/services/auth';
import ThemeToggle from '@/components/ThemeToggle';
import Feather from '@expo/vector-icons/Feather';
import { Stack, useRouter } from 'expo-router';
import React, { useCallback, useContext, useRef, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import useNotification from '@/hooks/useNotification';
const BloodLogo = () => (
  <View style={styles.bloodLogoCircle}>
    <Text style={styles.bloodEmoji}>🩸</Text>
  </View>
);

const CustomHeader = ({ title, canGoBack }) => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const theme = isDark ? COLORS.dark : COLORS.light;

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top, backgroundColor: theme.headerBg }]}>
      <View style={[styles.headerGlass, { backgroundColor: theme.headerGlassBg, borderColor: theme.headerGlassBorder }]}>
        <View style={[styles.headerHighlight, { backgroundColor: theme.headerHighlightLine }]} />
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <BloodLogo />
            <Text style={[styles.headerTitle, { color: theme.primary }]}>
              {title || 'Blood Finder'}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
            {canGoBack ? (
              <TouchableOpacity
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.headerBtn}
                onPress={() => router.back()}
              >
                <View style={[styles.userIconCircle, { backgroundColor: theme.userIconBg, borderColor: theme.userIconBorder }]}>
                  <Feather name="arrow-left" size={15} color={theme.userIconTint} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.headerBtn}
                onPress={() => router.push('/(Screens)/UserScreen')}
              >
                <View style={[styles.userIconCircle, { backgroundColor: theme.userIconBg, borderColor: theme.userIconBorder }]}>
                  <Feather name="user" size={15} color={theme.userIconTint} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default function ScreensLayout() {
  const { userInfo, getFrappeClient } = useContext(AuthContext);

  const userInfoRef = useRef(userInfo);
  useEffect(() => { userInfoRef.current = userInfo; }, [userInfo]);

  const saveFcmToken = useCallback((token) => {
    const info = userInfoRef.current;
    if (!info?.name) return;
    const frappe = getFrappeClient();
    const db = frappe.db();
    db.updateDoc('User', info.name, { fcm_token: token }).catch(() => {});
  }, [getFrappeClient]);

  useNotification(saveFcmToken)
  return (
    <Stack
      screenOptions={{
        header: ({ options, navigation, route }) => (
          <CustomHeader
            title={options.title ?? 'Blood Finder'}
            canGoBack={navigation.canGoBack() && route.name !== 'MainScreen'}
          />
        ),
      }}
    />
  );
}

const styles = StyleSheet.create({
  headerContainer: {},
  headerGlass: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 20,
    borderWidth: 0.5,
    overflow: 'hidden',
  },
  headerHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  headerRow: {
    flexDirection: 'row',
    height: 56,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    position: 'relative',
    zIndex: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  bloodLogoCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#8B0000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bloodEmoji: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: TYPOGRAPHY.bold,
    letterSpacing: 0.3,
  },
  headerBtn: {
    padding: 2,
  },
  userIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
