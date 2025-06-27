import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, X, Clock, TrendingUp, ArrowLeft } from 'lucide-react-native';
import { useNotes } from '@/hooks/useNotes';
import NoteCard from '@/components/NoteCard';
import { Note } from '@/types/Note';
import { useTheme } from '@/context/ThemeContext';

// Define props interface for screen components
interface ScreenProps {
  onMenuPress?: () => void;
}

export default function SearchScreen({ onMenuPress }: ScreenProps) {
  const { currentTheme } = useTheme();
  const { notes, searchNotes, togglePin, deleteNote } = useNotes();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([
    'meeting notes',
    'grocery list',
    'ideas',
  ]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    return searchNotes(query);
  }, [query, searchNotes]);

  const popularTags = useMemo(() => {
    const tagCounts: { [key: string]: number } = {};
    notes.forEach(note => {
      note.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });
    
    return Object.entries(tagCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([tag]) => tag);
  }, [notes]);

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    if (searchQuery.trim() && !recentSearches.includes(searchQuery.trim())) {
      setRecentSearches(prev => [searchQuery.trim(), ...prev.slice(0, 4)]);
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  const handleNoteMore = (note: Note) => {
    // Similar to main screen - could extract to a shared utility
  };

  const renderRecentSearches = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Clock size={16} color={currentTheme.colors.textSecondary} />
        <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>Recent Searches</Text>
        {recentSearches.length > 0 && (
          <TouchableOpacity onPress={clearRecentSearches}>
            <Text style={[styles.clearText, { color: currentTheme.colors.accent }]}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {recentSearches.length > 0 ? (
        <View style={styles.chipContainer}>
          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.chip, { 
                backgroundColor: currentTheme.colors.surface, 
                borderColor: currentTheme.colors.border 
              }]}
              onPress={() => handleSearch(search)}
            >
              <Text style={[styles.chipText, { color: currentTheme.colors.text }]}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={[styles.emptyText, { color: currentTheme.colors.textSecondary }]}>No recent searches</Text>
      )}
    </View>
  );

  const renderPopularTags = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <TrendingUp size={16} color={currentTheme.colors.textSecondary} />
        <Text style={[styles.sectionTitle, { color: currentTheme.colors.text }]}>Popular Tags</Text>
      </View>
      
      {popularTags.length > 0 ? (
        <View style={styles.chipContainer}>
          {popularTags.map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.chip, { 
                backgroundColor: currentTheme.colors.surface, 
                borderColor: currentTheme.colors.accent 
              }]}
              onPress={() => handleSearch(`#${tag}`)}
            >
              <Text style={[styles.chipText, { color: currentTheme.colors.text }]}>#{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={[styles.emptyText, { color: currentTheme.colors.textSecondary }]}>No tags found</Text>
      )}
    </View>
  );

  const renderSearchResults = () => (
    <View style={styles.resultsContainer}>
      <Text style={[styles.resultsHeader, { color: currentTheme.colors.text }]}>
        {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{query}"
      </Text>
      
      <FlatList
        data={searchResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <NoteCard
            note={item}
            onPress={() => {}} // Navigate to note editor
            onPinToggle={() => togglePin(item.id)}
            onMore={() => handleNoteMore(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
        numColumns={2}
        columnWrapperStyle={styles.row}
        ListEmptyComponent={
          <View style={styles.noResultsContainer}>
            <Search size={48} color={currentTheme.colors.textSecondary} />
            <Text style={[styles.noResultsTitle, { color: currentTheme.colors.text }]}>No Results Found</Text>
            <Text style={[styles.noResultsSubtitle, { color: currentTheme.colors.textSecondary }]}>
              Try adjusting your search terms or check for typos
            </Text>
          </View>
        }
      />
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: currentTheme.colors.background,
        borderBottomColor: currentTheme.colors.border
      }]}>
        <Text style={[styles.title, { color: currentTheme.colors.text }]}>Search Notes</Text>
      </View>

      {/* Search Input */}
      <View style={[styles.searchContainer, { backgroundColor: currentTheme.colors.background }]}>
        <View style={[styles.searchInputContainer, { 
          backgroundColor: currentTheme.colors.surface,
          borderColor: currentTheme.colors.border
        }]}>
          <Search size={20} color={currentTheme.colors.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: currentTheme.colors.text }]}
            placeholder="Search notes, tags, or content..."
            placeholderTextColor={currentTheme.colors.textSecondary}
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(query)}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color={currentTheme.colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <View style={[styles.content, { backgroundColor: currentTheme.colors.background }]}>
        {query.trim() ? (
          renderSearchResults()
        ) : (
          <>
            {renderRecentSearches()}
            {renderPopularTags()}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 8,
  },
  sectionTitle: {
    flex: 1,
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  clearText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 16,
  },
  row: {
    justifyContent: 'space-between',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 80,
  },
  noResultsTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 20,
  },
});