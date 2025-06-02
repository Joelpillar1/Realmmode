import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import Colors from '@/constants/Colors';
import { Play, Pause } from 'lucide-react-native';
import { usePlayerContext } from '@/contexts/PlayerContext';
import { useRouter } from 'expo-router';

export default function MiniPlayer() {
  const { currentSound, isPlaying, playSound, pauseSound } = usePlayerContext();
  const router = useRouter();
  
  if (!currentSound) return null;

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSound();
    } else {
      playSound(currentSound);
    }
  };

  const handlePress = () => {
    router.push(`/sound/${currentSound.id}`);
  };

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.content}>
        <Image 
          source={{ uri: currentSound.imageUrl }}
          style={styles.image}
        />
        
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>{currentSound.title}</Text>
          <Text style={styles.category}>{currentSound.category}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.playButton}
          onPress={handlePlayPause}
        >
          {isPlaying ? (
            <Pause size={24} color={Colors.white} />
          ) : (
            <Play size={24} color={Colors.white} fill={Colors.white} />
          )}
        </TouchableOpacity>
      </View>
      
      <View style={styles.progressBar}>
        <View style={styles.progress} />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    margin: 16,
    overflow: 'hidden',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  title: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 16,
  },
  category: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBar: {
    height: 3,
    backgroundColor: Colors.border,
    width: '100%',
  },
  progress: {
    height: '100%',
    width: '30%', // This would be dynamic based on actual progress
    backgroundColor: Colors.primary,
  },
});