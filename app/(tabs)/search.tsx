import { View, Text, StyleSheet, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import Colors from '@/constants/Colors';
import { Search as SearchIcon, X } from 'lucide-react-native';
import Header from '@/components/ui/Header';
import SoundCard from '@/components/sound/SoundCard';
import { useRouter } from 'expo-router';
import { Sound } from '@/types/sound';
import { soundService } from '@/services/soundService';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<Sound[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [allSounds, setAllSounds] = useState<Sound[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadSounds();
  }, []);

  const loadSounds = async () => {
    try {
      await soundService.loadSounds();
      setAllSounds(soundService.getSounds());
    } catch (error) {
      console.error('Error loading sounds for search:', error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    
    if (text.trim() === '') {
      setResults([]);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate search delay for better UX
    setTimeout(() => {
      const searchResults = soundService.searchSounds(text);
      setResults(searchResults);
      setIsLoading(false);
    }, 300);
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
            autoCorrect={false}
            autoCapitalize="none"
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
          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.loadingText}>Searching...</Text>
            </View>
          ) : results.length > 0 ? (
            <>
              <Text style={styles.resultsCount}>
                {results.length} sound{results.length !== 1 ? 's' : ''} found
              </Text>
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
            </>
          ) : (
            <View style={styles.noResults}>
              <Text style={styles.noResultsText}>No sounds found for "{searchQuery}"</Text>
              <Text style={styles.noResultsSubtext}>
                Try searching for different keywords or browse our categories
              </Text>
            </View>
          )}
        </View>
      )}

      {searchQuery.length === 0 && (
        <View style={styles.exploreContainer}>
          <Text style={styles.exploreTitle}>Discover Sounds</Text>
          <Text style={styles.exploreText}>
            Search through our collection of high-quality sounds by name, category, or mood to find the perfect audio for your needs.
          </Text>
          
          {allSounds.length > 0 && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>
                {allSounds.length} sounds available
              </Text>
            </View>
          )}
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
  resultsCount: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
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
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 8,
  },
  noResultsSubtext: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
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
  statsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
  },
  statsText: {
    color: Colors.primary,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});