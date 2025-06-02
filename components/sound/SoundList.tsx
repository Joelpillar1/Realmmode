import { View, StyleSheet, FlatList } from 'react-native';
import { Sound } from '@/types/sound';
import SoundCard from './SoundCard';

interface SoundListProps {
  sounds: Sound[];
  onSoundPress: (id: string) => void;
}

export default function SoundList({ sounds, onSoundPress }: SoundListProps) {
  return (
    <FlatList
      data={sounds}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SoundCard 
          sound={item} 
          onPress={() => onSoundPress(item.id)} 
          style={styles.card}
        />
      )}
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
  card: {
    width: 220,
    marginRight: 12,
  },
});