import { View, Text, StyleSheet, TouchableOpacity, Image, ViewStyle } from 'react-native';
import { Sound } from '@/types/sound';
import Colors from '@/constants/Colors';
import { Play, Lock } from 'lucide-react-native';

interface SoundCardProps {
  sound: Sound;
  onPress: () => void;
  style?: ViewStyle;
}

export default function SoundCard({ sound, onPress, style }: SoundCardProps) {
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: sound.imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.overlay}>
          <View style={styles.playButton}>
            {sound.isPremium ? (
              <Lock size={20} color={Colors.white} />
            ) : (
              <Play size={20} color={Colors.white} fill={Colors.white} />
            )}
          </View>
        </View>
      </View>
      
      <View style={styles.content}>
        <View>
          <Text style={styles.title} numberOfLines={1}>{sound.title}</Text>
          <Text style={styles.category}>{sound.category}</Text>
        </View>
        
        {sound.isPremium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>PREMIUM</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    overflow: 'hidden',
  },
  imageContainer: {
    position: 'relative',
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 16,
    marginBottom: 4,
  },
  category: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
  },
  premiumBadge: {
    backgroundColor: Colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  premiumText: {
    color: Colors.dark,
    fontFamily: 'Inter-Medium',
    fontSize: 10,
  },
});