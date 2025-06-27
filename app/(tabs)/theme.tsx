import React from 'react';
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
import { useTheme } from '@/context/ThemeContext';

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
  const { currentTheme: activeTheme, accentColor, autoTheme, setTheme, setAccentColor, setAutoTheme, themes: themeOptions, accentColors: accentOptions } = useTheme();
  const [selectedTheme, setSelectedTheme] = React.useState(activeTheme.id);
  const [selectedAccent, setSelectedAccent] = React.useState(accentOptions.find(a => a.color === accentColor)?.id || 'purple');
  const [showPreview, setShowPreview] = React.useState(false);

  // Map from theme context to local format
  const themes: ThemeOption[] = themeOptions.map(theme => (
    {
      id: theme.id,
      name: theme.id === 'light' ? 'Light Mode' : theme.id === 'dark' ? 'Dark Mode' : 'Midnight',
      description: theme.id === 'light' ? 'Clean and bright interface' : 
                  theme.id === 'dark' ? 'Easy on the eyes' : 'Pure black for OLED displays',
      icon: theme.id === 'light' ? <Sun size={24} color="#F59E0B" /> : 
            theme.id === 'dark' ? <Moon size={24} color="#6366F1" /> : 
            <Sparkles size={24} color="#8B5CF6" />,
      colors: {
        primary: theme.colors.primary,
        secondary: theme.colors.secondary,
        background: theme.colors.background,
        surface: theme.colors.surface,
        text: theme.colors.text,
      },
    }
  ));

  // Use accent colors from theme context
  const accentColors: AccentColor[] = accentOptions;

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

  const applyChanges = () => {
    setTheme(selectedTheme);
    setAccentColor(currentAccent.color);
    setAutoTheme(autoTheme);
    router.back();
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: activeTheme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: activeTheme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={activeTheme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: activeTheme.colors.text }]}>Appearance</Text>
        <TouchableOpacity 
          onPress={() => setShowPreview(!showPreview)}
          style={{padding: 8}}
        >
          <Eye size={20} color={showPreview ? currentAccent.color : activeTheme.colors.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView style={[styles.content, { backgroundColor: activeTheme.colors.background }]} showsVerticalScrollIndicator={false}>
        {/* Auto Theme Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Smartphone size={20} color={activeTheme.colors.textSecondary} />
            <Text style={[styles.sectionTitle, { color: activeTheme.colors.text }]}>Automatic</Text>
          </View>
          
          <View style={styles.settingCard}>
            <View style={[styles.settingItem, { borderBottomColor: activeTheme.colors.border }]}>
              <View style={styles.settingInfo}>
                <Text style={[styles.settingTitle, { color: activeTheme.colors.text }]}>Auto Dark Mode</Text>
                <Text style={[styles.settingSubtitle, { color: activeTheme.colors.textSecondary }]}>
                  Switch between light and dark mode based on system settings
                </Text>
              </View>
              <Switch
                value={autoTheme}
                onValueChange={setAutoTheme}
                trackColor={{ false: activeTheme.colors.secondary, true: currentAccent.color }}
                thumbColor="#F9FAFB"
              />
            </View>
          </View>
        </View>

        {/* Theme Selection */}
        <View style={{ paddingTop: 24 }}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: 20, color: activeTheme.colors.text }]}>
            Theme
          </Text>
          <View style={styles.themesContainer}>
            {themes.map(renderThemeCard)}
          </View>
        </View>

        {/* Accent Color */}
        <View style={{ paddingTop: 32 }}>
          <Text style={[styles.sectionTitle, { paddingHorizontal: 20, color: activeTheme.colors.text }]}>
            Accent Color
          </Text>
          <View style={styles.accentColorsContainer}>
            {accentColors.map(renderAccentColor)}
          </View>
          
          <Text style={[styles.accentDescription, { color: activeTheme.colors.textSecondary }]}>
            The accent color is used for buttons, links, and highlights throughout the app.
          </Text>
        </View>

        {/* Live Preview */}
        {showPreview && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Eye size={20} color={activeTheme.colors.textSecondary} />
              <Text style={[styles.sectionTitle, { color: activeTheme.colors.text }]}>Live Preview</Text>
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
            onPress={applyChanges}
          >
            <Text style={[styles.applyButtonText, { color: '#FFFFFF' }]}>Apply Changes</Text>
          </TouchableOpacity>
          
          <Text style={[styles.applyNote, { color: activeTheme.colors.textSecondary }]}>
            Changes will apply to all screens immediately.
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginLeft: 12,
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
  },
  settingCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  themesContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  themeCard: {
    borderRadius: 16,
    borderWidth: 2,
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
    marginBottom: 2,
  },
  themeDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
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
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  applyNote: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 16,
  },
});