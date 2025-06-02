import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import Colors from '@/constants/Colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface Tab {
  id: string;
  label: string;
}

interface TabSelectorProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  containerStyle?: ViewStyle;
}

export default function TabSelector({ 
  tabs, 
  activeTab, 
  onTabChange,
  containerStyle
}: TabSelectorProps) {
  const tabWidth = 100 / tabs.length;
  const activeIndex = tabs.findIndex(tab => tab.id === activeTab);
  const translateX = useSharedValue(activeIndex * tabWidth);
  
  useEffect(() => {
    const newIndex = tabs.findIndex(tab => tab.id === activeTab);
    translateX.value = withTiming(newIndex * tabWidth, { duration: 300 });
  }, [activeTab]);
  
  const indicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: `${translateX.value}%` }],
      width: `${tabWidth}%`,
    };
  });

  return (
    <View style={[styles.container, containerStyle]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[
            styles.tab,
            { width: `${tabWidth}%` },
          ]}
          onPress={() => onTabChange(tab.id)}
        >
          <Text 
            style={[
              styles.tabText,
              tab.id === activeTab && styles.activeTabText,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
      
      <Animated.View style={[styles.indicator, indicatorStyle]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    height: 48,
    position: 'relative',
    overflow: 'hidden',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  tabText: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  activeTabText: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
  },
});