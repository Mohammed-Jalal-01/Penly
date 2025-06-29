import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Shield, Eye, EyeOff, Lock, Trash2, Download, FileText, Clock, Smartphone, Globe, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Info } from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function PrivacyScreen() {
  const { currentTheme } = useTheme();
  
  // Privacy settings state
  const [biometricLock, setBiometricLock] = useState(false);
  const [autoLock, setAutoLock] = useState(true);
  const [hideContent, setHideContent] = useState(false);
  const [analyticsOptOut, setAnalyticsOptOut] = useState(false);
  const [crashReporting, setCrashReporting] = useState(true);
  const [autoBackup, setAutoBackup] = useState(true);
  const [encryptBackups, setEncryptBackups] = useState(true);

  const handleDataExport = () => {
    Alert.alert(
      'Export Your Data',
      'This will create a complete export of all your notes, categories, and settings in JSON format. The file will be saved to your device.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Export', 
          onPress: () => {
            // Implement data export logic
            Alert.alert('Success', 'Your data has been exported successfully!');
          }
        },
      ]
    );
  };

  const handleDataDeletion = () => {
    Alert.alert(
      'Delete All Data',
      'This will permanently delete all your notes, categories, settings, and preferences. This action cannot be undone.\n\nAre you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete Everything', 
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Final Confirmation',
              'Last chance! This will delete everything permanently.',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Yes, Delete All', 
                  style: 'destructive',
                  onPress: () => {
                    // Implement data deletion logic
                    Alert.alert('Deleted', 'All your data has been permanently deleted.');
                  }
                },
              ]
            );
          }
        },
      ]
    );
  };

  const PrivacySection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>{title}</Text>
      <View style={[
        styles.sectionContent,
        { 
          backgroundColor: currentTheme.colors.cardBackground,
          borderColor: currentTheme.colors.border 
        }
      ]}>
        {children}
      </View>
    </View>
  );

  const PrivacyItem = ({ 
    icon, 
    title, 
    subtitle, 
    value,
    onValueChange,
    type = 'switch',
    onPress,
    showWarning = false
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    value?: boolean;
    onValueChange?: (value: boolean) => void;
    type?: 'switch' | 'button';
    onPress?: () => void;
    showWarning?: boolean;
  }) => (
    <TouchableOpacity 
      style={[
        styles.privacyItem,
        { borderBottomColor: currentTheme.colors.border }
      ]} 
      onPress={onPress}
      disabled={type === 'switch'}
      activeOpacity={type === 'button' ? 0.7 : 1}
    >
      <View style={[styles.privacyIcon, { backgroundColor: currentTheme.colors.background }]}>
        {icon}
      </View>
      <View style={styles.privacyContent}>
        <View style={styles.privacyTextContainer}>
          <Text style={[styles.privacyTitle, { color: currentTheme.colors.text }]}>{title}</Text>
          {showWarning && (
            <AlertTriangle size={16} color={currentTheme.colors.warning} style={styles.warningIcon} />
          )}
        </View>
        <Text style={[styles.privacySubtitle, { color: currentTheme.colors.textSecondary }]}>
          {subtitle}
        </Text>
      </View>
      {type === 'switch' && (
        <Switch
          value={value}
          onValueChange={onValueChange}
          trackColor={{ false: currentTheme.colors.border, true: currentTheme.colors.primary }}
          thumbColor="#FFFFFF"
        />
      )}
    </TouchableOpacity>
  );

  const DataUsageCard = () => (
    <View style={[
      styles.dataUsageCard,
      { 
        backgroundColor: currentTheme.colors.surface,
        borderColor: currentTheme.colors.border 
      }
    ]}>
      <View style={styles.dataUsageHeader}>
        <FileText size={20} color={currentTheme.colors.primary} />
        <Text style={[styles.dataUsageTitle, { color: currentTheme.colors.text }]}>
          Your Data Summary
        </Text>
      </View>
      
      <View style={styles.dataUsageStats}>
        <View style={styles.dataStat}>
          <Text style={[styles.dataStatNumber, { color: currentTheme.colors.text }]}>127</Text>
          <Text style={[styles.dataStatLabel, { color: currentTheme.colors.textSecondary }]}>Notes</Text>
        </View>
        <View style={styles.dataStat}>
          <Text style={[styles.dataStatNumber, { color: currentTheme.colors.text }]}>4</Text>
          <Text style={[styles.dataStatLabel, { color: currentTheme.colors.textSecondary }]}>Categories</Text>
        </View>
        <View style={styles.dataStat}>
          <Text style={[styles.dataStatNumber, { color: currentTheme.colors.text }]}>2.3 MB</Text>
          <Text style={[styles.dataStatLabel, { color: currentTheme.colors.textSecondary }]}>Storage Used</Text>
        </View>
      </View>
      
      <Text style={[styles.dataUsageDescription, { color: currentTheme.colors.textSecondary }]}>
        All your data is stored locally on your device. We never upload your notes to external servers.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: currentTheme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={currentTheme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>Privacy & Security</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Data Usage Summary */}
        <View style={styles.section}>
          <DataUsageCard />
        </View>

        {/* Security Settings */}
        <PrivacySection title="Security">
          <PrivacyItem
            icon={<Lock size={20} color={currentTheme.colors.primary} />}
            title="Biometric Lock"
            subtitle="Use fingerprint or face recognition to unlock the app"
            value={biometricLock}
            onValueChange={setBiometricLock}
          />
          <PrivacyItem
            icon={<Clock size={20} color={currentTheme.colors.success} />}
            title="Auto Lock"
            subtitle="Automatically lock the app when inactive for 5 minutes"
            value={autoLock}
            onValueChange={setAutoLock}
          />
          <PrivacyItem
            icon={hideContent ? <EyeOff size={20} color={currentTheme.colors.warning} /> : <Eye size={20} color={currentTheme.colors.primary} />}
            title="Hide Content in App Switcher"
            subtitle="Blur app content when switching between apps"
            value={hideContent}
            onValueChange={setHideContent}
          />
        </PrivacySection>

        {/* Data & Privacy */}
        <PrivacySection title="Data & Privacy">
          <PrivacyItem
            icon={<Smartphone size={20} color={currentTheme.colors.primary} />}
            title="Local Storage Only"
            subtitle="Your notes are stored only on this device"
            type="button"
            onPress={() => Alert.alert(
              'Local Storage',
              'All your notes and data are stored locally on your device. We never upload your content to external servers or cloud services. This ensures complete privacy but means your data is only available on this device.'
            )}
          />
          <PrivacyItem
            icon={<Download size={20} color={currentTheme.colors.primary} />}
            title="Auto Backup"
            subtitle="Automatically backup notes to device storage"
            value={autoBackup}
            onValueChange={setAutoBackup}
          />
          <PrivacyItem
            icon={<Shield size={20} color={currentTheme.colors.success} />}
            title="Encrypt Backups"
            subtitle="Encrypt backup files for additional security"
            value={encryptBackups}
            onValueChange={setEncryptBackups}
          />
        </PrivacySection>

        {/* Analytics & Reporting */}
        <PrivacySection title="Analytics & Reporting">
          <PrivacyItem
            icon={<Globe size={20} color={analyticsOptOut ? currentTheme.colors.error : currentTheme.colors.textSecondary} />}
            title="Opt Out of Analytics"
            subtitle="Disable anonymous usage analytics and performance metrics"
            value={analyticsOptOut}
            onValueChange={setAnalyticsOptOut}
            showWarning={!analyticsOptOut}
          />
          <PrivacyItem
            icon={<AlertTriangle size={20} color={crashReporting ? currentTheme.colors.success : currentTheme.colors.error} />}
            title="Crash Reporting"
            subtitle="Help improve the app by sending anonymous crash reports"
            value={crashReporting}
            onValueChange={setCrashReporting}
          />
        </PrivacySection>

        {/* Data Management */}
        <PrivacySection title="Data Management">
          <PrivacyItem
            icon={<Download size={20} color={currentTheme.colors.primary} />}
            title="Export My Data"
            subtitle="Download a complete copy of all your notes and settings"
            type="button"
            onPress={handleDataExport}
          />
          <PrivacyItem
            icon={<Trash2 size={20} color={currentTheme.colors.error} />}
            title="Delete All Data"
            subtitle="Permanently remove all notes, categories, and app data"
            type="button"
            onPress={handleDataDeletion}
            showWarning={true}
          />
        </PrivacySection>

        {/* Privacy Information */}
        <View style={[
          styles.privacyInfo,
          { 
            backgroundColor: currentTheme.colors.surface,
            borderColor: currentTheme.colors.border 
          }
        ]}>
          <View style={styles.privacyInfoHeader}>
            <Info size={20} color={currentTheme.colors.primary} />
            <Text style={[styles.privacyInfoTitle, { color: currentTheme.colors.text }]}>
              Your Privacy Matters
            </Text>
          </View>
          <Text style={[styles.privacyInfoText, { color: currentTheme.colors.textSecondary }]}>
            This app is designed with privacy by default. Your notes never leave your device unless you explicitly export them. 
            We don't collect personal information, track your content, or share your data with third parties.
          </Text>
          
          <View style={styles.privacyFeatures}>
            <View style={styles.privacyFeature}>
              <CheckCircle size={16} color={currentTheme.colors.success} />
              <Text style={[styles.privacyFeatureText, { color: currentTheme.colors.textSecondary }]}>
                No cloud storage required
              </Text>
            </View>
            <View style={styles.privacyFeature}>
              <CheckCircle size={16} color={currentTheme.colors.success} />
              <Text style={[styles.privacyFeatureText, { color: currentTheme.colors.textSecondary }]}>
                No account registration needed
              </Text>
            </View>
            <View style={styles.privacyFeature}>
              <CheckCircle size={16} color={currentTheme.colors.success} />
              <Text style={[styles.privacyFeatureText, { color: currentTheme.colors.textSecondary }]}>
                End-to-end encryption for backups
              </Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: currentTheme.colors.textSecondary }]}>
            Last updated: December 2024
          </Text>
          <TouchableOpacity onPress={() => Alert.alert('Privacy Policy', 'Privacy policy details would be shown here.')}>
            <Text style={[styles.footerLink, { color: currentTheme.colors.primary }]}>
              View Full Privacy Policy
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
    marginHorizontal: 20,
  },
  sectionContent: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  privacyIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  privacyContent: {
    flex: 1,
  },
  privacyTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  privacyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  warningIcon: {
    marginLeft: 8,
  },
  privacySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  dataUsageCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
  },
  dataUsageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  dataUsageTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  dataUsageStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  dataStat: {
    alignItems: 'center',
  },
  dataStatNumber: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  dataStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  dataUsageDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    textAlign: 'center',
  },
  privacyInfo: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 32,
  },
  privacyInfoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  privacyInfoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  privacyInfoText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 16,
  },
  privacyFeatures: {
    gap: 8,
  },
  privacyFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  privacyFeatureText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  footerLink: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
});