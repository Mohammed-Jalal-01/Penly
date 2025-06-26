import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft,
  Palette,
  Sun,
  Moon,
  Smartphone,
  Check,
  Eye,
  Paintbrush,
  Sparkles
} from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

interface ThemeOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    surface: string;
    text: string;
  };
}

interface AccentColor {
  id: string;
  name: string;
  color: string;
}

export default function ThemeScreen() {
  const [selectedTheme, setSelectedTheme] = useState('dark');
  const [selectedAccent, setSelectedAccent] = useState('purple');
  const [autoTheme, setAutoTheme] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const themes: ThemeOption[] = [
    {
      id: 'light',
      name: 'Light Mode',
      description: 'Clean and bright interface',
      icon: <Sun size={24} color="#F59E0B" />,
      colors: {
        primary: '#8B5CF6',
        secondary: '#F3F4F6',
        background: '#FFFFFF',
        surface: '#F9FAFB',
        text: '#111827',
      },
    },
    {
      id: 'dark',
      name: 'Dark Mode',
      description: 'Easy on the eyes',
      icon: <Moon size={24} color="#6366F1" />,
      colors: {
        primary: '#8B5CF6',
        secondary: '#1F2937',
        background: '#111827',
        surface: '#1F2937',
        text: '#F9FAFB',
      },
    },
    {
      id: 'midnight',
      name: 'Midnight',
      description: 'Pure black for OLED displays',
      icon: <Sparkles size={24} color="#8B5CF6" />,
      colors: {
        primary: '#8B5CF6',
        secondary: '#0F0F0F',
        background: '#000000',
        surface: '#0F0F0F',
        text: '#FFFFFF',
      },
    },
  ];

  const accentColors: AccentColor[] = [
    { id: 'purple', name: 'Purple', color: '#8B5CF6' },
    { id: 'blue', name: 'Blue', color: '#3B82F6' },
    { id: 'green', name: 'Green', color: '#10B981' },
    { id: 'orange', name: 'Orange', color: '#F59E0B' },
    { id: 'pink', name: 'Pink', color: '#EC4899' },
    { id: 'red', name: 'Red', color: '#EF4444' },
    { id: 'indigo', name: 'Indigo', color: '#6366F1' },
    { id: 'teal', name: 'Teal', color: '#14B8A6' },
  ];

  const currentTheme = themes.find(t => t.id === selectedTheme) || themes[1];
  const currentAccent = accentColors.find(a => a.id === selectedAccent) || accentColors[0];

  const renderThemeCard = (theme: ThemeOption) => {
    const isSelected = selectedTheme === theme.id;
    
    return (
      <TouchableOpacity
        key={theme.id}
        style={[
          styles.themeCard,
          isSelected && styles.themeCardSelected,
          { borderColor: isSelected ? currentAccent.color : '#374151' }
        ]}
        onPress={() => setSelectedTheme(theme.id)}
        activeOpacity={0.8}
      >
        <View style={styles.themeCardHeader}>
          <View style={styles.themeIconContainer}>
            {theme.icon}
          </View>
          <View style={styles.themeInfo}>
            <Text style={styles.themeName}>{theme.name}</Text>
            <Text style={styles.themeDescription}>{theme.description}</Text>
          </View>
          {isSelected && (
            <View style={[styles.checkIcon, { backgroundColor: currentAccent.color }]}>
              <Check size={16} color="#FFFFFF" />
            </View>
          )}
        </View>

        {/* Theme Preview */}
        <View style={[styles.themePreview, { backgroundColor: theme.colors.background }]}>
          <View style={[styles.previewHeader, { backgroundColor: theme.colors.surface }]}>
            <View style={[styles.previewDot, { backgroundColor: theme.colors.primary }]} />
            <View style={[styles.previewLine, { backgroundColor: theme.colors.text, opacity: 0.6 }]} />
          </View>
          <View style={styles.previewContent}>
            <View style={[styles.previewCard, { backgroundColor: theme.colors.surface }]}>
              <View style={[styles.previewCardLine, { backgroundColor: theme.colors.text, opacity: 0.8 }]} />
              <View style={[styles.previewCardLine, { backgroundColor: theme.colors.text, opacity: 0.4, width: '60%' }]} />
            </View>
            <View style={[styles.previewCard, { backgroundColor: theme.colors.surface }]}>
              <View style={[styles.previewCardLine, { backgroundColor: theme.colors.text, opacity: 0.8 }]} />
              <View style={[styles.previewCardLine, { backgroundColor: theme.colors.text, opacity: 0.4, width: '80%' }]} />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderAccentColor = (accent: AccentColor) => {
    const isSelected = selectedAccent === accent.id;
    
    return (
      <TouchableOpacity
        key={accent.id}
        style={[
          styles.accentColor,
          { backgroundColor: accent.color },
          isSelected && styles.accentColorSelected
        ]}
        onPress={() => setSelectedAccent(accent.id)}
        activeOpacity={0.8}
      >
        {isSelected && (
          <Check size={16} color="#FFFFFF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color="#F9FAFB" />
        </TouchableOpacity>
        <Text style={styles.title}>Theme</Text>
        <TouchableOpacity 
          onPress={() => setShowPreview(!showPreview)}
          style={styles.previewButton}
        >
          <Eye size={20} color={showPreview ? currentAccent.color : '#9CA3AF'} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Auto Theme Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Smartphone size={20} color="#9CA3AF" />
            <Text style={styles.sectionTitle}>Automatic</Text>
          </View>
          
          <View style={styles.settingCard}>
            <View style={styles.settingItem}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Follow System</Text>
                <Text style={styles.settingSubtitle}>
                  Automatically switch between light and dark themes based on your device settings
                </Text>
              </View>
              <Switch
                value={autoTheme}
                onValueChange={setAutoTheme}
                trackColor={{ false: '#374151', true: currentAccent.color }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Theme Selection */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Palette size={20} color="#9CA3AF" />
            <Text style={styles.sectionTitle}>Appearance</Text>
          </View>
          
          <View style={styles.themesContainer}>
            {themes.map(renderThemeCard)}
          </View>
        </View>

        {/* Accent Colors */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Paintbrush size={20} color="#9CA3AF" />
            <Text style={styles.sectionTitle}>Accent Color</Text>
          </View>
          
          <View style={styles.accentColorsContainer}>
            {accentColors.map(renderAccentColor)}
          </View>
          
          <Text style={styles.accentDescription}>
            Choose an accent color that will be used for buttons, links, and highlights throughout the app.
          </Text>
        </View>

        {/* Live Preview */}
        {showPreview && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Eye size={20} color="#9CA3AF" />
              <Text style={styles.sectionTitle}>Live Preview</Text>
            </View>
            
            <View style={[
              styles.livePreview,
              { backgroundColor: currentTheme.colors.background }
            ]}>
              <View style={[
                styles.previewAppBar,
                { backgroundColor: currentTheme.colors.surface }
              ]}>
                <Text style={[
                  styles.previewAppTitle,
                  { color: currentTheme.colors.text }
                ]}>
                  Notes App
                </Text>
              </View>
              
              <View style={styles.previewNotes}>
                <View style={[
                  styles.previewNote,
                  { backgroundColor: currentTheme.colors.surface }
                ]}>
                  <View style={[
                    styles.previewNoteDot,
                    { backgroundColor: currentAccent.color }
                  ]} />
                  <Text style={[
                    styles.previewNoteTitle,
                    { color: currentTheme.colors.text }
                  ]}>
                    Meeting Notes
                  </Text>
                  <Text style={[
                    styles.previewNoteContent,
                    { color: currentTheme.colors.text, opacity: 0.7 }
                  ]}>
                    Discuss project timeline and deliverables...
                  </Text>
                </View>
                
                <View style={[
                  styles.previewNote,
                  { backgroundColor: currentTheme.colors.surface }
                ]}>
                  <View style={[
                    styles.previewNoteDot,
                    { backgroundColor: currentAccent.color }
                  ]} />
                  <Text style={[
                    styles.previewNoteTitle,
                    { color: currentTheme.colors.text }
                  ]}>
                    Ideas
                  </Text>
                  <Text style={[
                    styles.previewNoteContent,
                    { color: currentTheme.colors.text, opacity: 0.7 }
                  ]}>
                    New app features and improvements...
                  </Text>
                </View>
              </View>
              
              <TouchableOpacity style={[
                styles.previewFab,
                { backgroundColor: currentAccent.color }
              ]}>
                <Text style={styles.previewFabText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Apply Button */}
        <View style={styles.applySection}>
          <TouchableOpacity 
            style={[styles.applyButton, { backgroundColor: currentAccent.color }]}
            activeOpacity={0.8}
          >
            <Text style={styles.applyButtonText}>Apply Theme</Text>
          </TouchableOpacity>
          
          <Text style={styles.applyNote}>
            Changes will be applied immediately and saved to your preferences.
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#F9FAFB',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  previewButton: {
    padding: 8,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#E5E7EB',
  },
  settingCard: {
    backgroundColor: '#1F2937',
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F9FAFB',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    lineHeight: 20,
  },
  themesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  themeCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#374151',
    overflow: 'hidden',
  },
  themeCardSelected: {
    borderWidth: 2,
  },
  themeCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  themeIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F9FAFB',
    marginBottom: 2,
  },
  themeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themePreview: {
    height: 80,
    margin: 16,
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewHeader: {
    height: 24,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    gap: 6,
  },
  previewDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  previewLine: {
    height: 2,
    flex: 1,
    borderRadius: 1,
  },
  previewContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 8,
    gap: 6,
  },
  previewCard: {
    flex: 1,
    borderRadius: 6,
    padding: 6,
    gap: 3,
  },
  previewCardLine: {
    height: 2,
    borderRadius: 1,
  },
  accentColorsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 12,
  },
  accentColor: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  accentColorSelected: {
    borderColor: '#FFFFFF',
  },
  accentDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    paddingHorizontal: 20,
    marginTop: 16,
    lineHeight: 20,
  },
  livePreview: {
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    height: 200,
    borderWidth: 1,
    borderColor: '#374151',
  },
  previewAppBar: {
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  previewAppTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  previewNotes: {
    flex: 1,
    padding: 12,
    gap: 8,
  },
  previewNote: {
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  previewNoteDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 6,
  },
  previewNoteTitle: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  previewNoteContent: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    flex: 2,
    marginTop: 2,
  },
  previewFab: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewFabText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter-Bold',
  },
  applySection: {
    paddingHorizontal: 20,
    paddingBottom: 32,
  },
  applyButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  applyNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 16,
  },
});