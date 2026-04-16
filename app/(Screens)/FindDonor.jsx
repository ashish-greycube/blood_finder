import { COLORS, RADII, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { ThemeContext } from '@/context/ThemeContext';
import { Entypo, Feather } from '@expo/vector-icons';
import {
  Box,
  Center,
  Heading,
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
  Text,
} from '@gluestack-ui/themed';
import React, { useContext, useState } from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const ORB_COLORS = { o1: '#8B0000', o2: '#1565C0', o3: '#66BB6A', o4: '#CE93D8' };

const DUMMY_DONORS = [
  { id: '1', name: 'Rahul Sharma',   bloodGroup: 'A+',  territory: 'North Zone',   status: 'available', lastDonated: '2 months ago' },
  { id: '2', name: 'Priya Mehta',    bloodGroup: 'B+',  territory: 'South Zone',   status: 'available', lastDonated: '3 months ago' },
  { id: '3', name: 'Amit Patel',     bloodGroup: 'O+',  territory: 'East Zone',    status: 'cooldown',  lastDonated: '1 month ago'  },
  { id: '4', name: 'Sneha Nair',     bloodGroup: 'AB+', territory: 'West Zone',    status: 'available', lastDonated: '4 months ago' },
  { id: '5', name: 'Vikram Singh',   bloodGroup: 'A-',  territory: 'Central Zone', status: 'inroute',   lastDonated: '5 months ago' },
  { id: '6', name: 'Anita Desai',    bloodGroup: 'B-',  territory: 'North Zone',   status: 'available', lastDonated: '6 months ago' },
  { id: '7', name: 'Karan Malhotra', bloodGroup: 'O-',  territory: 'South Zone',   status: 'cooldown',  lastDonated: '6 weeks ago'  },
];

const STATUS_CONFIG = {
  available: { label: 'Available', color: '#4CAF50' },
  cooldown:  { label: 'Cooldown',  color: '#FF9800' },
  inroute:   { label: 'In Route',  color: '#42A5F5' },
};

const accentColor = '#42A5F5';

// ─── Donor Card ───────────────────────────────────────────────────
const DonorCard = ({ donor, theme }) => {
  const statusCfg = STATUS_CONFIG[donor.status] ?? STATUS_CONFIG.available;
  return (
    <View style={[styles.donorCard, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder }]}>
      <View style={[styles.donorCardHighlight, { backgroundColor: theme.glassHighlight }]} />

      {/* Avatar circle + info */}
      <View style={styles.donorCardRow}>
        <View style={[styles.donorAvatar, { backgroundColor: accentColor + '22' }]}>
          <Text style={[styles.donorInitials, { color: accentColor }]}>
            {donor.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
          </Text>
        </View>

        <View style={styles.donorInfo}>
          <Text style={[styles.donorName, { color: theme.text }]}>{donor.name}</Text>
          <Text style={[styles.donorMeta, { color: theme.textSecondary }]}>
            {donor.territory}
          </Text>
          <Text style={[styles.donorMeta, { color: theme.textSecondary }]}>
            Last donated: {donor.lastDonated}
          </Text>
        </View>

        <View style={styles.donorRight}>
          {/* Blood group badge */}
          <View style={[styles.bloodBadge, { backgroundColor: '#EF5350' + '22', borderColor: '#EF5350' + '55' }]}>
            <Text style={styles.bloodBadgeText}>{donor.bloodGroup}</Text>
          </View>
          {/* Status dot + label */}
          <View style={styles.statusRow}>
            <View style={[styles.statusDot, { backgroundColor: statusCfg.color }]} />
            <Text style={[styles.statusLabel, { color: statusCfg.color }]}>{statusCfg.label}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

// ─── Screen ───────────────────────────────────────────────────────
const FindDonorScreen = () => {
  const { isDark } = useContext(ThemeContext);
  const theme = isDark ? COLORS.dark : COLORS.light;

  const [selectedGroup, setSelectedGroup] = useState('');
  const [searchedGroup, setSearchedGroup] = useState('');

  const donors = searchedGroup
    ? DUMMY_DONORS.filter(d => d.bloodGroup === searchedGroup)
    : DUMMY_DONORS;

  const handleSearch = () => {
    setSearchedGroup(selectedGroup);
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
          keyboardShouldPersistTaps="handled"
        >
          {/* ── Header ── */}
          <Center mb="$6">
            <Box style={[styles.iconCircleHeader, { backgroundColor: theme.iconCircleBg, borderColor: theme.iconCircleBorder }]}>
              <Feather name="search" size={26} color={accentColor} />
            </Box>
            <Heading size="xl" style={[styles.screenHeading, { color: theme.text }]}>
              Find a Donor
            </Heading>
          </Center>

          {/* ── Search card ── */}
          <View style={[styles.searchCard, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder }]}>
            <View style={[styles.searchCardHighlight, { backgroundColor: theme.glassHighlight }]} />

            <View style={styles.searchCardInner}>
              <Text style={[styles.fieldLabel, { color: theme.fieldLabelColor }]}>Blood Group</Text>

              <Select onValueChange={setSelectedGroup} selectedValue={selectedGroup}>
                <SelectTrigger
                  variant="outline"
                  style={[styles.selectTrigger, { backgroundColor: theme.inputFieldBg, borderColor: theme.inputFieldBorder }]}
                >
                  <SelectInput
                    placeholder="Select blood group"
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
                    {BLOOD_GROUPS.map((bg) => (
                      <SelectItem key={bg} label={bg} value={bg} style={styles.selectItem} _text={{ color: theme.inputTextColor }} />
                    ))}
                  </SelectContent>
                </SelectPortal>
              </Select>

              <TouchableOpacity
                style={[styles.searchBtn, { backgroundColor: accentColor + 'D9', borderColor: accentColor + '80' }]}
                onPress={handleSearch}
                activeOpacity={0.85}
              >
                <View style={styles.searchBtnHighlight} />
                <Feather name="search" size={16} color="#FFF" style={{ marginRight: SPACING.sm }} />
                <Text style={styles.searchBtnLabel}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Results ── */}
          <View style={styles.resultsHeader}>
            <Text style={[styles.resultsTitle, { color: theme.textSecondary }]}>
              {searchedGroup ? `Donors with ${searchedGroup}` : 'All Donors'}
            </Text>
            <View style={[styles.resultsBadge, { backgroundColor: accentColor + '22' }]}>
              <Text style={[styles.resultsBadgeText, { color: accentColor }]}>{donors.length}</Text>
            </View>
          </View>

          {donors.length === 0 ? (
            <View style={styles.emptyState}>
              <Feather name="inbox" size={36} color={theme.textMuted} />
              <Text style={[styles.emptyText, { color: theme.textMuted }]}>No donors found for {searchedGroup}</Text>
            </View>
          ) : (
            donors.map(donor => (
              <DonorCard key={donor.id} donor={donor} theme={theme} />
            ))
          )}
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

  // Search card
  searchCard: {
    borderRadius: RADII.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: SPACING.xl,
  },
  searchCardHighlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
  },
  searchCardInner: {
    padding: SPACING.lg,
    gap: SPACING.md,
  },
  fieldLabel: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
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
  searchBtn: {
    height: 48,
    borderRadius: RADII.xl,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: SPACING.xs,
  },
  searchBtnHighlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  searchBtnLabel: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: '700',
    color: '#FFF',
  },

  // Results header
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginBottom: SPACING.md,
  },
  resultsTitle: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    flex: 1,
  },
  resultsBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADII.full,
    minWidth: 28,
    alignItems: 'center',
  },
  resultsBadgeText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: '700',
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxxl,
    gap: SPACING.md,
  },
  emptyText: {
    fontSize: TYPOGRAPHY.sm,
  },

  // Donor card
  donorCard: {
    borderRadius: RADII.xl,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  donorCardHighlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
  },
  donorCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
    gap: SPACING.md,
  },
  donorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    flexShrink: 0,
  },
  donorInitials: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: '700',
  },
  donorInfo: {
    flex: 1,
    gap: 2,
  },
  donorName: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: '600',
  },
  donorMeta: {
    fontSize: TYPOGRAPHY.xs,
  },
  donorRight: {
    alignItems: 'flex-end',
    gap: SPACING.xs,
    flexShrink: 0,
  },
  bloodBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 3,
    borderRadius: RADII.md,
    borderWidth: 1,
  },
  bloodBadgeText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: '700',
    color: '#EF5350',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusLabel: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: '600',
  },
});

export default FindDonorScreen;
