import { View, Text, StyleSheet, TextInput, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import Colors from '@/constants/Colors';
import { Search as SearchIcon, X } from 'lucide-react-native';
import Header from '@/components/ui/Header';
import { allSounds } from '@/data/sounds';
import SoundCard from '@/components/sound/SoundCard';
import { useRouter } from 'expo-router';
import { Sound } from '@/types/sound';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Sound[]>([]);
  const router = useRouter();

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setResults([]);
      return;
    }
    
    const filtered = allSounds.filter(sound => 
      sound.title.toLowerCase().includes(text.toLowerCase()) || 
      sound.category.toLowerCase().includes(text.toLowerCase())
    );
    
    setResults(filtered);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setResults([]);
  };

  const handleSoundPress = (id: string) => {
    router.push(`/sound/${id}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Search" />
      
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <SearchIcon size={20} color={Colors.lightGray} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search sounds, categories..."
            placeholderTextColor={Colors.lightGray}
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <X 
              size={20} 
              color={Colors.lightGray} 
              onPress={clearSearch}
              style={styles.clearIcon}
            />
          )}
        </View>
      </View>

      {searchQuery.length > 0 && (
        <View style={styles.resultsContainer}>
          {results.length > 0 ? (
            <FlatList
              data={results}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <SoundCard 
                  sound={item} 
                  onPress={() => handleSoundPress(item.id)} 
                  style={styles.resultCard}
                />
              )}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.resultsList}
            />
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No sounds found for "{searchQuery}"</Text>
            </View>
          )}
        </View>
      )}

      {searchQuery.length === 0 && (
        <View style={styles.exploreContainer}>
          <Text style={styles.exploreTitle}>Explore Sounds</Text>
          <Text style={styles.exploreText}>
            Search for sounds by name, category, or mood to find the perfect audio for your needs.
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  searchContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    color: Colors.white,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 10,
  },
  clearIcon: {
    padding: 4,
  },
  resultsContainer: {
    flex: 1,
    paddingTop: 16,
  },
  resultsList: {
    paddingHorizontal: 16,
    paddingBottom: 120,
  },
  resultCard: {
    marginBottom: 12,
  },
  noResults: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  noResultsText: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
  },
  exploreContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  exploreTitle: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  exploreText: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
});