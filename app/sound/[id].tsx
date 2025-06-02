import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useState, useEffect } from 'react';
import Colors from '@/constants/Colors';
import { X, Heart, Download, Clock, Share2 } from 'lucide-react-native';
import Slider from '@/components/ui/Slider';
import PlayerControls from '@/components/sound/PlayerControls';
import { usePlayerContext } from '@/contexts/PlayerContext';
import { Sound } from '@/types/sound';
import { getSoundById } from '@/data/sounds';
import SoundVisualizer from '@/components/sound/SoundVisualizer';
import SleepTimerModal from '@/components/sound/SleepTimerModal';
import PremiumBadge from '@/components/premium/PremiumBadge';

export default function SoundScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [sound, setSound] = useState<Sound | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [showTimerModal, setShowTimerModal] = useState(false);
  const { 
    playSound, 
    pauseSound, 
    isPlaying, 
    currentSound, 
    progress, 
    setProgress,
    duration 
  } = usePlayerContext();

  useEffect(() => {
    if (id) {
      const foundSound = getSoundById(id as string);
      if (foundSound) {
        setSound(foundSound);
        
        // Check if this is the current playing sound
        if (!currentSound || currentSound.id !== foundSound.id) {
          playSound(foundSound);
        }
      }
    }
  }, [id, currentSound, playSound]);

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const handleDownload = () => {
    // Premium feature - show upgrade prompt if not premium
    if (sound && !sound.isPremium) {
      // Download logic here
    }
  };

  const handleShare = () => {
    // Share logic
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (!sound) {
    return (
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <Text style={styles.loadingText}>Loading...</Text>
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
        </View>
        
        <SoundVisualizer isPlaying={isPlaying} />
        
        <View style={styles.playerContainer}>
          <View style={styles.progressContainer}>
            <Slider
              value={progress}
              maximumValue={duration}
              onValueChange={setProgress}
              minimumTrackTintColor={Colors.primary}
              maximumTrackTintColor={Colors.border}
            />
            
            <View style={styles.timeContainer}>
              <Text style={styles.timeText}>{formatTime(progress)}</Text>
              <Text style={styles.timeText}>{formatTime(duration)}</Text>
            </View>
          </View>
          
          <PlayerControls />
          
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
          <Text style={styles.descriptionTitle}>Description</Text>
          <Text style={styles.descriptionText}>
            {sound.description || 'Experience the calming effect of this carefully crafted sound. Perfect for relaxation, meditation, or focus.'}
          </Text>
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
  },
  title: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 18,
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
  },
  loadingText: {
    color: Colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 40,
  },
});