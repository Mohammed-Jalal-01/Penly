import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Plus, StickyNote, Menu, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { useNotes } from '@/hooks/useNotes';
import NoteCard from '@/components/NoteCard';
import NoteEditor from '@/components/NoteEditor';
import { Note } from '@/types/Note';

// Define props interface for screen components
interface ScreenProps {
  onMenuPress?: () => void;
}

export default function NotesScreen({ onMenuPress }: ScreenProps) {
  const {
    notes,
    categories,
    loading,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
  } = useNotes();

  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string | null>(null);

  const filteredNotes = filterCategory
    ? notes.filter(note => note.category === filterCategory)
    : notes;

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    // Pinned notes first
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    // Then by updated date
    return b.updatedAt.getTime() - a.updatedAt.getTime();
  });

  const handleNotePress = (note: Note) => {
    setSelectedNote(note);
    setShowEditor(true);
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setShowEditor(true);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setSelectedNote(null);
  };

  const handleNoteMore = (note: Note) => {
    Alert.alert(
      note.title || 'Note Options',
      'Choose an action',
      [
        {
          text: note.isPinned ? 'Unpin' : 'Pin',
          onPress: () => togglePin(note.id),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              'Delete Note',
              'Are you sure you want to delete this note?',
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Delete', 
                  style: 'destructive',
                  onPress: () => deleteNote(note.id) 
                },
              ]
            );
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <StickyNote size={64} color="#4B5563" />
      <Text style={styles.emptyStateTitle}>No Notes Yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Start capturing your thoughts and ideas
      </Text>
      <TouchableOpacity style={styles.createFirstNoteButton} onPress={handleNewNote}>
        <Text style={styles.createFirstNoteButtonText}>Create Your First Note</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCategoryFilter = () => (
    <View style={styles.filterContainer}>
      <TouchableOpacity
        style={[
          styles.filterChip,
          filterCategory === null && styles.filterChipActive
        ]}
        onPress={() => setFilterCategory(null)}
      >
        <Text style={[
          styles.filterChipText,
          filterCategory === null && styles.filterChipTextActive
        ]}>
          All
        </Text>
      </TouchableOpacity>
      
      {categories.map((category) => (
        <TouchableOpacity
          key={category.id}
          style={[
            styles.filterChip,
            filterCategory === category.name && styles.filterChipActive
          ]}
          onPress={() => setFilterCategory(category.name)}
        >
          <View style={[styles.filterChipDot, { backgroundColor: category.color }]} />
          <Text style={[
            styles.filterChipText,
            filterCategory === category.name && styles.filterChipTextActive
          ]}>
            {category.name}
          </Text>
          <View style={styles.filterChipBadge}>
            <Text style={styles.filterChipBadgeText}>{category.noteCount}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading notes...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Menu size={24} color="#E5E7EB" />
        </TouchableOpacity>
        
        <Text style={styles.searchPlaceholder}>Search your notes</Text>
        
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.moreButton}>
            <MoreHorizontal size={24} color="#E5E7EB" />
          </TouchableOpacity>
          <Image 
            source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2' }}
            style={styles.profileImage}
          />
        </View>
      </View>

      {/* Category Filter */}
      {notes.length > 0 && renderCategoryFilter()}

      {/* Notes List */}
      <FlatList
        data={sortedNotes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => handleNotePress(item)}
            onPinToggle={() => togglePin(item.id)}
            onMore={() => handleNoteMore(item)}
          />
        )}
        contentContainerStyle={[
          styles.notesList,
          sortedNotes.length === 0 && styles.notesListEmpty
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleNewNote}>
        <Plus size={28} color="#FFFFFF" />
      </TouchableOpacity>

      {/* Note Editor Modal */}
      <Modal
        visible={showEditor}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <NoteEditor
          note={selectedNote || undefined}
          onSave={addNote}
          onUpdate={updateNote}
          onDelete={deleteNote}
          onTogglePin={togglePin}
          onClose={handleCloseEditor}
          categories={categories}
        />
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#111827',
  },
  menuButton: {
    padding: 8,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginLeft: 16,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  moreButton: {
    padding: 8,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#111827',
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    gap: 6,
  },
  filterChipActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  filterChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  filterChipText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  filterChipBadge: {
    backgroundColor: 'rgba(156, 163, 175, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    minWidth: 18,
    alignItems: 'center',
  },
  filterChipBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    color: '#9CA3AF',
  },
  notesList: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 100,
  },
  notesListEmpty: {
    flex: 1,
  },
  row: {
    justifyContent: 'space-between',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#E5E7EB',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  createFirstNoteButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  createFirstNoteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  fab: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#8B5CF6',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
});