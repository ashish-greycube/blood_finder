import { COLORS, RADII, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { ThemeContext } from '@/context/ThemeContext';
import { AuthContext } from '@/services/auth';
import ThemeToggle from '@/components/ThemeToggle';
import { AntDesign } from '@expo/vector-icons';
import {
  ButtonSpinner,
  Center,
  Heading,
  HStack,
  Text,
  VStack,
} from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import React, { useContext, useEffect } from 'react';
import {
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ─── Login Screen ───────────────────────────────────────────────

/**
 * Login Screen
 *
 * Frappe OAuth login with day/night theme toggle.
 * Uses constants from @/constants/constant.js for server URL and OAuth Client ID.
 * Theme state is managed globally via ThemeContext.
 */
const Login = () => {
  const { isAuthenticated, error, promptAsync, request, isLoading } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const router = useRouter();
  const { width } = useWindowDimensions();

  const theme = isDark ? COLORS.dark : COLORS.light;
  const isReady = request && !isLoading;

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(Screens)/MainScreen');
    }
  }, [isAuthenticated]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
        animated
      />

      {/* Background orbs — opacities from theme */}
      <View style={[styles.orb, styles.orb1, { opacity: theme.orbOpacity1 }]} />
      <View style={[styles.orb, styles.orb2, { opacity: theme.orbOpacity2 }]} />
      <View style={[styles.orb, styles.orb3, { opacity: theme.orbOpacity3 }]} />
      <View style={[styles.orb, styles.orb4, { opacity: theme.orbOpacity4 }]} />

      <SafeAreaView style={styles.safeArea}>
        {/* Theme Toggle */}
        <View style={styles.themeToggleContainer}>
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </View>

        <Center style={styles.center}>
          <VStack space="4xl" style={styles.vstack}>
            {/* Header Section */}
            <VStack space="lg" style={styles.headerStack}>
              <View style={styles.logoBox}>
                <Text style={styles.logoEmoji}>🩸</Text>
              </View>
              <Heading style={[styles.title, { color: theme.primary }]}>
                Blood Finder
              </Heading>
              <Text style={[styles.tagline, { color: theme.textSecondary }]}>
                Connecting donors with those in need
              </Text>
            </VStack>

            {/* Error Message */}
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {/* Login Button */}
            <View style={[styles.buttonContainer, { maxWidth: width * 0.85 }]}>
              <TouchableOpacity
                style={[
                  styles.loginBtn,
                  {
                    backgroundColor: isReady ? theme.primary : theme.textMuted,
                    shadowColor: isReady ? theme.primary : 'transparent',
                  },
                ]}
                disabled={!isReady}
                onPress={() => promptAsync()}
                activeOpacity={0.82}
              >
                {isLoading ? (
                  <ButtonSpinner color={theme.textOnPrimary} size="small" />
                ) : (
                  <HStack space="md" style={styles.buttonContent}>
                    <AntDesign
                      name="login"
                      size={20}
                      color={isReady ? theme.textOnPrimary : theme.textSecondary}
                    />
                    <Text
                      style={[
                        styles.buttonLabel,
                        { color: isReady ? theme.textOnPrimary : theme.textSecondary },
                      ]}
                    >
                      Sign In with Frappe
                    </Text>
                  </HStack>
                )}
              </TouchableOpacity>
            </View>
          </VStack>
        </Center>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textMuted }]}>
            Created by Milan
          </Text>
        </View>
      </SafeAreaView>
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },

  // Background orbs — identical to MainScreen
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  orb1: {
    width: 220,
    height: 220,
    backgroundColor: '#8B0000',
    top: -40,
    right: -50,
  },
  orb2: {
    width: 160,
    height: 160,
    backgroundColor: '#1565C0',
    bottom: 280,
    left: -30,
  },
  orb3: {
    width: 130,
    height: 130,
    backgroundColor: '#66BB6A',
    bottom: 140,
    right: -10,
  },
  orb4: {
    width: 180,
    height: 180,
    backgroundColor: '#CE93D8',
    top: 300,
    left: -60,
  },

  // Theme toggle
  themeToggleContainer: {
    position: 'absolute',
    top: 50,
    right: SPACING.xl,
    zIndex: 10,
  },

  // Main layout
  center: {
    flex: 1,
    paddingHorizontal: SPACING.xl,
  },
  vstack: {
    width: '100%',
    alignItems: 'center',
  },
  headerStack: {
    alignItems: 'center',
    marginTop: 100,
  },
  logoBox: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#8B0000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8B0000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 8,
    marginBottom: SPACING.lg,
  },
  logoEmoji: {
    fontSize: 56,
  },
  title: {
    fontSize: TYPOGRAPHY['3xl'],
    fontWeight: TYPOGRAPHY.bold,
    textAlign: 'center',
    marginBottom: SPACING.sm,
  },
  tagline: {
    fontSize: TYPOGRAPHY.md,
    textAlign: 'center',
    lineHeight: 22,
  },

  // Error box
  errorBox: {
    backgroundColor: COLORS.light.error + '15',
    borderRadius: RADII.md,
    padding: SPACING.md,
    width: '100%',
  },
  errorText: {
    color: COLORS.light.error,
    fontSize: TYPOGRAPHY.sm,
    textAlign: 'center',
  },

  // Button styles
  buttonContainer: {
    width: '100%',
    marginTop: SPACING.xxl,
  },
  loginBtn: {
    borderRadius: RADII.xl,
    paddingVertical: 20,
    paddingHorizontal: SPACING.xl,
    minHeight: 60,
    width: '100%',
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  buttonContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: TYPOGRAPHY.bold,
    lineHeight: 24,
  },

  // Footer
  footer: {
    paddingBottom: SPACING.xxl,
    paddingHorizontal: SPACING.xl,
  },
  footerText: {
    fontSize: TYPOGRAPHY.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default Login;
