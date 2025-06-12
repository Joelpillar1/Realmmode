import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import Colors from '@/constants/Colors';
import { X, Heart, Download, Clock, Share2, Volume2 } from 'lucide-react-native';
import Slider from '@/components/ui/Slider';
import PlayerControls from '@/components/sound/PlayerControls';
import { usePlayerContext } from '@/contexts/PlayerContext';
import { Sound } from '@/types/sound';
import SoundVisualizer from '@/components/sound/SoundVisualizer';
import SleepTimerModal from '@/components/sound/SleepTimerModal';
import PremiumBadge from '@/components/premium/PremiumBadge';
import { soundService } from '@/services/soundService';

export default function SoundScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sound, setSound] = useState<Sound | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { 
    playSound, 
    pauseSound, 
    isPlaying, 
    currentSound, 
    progress, 
    setProgress,
    duration,
    volume,
    setVolume,
    isLoading: playerLoading
  } = usePlayerContext();

  useEffect(() => {
    loadSound();
  }, [id]);

  const loadSound = async () => {
    if (!id) return;
    
    try {
      setIsLoading(true);
      await soundService.loadSounds();
      const foundSound = soundService.getSoundById(id as string);
      
      if (foundSound) {
        setSound(foundSound);
        
        // Check if this is the current playing sound
        if (!currentSound || currentSound.id !== foundSound.id) {
          await playSound(foundSound);
        }
      } else {
        console.error('Sound not found:', id);
      }
    } catch (error) {
      console.error('Error loading sound:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, this would save to user preferences
  };

  const handleDownload = () => {
    if (sound && !sound.isPremium) {
      // Download logic here
      console.log('Downloading sound:', sound.title);
    } else {
      // Show premium upgrade prompt
      console.log('Premium feature - show upgrade prompt');
    }
  };

  const handleShare = () => {
    // Share logic
    console.log('Sharing sound:', sound?.title);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (isLoading) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Loading sound...</Text>
        </View>
      </View>
    );
  }

  if (!sound) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Sound not found</Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <X size={24} color={Colors.white} />
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{sound.title}</Text>
            <Text style={styles.category}>{sound.category}</Text>
          </View>
          
          <View style={styles.placeholder} />
        </View>
        
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: sound.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          
          {sound.isPremium && (
            <View style={styles.premiumBadgeContainer}>
              <PremiumBadge />
            </View>
          )}
          
          {playerLoading && (
            <View style={styles.imageOverlay}>
              <ActivityIndicator size="large" color={Colors.primary} />
            </View>
          )}
        </View>
        
        <SoundVisualizer isPlaying={isPlaying && currentSound?.id === sound.id} />
        
        <View style={styles.playerContainer}>
          <View style={styles.progressContainer}>
            <Slider
              value={progress}
              maximumValue={duration || sound.duration}
              onValueChange={setProgress}
              minimumTrackTintColor={Colors.primary}
              maximumTrackTintColor={Colors.border}
            />
            
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(progress)}</Text>
              <Text style={styles.timeText}>{formatTime(duration || sound.duration)}</Text>
            </View>
          </View>
          
          <PlayerControls />
          
          <View style={styles.volumeContainer}>
            <Volume2 size={20} color={Colors.lightGray} />
            <Slider
              value={volume}
              maximumValue={1}
              onValueChange={setVolume}
              minimumTrackTintColor={Colors.primary}
              maximumTrackTintColor={Colors.border}
            />
          </View>
          
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={toggleFavorite}
            >
              <Heart 
                size={24} 
                color={isFavorite ? Colors.error : Colors.white} 
                fill={isFavorite ? Colors.error : 'transparent'} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleDownload}
            >
              <Download size={24} color={Colors.white} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => setShowTimerModal(true)}
            >
              <Clock size={24} color={Colors.white} />
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={handleShare}
            >
              <Share2 size={24} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionTitle}>About</Text>
          <Text style={styles.descriptionText}>
            {sound.description || `Experience the calming effect of ${sound.title}. Perfect for relaxation, meditation, or focus sessions.`}
          </Text>
          
          <View style={styles.detailsContainer}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Duration</Text>
              <Text style={styles.detailValue}>{formatTime(sound.duration)}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Category</Text>
              <Text style={styles.detailValue}>{sound.category}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Type</Text>
              <Text style={styles.detailValue}>{sound.isPremium ? 'Premium' : 'Free'}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
      
      <SleepTimerModal 
        visible={showTimerModal}
        onClose={() => setShowTimerModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: Colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  errorText: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: Colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    textAlign: 'center',
  },
  category: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  placeholder: {
    width: 40,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 24,
    position: 'relative',
  },
  image: {
    width: 250,
    height: 250,
    borderRadius: 125,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 125,
  },
  premiumBadgeContainer: {
    position: 'absolute',
    top: 8,
    right: 80,
  },
  playerContainer: {
    paddingHorizontal: 24,
    marginTop: 8,
  },
  progressContainer: {
    marginBottom: 24,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  timeText: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 12,
  },
  volumeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 32,
    paddingHorizontal: 24,
  },
  actionButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  descriptionContainer: {
    paddingHorizontal: 24,
    marginTop: 40,
  },
  descriptionTitle: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    marginBottom: 12,
  },
  descriptionText: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  detailsContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    padding: 16,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  detailLabel: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  detailValue: {
    color: Colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
});