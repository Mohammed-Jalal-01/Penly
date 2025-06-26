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
  X
} from 'lucide-react-native';

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
  const menuItems = [
    { id: 'index', title: 'Notes', icon: NotebookPen },
    { id: 'search', title: 'Search', icon: Search },
    { id: 'categories', title: 'Categories', icon: FolderOpen },
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
          <View style={styles.sidebarHeader}>
            <View style={styles.profileSection}>
              <Image 
                source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }}
                style={styles.profileImage}
              />
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>John Doe</Text>
                <Text style={styles.profileEmail}>john@example.com</Text>
              </View>
            </View>
            
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#9CA3AF" />
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
                  style={[styles.menuItem, isActive && styles.menuItemActive]}
                  onPress={() => handleTabPress(item.id)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.menuIconContainer, isActive && styles.menuIconContainerActive]}>
                    <IconComponent 
                      size={20} 
                      color={isActive ? '#8B5CF6' : '#9CA3AF'} 
                    />
                  </View>
                  <Text style={[styles.menuItemText, isActive && styles.menuItemTextActive]}>
                    {item.title}
                  </Text>
                  {isActive && <View style={styles.activeIndicator} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Footer */}
          <View style={styles.sidebarFooter}>
            <Text style={styles.footerText}>Notes App v1.0.0</Text>
            <Text style={styles.footerSubtext}>Made By Mohammed.J</Text>
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
    backgroundColor: '#1F2937',
    zIndex: 999,
    borderRightWidth: 1,
    borderRightColor: '#374151',
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
    borderBottomColor: '#374151',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F9FAFB',
    marginBottom: 2,
  },
  profileEmail: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
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
    backgroundColor: '#374151',
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
    backgroundColor: '#8B5CF620',
  },
  menuItemText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    flex: 1,
  },
  menuItemTextActive: {
    color: '#F9FAFB',
  },
  activeIndicator: {
    width: 3,
    height: 20,
    backgroundColor: '#8B5CF6',
    borderRadius: 2,
    position: 'absolute',
    right: 0,
  },
  sidebarFooter: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#374151',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 10,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
});