import { COLORS, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { ThemeContext } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Box, Center, Heading, Text, VStack } from '@gluestack-ui/themed';
import React, { useContext } from 'react';
import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SettingsScreen = () => {
  const { isDark } = useContext(ThemeContext);
  const theme = isDark ? COLORS.dark : COLORS.light;

  return (
    <Box style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} animated />
      <SafeAreaView style={styles.safeArea}>
        <Center flex={1} px="$8">
          <VStack space="xl" alignItems="center">
            <Box style={[styles.iconCircle, { backgroundColor: '#9E9E9E' + '20' }]}>
              <Feather name="settings" size={40} color="#9E9E9E" />
            </Box>
            <Heading size="xl" textAlign="center" style={{ color: theme.primary }}>
              Settings
            </Heading>
            <Text size="md" textAlign="center" style={{ color: theme.textSecondary, lineHeight: 22 }}>
              Configure your app preferences,{'\n'}
              notifications, and account. Coming soon.
            </Text>
            <Box style={{ width: 60, height: 3, borderRadius: 2, backgroundColor: theme.primary, opacity: 0.4, marginTop: 24 }} />
          </VStack>
        </Center>
      </SafeAreaView>
    </Box>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  iconCircle: {
    width: 80, height: 80, borderRadius: 40,
    justifyContent: 'center', alignItems: 'center', marginBottom: 24,
  },
});

export default SettingsScreen;
