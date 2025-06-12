import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import { Category } from '@/types/sound';
import Colors from '@/constants/Colors';
import { useRouter } from 'expo-router';

interface CategoryListProps {
  categories: Category[];
}

export default function CategoryList({ categories }: CategoryListProps) {
  const router = useRouter();

  const handleCategoryPress = (category: Category) => {
    // Navigate to category screen (could be implemented as a search filter)
    router.push(`/search?category=${category.id}`);
  };

  const renderCategoryItem = ({ item }: { item: Category }) => (
    <TouchableOpacity 
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(item)}
    >
      <Image 
        source={{ uri: item.imageUrl }}
        style={styles.categoryImage}
        resizeMode="cover"
      />
      <View style={styles.overlay}>
        <Text style={styles.categoryName}>{item.name}</Text>
        {item.soundCount && (
          <Text style={styles.soundCount}>{item.soundCount} sounds</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      renderItem={renderCategoryItem}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingLeft: 0,
    paddingRight: 16,
  },
  categoryCard: {
    width: 140,
    height: 90,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    position: 'relative',
  },
  categoryImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  categoryName: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    textAlign: 'center',
  },
  soundCount: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    marginTop: 2,
  },
});