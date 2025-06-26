import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note, Category } from '@/types/Note';

const NOTES_STORAGE_KEY = '@notes_app_notes';
const CATEGORIES_STORAGE_KEY = '@notes_app_categories';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Default categories
  const defaultCategories: Category[] = [
    { id: '1', name: 'Personal', color: '#2563EB', noteCount: 0 },
    { id: '2', name: 'Work', color: '#7C3AED', noteCount: 0 },
    { id: '3', name: 'Ideas', color: '#DC2626', noteCount: 0 },
    { id: '4', name: 'Shopping', color: '#059669', noteCount: 0 },
  ];

  // Load data from storage
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [notesData, categoriesData] = await Promise.all([
        AsyncStorage.getItem(NOTES_STORAGE_KEY),
        AsyncStorage.getItem(CATEGORIES_STORAGE_KEY),
      ]);

      if (notesData) {
        const parsedNotes = JSON.parse(notesData).map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        }));
        setNotes(parsedNotes);
      }

      if (categoriesData) {
        setCategories(JSON.parse(categoriesData));
      } else {
        setCategories(defaultCategories);
        await AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(defaultCategories));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setCategories(defaultCategories);
    } finally {
      setLoading(false);
    }
  };

  const saveNotes = async (newNotes: Note[]) => {
    try {
      await AsyncStorage.setItem(NOTES_STORAGE_KEY, JSON.stringify(newNotes));
      setNotes(newNotes);
      updateCategoryCount(newNotes);
    } catch (error) {
      console.error('Error saving notes:', error);
    }
  };

  const updateCategoryCount = (noteList: Note[]) => {
    const updatedCategories = categories.map(category => ({
      ...category,
      noteCount: noteList.filter(note => note.category === category.name).length,
    }));
    setCategories(updatedCategories);
    AsyncStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(updatedCategories));
  };

  const addNote = async (noteData: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedNotes = [newNote, ...notes];
    await saveNotes(updatedNotes);
  };

  const updateNote = async (id: string, noteData: Partial<Note>) => {
    const updatedNotes = notes.map(note =>
      note.id === id
        ? { ...note, ...noteData, updatedAt: new Date() }
        : note
    );
    await saveNotes(updatedNotes);
  };

  const deleteNote = async (id: string) => {
    const updatedNotes = notes.filter(note => note.id !== id);
    await saveNotes(updatedNotes);
  };

  const togglePin = async (id: string) => {
    const updatedNotes = notes.map(note =>
      note.id === id
        ? { ...note, isPinned: !note.isPinned, updatedAt: new Date() }
        : note
    );
    await saveNotes(updatedNotes);
  };

  const searchNotes = (query: string): Note[] => {
    if (!query.trim()) return notes;
    
    const lowercaseQuery = query.toLowerCase();
    return notes.filter(
      note =>
        note.title.toLowerCase().includes(lowercaseQuery) ||
        note.content.toLowerCase().includes(lowercaseQuery) ||
        note.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery))
    );
  };

  const getNotesByCategory = (categoryName: string): Note[] => {
    return notes.filter(note => note.category === categoryName);
  };

  return {
    notes,
    categories,
    loading,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    searchNotes,
    getNotesByCategory,
  };
}