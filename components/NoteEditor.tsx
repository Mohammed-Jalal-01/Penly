import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, 
  Save, 
  Pin, 
  Tag, 
  FolderOpen,
  Trash2 
} from 'lucide-react-native';
import { Note } from '@/types/Note';
import { useTheme } from '@/context/ThemeContext';

interface NoteEditorProps {
  note?: Note;
  onSave: (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onUpdate: (id: string, noteData: Partial<Note>) => void;
  onDelete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onClose: () => void;
  categories: Array<{ name: string; color: string }>;
}

export default function NoteEditor({
  note,
  onSave,
  onUpdate,
  onDelete,
  onTogglePin,
  onClose,
  categories,
}: NoteEditorProps) {
  const { currentTheme } = useTheme();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [category, setCategory] = useState(note?.category || 'Personal');
  const [tags, setTags] = useState<string[]>(note?.tags || []);
  const [tagInput, setTagInput] = useState('');
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    const originalNote = note || { title: '', content: '', category: 'Personal', tags: [] };
    const hasChanges = 
      title !== originalNote.title ||
      content !== originalNote.content ||
      category !== originalNote.category ||
      JSON.stringify(tags) !== JSON.stringify(originalNote.tags);
    
    setHasUnsavedChanges(hasChanges);
  }, [title, content, category, tags, note]);

  const handleSave = () => {
    if (!title.trim() && !content.trim()) {
      Alert.alert('Empty Note', 'Please add a title or content to save the note.');
      return;
    }

    const noteData = {
      title: title.trim(),
      content: content.trim(),
      category,
      tags,
      isPinned: note?.isPinned || false,
    };

    if (note) {
      onUpdate(note.id, noteData);
    } else {
      onSave(noteData);
    }
    
    setHasUnsavedChanges(false);
    onClose();
  };

  const handleClose = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Do you want to save before closing?',
        [
          { text: 'Discard', onPress: onClose, style: 'destructive' },
          { text: 'Save', onPress: handleSave },
        ]
      );
    } else {
      onClose();
    }
  };

  const handleDelete = () => {
    if (!note || !onDelete) return;
    
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
            onDelete(note.id);
            onClose();
          }
        },
      ]
    );
  };

  const addTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag && !tags.includes(trimmedTag)) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <SafeAreaView style={[styles.container, {backgroundColor: currentTheme.colors.background}]} edges={['top']}>
      <KeyboardAvoidingView 
        style={[styles.container, {backgroundColor: currentTheme.colors.background}]}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={[styles.header, {borderBottomColor: currentTheme.colors.border}]}>
          <TouchableOpacity onPress={handleClose} style={styles.headerButton}>
            <ArrowLeft size={24} color={currentTheme.colors.text} />
          </TouchableOpacity>
          
          <View style={styles.headerActions}>
            {note && onTogglePin && (
              <TouchableOpacity 
                onPress={() => onTogglePin(note.id)}
                style={styles.headerButton}
              >
                <Pin 
                  size={20} 
                  color={note.isPinned ? currentTheme.colors.warning : currentTheme.colors.textSecondary}
                  fill={note.isPinned ? currentTheme.colors.warning : "transparent"}
                />
              </TouchableOpacity>
            )}
            
            {onDelete && note && (
              <TouchableOpacity 
                onPress={handleDelete}
                style={styles.headerButton}
              >
                <Trash2 size={20} color="#EF4444" />
              </TouchableOpacity>
            )}
            
            <TouchableOpacity
              onPress={handleSave}
              style={[
                styles.saveButton, 
                { backgroundColor: hasUnsavedChanges ? currentTheme.colors.accent : currentTheme.colors.secondary }
              ]}
              disabled={!hasUnsavedChanges}
            >
              <Save size={16} color={hasUnsavedChanges ? "#FFFFFF" : currentTheme.colors.textSecondary} />
              <Text style={[
                styles.saveButtonText, 
                { color: hasUnsavedChanges ? "#FFFFFF" : currentTheme.colors.textSecondary }
              ]}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView style={[styles.content, { backgroundColor: currentTheme.colors.background }]} showsVerticalScrollIndicator={false}>
          {/* Title Input */}
          <TextInput
            style={[styles.titleInput, { color: currentTheme.colors.text }]}
            placeholder="Title"
            placeholderTextColor={currentTheme.colors.textSecondary}
            value={title}
            onChangeText={setTitle}
            multiline
            maxLength={100}
          />

          {/* Category Selector */}
          <TouchableOpacity 
            style={[styles.categorySelector, { 
              backgroundColor: currentTheme.colors.surface,
              borderColor: currentTheme.colors.border 
            }]}
            onPress={() => setShowCategoryPicker(!showCategoryPicker)}
          >
            <View 
              style={[
                styles.categoryDot,
                { backgroundColor: categories.find(c => c.name === category)?.color || currentTheme.colors.textSecondary }
              ]}
            />
            <Text style={[styles.categorySelectorText, { color: currentTheme.colors.textSecondary }]}>{category}</Text>
            <Text style={[styles.categorySelectorText, { color: currentTheme.colors.textSecondary }]}>▼</Text>
          </TouchableOpacity>

          {showCategoryPicker && (
            <View style={styles.categoryPicker}>
              {categories.map((cat) => (
                <TouchableOpacity
                  key={cat.name}
                  style={[
                    styles.categoryOption,
                    category === cat.name && styles.categoryOptionSelected
                  ]}
                  onPress={() => {
                    setCategory(cat.name);
                    setShowCategoryPicker(false);
                  }}
                >
                  <View style={[styles.categoryDot, { backgroundColor: cat.color }]} />
                  <Text style={[
                    styles.categoryOptionText,
                    { color: currentTheme.colors.textSecondary },
                    category === cat.name && [styles.categoryOptionTextSelected, { color: currentTheme.colors.accent }]
                  ]}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* Note Content */}
          <TextInput
            style={[styles.contentInput, { color: currentTheme.colors.text }]}
            placeholder="Start typing..."
            placeholderTextColor={currentTheme.colors.textSecondary}
            value={content}
            onChangeText={setContent}
            multiline
            keyboardType="default"
          />

          {/* Tags Section */}
          <View style={styles.tagsSection}>
            <View style={styles.tagsSectionHeader}>
              <Tag size={16} color={currentTheme.colors.textSecondary} />
              <Text style={[styles.tagsSectionTitle, { color: currentTheme.colors.text }]}>Tags</Text>
            </View>
            
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="Add a tag..."
                placeholderTextColor="#6B7280"
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={addTag}
                returnKeyType="done"
              />
              <TouchableOpacity onPress={addTag} style={styles.addTagButton}>
                <Text style={styles.addTagButtonText}>Add</Text>
              </TouchableOpacity>
            </View>

            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {tags.map((tag, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.tag, { backgroundColor: currentTheme.id === 'light' ? currentTheme.colors.secondary : '#374151' }]}
                    onPress={() => removeTag(tag)}
                  >
                    <Text style={[styles.tagText, { color: currentTheme.colors.accent }]}>#{tag}</Text>
                    <Text style={[styles.removeTagText, { color: currentTheme.colors.textSecondary }]}>×</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerButton: {
    padding: 8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  saveButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  titleInput: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    marginTop: 20,
    marginBottom: 16,
    lineHeight: 32,
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginBottom: 16,
    gap: 8,
    borderWidth: 1,
  },
  categorySelectorText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  categoryPicker: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  categoryOptionSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  categoryOptionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  categoryOptionTextSelected: {
    // Color provided inline
  },
  contentInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 24,
    minHeight: 200,
    marginBottom: 24,
  },
  tagsSection: {
    marginBottom: 24,
  },
  tagsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  tagsSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderWidth: 1,
  },
  tagInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    paddingVertical: 12,
  },
  addTagButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  addTagButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  tagText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  removeTagText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
  },
});