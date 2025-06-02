import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { Sound } from '@/types/sound';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

interface PlayerContextType {
  currentSound: Sound | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  playSound: (sound: Sound) => void;
  pauseSound: () => void;
  setProgress: (value: number) => void;
}

const PlayerContext = createContext<PlayerContextType>({
  currentSound: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  playSound: () => {},
  pauseSound: () => {},
  setProgress: () => {},
});

export const usePlayerContext = () => useContext(PlayerContext);

interface PlayerProviderProps {
  children: ReactNode;
}

export function PlayerProvider({ children }: PlayerProviderProps) {
  const [currentSound, setCurrentSound] = useState<Sound | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Clean up sound on unmount
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  // Update progress when playing
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(async () => {
        if (sound) {
          try {
            const status = await sound.getStatusAsync();
            if (status.isLoaded) {
              setProgress(status.positionMillis / 1000);
            }
          } catch (error) {
            console.error('Error getting sound status:', error);
          }
        }
      }, 1000);
      
      return () => clearInterval(interval);
    }
  }, [isPlaying, sound]);

  const playSound = async (soundToPlay: Sound) => {
    try {
      // If there's already a sound, unload it
      if (sound) {
        await sound.unloadAsync();
      }
      
      // For web, we need to use a different approach since expo-av has limitations
      if (Platform.OS === 'web') {
        // This is a simplification - in a real app, you'd use a proper web audio implementation
        setCurrentSound(soundToPlay);
        setIsPlaying(true);
        setDuration(180); // 3 minutes for demo
        return;
      }
      
      // Create a new sound object
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: soundToPlay.audioUrl },
        { shouldPlay: true },
        (status) => {
          if (status.isLoaded) {
            if (status.didJustFinish) {
              setIsPlaying(false);
              setProgress(0);
            }
          }
        }
      );
      
      setSound(newSound);
      setCurrentSound(soundToPlay);
      setIsPlaying(true);
      
      // Get duration
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        setDuration(status.durationMillis ? status.durationMillis / 1000 : 0);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const pauseSound = async () => {
    if (sound) {
      await sound.pauseAsync();
    }
    setIsPlaying(false);
  };

  const handleSetProgress = async (value: number) => {
    setProgress(value);
    if (sound) {
      await sound.setPositionAsync(value * 1000);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSound,
        isPlaying,
        progress,
        duration,
        playSound,
        pauseSound,
        setProgress: handleSetProgress,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}