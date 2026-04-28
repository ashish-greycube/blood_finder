import { COLORS, RADII, SPACING, TYPOGRAPHY } from '@/constants/theme';
import { ThemeContext } from '@/context/ThemeContext';
import { AuthContext } from '@/services/auth';
import { Entypo, Feather } from '@expo/vector-icons';
import {
  Box,
  Center,
  Heading,
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
import { FrappeContext as fcx } from 'frappe-react-sdk';
import { useFrappe } from '@/services/backend';
import React, { useContext, useState } from 'react';
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
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
const URGENCY_LEVELS = ['Critical','Standard'];

const ORB_COLORS = { o1: '#8B0000', o2: '#1565C0', o3: '#66BB6A', o4: '#CE93D8' };

// ─── Field Label with optional required star ──────────────────────
const FieldLabel = ({ label, required, theme }) => (
  <View style={styles.labelRow}>
    <Text style={[styles.fieldLabel, { color: theme.fieldLabelColor }]}>{label}</Text>
    {required && <Text style={styles.requiredStar}> *</Text>}
  </View>
);

const CreateRequestScreen = () => {
  const { isDark } = useContext(ThemeContext);
  const theme = isDark ? COLORS.dark : COLORS.light;

  const { db } = useContext(fcx);
  const { useGetDocList } = useFrappe();
  const { data: hospitalDocs } = useGetDocList('Hospital', { fields: ['name', 'hospital_name'], limit: 100 });
  const { userInfo } = useContext(AuthContext)
  const [finder, setFinder] = useState();
  const [contactNumber, setContactNumber] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [requiredUnits, setRequiredUnits] = useState('');
  const [hospital, setHospital] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState('');
  const [formError, setFormError] = useState('');

  const accentColor = '#66BB6A';


  const clearError = () => { if (formError) setFormError(''); };

  const resetForm = () => {
    setContactNumber('');
    setBloodGroup('');
    setRequiredUnits('');
    setHospital('');
    setUrgencyLevel('');
    setFormError('');
  };

  const submitRequest = () => {
    setFormError('');
    db.getValue('Doner_Finder', 'name', [['user_id', '=', `${userInfo.name}`]])
      .then((res) => {
        const name = res.message.name;
        return db.createDoc('Blood Request', {
          "finder_name" : name,
          "contact_number" : `+91-${contactNumber}`,
          "blood_group" : bloodGroup,
          "required_units" : requiredUnits,
          "hospital" : hospital,
          "urgency_level" : urgencyLevel,
          "request_time" : new Date().toISOString().slice(0, 19).replace('T', ' ')
        });
      })
      .then(() => {
        resetForm();
        Alert.alert('Request Submitted', 'Your blood request has been created successfully.');
      })
      .catch(() => {
        Alert.alert('Submission Failed', 'Something went wrong. Please try again.');
      });
  };

  const handleSubmit = () => {
    Alert.alert(
      'Confirm Request',
      `Submit a ${urgencyLevel || 'standard'} request for ${requiredUnits || '?'} unit(s) of ${bloodGroup || '?'} blood?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Submit', onPress: submitRequest },
      ]
    );

  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor="transparent" translucent animated />

      {/* Background orbs */}
      <View style={[styles.orb, { backgroundColor: ORB_COLORS.o1, opacity: theme.orbOpacity1, top: -40, right: -50, width: 220, height: 220 }]} />
      <View style={[styles.orb, { backgroundColor: ORB_COLORS.o2, opacity: theme.orbOpacity2, bottom: 280, left: -30, width: 160, height: 160 }]} />
      <View style={[styles.orb, { backgroundColor: ORB_COLORS.o3, opacity: theme.orbOpacity3, bottom: 140, right: -10, width: 130, height: 130 }]} />
      <View style={[styles.orb, { backgroundColor: ORB_COLORS.o4, opacity: theme.orbOpacity4, top: 300, left: -60, width: 180, height: 180 }]} />

      <KeyboardAvoidingView
        style={styles.safeArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── Header ── */}
          <Center mb="$6">
            <Box style={[styles.iconCircleHeader, { backgroundColor: theme.iconCircleBg, borderColor: theme.iconCircleBorder }]}>
              <Feather name="plus-circle" size={26} color={accentColor} />
            </Box>
            <Heading size="xl" style={[styles.screenHeading, { color: theme.text }]}>
              Create Request
            </Heading>
          </Center>

          {/* Glass Form Card */}
          <View style={[styles.formCard, { backgroundColor: theme.glassBg, borderColor: theme.glassBorder }]}>
            <View style={[styles.formCardHighlight, { backgroundColor: theme.glassHighlight }]} />

            <VStack space="lg" p="$5">

              {/* Finder */}
              <VStack space="$xs">
                <FieldLabel label="Finder" required theme={theme} />
                <Input isReadOnly variant="outline" style={[styles.inputWrapper, { backgroundColor: theme.inputFieldBg, borderColor: theme.inputFieldBorder }]}>
                  <InputField
                    editable={false}
                    value={userInfo.given_name}
                    color={theme.textMuted}
                    fontSize={TYPOGRAPHY.base}
                    style={styles.inputField}
                  />
                </Input>
              </VStack>

              {/* Contact Number */}
              <VStack space="$xs">
                <FieldLabel label="Contact Number" required theme={theme} />
                <Input variant="outline" style={[styles.inputWrapper, { backgroundColor: theme.inputFieldBg, borderColor: theme.inputFieldBorder }]}>
                  <View style={styles.phonePrefix}>
                    <Text style={styles.flagEmoji}>🇮🇳</Text>
                    <Text style={[styles.phonePrefixText, { color: theme.inputTextColor }]}>+91</Text>
                    <View style={[styles.phoneDivider, { backgroundColor: theme.inputFieldBorder }]} />
                  </View>
                  <InputField
                    placeholder="Enter contact number"
                    placeholderTextColor={theme.placeholderColor}
                    value={contactNumber}
                    onChangeText={(v) => { setContactNumber(v); clearError(); }}
                    color={theme.inputTextColor}
                    fontSize={TYPOGRAPHY.base}
                    keyboardType="phone-pad"
                    style={styles.phoneInputField}
                  />
                </Input>
              </VStack>

              {/* Blood Group */}
              <VStack space="$xs">
                <FieldLabel label="Blood Group" required theme={theme} />
                <Select onValueChange={(v) => { setBloodGroup(v); clearError(); }} selectedValue={bloodGroup}>
                  <SelectTrigger variant="outline" style={[styles.selectTrigger, { backgroundColor: theme.inputFieldBg, borderColor: theme.inputFieldBorder }]}>
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

              {/* Required Units */}
              <VStack space="$xs">
                <FieldLabel label="Required Units" required theme={theme} />
                <Input variant="outline" style={[styles.inputWrapper, { backgroundColor: theme.inputFieldBg, borderColor: theme.inputFieldBorder }]}>
                  <InputField
                    placeholder="e.g. 2"
                    placeholderTextColor={theme.placeholderColor}
                    value={requiredUnits}
                    onChangeText={(v) => { setRequiredUnits(v); clearError(); }}
                    color={theme.inputTextColor}
                    fontSize={TYPOGRAPHY.base}
                    keyboardType="numeric"
                    style={styles.inputField}
                  />
                </Input>
              </VStack>

              {/* Hospital (optional) */}
              <VStack space="$xs">
                <FieldLabel label="Hospital" theme={theme} />
                <Select onValueChange={setHospital} selectedValue={hospital}>
                  <SelectTrigger variant="outline" style={[styles.selectTrigger, { backgroundColor: theme.inputFieldBg, borderColor: theme.inputFieldBorder }]}>
                    <SelectInput
                      placeholder="Select hospital"
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
                      {(hospitalDocs ?? []).map((h) => (
                        <SelectItem key={h.name} label={h.hospital_name} value={h.name} style={styles.selectItem} _text={{ color: theme.inputTextColor }} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </VStack>

              {/* Urgency Level */}
              <VStack space="$xs">
                <FieldLabel label="Urgency Level" required theme={theme} />
                <Select onValueChange={(v) => { setUrgencyLevel(v); clearError(); }} selectedValue={urgencyLevel}>
                  <SelectTrigger variant="outline" style={[styles.selectTrigger, { backgroundColor: theme.inputFieldBg, borderColor: theme.inputFieldBorder }]}>
                    <SelectInput
                      placeholder="Select urgency level"
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
                      {URGENCY_LEVELS.map((u) => (
                        <SelectItem key={u} label={u} value={u} style={styles.selectItem} _text={{ color: theme.inputTextColor }} />
                      ))}
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </VStack>

            </VStack>
          </View>

          {/* Inline error */}
          {formError ? (
            <View style={styles.errorBox}>
              <Feather name="alert-circle" size={14} color={theme.error} style={styles.errorIcon} />
              <Text style={[styles.errorText, { color: theme.error }]}>{formError}</Text>
            </View>
          ) : null}

          {/* Submit */}
          <TouchableOpacity
            style={[styles.submitBtn, { backgroundColor: accentColor + 'D9', borderColor: accentColor + '80' }]}
            onPress={handleSubmit}
            activeOpacity={0.85}
          >
            <View style={styles.submitBtnHighlight} />
            <Feather name="send" size={16} color="#FFF" style={{ marginRight: SPACING.sm }} />
            <Text style={styles.submitBtnLabel}>Submit Request</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
      </KeyboardAvoidingView>
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

  // Label
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fieldLabel: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  requiredStar: {
    fontSize: TYPOGRAPHY.xs,
    fontWeight: '600',
    color: '#EF5350',
  },
  timezoneHint: {
    fontSize: TYPOGRAPHY.xs,
    marginTop: 3,
    letterSpacing: 0.3,
  },

  // Card
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

  // Input
  inputWrapper: {
    height: 48,
    borderRadius: RADII.lg,
    borderWidth: 0.5,
    paddingHorizontal: SPACING.md,
  },
  inputField: {
    paddingLeft: 0,
  },

  // Phone prefix
  phonePrefix: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: SPACING.sm,
    gap: SPACING.xs,
  },
  flagEmoji: {
    fontSize: 18,
  },
  phonePrefixText: {
    fontSize: TYPOGRAPHY.base,
    fontWeight: '500',
  },
  phoneDivider: {
    width: 1,
    height: 18,
    marginLeft: SPACING.xs,
  },
  phoneInputField: {
    paddingLeft: SPACING.sm,
  },

  // Select
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

  // Error
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

  // Submit button
  submitBtn: {
    height: 52,
    borderRadius: RADII.xl,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: SPACING.lg,
  },
  submitBtnHighlight: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  submitBtnLabel: {
    fontSize: TYPOGRAPHY.md,
    fontWeight: '700',
    color: '#FFF',
  },
});

export default CreateRequestScreen;
