import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Pin, Calendar, MoveVertical as MoreVertical, ExternalLink, Globe } from 'lucide-react-native';
import { Note } from '@/types/Note';

interface NoteCardProps {
  note: Note;
  onPress: () => void;
  onPinToggle: () => void;
  onMore: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = (width - 48) / 2; // Account for padding and gap

export default function NoteCard({ note, onPress, onPinToggle, onMore }: NoteCardProps) {
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 168) { // 7 days
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'Personal': '#8B5CF6',
      'Work': '#F59E0B',
      'Ideas': '#EF4444',
      'Shopping': '#10B981',
    };
    return colors[category] || '#6B7280';
  };

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const hasUrl = note.content.split('\n').some(line => isUrl(line.trim()));

  return (
    <TouchableOpacity
      style={[styles.card, note.isPinned && styles.pinnedCard]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.categoryContainer}>
          <View 
            style={[
              styles.categoryDot, 
              { backgroundColor: getCategoryColor(note.category) }
            ]} 
          />
        </View>
        
        <View style={styles.headerActions}>
          {note.isPinned && (
            <Pin size={14} color="#F59E0B" fill="#F59E0B" />
          )}
          <TouchableOpacity onPress={onMore} style={styles.moreButton}>
            <MoreVertical size={16} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title} numberOfLines={2}>
        {note.title || 'Untitled Note'}
      </Text>
      
      <Text style={styles.content} numberOfLines={6}>
        {note.content || 'No content'}
      </Text>

      {hasUrl && (
        <View style={styles.linkIndicator}>
          <Globe size={12} color="#8B5CF6" />
          <ExternalLink size={12} color="#8B5CF6" />
        </View>
      )}

      <View style={styles.footer}>
        {note.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {note.tags.slice(0, 1).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
            {note.tags.length > 1 && (
              <Text style={styles.moreTagsText}>+{note.tags.length - 1}</Text>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1F2937',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    width: cardWidth,
    borderWidth: 1,
    borderColor: '#374151',
    minHeight: 180,
  },
  pinnedCard: {
    borderColor: '#F59E0B',
    backgroundColor: '#1F2937',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  moreButton: {
    padding: 4,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#F9FAFB',
    marginBottom: 8,
    lineHeight: 22,
  },
  content: {
    fontSize: 13,
    fontFamily: 'Inter-Regular',
    color: '#D1D5DB',
    lineHeight: 18,
    marginBottom: 12,
    flex: 1,
  },
  linkIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  tag: {
    backgroundColor: '#374151',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#9CA3AF',
  },
  moreTagsText: {
    fontSize: 10,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
});