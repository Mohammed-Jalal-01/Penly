import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const ProfileScreen = () => {
  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.emailText}>mohammed333@example.com</Text>
        <TouchableOpacity style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#ffffff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Profile Section */}
        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <Image
              source={require('../../assets/images/note-profile-1.jpg')}
              style={styles.profileImage}
            />
            <View style={styles.cameraIconContainer}>
              <Ionicons name="camera" size={16} color="#ffffff" />
            </View>
          </View>
          
          <Text style={styles.greetingText}>Hi, Mohammed!</Text>
          
          <TouchableOpacity style={styles.manageAccountButton}>
            <Text style={styles.manageAccountText}>Manage your Google Account</Text>
          </TouchableOpacity>
        </View>

        {/* Switch Account Section */}
        <View style={styles.switchAccountSection}>
          <TouchableOpacity style={styles.switchAccountHeader}>
            <Text style={styles.switchAccountTitle}>Switch account</Text>
            <Ionicons name="chevron-up" size={20} color="#ffffff" />
          </TouchableOpacity>

          {/* Current Account */}
          <TouchableOpacity style={styles.accountItem}>
            <Image
              source={require('../../assets/images/note-profile-2.jpg')}
              style={styles.accountAvatar}
            />
            <View style={styles.accountInfo}>
              <Text style={styles.accountName}>Mohammed.J</Text>
              <Text style={styles.accountEmail}>mohammedjalal.0130@gmail.com</Text>
            </View>
          </TouchableOpacity>

          {/* Add Another Account */}
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIconContainer}>
              <Ionicons name="add" size={24} color="#4285f4" />
            </View>
            <Text style={styles.actionText}>Add another account</Text>
          </TouchableOpacity>

          {/* Manage Accounts */}
          <TouchableOpacity style={styles.actionItem}>
            <View style={styles.actionIconContainer}>
              <MaterialIcons name="manage-accounts" size={24} color="#ffffff" />
            </View>
            <Text style={styles.actionText}>Manage accounts on this device</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </TouchableOpacity>
        <Text style={styles.footerDot}>•</Text>
        <TouchableOpacity>
          <Text style={styles.footerLink}>Terms of Service</Text>
        </TouchableOpacity>
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  emailText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '400',
  },
  closeButton: {
    padding: 5,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  cameraIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#333333',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#1a1a1a',
  },
  greetingText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '400',
    marginBottom: 30,
  },
  manageAccountButton: {
    borderWidth: 1,
    borderColor: '#4285f4',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  manageAccountText: {
    color: '#4285f4',
    fontSize: 16,
    fontWeight: '500',
  },
  switchAccountSection: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    marginTop: 20,
    overflow: 'hidden',
  },
  switchAccountHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  switchAccountTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '400',
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#404040',
  },
  accountAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 15,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  accountEmail: {
    color: '#b0b0b0',
    fontSize: 14,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderTopWidth: 1,
    borderTopColor: '#404040',
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  actionText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '400',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  footerLink: {
    color: '#b0b0b0',
    fontSize: 14,
  },
  footerDot: {
    color: '#b0b0b0',
    fontSize: 14,
    marginHorizontal: 10,
  },

});

export default ProfileScreen;