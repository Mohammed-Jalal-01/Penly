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

// Define props interface for screen components
interface ScreenProps {
  onMenuPress?: () => void;
}

export default function SearchScreen({ onMenuPress }: ScreenProps) {
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
        <Clock size={16} color="#9CA3AF" />
        <Text style={styles.sectionTitle}>Recent Searches</Text>
        {recentSearches.length > 0 && (
          <TouchableOpacity onPress={clearRecentSearches}>
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>
      
      {recentSearches.length > 0 ? (
        <View style={styles.chipContainer}>
          {recentSearches.map((search, index) => (
            <TouchableOpacity
              key={index}
              style={styles.chip}
              onPress={() => handleSearch(search)}
            >
              <Text style={styles.chipText}>{search}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>No recent searches</Text>
      )}
    </View>
  );

  const renderPopularTags = () => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <TrendingUp size={16} color="#9CA3AF" />
        <Text style={styles.sectionTitle}>Popular Tags</Text>
      </View>
      
      {popularTags.length > 0 ? (
        <View style={styles.chipContainer}>
          {popularTags.map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.chip, styles.tagChip]}
              onPress={() => handleSearch(`#${tag}`)}
            >
              <Text style={styles.chipText}>#{tag}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : (
        <Text style={styles.emptyText}>No tags found</Text>
      )}
    </View>
  );

  const renderSearchResults = () => (
    <View style={styles.resultsContainer}>
      <Text style={styles.resultsHeader}>
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
            <Search size={48} color="#4B5563" />
            <Text style={styles.noResultsTitle}>No Results Found</Text>
            <Text style={styles.noResultsSubtitle}>
              Try adjusting your search terms or check for typos
            </Text>
          </View>
        }
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Search Notes</Text>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search notes, tags, or content..."
            placeholderTextColor="#6B7280"
            value={query}
            onChangeText={setQuery}
            returnKeyType="search"
            onSubmitEditing={() => handleSearch(query)}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={clearSearch}>
              <X size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Content */}
      <View style={styles.content}>
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
    backgroundColor: '#111827',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#F9FAFB',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#111827',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1F2937',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#F9FAFB',
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
    color: '#E5E7EB',
  },
  clearText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#8B5CF6',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#1F2937',
    borderWidth: 1,
    borderColor: '#374151',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  tagChip: {
    backgroundColor: '#1F2937',
    borderColor: '#8B5CF6',
  },
  chipText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#D1D5DB',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    fontStyle: 'italic',
  },
  resultsContainer: {
    flex: 1,
  },
  resultsHeader: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#E5E7EB',
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
    color: '#E5E7EB',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 20,
  },
});