import { View, StyleSheet } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

interface SliderProps {
  value: number;
  maximumValue: number;
  onValueChange: (value: number) => void;
  minimumTrackTintColor: string;
  maximumTrackTintColor: string;
}

export default function Slider({
  value,
  maximumValue,
  onValueChange,
  minimumTrackTintColor,
  maximumTrackTintColor,
}: SliderProps) {
  const width = useSharedValue(0);
  const translateX = useSharedValue(0);
  
  // Calculate the initial position of the thumb
  const thumbPosition = value > 0 && maximumValue > 0 
    ? (value / maximumValue) * 100
    : 0;
  
  // Update the translateX when the value changes
  translateX.value = (thumbPosition / 100) * width.value;

  const onLayout = (event: any) => {
    const layoutWidth = event.nativeEvent.layout.width;
    width.value = layoutWidth;
    translateX.value = (thumbPosition / 100) * layoutWidth;
  };

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = translateX.value;
    },
    onActive: (event, ctx) => {
      let newValue = ctx.startX + event.translationX;
      
      // Clamp the value to the track boundaries
      if (newValue < 0) {
        newValue = 0;
      }
      if (newValue > width.value) {
        newValue = width.value;
      }
      
      translateX.value = newValue;
      
      // Calculate and update the actual value
      const percentage = newValue / width.value;
      const calculatedValue = percentage * maximumValue;
      
      runOnJS(onValueChange)(calculatedValue);
    },
  });

  const thumbStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const progressStyle = useAnimatedStyle(() => {
    return {
      width: translateX.value,
    };
  });

  return (
    <View style={styles.container} onLayout={onLayout}>
      <View 
        style={[
          styles.track,
          { backgroundColor: maximumTrackTintColor }
        ]}
      >
        <Animated.View
          style={[
            styles.progress,
            { backgroundColor: minimumTrackTintColor },
            progressStyle,
          ]}
        />
      </View>
      
      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View style={[styles.thumb, thumbStyle]} />
      </PanGestureHandler>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 4,
    borderRadius: 2,
    width: '100%',
  },
  progress: {
    height: '100%',
    borderRadius: 2,
    position: 'absolute',
    left: 0,
  },
  thumb: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    // Adjust for the thumb's center position
    transform: [{ translateX: -8 }],
  },
});