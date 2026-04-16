import { COLORS, RADII, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { ThemeContext } from '@/context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import { Box, Center, Heading, Text } from '@gluestack-ui/themed';
import React, { useContext, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const ORB_COLORS = { o1: '#8B0000', o2: '#1565C0', o3: '#66BB6A', o4: '#CE93D8' };

const accentColor = '#FFA726';

const URGENCY_CONFIG = {
  Critical: { color: '#EF5350', bg: 'rgba(239,83,80,0.15)', border: 'rgba(239,83,80,0.35)' },
  High:     { color: '#FF9800', bg: 'rgba(255,152,0,0.15)',  border: 'rgba(255,152,0,0.35)'  },
  Medium:   { color: '#42A5F5', bg: 'rgba(66,165,245,0.15)', border: 'rgba(66,165,245,0.35)' },
  Low:      { color: '#66BB6A', bg: 'rgba(102,187,106,0.15)',border: 'rgba(102,187,106,0.35)' },
};

const DUMMY_REQUESTS = [
  {
    id: '1',
    finder: 'Rohit Verma',
    bloodGroup: 'O+',
    hospital: 'Apollo Hospital',
    territory: 'North Zone',
    units: 2,
    urgency: 'Critical',
    requestedAt: '10 min ago',
  },
  {
    id: '2',
    finder: 'Meena Joshi',
    bloodGroup: 'A+',
    hospital: 'Fortis Healthcare',
    territory: 'South Zone',
    units: 1,
    urgency: 'High',
    requestedAt: '25 min ago',
  },
  {
    id: '3',
    finder: 'Suresh Pillai',
    bloodGroup: 'B-',
    hospital: 'AIIMS Delhi',
    territory: 'Central Zone',
    units: 3,
    urgency: 'Critical',
    requestedAt: '1 hr ago',
  },
  {
    id: '4',
    finder: 'Kavya Reddy',
    bloodGroup: 'AB+',
    hospital: 'Manipal Hospital',
    territory: 'East Zone',
    units: 1,
    urgency: 'Medium',
    requestedAt: '2 hrs ago',
  },
  {
    id: '5',
    finder: 'Arjun Bose',
    bloodGroup: 'O-',
    hospital: 'Max Super Speciality',
    territory: 'West Zone',
    units: 2,
    urgency: 'High',
    requestedAt: '3 hrs ago',
  },
];

// ─── Request Card ─────────────────────────────────────────────────
const RequestCard = ({ request, acceptedId, onAccept, onRelease, theme }) => {
  const urgCfg = URGENCY_CONFIG[request.urgency] ?? URGENCY_CONFIG.Medium;
  const isAccepted = acceptedId === request.id;
  const isLockedOut = acceptedId !== null && acceptedId !== request.id;

  return (
    <View style={[
      styles.card,
      { backgroundColor: theme.glassBg, borderColor: theme.glassBorder },
      isAccepted && { borderColor: '#4CAF50' + '88' },
    ]}>
      <View style={[styles.cardHighlight, { backgroundColor: theme.glassHighlight }]} />

      {/* Accepted banner */}
      {isAccepted && (
        <View style={styles.acceptedBanner}>
          <Feather name="check-circle" size={12} color="#4CAF50" />
          <Text style={styles.acceptedBannerText}>You accepted this request</Text>
        </View>
      )}

      {/* Top row: blood group + urgency badge */}
      <View style={styles.cardTopRow}>
        <View style={[styles.bloodBadge, { backgroundColor: 'rgba(239,83,80,0.18)', borderColor: 'rgba(239,83,80,0.4)' }]}>
          <Text style={styles.bloodBadgeText}>{request.bloodGroup}</Text>
        </View>

        <View style={[styles.urgencyBadge, { backgroundColor: urgCfg.bg, borderColor: urgCfg.border }]}>
          <View style={[styles.urgencyDot, { backgroundColor: urgCfg.color }]} />
          <Text style={[styles.urgencyText, { color: urgCfg.color }]}>{request.urgency}</Text>
        </View>
      </View>

      {/* Finder name */}
      <Text style={[styles.finderName, { color: theme.text }]}>{request.finder}</Text>

      {/* Info rows */}
      <View style={styles.infoGrid}>
        <InfoChip icon="map-pin"  label={request.territory} theme={theme} />
        <InfoChip icon="activity"  label={`${request.units} unit${request.units > 1 ? 's' : ''} needed`} theme={theme} />
        {request.hospital ? <InfoChip icon="home"  label={request.hospital} theme={theme} /> : null}
        <InfoChip icon="clock"    label={request.requestedAt} theme={theme} />
      </View>

      {/* Action button */}
      {isAccepted ? (
        <TouchableOpacity
          style={styles.releaseBtn}
          onPress={() => onRelease(request.id)}
          activeOpacity={0.8}
        >
          <Feather name="x-circle" size={15} color="#EF5350" style={{ marginRight: SPACING.xs }} />
          <Text style={styles.releaseBtnText}>Release</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.acceptBtn,
            isLockedOut && styles.acceptBtnDisabled,
          ]}
          onPress={() => !isLockedOut && onAccept(request.id)}
          activeOpacity={isLockedOut ? 1 : 0.85}
          disabled={isLockedOut}
        >
          <View style={styles.acceptBtnHighlight} />
          <Feather
            name="check"
            size={15}
            color={isLockedOut ? 'rgba(255,255,255,0.3)' : '#FFF'}
            style={{ marginRight: SPACING.xs }}
          />
          <Text style={[styles.acceptBtnText, isLockedOut && { opacity: 0.35 }]}>Accept</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const InfoChip = ({ icon, label, theme }) => (
  <View style={styles.infoChip}>
    <Feather name={icon} size={11} color={theme.textSecondary} />
    <Text style={[styles.infoChipText, { color: theme.textSecondary }]} numberOfLines={1}>{label}</Text>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────
const RequestsScreen = () => {
  const { isDark } = useContext(ThemeContext);
  const theme = isDark ? COLORS.dark : COLORS.light;

  const [acceptedId, setAcceptedId] = useState(null);

  const handleAccept = (id) => {
    const req = DUMMY_REQUESTS.find(r => r.id === id);
    Alert.alert(
      'Accept Request',
      `Accept blood request from ${req.finder} for ${req.bloodGroup}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          style: 'default',
          onPress: () => setAcceptedId(id),
        },
      ]
    );
  };

  const handleRelease = (id) => {
    Alert.alert(
      'Release Request',
      'Are you sure you want to release this request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Release',
          style: 'destructive',
          onPress: () => setAcceptedId(null),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent animated />

      {/* Background orbs */}
      <View style={[styles.orb, { backgroundColor: ORB_COLORS.o1, opacity: theme.orbOpacity1, top: -40,  right: -50, width: 220, height: 220 }]} />
      <View style={[styles.orb, { backgroundColor: ORB_COLORS.o2, opacity: theme.orbOpacity2, bottom: 280, left: -30,  width: 160, height: 160 }]} />
      <View style={[styles.orb, { backgroundColor: ORB_COLORS.o3, opacity: theme.orbOpacity3, bottom: 140, right: -10, width: 130, height: 130 }]} />
      <View style={[styles.orb, { backgroundColor: ORB_COLORS.o4, opacity: theme.orbOpacity4, top: 300,  left: -60,  width: 180, height: 180 }]} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Header ── */}
          <Center mb="$6">
            <Box style={[styles.iconCircleHeader, { backgroundColor: theme.iconCircleBg, borderColor: theme.iconCircleBorder }]}>
              <Feather name="bell" size={26} color={accentColor} />
            </Box>
            <Heading size="xl" style={[styles.screenHeading, { color: theme.text }]}>
              Active Requests
            </Heading>
          </Center>

          {/* ── Active notice ── */}
          {acceptedId && (
            <View style={styles.activeNotice}>
              <Feather name="info" size={14} color={accentColor} />
              <Text style={[styles.activeNoticeText, { color: accentColor }]}>
                You have an active commitment. Release it to accept another.
              </Text>
            </View>
          )}

          {/* ── Request cards ── */}
          {DUMMY_REQUESTS.map(req => (
            <RequestCard
              key={req.id}
              request={req}
              acceptedId={acceptedId}
              onAccept={handleAccept}
              onRelease={handleRelease}
              theme={theme}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },

  // Header
  iconCircleHeader: {
    width: 56,
    height: 56,
    borderRadius: RADII.full,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenHeading: {
    opacity: 0.9,
    marginTop: SPACING.md,
  },

  // Active notice
  activeNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    backgroundColor: 'rgba(255,167,38,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,167,38,0.3)',
    borderRadius: RADII.md,
    padding: SPACING.md,
    marginBottom: SPACING.lg,
  },
  activeNoticeText: {
    fontSize: TYPOGRAPHY.sm,
    flex: 1,
    lineHeight: 18,
  },

  // Card
  card: {
    borderRadius: RADII.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: SPACING.md,
    padding: SPACING.md,
  },
  cardHighlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
  },

  // Accepted banner
  acceptedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs,
    backgroundColor: 'rgba(76,175,80,0.15)',
    borderRadius: RADII.sm,
    paddingVertical: 4,
    paddingHorizontal: SPACING.sm,
    marginBottom: SPACING.sm,
    alignSelf: 'flex-start',
  },
  acceptedBannerText: {
    fontSize: TYPOGRAPHY.xs,
    color: '#4CAF50',
    fontWeight: '600',
  },

  // Top row
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  bloodBadge: {
    paddingHorizontal: SPACING.md,
    paddingVertical: 4,
    borderRadius: RADII.md,
    borderWidth: 1,
  },
  bloodBadgeText: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: '800',
    color: '#EF5350',
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: RADII.full,
    borderWidth: 1,
  },
  urgencyDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  urgencyText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Finder name
  finderName: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: '700',
    marginBottom: SPACING.sm,
  },

  // Info chips
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
    marginBottom: SPACING.md,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(128,128,128,0.1)',
    borderRadius: RADII.full,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
  },
  infoChipText: {
    fontSize: TYPOGRAPHY.xs,
  },

  // Accept button
  acceptBtn: {
    height: 42,
    borderRadius: RADII.lg,
    backgroundColor: '#FFA726D9',
    borderWidth: 1,
    borderColor: '#FFA72680',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  acceptBtnDisabled: {
    backgroundColor: 'rgba(128,128,128,0.15)',
    borderColor: 'rgba(128,128,128,0.2)',
  },
  acceptBtnHighlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  acceptBtnText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: '700',
    color: '#FFF',
  },

  // Release button
  releaseBtn: {
    height: 42,
    borderRadius: RADII.lg,
    borderWidth: 1,
    borderColor: 'rgba(239,83,80,0.4)',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  releaseBtnText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: '600',
    color: '#EF5350',
  },
});

export default RequestsScreen;
