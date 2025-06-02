import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { usePlayerContext } from '@/contexts/PlayerContext';

export default function PlayerControls() {
  const { isPlaying, playSound, pauseSound, currentSound } = usePlayerContext();

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseSound();
    } else if (currentSound) {
      playSound(currentSound);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.secondaryButton}>
        <SkipBack size={24} color={Colors.white} />
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={styles.playButton}
        onPress={handlePlayPause}
      >
        {isPlaying ? (
          <Pause size={32} color={Colors.dark} fill={Colors.dark} />
        ) : (
          <Play size={32} color={Colors.dark} fill={Colors.dark} />
        )}
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.secondaryButton}>
        <SkipForward size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 24,
  },
  secondaryButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});