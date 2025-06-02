import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import Colors from '@/constants/Colors';
import CategoryList from '@/components/sound/CategoryList';
import SoundList from '@/components/sound/SoundList';
import { useRouter } from 'expo-router';
import { categories, featuredSounds, recentSounds } from '@/data/sounds';
import { Sound } from '@/types/sound';
import Header from '@/components/ui/Header';

export default function HomeScreen() {
  const router = useRouter();
  const [featuredSound, setFeaturedSound] = useState<Sound | null>(null);

  useEffect(() => {
    // Set the first featured sound
    if (featuredSounds.length > 0) {
      setFeaturedSound(featuredSounds[0]);
    }
  }, []);

  const handleSoundPress = (id: string) => {
    router.push(`/sound/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Header title="SoundWave" />
        
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
        
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <CategoryList categories={categories} />
        </View>

        <View style={styles.soundSection}>
          <Text style={styles.sectionTitle}>Popular Sounds</Text>
          <SoundList sounds={featuredSounds} onSoundPress={handleSoundPress} />
        </View>

        <View style={styles.soundSection}>
          <Text style={styles.sectionTitle}>Recently Added</Text>
          <SoundList sounds={recentSounds} onSoundPress={handleSoundPress} />
        </View>
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
});