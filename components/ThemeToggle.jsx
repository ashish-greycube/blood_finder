import { Box } from '@gluestack-ui/themed';
import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity } from 'react-native';

/**
 * Animated day/night sky toggle.
 *
 * Props:
 *   isDark   — boolean, current dark state
 *   onToggle — function(nextIsDark: boolean) — called with the NEW boolean value
 */
const ThemeToggle = ({ isDark, onToggle }) => {
  // useRef so the Animated.Value is stable across re-renders
  const animValue = useRef(new Animated.Value(isDark ? 1 : 0)).current;

  // Sync knob position whenever isDark changes from outside
  // (e.g. navigating back to a screen after toggling on another screen)
  useEffect(() => {
    Animated.spring(animValue, {
      toValue: isDark ? 1 : 0,
      useNativeDriver: false,
      tension: 60,
      friction: 8,
    }).start();
  }, [isDark]);

  const handleToggle = () => {
    onToggle(!isDark);
  };

  const knobPosition = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 38],
  });

  const knobColor = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['#FFD600', '#E8E0D0'],
  });

  return (
    <TouchableOpacity
      style={styles.toggleContainer}
      onPress={handleToggle}
      activeOpacity={0.8}
    >
      <Box style={styles.toggleTrack}>
        {/* Sky background */}
        <Box
          style={[
            styles.skyBackground,
            isDark ? styles.nightSky : styles.daySky,
          ]}
        />

        {/* Stars for night mode */}
        {isDark && (
          <>
            <Box style={[styles.star, { top: 5, left: 12 }]} />
            <Box style={[styles.star, { top: 9, left: 22 }]} />
            <Box style={[styles.star, { top: 4, left: 32 }]} />
            <Box style={[styles.star, { top: 11, left: 42 }]} />
            <Box style={[styles.star, { top: 6, left: 52 }]} />
            <Box style={[styles.star, { top: 12, left: 62 }]} />
          </>
        )}

        {/* Clouds for day mode */}
        {!isDark && (
          <>
            <Box style={[styles.cloud, { top: 4, left: 24 }]} />
            <Box style={[styles.cloud, { top: 10, left: 34 }]} />
            <Box style={[styles.cloud, { top: 5, left: 46 }]} />
          </>
        )}

        {/* Animated knob */}
        <Animated.View
          style={[
            styles.toggleKnob,
            {
              transform: [{ translateX: knobPosition }],
              backgroundColor: knobColor,
              shadowColor: isDark ? '#E8E0D0' : '#FFD600',
              shadowOpacity: isDark ? 0.6 : 0.5,
              shadowRadius: isDark ? 8 : 5,
              shadowOffset: { width: 0, height: 2 },
            },
          ]}
        >
          {isDark ? (
            <>
              <Box style={[styles.moonCrater, { top: 5, left: 4 }]} />
              <Box style={[styles.moonCrater, { top: 10, left: 9 }]} />
              <Box style={[styles.moonCrater, { top: 4, left: 10 }]} />
            </>
          ) : (
            <Box style={styles.sunGlow} />
          )}
        </Animated.View>
      </Box>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  toggleContainer: {
    padding: 2,
  },
  toggleTrack: {
    width: 72,
    height: 34,
    borderRadius: 17,
    overflow: 'hidden',
    position: 'relative',
  },
  skyBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  daySky: {
    backgroundColor: '#5BB5D5',
  },
  nightSky: {
    backgroundColor: '#1A2744',
  },
  star: {
    position: 'absolute',
    width: 1.5,
    height: 1.5,
    borderRadius: 1,
    backgroundColor: '#FFFFFF',
  },
  cloud: {
    position: 'absolute',
    width: 12,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
    opacity: 0.9,
  },
  toggleKnob: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moonCrater: {
    position: 'absolute',
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#C8BFB0',
    opacity: 0.5,
  },
  sunGlow: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    borderColor: '#FFD600',
    opacity: 0.3,
  },
});

export default ThemeToggle;
