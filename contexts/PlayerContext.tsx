import { createContext, useState, useContext, useEffect, ReactNode, useRef } from 'react';
import { Sound } from '@/types/sound';
import { Audio } from 'expo-av';
import { Platform } from 'react-native';

interface PlayerContextType {
  currentSound: Sound | null;
  isPlaying: boolean;
  progress: number;
  duration: number;
  volume: number;
  isLoading: boolean;
  playSound: (sound: Sound) => Promise<void>;
  pauseSound: () => Promise<void>;
  stopSound: () => Promise<void>;
  setProgress: (value: number) => Promise<void>;
  setVolume: (value: number) => Promise<void>;
}

const PlayerContext = createContext<PlayerContextType>({
  currentSound: null,
  isPlaying: false,
  progress: 0,
  duration: 0,
  volume: 1,
  isLoading: false,
  playSound: async () => {},
  pauseSound: async () => {},
  stopSound: async () => {},
  setProgress: async () => {},
  setVolume: async () => {},
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
  const [volume, setVolumeState] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);

  // Configure audio mode
  useEffect(() => {
    const configureAudio = async () => {
      try {
        if (Platform.OS !== 'web') {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            staysActiveInBackground: true,
            playsInSilentModeIOS: true,
            shouldDuckAndroid: true,
            playThroughEarpieceAndroid: false,
          });
        }
      } catch (error) {
        console.error('Error configuring audio:', error);
      }
    };

    configureAudio();
  }, []);

  // Clean up sound on unmount
  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [sound]);

  // Progress tracking
  const startProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = setInterval(async () => {
      if (sound && isPlaying) {
        try {
          const status = await sound.getStatusAsync();
          if (status.isLoaded && status.positionMillis !== undefined) {
            setProgress(status.positionMillis / 1000);
            
            // Auto-stop when finished
            if (status.didJustFinish) {
              setIsPlaying(false);
              setProgress(0);
              if (progressInterval.current) {
                clearInterval(progressInterval.current);
              }
            }
          }
        } catch (error) {
          console.error('Error tracking progress:', error);
        }
      }
    }, 1000);
  };

  const stopProgressTracking = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
      progressInterval.current = null;
    }
  };

  const playSound = async (soundToPlay: Sound) => {
    try {
      setIsLoading(true);

      // If there's already a sound playing, stop it
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
        stopProgressTracking();
      }

      // For web platform, use HTML5 audio as fallback
      if (Platform.OS === 'web') {
        setCurrentSound(soundToPlay);
        setIsPlaying(true);
        setDuration(soundToPlay.duration);
        setProgress(0);
        setIsLoading(false);
        startProgressTracking();
        return;
      }

      console.log('Loading sound:', soundToPlay.audioUrl);

      // Create and load the sound
      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: soundToPlay.audioUrl },
        { 
          shouldPlay: false,
          volume: volume,
          isLooping: false,
        }
      );

      // Get sound status to retrieve duration
      const status = await newSound.getStatusAsync();
      if (status.isLoaded) {
        const soundDuration = status.durationMillis ? status.durationMillis / 1000 : soundToPlay.duration;
        setDuration(soundDuration);
      }

      setSound(newSound);
      setCurrentSound(soundToPlay);
      setProgress(0);
      setIsLoading(false);

      // Start playing
      await newSound.playAsync();
      setIsPlaying(true);
      startProgressTracking();

    } catch (error) {
      console.error('Error playing sound:', error);
      setIsLoading(false);
      
      // Fallback for web or when audio fails
      if (Platform.OS === 'web' || error.message?.includes('AVPlayerItem')) {
        setCurrentSound(soundToPlay);
        setIsPlaying(true);
        setDuration(soundToPlay.duration);
        setProgress(0);
        startProgressTracking();
      }
    }
  };

  const pauseSound = async () => {
    try {
      if (sound && Platform.OS !== 'web') {
        await sound.pauseAsync();
      }
      setIsPlaying(false);
      stopProgressTracking();
    } catch (error) {
      console.error('Error pausing sound:', error);
      setIsPlaying(false);
      stopProgressTracking();
    }
  };

  const stopSound = async () => {
    try {
      if (sound && Platform.OS !== 'web') {
        await sound.stopAsync();
      }
      setIsPlaying(false);
      setProgress(0);
      stopProgressTracking();
    } catch (error) {
      console.error('Error stopping sound:', error);
      setIsPlaying(false);
      setProgress(0);
      stopProgressTracking();
    }
  };

  const handleSetProgress = async (value: number) => {
    try {
      setProgress(value);
      if (sound && Platform.OS !== 'web') {
        await sound.setPositionAsync(value * 1000);
      }
    } catch (error) {
      console.error('Error setting progress:', error);
    }
  };

  const handleSetVolume = async (value: number) => {
    try {
      setVolumeState(value);
      if (sound && Platform.OS !== 'web') {
        await sound.setVolumeAsync(value);
      }
    } catch (error) {
      console.error('Error setting volume:', error);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSound,
        isPlaying,
        progress,
        duration,
        volume,
        isLoading,
        playSound,
        pauseSound,
        stopSound,
        setProgress: handleSetProgress,
        setVolume: handleSetVolume,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}