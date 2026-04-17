import { COLORS, RADII, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { ThemeContext } from '@/context/ThemeContext';
import { AuthContext } from '@/services/auth';
import { Entypo, Feather } from '@expo/vector-icons';
import {
  Avatar,
  AvatarFallbackText,
  AvatarImage,
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger,
} from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Orb base colors — decorative, same as all other screens
const ORB_COLORS = { o1: '#8B0000', o2: '#1565C0', o3: '#66BB6A', o4: '#CE93D8' };

const TERRITORIES = [
  'North Zone',
  'South Zone',
  'East Zone',
  'West Zone',
  'Central Zone',
];

const STATUS_META = {
  available: { label: 'AVAILABLE', icon: 'check-circle', color: '#4CAF50' },
  cooldown:  { label: 'COOLDOWN',  icon: 'clock',        color: '#FF9800' },
  inroute:   { label: 'IN ROUTE',  icon: 'navigation',   color: '#42A5F5' },
};

// ─── Info Row ─────────────────────────────────────────────────────
const InfoRow = ({ label, value, theme, isLast }) => (
  <View style={[styles.infoRow, !isLast && { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: theme.inputFieldBorder }]}>
    <Text style={[styles.infoLabel, { color: theme.fieldLabelColor }]}>{label}</Text>
    <Text style={[styles.infoValue, { color: theme.text }]} numberOfLines={1}>
      {value || '—'}
    </Text>
  </View>
);

// ─── Screen ───────────────────────────────────────────────────────
const UserScreen = () => {
  const { isDark } = useContext(ThemeContext);
  const { userInfo, logout } = useContext(AuthContext);
  console.log(userInfo)
  const theme = isDark ? COLORS.dark : COLORS.light;
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.replace('/Login');
  };

  // Extract user data from Frappe openid_profile response
  const profile    = userInfo?.message ?? userInfo ?? {};
  const fullName   = profile.full_name   || profile.name  || 'User';
  const email      = profile.email       || profile.sub   || '';
  const territory  = profile.territory   || '';
  const bloodGroup = profile.blood_group || '';

  // Territory edit state — start with current profile territory
  const [selectedTerritory, setSelectedTerritory] = useState(territory);
  const [savedTerritory, setSavedTerritory] = useState(territory);

  const handleSetTerritory = () => {
    if (!selectedTerritory) return;
    setSavedTerritory(selectedTerritory);
    Alert.alert('Territory Updated', `Your territory has been set to ${selectedTerritory}.`);
  };

  // Derive status key from profile, default to 'available'
  const statusKey = profile.donor_status || 'available';
  const statusMeta = STATUS_META[statusKey] ?? STATUS_META.available;

  // Initials for avatar fallback
  const initials = fullName
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

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
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* ── Avatar block ── */}
          <View style={styles.avatarBlock}>
            <View style={styles.avatarRing}>
              <Avatar size="xl" style={styles.avatar}>
                <AvatarFallbackText style={{ color: '#FFF', fontSize: TYPOGRAPHY.xl, fontWeight: TYPOGRAPHY.bold }}>
                  {initials}
                </AvatarFallbackText>
                {profile.picture ? (
                  <AvatarImage source={{ uri: profile.picture }} alt="avatar" />
                ) : null}
              </Avatar>
            </View>

            <Text style={[styles.userName, { color: theme.text }]}>{fullName}</Text>
            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>{email}</Text>

            {/* ── Read-only status badge ── */}
            <View style={[styles.statusBadge, { backgroundColor: isDark ? 'rgba(30,30,30,0.92)' : 'rgba(0,0,0,0.82)' }]}>
              <Text style={styles.statusBadgeText}>{statusMeta.label}</Text>
              <View style={styles.statusBadgeDivider} />
              <Feather name={statusMeta.icon} size={14} color="#FFFFFF" />
            </View>
          </View>

          {/* ── Info card ── */}
          <View style={[styles.card, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder }]}>
            <View style={[styles.cardHighlight, { backgroundColor: theme.glassHighlight }]} />
            <InfoRow label="Full Name"   value={fullName}   theme={theme} />
            <InfoRow label="Email"       value={email}      theme={theme} />
            <InfoRow label="Territory"   value={territory}  theme={theme} />
            <InfoRow label="Blood Group" value={bloodGroup} theme={theme} isLast />
          </View>

          {/* ── Territory Setting ── */}
          <View style={[styles.card, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder, marginBottom: SPACING.lg }]}>
            <View style={[styles.cardHighlight, { backgroundColor: theme.glassHighlight }]} />
            <View style={styles.territoryCardInner}>
              <Text style={[styles.infoLabel, { color: theme.fieldLabelColor, marginBottom: SPACING.sm }]}>
                Change Territory
              </Text>
              <Select onValueChange={setSelectedTerritory} selectedValue={selectedTerritory}>
                <SelectTrigger
                  variant="outline"
                  style={[styles.selectTrigger, { backgroundColor: theme.inputFieldBg, borderColor: theme.inputFieldBorder }]}
                >
                  <SelectInput
                    placeholder="Select territory"
                    placeholderTextColor={theme.placeholderColor}
                    style={[styles.selectInput, { color: theme.inputTextColor }]}
                  />
                  <SelectIcon as={Entypo} name="chevron-down" size="md" color={theme.chevronColor} />
                </SelectTrigger>
                <SelectPortal>
                  <SelectBackdrop />
                  <SelectContent style={[styles.selectContent, { backgroundColor: theme.dropdownBg, borderColor: theme.dropdownBorder }]}>
                    <SelectDragIndicatorWrapper>
                      <SelectDragIndicator />
                    </SelectDragIndicatorWrapper>
                    {TERRITORIES.map((t) => (
                      <SelectItem key={t} label={t} value={t} style={styles.selectItem} _text={{ color: theme.inputTextColor }} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>

              <TouchableOpacity
                style={[
                  styles.setBtn,
                  { backgroundColor: '#8B0000D9', borderColor: '#8B000080' },
                  !selectedTerritory && styles.setBtnDisabled,
                ]}
                onPress={handleSetTerritory}
                activeOpacity={0.85}
                disabled={!selectedTerritory}
              >
                <View style={styles.setBtnHighlight} />
                <Feather name="check" size={15} color="#FFF" style={{ marginRight: SPACING.xs }} />
                <Text style={styles.setBtnLabel}>Set Territory</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Logout ── */}
          <TouchableOpacity
            style={[styles.logoutBtn, { borderColor: theme.error + '80' }]}
            onPress={handleLogout}
            activeOpacity={0.8}
          >
            <Feather name="log-out" size={16} color={theme.error} style={styles.logoutIcon} />
            <Text style={[styles.logoutLabel, { color: theme.error }]}>Logout</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea:  { flex: 1 },
  scroll: {
    paddingHorizontal: SPACING.xl,
    paddingTop: SPACING.xl,
    paddingBottom: SPACING.xxxl,
  },

  // Orbs
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },

  // ── Avatar block ──────────────────────────────────────────────
  avatarBlock: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#8B0000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
    shadowColor: '#8B0000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
  },
  userName: {
    fontSize: TYPOGRAPHY.xl,
    fontWeight: TYPOGRAPHY.bold,
    letterSpacing: 0.2,
    marginBottom: SPACING.xs,
  },
  userEmail: {
    fontSize: TYPOGRAPHY.sm,
    marginBottom: SPACING.lg,
  },

  // Status badge (read-only)
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    borderRadius: RADII.lg,
    gap: SPACING.sm,
  },
  statusBadgeText: {
    color: '#FFFFFF',
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.bold,
    letterSpacing: 1.5,
  },
  statusBadgeDivider: {
    width: 1,
    height: 14,
    backgroundColor: 'rgba(255,255,255,0.3)',
  },

  // ── Info card ─────────────────────────────────────────────────
  card: {
    borderRadius: RADII.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: SPACING.lg,
  },
  cardHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  infoRow: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
  },
  infoLabel: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: TYPOGRAPHY.medium,
  },

  // ── Territory ─────────────────────────────────────────────────
  territoryCardInner: {
    padding: SPACING.lg,
  },
  selectTrigger: {
    height: 48,
    borderRadius: RADII.lg,
    borderWidth: 0.5,
    paddingHorizontal: SPACING.md,
  },
  selectInput: {
    fontSize: TYPOGRAPHY.base,
  },
  selectContent: {
    borderWidth: 1,
    borderRadius: RADII.lg,
  },
  selectItem: {
    paddingVertical: SPACING.md,
  },
  setBtn: {
    height: 44,
    borderRadius: RADII.lg,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: SPACING.md,
  },
  setBtnDisabled: {
    opacity: 0.45,
  },
  setBtnHighlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  setBtnLabel: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.semibold,
    color: '#FFF',
  },

  // ── Logout ────────────────────────────────────────────────────
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    borderRadius: RADII.xl,
    borderWidth: 1,
    gap: SPACING.sm,
  },
  logoutIcon: {},
  logoutLabel: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: TYPOGRAPHY.semibold,
  },
});

export default UserScreen;
