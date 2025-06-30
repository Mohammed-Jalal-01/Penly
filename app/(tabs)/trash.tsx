import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Trash2, RotateCcw, Search, MoreVertical, XCircle } from 'lucide-react-native';
import { router } from 'expo-router';

const EmptyTrashState = () => {
  const { currentTheme } = useTheme();
  
  return (
    <View style={styles.emptyStateContainer}>
      <Trash2 size={80} color={`${currentTheme.colors.textSecondary}50`} />
      <Text style={[styles.emptyStateTitle, { color: currentTheme.colors.textSecondary }]}>
        Your trash is empty
      </Text>
      <Text style={[styles.emptyStateDescription, { color: currentTheme.colors.textSecondary }]}>
        Deleted notes will appear here for 30 days
      </Text>
    </View>
  );
};

interface TrashedNote {
  id: string;
  title: string;
  content: string;
  dateDeleted: string;
}

interface TrashScreenProps {
  onMenuPress?: () => void;
}

export default function TrashScreen({ onMenuPress }: TrashScreenProps) {
  const { currentTheme } = useTheme();
  const [trashedNotes, setTrashedNotes] = useState<TrashedNote[]>([]);
  
  const handleEmptyTrash = () => {
    if (trashedNotes.length === 0) return;
    
    Alert.alert(
      "Empty Trash",
      "All notes in trash will be permanently deleted. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Empty Trash", 
          style: "destructive",
          onPress: () => setTrashedNotes([])
        }
      ]
    );
  };

  const handleRestoreNote = (noteId: string) => {
    // Implementation would restore note from trash
    setTrashedNotes(trashedNotes.filter(note => note.id !== noteId));
  };

  const handleDeletePermanently = (noteId: string) => {
    Alert.alert(
      "Delete Permanently",
      "This note will be permanently deleted. This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          style: "destructive",
          onPress: () => setTrashedNotes(trashedNotes.filter(note => note.id !== noteId))
        }
      ]
    );
  };
  
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: currentTheme.colors.background }]}
      edges={['top', 'right', 'left', 'bottom']}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: currentTheme.id === 'light' ? currentTheme.colors.border : '#374151' }]}>
        <View style={styles.headerTitleContainer}>
          <Text style={[styles.headerTitle, { color: currentTheme.colors.text }]}>Trash</Text>
          <Text style={[styles.headerSubtitle, { color: currentTheme.colors.textSecondary }]}>
            {trashedNotes.length} {trashedNotes.length === 1 ? 'note' : 'notes'}
          </Text>
        </View>
        <View style={styles.headerActions}>
          {trashedNotes.length > 0 && (
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleEmptyTrash}
            >
              <Text style={[styles.emptyTrashText, { color: '#ff3b30' }]}>Empty</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => router.push('/(tabs)/search' as any)}
          >
            <Search size={22} color={currentTheme.colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Content */}
      {trashedNotes.length > 0 ? (
        <FlatList
          data={trashedNotes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <View 
              style={[
                styles.noteCard,
                { backgroundColor: currentTheme.colors.surface }
              ]}
            >
              <View style={styles.noteCardHeader}>
                <Text style={[styles.noteTitle, { color: currentTheme.colors.text }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <TouchableOpacity 
                  style={styles.noteMenuButton}
                  onPress={() => handleDeletePermanently(item.id)}
                >
                  <XCircle size={18} color="#ff3b30" />
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
                  Deleted on {item.dateDeleted}
                </Text>
                <TouchableOpacity
                  style={styles.restoreButton}
                  onPress={() => handleRestoreNote(item.id)}
                >
                  <RotateCcw size={16} color={currentTheme.colors.accent} />
                  <Text style={[styles.restoreText, { color: currentTheme.colors.accent }]}>
                    Restore
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      ) : (
        <EmptyTrashState />
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
  emptyTrashText: {
    fontFamily: 'Inter-Medium',
    fontSize: 14,
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
  restoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  restoreText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginLeft: 4,
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
