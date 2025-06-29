import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Info, 
  Heart, 
  Star, 
  ExternalLink, 
  Github, 
  Mail, 
  MessageCircle, 
  Shield,
  Smartphone,
  Zap,
  Lock,
  Download,
  Globe,
  Code,
  Coffee,
  Users,
  Award,
  Sparkles
} from 'lucide-react-native';
import { router } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function AppInfoScreen() {
  const { currentTheme } = useTheme();

  const appVersion = '1.0.0';
  const releaseDate = 'Jun 2025';

  const handleLinkPress = (url: string, title: string) => {
    Alert.alert(
      `Open ${title}`,
      `This will open ${url} in your browser.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Open', 
          onPress: () => Linking.openURL(url).catch(() => 
            Alert.alert('Error', 'Unable to open link')
          )
        },
      ]
    );
  };

  const handleFeedback = () => {
    Alert.alert(
      'Send Feedback',
      'Choose how you\'d like to provide feedback:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Email', 
          onPress: () => Linking.openURL('mailto:feedback@notesapp.com?subject=Notes App Feedback')
        },
        { 
          text: 'Rate App', 
          onPress: () => Alert.alert('Thank you!', 'Rating feature would open app store here.')
        },
      ]
    );
  };

  const InfoSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
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

  const InfoItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress,
    showArrow = false,
    value
  }: {
    icon: React.ReactNode;
    title: string;
    subtitle?: string;
    onPress?: () => void;
    showArrow?: boolean;
    value?: string;
  }) => (
    <TouchableOpacity 
      style={[
        styles.infoItem,
        { borderBottomColor: currentTheme.colors.border }
      ]} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.infoIcon, { backgroundColor: currentTheme.colors.background }]}>
        {icon}
      </View>
      <View style={styles.infoContent}>
        <Text style={[styles.infoTitle, { color: currentTheme.colors.text }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.infoSubtitle, { color: currentTheme.colors.textSecondary }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {value && (
        <Text style={[styles.infoValue, { color: currentTheme.colors.textSecondary }]}>
          {value}
        </Text>
      )}
      {showArrow && (
        <ExternalLink size={16} color={currentTheme.colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  const FeatureCard = ({ icon, title, description }: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
  }) => (
    <View style={[
      styles.featureCard,
      { 
        backgroundColor: currentTheme.colors.surface,
        borderColor: currentTheme.colors.border 
      }
    ]}>
      <View style={[styles.featureIcon, { backgroundColor: currentTheme.colors.background }]}>
        {icon}
      </View>
      <Text style={[styles.featureTitle, { color: currentTheme.colors.text }]}>{title}</Text>
      <Text style={[styles.featureDescription, { color: currentTheme.colors.textSecondary }]}>
        {description}
      </Text>
    </View>
  );

  const AppHeader = () => (
    <View style={[
      styles.appHeader,
      { 
        backgroundColor: currentTheme.colors.surface,
        borderColor: currentTheme.colors.border 
      }
    ]}>
      <View style={styles.appIconContainer}>
        <View style={[styles.appIcon, { backgroundColor: currentTheme.colors.primary }]}>
          <Sparkles size={32} color="#FFFFFF" />
        </View>
      </View>
      
      <Text style={[styles.appName, { color: currentTheme.colors.text }]}> Penly Notes</Text>
      <Text style={[styles.appTagline, { color: currentTheme.colors.textSecondary }]}>
        Your thoughts, beautifully organized
      </Text>
      
      <View style={styles.versionContainer}>
        <Text style={[styles.versionText, { color: currentTheme.colors.textSecondary }]}>
          Version {appVersion} 
        </Text>
        <Text style={[styles.releaseDate, { color: currentTheme.colors.textSecondary }]}>
          Released {releaseDate}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: currentTheme.colors.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <ArrowLeft size={24} color={currentTheme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>App Info</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* App Header */}
        <View style={styles.section}>
          <AppHeader />
        </View>

        {/* Key Features */}
        <InfoSection title="Key Features">
          <View style={styles.featuresGrid}>
            <FeatureCard
              icon={<Lock size={20} color={currentTheme.colors.primary} />}
              title="Privacy First"
              description="All data stored locally on your device"
            />
            <FeatureCard
              icon={<Zap size={20} color={currentTheme.colors.warning} />}
              title="Lightning Fast"
              description="Instant search and smooth performance"
            />
            <FeatureCard
              icon={<Smartphone size={20} color={currentTheme.colors.success} />}
              title="Cross Platform"
              description="Works seamlessly on all devices"
            />
            <FeatureCard
              icon={<Sparkles size={20} color={currentTheme.colors.error} />}
              title="Beautiful Design"
              description="Thoughtfully crafted user experience"
            />
          </View>
        </InfoSection>

        {/* Technical Information */}
        <InfoSection title="Technical Details">
          <InfoItem
            icon={<Code size={20} color={currentTheme.colors.primary} />}
            title="Framework"
            subtitle="Built with React Native and Expo"
            value="Expo SDK 52"
          />
          <InfoItem
            icon={<Smartphone size={20} color={currentTheme.colors.success} />}
            title="Platform Support"
            subtitle="iOS, Android, and Web"
            value="Universal"
          />
          <InfoItem
            icon={<Download size={20} color={currentTheme.colors.warning} />}
            title="App Size"
            subtitle="Optimized for minimal storage usage"
            value="< 10 MB"
          />
          <InfoItem
            icon={<Shield size={20} color={currentTheme.colors.success} />}
            title="Security"
            subtitle="End-to-end encryption for backups"
            value="AES-256"
          />
        </InfoSection>

        {/* Development Team */}
        <InfoSection title="Development">
          <InfoItem
            icon={<Users size={20} color={currentTheme.colors.primary} />}
            title="Development Team"
            subtitle="Crafted with care by passionate developers"
          />
          <InfoItem
            icon={<Coffee size={20} color={currentTheme.colors.warning} />}
            title="Made with Love"
            subtitle="Countless hours and lots of coffee"
          />
          <InfoItem
            icon={<Heart size={20} color={currentTheme.colors.error} />}
            title="Open Source"
            subtitle="Built on amazing open source technologies"
          />
        </InfoSection>

        {/* Support & Feedback */}
        <InfoSection title="Support & Feedback">
          <InfoItem
            icon={<MessageCircle size={20} color={currentTheme.colors.primary} />}
            title="Send Feedback"
            subtitle="Help us improve the app"
            onPress={handleFeedback}
            showArrow={true}
          />
          <InfoItem
            icon={<Star size={20} color={currentTheme.colors.warning} />}
            title="Rate the App"
            subtitle="Share your experience with others"
            onPress={() => Alert.alert('Thank you!', 'Rating feature would open app store here.')}
            showArrow={true}
          />
          <InfoItem
            icon={<Github size={20} color={currentTheme.colors.textSecondary} />}
            title="Source Code"
            subtitle="View on GitHub"
            onPress={() => handleLinkPress('https://github.com/yourapp/notes', 'GitHub')}
            showArrow={true}
          />
          <InfoItem
            icon={<Globe size={20} color={currentTheme.colors.primary} />}
            title="Website"
            subtitle="Visit our official website"
            onPress={() => handleLinkPress('https://notesapp.com', 'Website')}
            showArrow={true}
          />
        </InfoSection>

        {/* Legal & Privacy */}
        <InfoSection title="Legal & Privacy">
          <InfoItem
            icon={<Shield size={20} color={currentTheme.colors.success} />}
            title="Privacy Policy"
            subtitle="How we protect your data"
            onPress={() => router.push('/(tabs)/privacy')}
            showArrow={true}
          />
          <InfoItem
            icon={<Info size={20} color={currentTheme.colors.textSecondary} />}
            title="Terms of Service"
            subtitle="App usage terms and conditions"
            onPress={() => Alert.alert('Terms of Service', 'Terms of service would be displayed here.')}
            showArrow={true}
          />
          <InfoItem
            icon={<Award size={20} color={currentTheme.colors.warning} />}
            title="Licenses"
            subtitle="Open source licenses and attributions"
            onPress={() => Alert.alert('Licenses', 'Third-party licenses and attributions would be shown here.')}
            showArrow={true}
          />
        </InfoSection>

        {/* Credits */}
        <View style={[
          styles.creditsSection,
          { 
            backgroundColor: currentTheme.colors.surface,
            borderColor: currentTheme.colors.border 
          }
        ]}>
          <Text style={[styles.creditsTitle, { color: currentTheme.colors.text }]}>
            Special Thanks
          </Text>
          <Text style={[styles.creditsText, { color: currentTheme.colors.textSecondary }]}>
            Built with amazing technologies including React Native, Expo, TypeScript, and many other 
            open source libraries. Special thanks to the incredible developer community that makes 
            projects like this possible.
          </Text>
          
          <View style={styles.techStack}>
            <View style={styles.techItem}>
              <Text style={[styles.techName, { color: currentTheme.colors.primary }]}>React Native</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={[styles.techName, { color: currentTheme.colors.primary }]}>Expo</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={[styles.techName, { color: currentTheme.colors.primary }]}>TypeScript</Text>
            </View>
            <View style={styles.techItem}>
              <Text style={[styles.techName, { color: currentTheme.colors.primary }]}>Lucide Icons</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: currentTheme.colors.textSecondary }]}>
            © 2025 Penly App. Made with ❤️
          </Text>
          <Text style={[styles.footerSubtext, { color: currentTheme.colors.textSecondary }]}>
            Thank you for using our app!
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
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  infoSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 18,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginRight: 8,
  },
  appHeader: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
  },
  appIconContainer: {
    marginBottom: 16,
  },
  appIcon: {
    width: 80,
    height: 80,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  appTagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 16,
    textAlign: 'center',
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    marginBottom: 2,
  },
  releaseDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 12,
  },
  featureCard: {
    width: '48%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
    textAlign: 'center',
  },
  featureDescription: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 16,
  },
  creditsSection: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginBottom: 32,
  },
  creditsTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 12,
    textAlign: 'center',
  },
  creditsText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    textAlign: 'center',
    marginBottom: 16,
  },
  techStack: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 8,
  },
  techItem: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  techName: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 32,
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  footerSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});