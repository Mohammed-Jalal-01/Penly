import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  NotebookPen, 
  Search, 
  FolderOpen, 
  Settings,
  X,
  Archive,
  Trash2
} from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { router } from 'expo-router';

interface SidebarProps {
  isVisible: boolean;
  onClose: () => void;
  activeTab: string;
  onTabPress: (tab: string) => void;
  slideAnim: Animated.Value;
}

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

export default function Sidebar({ 
  isVisible, 
  onClose, 
  activeTab, 
  onTabPress, 
  slideAnim 
}: SidebarProps) {
  const { currentTheme } = useTheme();
  const menuItems = [
    { id: 'index', title: 'Notes', icon: NotebookPen },
    { id: 'search', title: 'Search', icon: Search },
    { id: 'categories', title: 'Categories', icon: FolderOpen },
    { id: 'archive', title: 'Archive', icon: Archive },
    { id: 'trash', title: 'Trash', icon: Trash2 },
    { id: 'settings', title: 'Settings', icon: Settings },
  ];

  const handleTabPress = (tabId: string) => {
    onTabPress(tabId);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isVisible && (
        <Animated.View 
          style={[
            styles.backdrop,
            {
              opacity: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
              }),
            }
          ]}
        >
          <TouchableOpacity 
            style={styles.backdropTouchable}
            onPress={onClose}
            activeOpacity={1}
          />
        </Animated.View>
      )}

      {/* Sidebar */}
      <Animated.View
        style={[
          styles.sidebar,
          {
            backgroundColor: currentTheme.colors.surface,
            borderRightColor: currentTheme.id === 'light' ? currentTheme.colors.border : '#374151',
            transform: [{
              translateX: slideAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [-SIDEBAR_WIDTH, 0],
              }),
            }],
          }
        ]}
      >
        <SafeAreaView style={styles.sidebarContent} edges={['top', 'bottom']}>
          {/* Header */}
          <View style={[styles.sidebarHeader, { borderBottomColor: currentTheme.id === 'light' ? currentTheme.colors.border : '#374151' }]}>
            <TouchableOpacity 
              style={styles.profileSection}
              onPress={() => {
                router.push('/(tabs)/ProfileScreen' as any);
                onClose();
              }}
              activeOpacity={0.7}
            >
             <Image
                source={require('../assets/images/note-profile-1.jpg')}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text 
                  style={[styles.profileName, { color: currentTheme.colors.text }]} 
                  numberOfLines={1} 
                  ellipsizeMode="tail"
                >
                  Mohammed
                </Text>
                <Text 
                  style={[styles.profileEmail, { color: currentTheme.colors.textSecondary }]} 
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  mohammed333@example.com
                </Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={currentTheme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Menu Items */}
          <View style={styles.menuSection}>
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;
              
              return (
                <TouchableOpacity
                  key={item.id}
                  style={[styles.menuItem, isActive && [styles.menuItemActive, { backgroundColor: currentTheme.id === 'light' ? currentTheme.colors.secondary : '#374151' }]]}
                  onPress={() => handleTabPress(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIconContainer, isActive && [styles.menuIconContainerActive, { backgroundColor: `${currentTheme.colors.accent}20` }]]}>
                    <IconComponent 
                      size={20} 
                      color={isActive ? currentTheme.colors.accent : currentTheme.colors.textSecondary} 
                    />
                  </View>
                  <Text style={[styles.menuItemText, { color: currentTheme.colors.textSecondary }, isActive && { color: currentTheme.colors.text }]}>
                    {item.title}
                  </Text>
                  {isActive && <View style={[styles.activeIndicator, { backgroundColor: currentTheme.colors.accent }]} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footer */}
          <View style={[styles.sidebarFooter, { borderTopColor: currentTheme.id === 'light' ? currentTheme.colors.border : '#374151' }]}>
            <Text style={[styles.footerText, { color: currentTheme.colors.textSecondary }]}>Notes App v1.0.0</Text>
            <Text style={[styles.footerSubtext, { color: currentTheme.colors.textSecondary, opacity: 0.7 }]}>Made By Mohammed.J</Text>
          </View>
        </SafeAreaView>
      </Animated.View>
    </>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000000',
    zIndex: 998,
  },
  backdropTouchable: {
    flex: 1,
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    zIndex: 999,
    borderRightWidth: 1,
  },
  sidebarContent: {
    flex: 1,
  },
  sidebarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0, // Ensures text truncation works properly
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
    flexShrink: 0, // Prevents image from shrinking
  },
  profileInfo: {
    flex: 1,
    minWidth: 0, // Ensures text truncation works properly
  },
  profileName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
    flexShrink: 1, // Allows text to shrink
  },
  profileEmail: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    flexShrink: 1, // Allows text to shrink
  },
  closeButton: {
    padding: 8,
  },
  menuSection: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginHorizontal: 12,
    borderRadius: 12,
    position: 'relative',
  },
  menuItemActive: {
    // Background color will be set dynamically
  },
  menuIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuIconContainerActive: {
    // Background color will be set dynamically
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    flex: 1,
    // Color will be set dynamically
  },
  menuItemTextActive: {
    // Color will be set dynamically
  },
  activeIndicator: {
    width: 3,
    height: 20,
    borderRadius: 2,
    position: 'absolute',
    right: 0,
    // Background color will be set dynamically
  },
  sidebarFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
    // Color will be set dynamically
  },
  footerSubtext: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    // Color will be set dynamically
  },
});