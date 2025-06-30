import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Archive, MoreVertical, Search } from 'lucide-react-native';
import { router } from 'expo-router';

const EmptyArchiveState = () => {
  const { currentTheme } = useTheme();
  
  return (
    <View style={styles.emptyStateContainer}>
      <Archive size={80} color={`${currentTheme.colors.textSecondary}50`} />
      <Text style={[styles.emptyStateTitle, { color: currentTheme.colors.textSecondary }]}>
        Your archive is empty
      </Text>
      <Text style={[styles.emptyStateDescription, { color: currentTheme.colors.textSecondary }]}>
        Archived notes will appear here
      </Text>
    </View>
  );
};

interface ArchivedNote {
  id: string;
  title: string;
  content: string;
  dateArchived: string;
}

interface ArchiveScreenProps {
  onMenuPress?: () => void;
}

export default function ArchiveScreen({ onMenuPress }: ArchiveScreenProps) {
  const { currentTheme } = useTheme();
  const [archivedNotes, setArchivedNotes] = useState<ArchivedNote[]>([]);
  
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.colors.background }]}
      edges={['top', 'right', 'left', 'bottom']}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: currentTheme.id === 'light' ? currentTheme.colors.border : '#374151' }]}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>Archive</Text>
          <Text style={[styles.headerSubtitle, { color: currentTheme.colors.textSecondary }]}>
            {archivedNotes.length} {archivedNotes.length === 1 ? 'note' : 'notes'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/search' as any)}
          >
            <Search size={22} color={currentTheme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content */}
      {archivedNotes.length > 0 ? (
        <FlatList
          data={archivedNotes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.noteCard,
                { backgroundColor: currentTheme.colors.surface }
              ]}
              onPress={() => {}}
            >
              <View style={styles.noteCardHeader}>
                <Text style={[styles.noteTitle, { color: currentTheme.colors.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <TouchableOpacity style={styles.noteMenuButton}>
                  <MoreVertical size={18} color={currentTheme.colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <Text 
                style={[styles.noteExcerpt, { color: currentTheme.colors.textSecondary }]} 
                numberOfLines={2}
              >
                {item.content}
              </Text>
              <View style={styles.noteFooter}>
                <Text style={[styles.noteDate, { color: currentTheme.colors.textSecondary }]}>
                  {item.dateArchived}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <EmptyArchiveState />
      )}
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
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
  },
  noteCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  noteCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  noteTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    flex: 1,
  },
  noteMenuButton: {
    padding: 4,
  },
  noteExcerpt: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
    marginBottom: 12,
  },
  noteFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  noteDate: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    maxWidth: 280,
  },
});
