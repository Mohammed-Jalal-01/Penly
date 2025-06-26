import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  BackHandler,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Redirect } from 'expo-router';
import Sidebar from '@/components/Sidebar';
// Import screen components directly
import NotesScreen from '@/app/(tabs)/index';
import SearchScreen from '@/app/(tabs)/SearchScreen';
import SettingsScreen from '@/app/(tabs)/SettingsScreen';
import CategoriesScreen from '@/app/(tabs)/CategoriesScreen';

export default function MainApp() {
  const [activeTab, setActiveTab] = useState('index');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (sidebarVisible) {
        closeSidebar();
        return true;
      }
      // If not on the Notes page (index), go back to it
      if (activeTab !== 'index') {
        setActiveTab('index');
        return true;
      }
      return false;
    });

    return () => backHandler.remove();
  }, [sidebarVisible, activeTab]);

  const openSidebar = () => {
    setSidebarVisible(true);
    Animated.timing(slideAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSidebarVisible(false);
    });
  };

  const handleTabPress = (tab: string) => {
    setActiveTab(tab);
    closeSidebar(); // Close sidebar after selecting a tab
  };

  const renderActiveScreen = () => {
    const screenProps = {
      onMenuPress: openSidebar,
    };

    switch (activeTab) {
      case 'index':
        return <NotesScreen {...screenProps} />;
      case 'search':
        return <SearchScreen {...screenProps} />;
      case 'categories':
        return <CategoriesScreen {...screenProps} />;
      case 'settings':
        return <SettingsScreen {...screenProps} />;
      default:
        return <NotesScreen {...screenProps} />;
    }
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        {renderActiveScreen()}
        
        <Sidebar
          isVisible={sidebarVisible}
          onClose={closeSidebar}
          activeTab={activeTab}
          onTabPress={handleTabPress}
          slideAnim={slideAnim}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
});