import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FolderOpen, FileText, ChevronRight, Menu } from 'lucide-react-native';
import { useNotes } from '@/hooks/useNotes';

// Define props interface for screen components
interface ScreenProps {
  onMenuPress?: () => void;
}

export default function CategoriesScreen({ onMenuPress }: ScreenProps) {
  const { categories, getNotesByCategory } = useNotes();

  const renderCategoryCard = ({ item }: { item: any }) => {
    const categoryNotes = getNotesByCategory(item.name);
    const recentNote = categoryNotes.sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    )[0];

    return (
      <TouchableOpacity style={styles.categoryCard} activeOpacity={0.8}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryTitleContainer}>
            <View style={[styles.categoryIcon, { backgroundColor: `${item.color}20` }]}>
              <FolderOpen size={20} color={item.color} />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{item.name}</Text>
              <Text style={styles.categoryCount}>
                {item.noteCount} {item.noteCount === 1 ? 'note' : 'notes'}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#6B7280" />
        </View>

        {recentNote && (
          <View style={styles.recentNoteContainer}>
            <Text style={styles.recentNoteLabel}>Recent:</Text>
            <Text style={styles.recentNoteTitle} numberOfLines={1}>
              {recentNote.title || 'Untitled Note'}
            </Text>
            <Text style={styles.recentNoteContent} numberOfLines={2}>
              {recentNote.content || 'No content'}
            </Text>
          </View>
        )}

        <View style={styles.categoryFooter}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  backgroundColor: item.color,
                  width: `${Math.min((item.noteCount / 10) * 100, 100)}%`
                }
              ]} 
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <FolderOpen size={64} color="#4B5563" />
      <Text style={styles.emptyStateTitle}>No Categories Yet</Text>
      <Text style={styles.emptyStateSubtitle}>
        Categories will appear here as you create notes
      </Text>
    </View>
  );

  const totalNotes = categories.reduce((sum, cat) => sum + cat.noteCount, 0);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Menu size={24} color="#E5E7EB" />
        </TouchableOpacity>
        <View>
          <Text style={styles.title}>Categories</Text>
          <Text style={styles.subtitle}>
            {totalNotes} total {totalNotes === 1 ? 'note' : 'notes'} organized
          </Text>
        </View>
      </View>

      {/* Stats Overview */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <FolderOpen size={24} color="#8B5CF6" />
          <Text style={styles.statNumber}>{categories.length}</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </View>
        
        <View style={styles.statCard}>
          <FileText size={24} color="#F59E0B" />
          <Text style={styles.statNumber}>{totalNotes}</Text>
          <Text style={styles.statLabel}>Total Notes</Text>
        </View>
        
        <View style={styles.statCard}>
          <View style={styles.mostActiveIcon}>
            <Text style={styles.mostActiveEmoji}>🏆</Text>
          </View>
          <Text style={styles.statNumber}>
            {categories.reduce((max, cat) => Math.max(max, cat.noteCount), 0)}
          </Text>
          <Text style={styles.statLabel}>Most Active</Text>
        </View>
      </View>

      {/* Categories List */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={renderCategoryCard}
        contentContainerStyle={[
          styles.categoriesList,
          categories.length === 0 && styles.categoriesListEmpty
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111827',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: '#374151',
  },
  menuButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    color: '#F9FAFB',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#111827',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: '#374151',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#F9FAFB',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    textAlign: 'center',
  },
  mostActiveIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mostActiveEmoji: {
    fontSize: 20,
  },
  categoriesList: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  categoriesListEmpty: {
    flex: 1,
  },
  categoryCard: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  categoryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  categoryTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#F9FAFB',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  recentNoteContainer: {
    backgroundColor: '#111827',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#374151',
  },
  recentNoteLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
    marginBottom: 4,
  },
  recentNoteTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#F9FAFB',
    marginBottom: 2,
  },
  recentNoteContent: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#D1D5DB',
    lineHeight: 16,
  },
  categoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#374151',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
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
  },
});