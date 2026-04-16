import { COLORS, RADII, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { ThemeContext } from '@/context/ThemeContext';
import { Entypo, Feather, FontAwesome } from '@expo/vector-icons';
import {
  Box,
  Center,
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
  Heading,
  HStack,
  Icon,
  Input,
  InputField,
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
  VStack,
} from '@gluestack-ui/themed';
import React, { useContext, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');
const FORM_WIDTH = Math.min(width - SPACING.xl * 2, 480);

const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const TERRITORIES = [
  'North Zone',
  'South Zone',
  'East Zone',
  'West Zone',
  'Central Zone',
];

// Orb base colors — decorative, do not change between themes
const ORB_COLORS = { o1: '#8B0000', o2: '#1565C0', o3: '#66BB6A', o4: '#CE93D8' };

const RegisterDonorScreen = () => {
  const { isDark } = useContext(ThemeContext);
  const theme = isDark ? COLORS.dark : COLORS.light;

  const [mode, setMode] = useState('donor');
  const [fullName, setFullName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [territory, setTerritory] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [formError, setFormError] = useState('');

  const isDonor = mode === 'donor';
  const accentColor = isDonor ? '#EF5350' : '#42A5F5';

  const handleRegister = () => {
    if (!fullName.trim() || !bloodGroup || !territory) {
      setFormError('Please fill all fields before submitting.');
      return;
    }
    setFormError('');
    console.log('Register:', { mode, fullName, bloodGroup, territory, isAvailable });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent animated />

      {/* Background orbs — opacities from theme */}
      <View style={[styles.orb, { backgroundColor: ORB_COLORS.o1, opacity: theme.orbOpacity1, top: -40, right: -50, width: 220, height: 220 }]} />
      <View style={[styles.orb, { backgroundColor: ORB_COLORS.o2, opacity: theme.orbOpacity2, bottom: 280, left: -30, width: 160, height: 160 }]} />
      <View style={[styles.orb, { backgroundColor: ORB_COLORS.o3, opacity: theme.orbOpacity3, bottom: 140, right: -10, width: 130, height: 130 }]} />
      <View style={[styles.orb, { backgroundColor: ORB_COLORS.o4, opacity: theme.orbOpacity4, top: 300, left: -60, width: 180, height: 180 }]} />

      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Center mb="$6">
            <Box style={[styles.iconCircleHeader, { backgroundColor: theme.iconCircleBg, borderColor: theme.iconCircleBorder }]}>
              <Icon as={FontAwesome} name={isDonor ? 'user' : 'search'} size="xl" color={accentColor} />
            </Box>
            <Heading size="xl" style={[styles.screenHeading, { color: theme.text }]}>
              {isDonor ? 'Register as Donor' : 'Register as Finder'}
            </Heading>

            {/* Donor / Finder toggle pills */}
            <HStack
              mt="$4"
              space="$2"
              style={[styles.togglePillRow, { width: FORM_WIDTH, backgroundColor: theme.pillContainerBg, borderColor: theme.pillContainerBorder }]}
            >
              <TouchableOpacity
                style={[styles.togglePill, { backgroundColor: isDonor ? '#EF5350' : 'transparent' }]}
                onPress={() => { setMode('donor'); setFormError(''); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.togglePillText, { color: isDonor ? '#FFF' : theme.pillInactiveText }]}>
                  Donor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.togglePill, { backgroundColor: !isDonor ? '#42A5F5' : 'transparent' }]}
                onPress={() => { setMode('finder'); setFormError(''); }}
                activeOpacity={0.8}
              >
                <Text style={[styles.togglePillText, { color: !isDonor ? '#FFF' : theme.pillInactiveText }]}>
                  Finder
                </Text>
              </TouchableOpacity>
            </HStack>
          </Center>

          {/* Glass Form Card */}
          <View style={[styles.formCard, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder }]}>
            <View style={[styles.formCardHighlight, { backgroundColor: theme.glassHighlight }]} />

            <VStack space="lg" p="$5">
              {/* Full Name */}
              <VStack space="$xs">
                <Text style={[styles.fieldLabel, { color: theme.fieldLabelColor }]}>Full Name</Text>
                <Input
                  variant="outline"
                  style={[styles.inputWrapper, { backgroundColor: theme.inputFieldBg, borderColor: theme.inputFieldBorder }]}
                >
                  <InputField
                    placeholder="Enter your full name"
                    placeholderTextColor={theme.placeholderColor}
                    value={fullName}
                    onChangeText={(val) => { setFullName(val); if (formError) setFormError(''); }}
                    color={theme.inputTextColor}
                    fontSize={TYPOGRAPHY.base}
                    style={styles.inputField}
                  />
                </Input>
              </VStack>

              {/* Blood Group */}
              <VStack space="$xs">
                <Text style={[styles.fieldLabel, { color: theme.fieldLabelColor }]}>Blood Group</Text>
                <Select
                  onValueChange={(val) => { setBloodGroup(val); if (formError) setFormError(''); }}
                  selectedValue={bloodGroup}
                >
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
              </VStack>

              {/* Territory */}
              <VStack space="$xs">
                <Text style={[styles.fieldLabel, { color: theme.fieldLabelColor }]}>Territory</Text>
                <Select
                  onValueChange={(val) => { setTerritory(val); if (formError) setFormError(''); }}
                  selectedValue={territory}
                >
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
              </VStack>

              {/* Is Available? */}
              <HStack space="$sm" alignItems="center" justifyContent="space-between">
                <Text style={[styles.fieldLabel, { color: theme.fieldLabelColor }]}>Is Available?</Text>
                <Checkbox value="available" isChecked={isAvailable} onChange={setIsAvailable}>
                  <CheckboxIndicator borderColor={theme.inputFieldBorder} bg="transparent">
                    <CheckboxIcon as={Feather} name="check" size="md" color={accentColor} />
                  </CheckboxIndicator>
                  <CheckboxLabel style={{ color: theme.fieldLabelColor }} ml="$2" />
                </Checkbox>
              </HStack>
            </VStack>
          </View>

          {/* Inline error box */}
          {formError ? (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={14} color={theme.error} style={styles.errorIcon} />
              <Text style={[styles.errorText, { color: theme.error }]}>{formError}</Text>
            </View>
          ) : null}

          {/* Submit button */}
          <TouchableOpacity
            style={[styles.registerBtn, { backgroundColor: accentColor + 'D9', borderColor: accentColor + '80' }]}
            onPress={handleRegister}
            activeOpacity={0.85}
          >
            <View style={styles.registerBtnHighlight} />
            <Text style={styles.registerBtnLabel}>Register</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.lg,
    paddingBottom: SPACING.xxxl,
  },
  orb: {
    position: 'absolute',
    borderRadius: 999,
  },
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
  togglePillRow: {
    borderRadius: RADII.lg,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  togglePill: {
    flex: 1,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    borderRadius: RADII.lg,
  },
  togglePillText: {
    fontSize: TYPOGRAPHY.sm,
    fontWeight: TYPOGRAPHY.semibold,
  },
  formCard: {
    width: '100%',
    borderRadius: RADII.xl,
    borderWidth: 1,
    overflow: 'hidden',
  },
  formCardHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
  },
  fieldLabel: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: TYPOGRAPHY.semibold,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  inputWrapper: {
    height: 48,
    borderRadius: RADII.lg,
    borderWidth: 0.5,
    paddingHorizontal: SPACING.md,
  },
  inputField: {
    paddingLeft: 0,
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
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,83,80,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239,83,80,0.3)',
    borderRadius: RADII.md,
    padding: SPACING.md,
    marginTop: SPACING.md,
  },
  errorIcon: {
    marginRight: SPACING.sm,
  },
  errorText: {
    fontSize: TYPOGRAPHY.sm,
    flex: 1,
  },
  registerBtn: {
    height: 52,
    borderRadius: RADII.xl,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: SPACING.lg,
  },
  registerBtnHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  registerBtnLabel: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: TYPOGRAPHY.bold,
    color: '#FFF',
  },
});

export default RegisterDonorScreen;
