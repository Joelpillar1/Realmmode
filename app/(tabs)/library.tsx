import { View, Text, StyleSheet, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Colors from '@/constants/Colors';
import Header from '@/components/ui/Header';
import { useRouter } from 'expo-router';
import { favoriteSounds, recentlyPlayedSounds } from '@/data/sounds';
import SoundCard from '@/components/sound/SoundCard';
import { Sound } from '@/types/sound';
import TabSelector from '@/components/ui/TabSelector';

type LibraryTab = 'favorites' | 'recent';

export default function LibraryScreen() {
  const [activeTab, setActiveTab] = useState<LibraryTab>('favorites');
  const router = useRouter();
  const tabs = [
    { id: 'favorites', label: 'Favorites' },
    { id: 'recent', label: 'Recently Played' }
  ];

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

  const getEmptyMessage = () => {
    if (activeTab === 'favorites') {
      return {
        title: 'No favorites yet',
        message: 'Start adding sounds to your favorites to see them here.'
      };
    }
    return {
      title: 'No recent activity',
      message: 'Play some sounds to see your recently played history.'
    };
  };

  const renderEmptyList = () => {
    const { title, message } = getEmptyMessage();
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>{title}</Text>
        <Text style={styles.emptyMessage}>{message}</Text>
      </View>
    );
  };

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
        data={activeTab === 'favorites' ? favoriteSounds : recentlyPlayedSounds}
        keyExtractor={(item) => item.id}
        renderItem={renderSoundItem}
        ListEmptyComponent={renderEmptyList}
        contentContainerStyle={[
          styles.listContent,
          (activeTab === 'favorites' ? favoriteSounds.length === 0 : recentlyPlayedSounds.length === 0) && styles.emptyListContent
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