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
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

interface SettingsScreenProps {
  onMenuPress: () => void;
}

export default function SettingsScreen({ onMenuPress }: SettingsScreenProps) {
  const { currentTheme, setTheme, autoTheme, setAutoTheme } = useTheme();
  const isDarkMode = currentTheme.id === 'dark' || currentTheme.id === 'midnight';
  const [notifications, setNotifications] = React.useState(true);
  
  const toggleDarkMode = (value: boolean) => {
    setTheme(value ? 'dark' : 'light');
  };

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
      style={[styles.settingItem, { borderBottomColor: currentTheme.colors.border }]} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.settingIcon, { backgroundColor: currentTheme.colors.background }]}>
        {icon}
      </View>
      <View style={styles.settingContent}>
        <Text style={[styles.settingTitle, { color: currentTheme.colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.settingSubtitle, { color: currentTheme.colors.textSecondary }]}>{subtitle}</Text>
        )}
      </View>
      {rightComponent || (showChevron && onPress && (
        <ChevronRight size={20} color={currentTheme.colors.textSecondary} />
      ))}
    </TouchableOpacity>
  );

  const SettingSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <View style={styles.settingSection}>
      <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>{title}</Text>
      <View style={[styles.sectionContent, { 
        backgroundColor: currentTheme.colors.surface,
        borderColor: currentTheme.colors.border 
      }]}>
        {children}
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: currentTheme.colors.background, 
        borderBottomColor: currentTheme.colors.border 
      }]}>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Menu size={24} color={currentTheme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>Settings</Text>
      </View>

      <ScrollView style={[styles.content, { backgroundColor: currentTheme.colors.background }]} showsVerticalScrollIndicator={false}>


        {/* Preferences Section */}
        <SettingSection title="Preferences">
          <SettingItem
            icon={<Moon size={20} color="#F59E0B" />}
            title="Dark Mode"
            subtitle="Switch between light and dark themes"
            showChevron={false}
            rightComponent={
              <Switch
                value={isDarkMode}
                onValueChange={toggleDarkMode}
                trackColor={{ false: currentTheme.colors.secondary, true: currentTheme.colors.accent }}
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
            onPress={() => router.push('/(tabs)/theme')}
          />
        </SettingSection>

     
  {/* Privacy & Security Section */}
  <SettingSection title="Privacy & Security">
          <SettingItem
            icon={<Shield size={20} color={currentTheme.colors.success} />}
            title="Privacy"
            subtitle="Control your data and privacy settings"
            onPress={() => router.push('/(tabs)/privacy' as any)}
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
            icon={<Info size={20} color={currentTheme.colors.textSecondary} />}
            title="App Info"
            subtitle="Version, credits, and technical details"
            onPress={() => router.push('/(tabs)/app-info')}
          />
        </SettingSection>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: currentTheme.colors.textSecondary }]}>
            Made with ❤️ using React Native
          </Text>
          <Text style={[styles.footerSubtext, { color: currentTheme.colors.textSecondary }]}>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuButton: {
    padding: 8,
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
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
    marginBottom: 12,
    marginHorizontal: 20,
  },
  sectionContent: {
    borderRadius: 16,
    marginHorizontal: 20,
    overflow: 'hidden',
    borderWidth: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
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
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
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
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
  },
});