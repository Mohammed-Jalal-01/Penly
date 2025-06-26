import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, 
  Bell, 
  Shield, 
  Download, 
  Upload, 
  Trash2, 
  Info, 
  ChevronRight,
  Moon,
  Palette,
  Menu
} from 'lucide-react-native';

// Define props interface for screen components
interface ScreenProps {
  onMenuPress?: () => void;
}

export default function SettingsScreen({ onMenuPress }: ScreenProps) {
  const [darkMode, setDarkMode] = React.useState(true);
  const [notifications, setNotifications] = React.useState(true);

  const handleExportData = () => {
    Alert.alert(
      'Export Data',
      'Export all your notes as a JSON file?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Export', onPress: () => console.log('Exporting data...') },
      ]
    );
  };

  const handleImportData = () => {
    Alert.alert(
      'Import Data',
      'Import notes from a JSON file? This will merge with your existing notes.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Import', onPress: () => console.log('Importing data...') },
      ]
    );
  };

  const handleClearAllData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your notes and categories. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All', 
          style: 'destructive',
          onPress: () => {
            Alert.alert('Cleared', 'All data has been cleared.');
          }
        },
      ]
    );
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress, 
    showChevron = true,
    rightComponent 
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showChevron?: boolean;
    rightComponent?: React.ReactNode;
  }) => (
    <TouchableOpacity 
      style={styles.settingItem} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={styles.settingIcon}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={styles.settingTitle}>{title}</Text>
        {subtitle && (
          <Text style={styles.settingSubtitle}>{subtitle}</Text>
        )}
      </View>
      {rightComponent || (showChevron && onPress && (
        <ChevronRight size={20} color="#6B7280" />
      ))}
    </TouchableOpacity>
  );

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.settingSection}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
            <Menu size={24} color="#E5E7EB" />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <SettingSection title="Profile">
          <SettingItem
            icon={<User size={20} color="#8B5CF6" />}
            title="Account"
            subtitle="Manage your profile and preferences"
            onPress={() => Alert.alert('Account', 'Account settings coming soon!')}
          />
        </SettingSection>

        {/* Preferences Section */}
        <SettingSection title="Preferences">
          <SettingItem
            icon={<Moon size={20} color="#F59E0B" />}
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            showChevron={false}
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#374151', true: '#8B5CF6' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingItem
            icon={<Bell size={20} color="#10B981" />}
            title="Notifications"
            subtitle="Get notified about reminders and updates"
            showChevron={false}
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#374151', true: '#8B5CF6' }}
                thumbColor="#FFFFFF"
              />
            }
          />
          <SettingItem
            icon={<Palette size={20} color="#EC4899" />}
            title="Theme"
            subtitle="Customize app appearance"
            onPress={() => Alert.alert('Theme', 'Theme customization coming soon!')}
          />
        </SettingSection>

        {/* Privacy & Security Section */}
        <SettingSection title="Privacy & Security">
          <SettingItem
            icon={<Shield size={20} color="#10B981" />}
            title="Privacy"
            subtitle="Control your data and privacy settings"
            onPress={() => Alert.alert('Privacy', 'Privacy settings coming soon!')}
          />
        </SettingSection>

        {/* Data Management Section */}
        <SettingSection title="Data Management">
          <SettingItem
            icon={<Download size={20} color="#8B5CF6" />}
            title="Export Data"
            subtitle="Download your notes as JSON file"
            onPress={handleExportData}
          />
          <SettingItem
            icon={<Upload size={20} color="#F59E0B" />}
            title="Import Data"
            subtitle="Import notes from JSON file"
            onPress={handleImportData}
          />
          <SettingItem
            icon={<Trash2 size={20} color="#EF4444" />}
            title="Clear All Data"
            subtitle="Permanently delete all notes and categories"
            onPress={handleClearAllData}
          />
        </SettingSection>

        {/* About Section */}
        <SettingSection title="About">
          <SettingItem
            icon={<Info size={20} color="#9CA3AF" />}
            title="App Info"
            subtitle="Version 1.0.0 • Built with React Native"
            onPress={() => Alert.alert('App Info', 'Notes App v1.0.0\nBuilt with React Native and Expo')}
          />
        </SettingSection>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
          Made By Mohammed.J
          </Text>
          <Text style={styles.footerSubtext}>
            Your notes are stored locally on your device
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#F9FAFB',
  },
  content: {
    flex: 1,
    paddingTop: 20,
  },
  settingSection: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#E5E7EB',
    marginBottom: 12,
    marginHorizontal: 20,
  },
  sectionContent: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    marginHorizontal: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#374151',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F9FAFB',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    lineHeight: 18,
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
});