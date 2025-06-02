import { View, StyleSheet, Animated } from 'react-native';
import { useRef, useEffect } from 'react';
import Colors from '@/constants/Colors';

interface SoundVisualizerProps {
  isPlaying: boolean;
}

export default function SoundVisualizer({ isPlaying }: SoundVisualizerProps) {
  // Create animated values for each bar
  const animations = Array(12).fill(0).map(() => useRef(new Animated.Value(0.3)).current);
  
  useEffect(() => {
    if (isPlaying) {
      // Animate bars when playing
      animations.forEach((anim, index) => {
        createAnimation(anim, index);
      });
    } else {
      // Reset bars when paused
      animations.forEach(anim => {
        Animated.timing(anim).stop();
        Animated.timing(anim, {
          toValue: 0.3,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [isPlaying]);

  const createAnimation = (anim: Animated.Value, index: number) => {
    const randomHeight = Math.random() * 0.7 + 0.3; // Random height between 0.3 and 1
    const randomDuration = Math.random() * 400 + 200; // Random duration between 200ms and 600ms
    
    Animated.sequence([
      Animated.timing(anim, {
        toValue: randomHeight,
        duration: randomDuration,
        useNativeDriver: false,
      }),
      Animated.timing(anim, {
        toValue: 0.3,
        duration: randomDuration,
        useNativeDriver: false,
      })
    ]).start(() => {
      if (isPlaying) {
        createAnimation(anim, index);
      }
    });
  };

  return (
    <View style={styles.container}>
      {animations.map((anim, index) => (
        <Animated.View
          key={index}
          style={[
            styles.bar,
            {
              height: anim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%']
              }),
            }
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 80,
    paddingHorizontal: 24,
    marginVertical: 16,
  },
  bar: {
    width: 4,
    backgroundColor: Colors.primary,
    borderRadius: 2,
    marginHorizontal: 4,
  },
});