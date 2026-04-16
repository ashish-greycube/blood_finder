import { COLORS, RADII, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { ThemeContext } from '@/context/ThemeContext';
import { Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { Heading, Text } from '@gluestack-ui/themed';
import { useRouter } from 'expo-router';
import React, { useContext, useState } from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const HORIZONTAL_PAD = SPACING.xxl;
const GAP = 14;
const CARD_SIZE = (width - HORIZONTAL_PAD * 2 - GAP) / 2;

// Orb base colors — decorative brand colors, never change between themes
const ORB_COLORS = {
  orb1: '#8B0000',
  orb2: '#1565C0',
  orb3: '#66BB6A',
  orb4: '#CE93D8',
};

const DUMMY_PATIENTS = [
  { id: '1', name: 'Arjun Mehta',    bloodGroup: 'O+',  age: 34, condition: 'Surgery',      color: '#EF5350' },
  { id: '2', name: 'Priya Sharma',   bloodGroup: 'A-',  age: 28, condition: 'Accident',     color: '#42A5F5' },
  { id: '3', name: 'Ramesh Pillai',  bloodGroup: 'B+',  age: 55, condition: 'Anaemia',      color: '#66BB6A' },
  { id: '4', name: 'Sneha Kapoor',   bloodGroup: 'AB+', age: 22, condition: 'Thalassemia',  color: '#CE93D8' },
  { id: '5', name: 'Vijay Nair',     bloodGroup: 'O-',  age: 41, condition: 'Transplant',   color: '#FFA726' },
  { id: '6', name: 'Kavita Desai',   bloodGroup: 'B-',  age: 63, condition: 'Cancer',       color: '#26C6DA' },
];

const PatientCard = ({ patient, theme }) => {
  const initials = patient.name.split(' ').map(w => w[0]).slice(0, 2).join('');
  return (
    <View style={[styles.patientCard, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder }]}>
      <View style={[styles.patientCardHighlight, { backgroundColor: theme.glassHighlight }]} />
      <View style={[styles.patientAvatar, { backgroundColor: patient.color + '22' }]}>
        <Text style={[styles.patientInitials, { color: patient.color }]}>{initials}</Text>
      </View>
      <View style={[styles.patientBloodBadge, { backgroundColor: '#EF535018', borderColor: '#EF535055' }]}>
        <Text style={styles.patientBloodText}>{patient.bloodGroup}</Text>
      </View>
      <Text style={[styles.patientName, { color: theme.text }]} numberOfLines={1}>{patient.name}</Text>
      <Text style={[styles.patientMeta, { color: theme.textSecondary }]}>{patient.age} yrs</Text>
      <Text style={[styles.patientCondition, { color: patient.color }]} numberOfLines={1}>{patient.condition}</Text>
    </View>
  );
};

const NavCard = ({ icon, iconColor, label, onPress, theme }) => {
  const [pressed, setPressed] = useState(false);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      onPress={onPress}
      style={[styles.cardWrapper, pressed && styles.cardPressed]}
    >
      <View style={[styles.cardGlass, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder }]}>
        <View style={[styles.cardHighlight, { backgroundColor: theme.glassHighlight }]} />
        <View style={styles.cardInner}>
          <View style={[styles.iconCircle, { backgroundColor: iconColor + '18' }]}>
            {icon}
          </View>
          <Text style={[styles.cardLabel, { color: theme.cardLabel }]}>{label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MainScreen = () => {
  const router = useRouter();
  const { isDark } = useContext(ThemeContext);
  const theme = isDark ? COLORS.dark : COLORS.light;

  const cards = [
    {
      label: 'Register\nDonor',
      icon: <MaterialCommunityIcons name="account-plus" size={24} color="#EF5350" />,
      color: '#EF5350',
      onPress: () => router.push('/(Screens)/RegisterDonor'),
    },
    {
      label: 'Find Donor',
      icon: <Feather name="search" size={24} color="#42A5F5" />,
      color: '#42A5F5',
      onPress: () => router.push('/(Screens)/FindDonor'),
    },
    {
      label: 'Create\nRequest',
      icon: <MaterialCommunityIcons name="clipboard-plus" size={24} color="#66BB6A" />,
      color: '#66BB6A',
      onPress: () => router.push('/(Screens)/CreateRequest'),
    },
    {
      label: 'Requests',
      icon: <MaterialCommunityIcons name="file-document-multiple" size={24} color="#FFA726" />,
      color: '#FFA726',
      onPress: () => router.push('/(Screens)/Requests'),
    },
  ];

  const row1 = cards.slice(0, 2);
  const row2 = cards.slice(2, 4);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent animated />

      {/* Background orbs — opacities come from theme */}
      <View style={[styles.orb, { backgroundColor: ORB_COLORS.orb1, opacity: theme.orbOpacity1, top: -40, right: -50, width: 220, height: 220 }]} />
      <View style={[styles.orb, { backgroundColor: ORB_COLORS.orb2, opacity: theme.orbOpacity2, bottom: 280, left: -30, width: 160, height: 160 }]} />
      <View style={[styles.orb, { backgroundColor: ORB_COLORS.orb3, opacity: theme.orbOpacity3, bottom: 140, right: -10, width: 130, height: 130 }]} />
      <View style={[styles.orb, { backgroundColor: ORB_COLORS.orb4, opacity: theme.orbOpacity4, top: 300, left: -60, width: 180, height: 180 }]} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Heading size="lg" style={[styles.title, { color: theme.text }]}>
            Dashboard
          </Heading>

          {/* 2x2 Grid */}
          <View style={styles.grid}>
            <View style={styles.row}>
              <View style={styles.cardSlot}>
                <NavCard icon={row1[0].icon} iconColor={row1[0].color} label={row1[0].label} onPress={row1[0].onPress} theme={theme} />
              </View>
              <View style={styles.gapH} />
              <View style={styles.cardSlot}>
                <NavCard icon={row1[1].icon} iconColor={row1[1].color} label={row1[1].label} onPress={row1[1].onPress} theme={theme} />
              </View>
            </View>

            <View style={styles.gapV} />

            <View style={styles.row}>
              <View style={styles.cardSlot}>
                <NavCard icon={row2[0].icon} iconColor={row2[0].color} label={row2[0].label} onPress={row2[0].onPress} theme={theme} />
              </View>
              <View style={styles.gapH} />
              <View style={styles.cardSlot}>
                <NavCard icon={row2[1].icon} iconColor={row2[1].color} label={row2[1].label} onPress={row2[1].onPress} theme={theme} />
              </View>
            </View>
          </View>

          {/* Patients section */}
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.textSecondary }]}>Patients</Text>
            <View style={[styles.sectionBadge, { backgroundColor: '#EF535022' }]}>
              <Text style={[styles.sectionBadgeText, { color: '#EF5350' }]}>{DUMMY_PATIENTS.length}</Text>
            </View>
          </View>

          <FlatList
            data={DUMMY_PATIENTS}
            keyExtractor={(p) => p.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.patientList}
            ItemSeparatorComponent={() => <View style={{ width: GAP }} />}
            renderItem={({ item }) => <PatientCard patient={item} theme={theme} />}
            scrollEnabled
          />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
  safeArea: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: HORIZONTAL_PAD,
    paddingTop: 20,
    paddingBottom: SPACING.xxxl,
  },
  title: {
    opacity: 0.9,
    marginBottom: 24,
  },
  grid: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
  },
  cardSlot: {
    flex: 1,
    aspectRatio: 1,
  },
  gapH: {
    width: GAP,
  },
  gapV: {
    height: GAP,
  },
  cardWrapper: {
    width: '100%',
    height: '100%',
  },
  fullCardWrapper: {
    width: '100%',
    height: CARD_SIZE,
    marginTop: GAP,
  },
  cardPressed: {
    transform: [{ scale: 0.96 }],
  },
  cardGlass: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  cardHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  cardInner: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardLabel: {
    fontSize: 14,
    fontWeight: TYPOGRAPHY.semibold,
    textAlign: 'center',
    lineHeight: 18,
    opacity: 0.9,
  },

  // ── Patients section ──────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    marginTop: GAP + 4,
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    flex: 1,
  },
  sectionBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADII.full,
    minWidth: 26,
    alignItems: 'center',
  },
  sectionBadgeText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: '700',
  },
  patientList: {
    paddingBottom: 4,
  },
  patientCard: {
    width: 120,
    borderRadius: RADII.xl,
    borderWidth: 1,
    overflow: 'hidden',
    padding: SPACING.md,
    alignItems: 'center',
  },
  patientCardHighlight: {
    position: 'absolute',
    top: 0, left: 0, right: 0,
    height: 1,
  },
  patientAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SPACING.sm,
  },
  patientInitials: {
    fontSize: TYPOGRAPHY.lg,
    fontWeight: '700',
  },
  patientBloodBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: RADII.md,
    borderWidth: 1,
    marginBottom: SPACING.xs,
  },
  patientBloodText: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: '800',
    color: '#EF5350',
  },
  patientName: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 2,
  },
  patientMeta: {
    fontSize: TYPOGRAPHY.xs,
    marginBottom: 2,
  },
  patientCondition: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default MainScreen;
