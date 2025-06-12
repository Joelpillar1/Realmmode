import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import Colors from '@/constants/Colors';
import Header from '@/components/ui/Header';
import { useRouter } from 'expo-router';
import SoundCard from '@/components/sound/SoundCard';
import { Sound } from '@/types/sound';
import TabSelector from '@/components/ui/TabSelector';
import { soundService } from '@/services/soundService';

type LibraryTab = 'favorites' | 'recent' | 'downloaded';

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<LibraryTab>('favorites');
  const [favoriteSounds, setFavoriteSounds] = useState<Sound[]>([]);
  const [recentSounds, setRecentSounds] = useState<Sound[]>([]);
  const [downloadedSounds, setDownloadedSounds] = useState<Sound[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  
  const tabs = [
    { id: 'favorites', label: 'Favorites' },
    { id: 'recent', label: 'Recent' },
    { id: 'downloaded', label: 'Downloaded' }
  ];

  useEffect(() => {
    loadLibraryData();
  }, []);

  const loadLibraryData = async () => {
    try {
      setIsLoading(true);
      await soundService.loadSounds();
      
      // Mock data for library - in a real app, this would come from user preferences/storage
      const allSounds = soundService.getSounds();
      
      // Mock favorites (first 3 sounds)
      setFavoriteSounds(allSounds.slice(0, 3));
      
      // Mock recent (last 4 sounds)
      setRecentSounds(allSounds.slice(-4));
      
      // Mock downloaded (premium sounds)
      setDownloadedSounds(allSounds.filter(sound => sound.isPremium).slice(0, 2));
      
    } catch (error) {
      console.error('Error loading library data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSoundPress = (id: string) => {
    router.push(`/sound/${id}`);
  };

  const renderSoundItem = ({ item }: { item: Sound }) => (
    <SoundCard 
      sound={item} 
      onPress={() => handleSoundPress(item.id)} 
      style={styles.soundCard}
    />
  );

  const getCurrentData = () => {
    switch (activeTab) {
      case 'favorites':
        return favoriteSounds;
      case 'recent':
        return recentSounds;
      case 'downloaded':
        return downloadedSounds;
      default:
        return [];
    }
  };

  const getEmptyMessage = () => {
    switch (activeTab) {
      case 'favorites':
        return {
          title: 'No favorites yet',
          message: 'Start adding sounds to your favorites to see them here.'
        };
      case 'recent':
        return {
          title: 'No recent activity',
          message: 'Play some sounds to see your recently played history.'
        };
      case 'downloaded':
        return {
          title: 'No downloads',
          message: 'Download sounds for offline listening to see them here.'
        };
      default:
        return {
          title: 'No content',
          message: 'Nothing to show here.'
        };
    }
  };

  const renderEmptyList = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading library...</Text>
        </View>
      );
    }

    const { title, message } = getEmptyMessage();
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptyMessage}>{message}</Text>
      </View>
    );
  };

  const currentData = getCurrentData();

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Your Library" />
      
      <TabSelector
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as LibraryTab)}
        containerStyle={styles.tabSelector}
      />
      
      <FlatList
        data={currentData}
        keyExtractor={(item) => item.id}
        renderItem={renderSoundItem}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={[
          styles.listContent,
          currentData.length === 0 && styles.emptyListContent
        ]}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabSelector: {
    marginHorizontal: 16,
    marginVertical: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
  },
  soundCard: {
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginTop: 12,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyTitle: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyMessage: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});