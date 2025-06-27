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
import { useTheme } from '@/context/ThemeContext';

// Define props interface for screen components
interface ScreenProps {
  onMenuPress?: () => void;
}

export default function CategoriesScreen({ onMenuPress }: ScreenProps) {
  const { currentTheme } = useTheme();
  const { categories, getNotesByCategory } = useNotes();

  const renderCategoryCard = ({ item }: { item: any }) => {
    const categoryNotes = getNotesByCategory(item.name);
    const recentNote = categoryNotes.sort((a, b) => 
      b.updatedAt.getTime() - a.updatedAt.getTime()
    )[0];

    return (
      <TouchableOpacity 
        style={[styles.categoryCard, {
          backgroundColor: currentTheme.colors.surface,
          borderColor: currentTheme.colors.border
        }]} 
        activeOpacity={0.8}>
        <View style={styles.categoryHeader}>
          <View style={styles.categoryTitleContainer}>
            <View style={[styles.categoryIcon, { backgroundColor: `${item.color}20` }]}>
              <FolderOpen size={20} color={item.color} />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={[styles.categoryName, { color: currentTheme.colors.text }]}>{item.name}</Text>
              <Text style={[styles.categoryCount, { color: currentTheme.colors.textSecondary }]}>
                {item.noteCount} {item.noteCount === 1 ? 'note' : 'notes'}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color={currentTheme.colors.textSecondary} />
        </View>

        {recentNote && (
          <View style={[styles.recentNoteContainer, {
            backgroundColor: currentTheme.colors.background,
            borderColor: currentTheme.colors.border
          }]}>
            <Text style={[styles.recentNoteLabel, { color: currentTheme.colors.textSecondary }]}>Recent:</Text>
            <Text style={[styles.recentNoteTitle, { color: currentTheme.colors.text }]} numberOfLines={1}>
              {recentNote.title || 'Untitled Note'}
            </Text>
            <Text style={[styles.recentNoteContent, { color: currentTheme.colors.textSecondary }]} numberOfLines={2}>
              {recentNote.content || 'No content'}
            </Text>
          </View>
        )}

        <View style={styles.categoryFooter}>
          <View style={[styles.progressBar, { backgroundColor: currentTheme.colors.secondary }]}>
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
      <FolderOpen size={64} color={currentTheme.colors.textSecondary} />
      <Text style={[styles.emptyStateTitle, { color: currentTheme.colors.text }]}>No Categories Yet</Text>
      <Text style={[styles.emptyStateSubtitle, { color: currentTheme.colors.textSecondary }]}>
        Categories will appear here as you create notes
      </Text>
    </View>
  );

  const totalNotes = categories.reduce((sum, cat) => sum + cat.noteCount, 0);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.colors.background }]} edges={['top']}>
      {/* Header */}
      <View style={[styles.header, { 
        backgroundColor: currentTheme.colors.background, 
        borderBottomColor: currentTheme.colors.border 
      }]}>
        <TouchableOpacity style={styles.menuButton} onPress={onMenuPress}>
          <Menu size={24} color={currentTheme.colors.text} />
        </TouchableOpacity>
        <View>
          <Text style={[styles.title, { color: currentTheme.colors.text }]}>Categories</Text>
          <Text style={[styles.subtitle, { color: currentTheme.colors.textSecondary }]}>
            {totalNotes} total {totalNotes === 1 ? 'note' : 'notes'} organized
          </Text>
        </View>
      </View>

      {/* Stats Overview */}
      <View style={[styles.statsContainer, { backgroundColor: currentTheme.colors.background }]}>
        <View style={[styles.statCard, { 
          backgroundColor: currentTheme.colors.surface, 
          borderColor: currentTheme.colors.border 
        }]}>
          <FolderOpen size={24} color={currentTheme.colors.accent} />
          <Text style={[styles.statNumber, { color: currentTheme.colors.text }]}>{categories.length}</Text>
          <Text style={[styles.statLabel, { color: currentTheme.colors.textSecondary }]}>Categories</Text>
        </View>
        
        <View style={[styles.statCard, { 
          backgroundColor: currentTheme.colors.surface, 
          borderColor: currentTheme.colors.border 
        }]}>
          <FileText size={24} color="#F59E0B" />
          <Text style={[styles.statNumber, { color: currentTheme.colors.text }]}>{totalNotes}</Text>
          <Text style={[styles.statLabel, { color: currentTheme.colors.textSecondary }]}>Total Notes</Text>
        </View>
        
        <View style={[styles.statCard, { 
          backgroundColor: currentTheme.colors.surface, 
          borderColor: currentTheme.colors.border 
        }]}>
          <View style={styles.mostActiveIcon}>
            <Text style={styles.mostActiveEmoji}>🏆</Text>
          </View>
          <Text style={[styles.statNumber, { color: currentTheme.colors.text }]}>
            {categories.reduce((max, cat) => Math.max(max, cat.noteCount), 0)}
          </Text>
          <Text style={[styles.statLabel, { color: currentTheme.colors.textSecondary }]}>Most Active</Text>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  menuButton: {
    marginRight: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
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
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
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
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  recentNoteContainer: {
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
  },
  recentNoteLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    marginBottom: 4,
  },
  recentNoteTitle: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 2,
  },
  recentNoteContent: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    lineHeight: 16,
  },
  categoryFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressBar: {
    flex: 1,
    height: 4,
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
    marginTop: 24,
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
});