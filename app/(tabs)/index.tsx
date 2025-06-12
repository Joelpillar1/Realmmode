import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import Colors from '@/constants/Colors';
import CategoryList from '@/components/sound/CategoryList';
import SoundList from '@/components/sound/SoundList';
import { useRouter } from 'expo-router';
import { Sound } from '@/types/sound';
import Header from '@/components/ui/Header';
import { soundService } from '@/services/soundService';

export default function HomeScreen() {
  const router = useRouter();
  const [featuredSound, setFeaturedSound] = useState<Sound | null>(null);
  const [featuredSounds, setFeaturedSounds] = useState<Sound[]>([]);
  const [recentSounds, setRecentSounds] = useState<Sound[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await soundService.loadSounds();
      
      const sounds = soundService.getSounds();
      const cats = soundService.getCategories();
      
      setFeaturedSounds(soundService.getFeaturedSounds());
      setRecentSounds(soundService.getRecentSounds());
      setCategories(cats);
      
      if (sounds.length > 0) {
        setFeaturedSound(sounds[0]);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSoundPress = (id: string) => {
    router.push(`/sound/${id}`);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Realmmode" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading sounds...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header title="Realmmode" />
        
        {featuredSound && (
          <TouchableOpacity 
            style={styles.featuredContainer}
            onPress={() => handleSoundPress(featuredSound.id)}
          >
            <Image 
              source={{ uri: featuredSound.imageUrl }} 
              style={styles.featuredImage} 
              resizeMode="cover"
            />
            <View style={styles.featuredGradient}>
              <View style={styles.featuredContent}>
                <Text style={styles.featuredLabel}>Featured</Text>
                <Text style={styles.featuredTitle}>{featuredSound.title}</Text>
                <Text style={styles.featuredCategory}>{featuredSound.category}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        
        {categories.length > 0 && (
          <View style={styles.categorySection}>
            <Text style={styles.sectionTitle}>Categories</Text>
            <CategoryList categories={categories} />
          </View>
        )}

        {featuredSounds.length > 0 && (
          <View style={styles.soundSection}>
            <Text style={styles.sectionTitle}>Popular Sounds</Text>
            <SoundList sounds={featuredSounds} onSoundPress={handleSoundPress} />
          </View>
        )}

        {recentSounds.length > 0 && (
          <View style={styles.soundSection}>
            <Text style={styles.sectionTitle}>Recently Added</Text>
            <SoundList sounds={recentSounds} onSoundPress={handleSoundPress} />
          </View>
        )}

        {!isLoading && featuredSounds.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No sounds available</Text>
            <Text style={styles.emptyText}>
              Unable to load sounds from the server. Please check your connection and try again.
            </Text>
            <TouchableOpacity style={styles.retryButton} onPress={loadData}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 120,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    color: Colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginTop: 16,
  },
  featuredContainer: {
    height: 220,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingBottom: 16,
    justifyContent: 'flex-end',
  },
  featuredContent: {
    alignItems: 'flex-start',
  },
  featuredLabel: {
    color: Colors.primary,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    marginBottom: 4,
  },
  featuredTitle: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 4,
  },
  featuredCategory: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  categorySection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  soundSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 60,
  },
  emptyTitle: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyText: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: Colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
});