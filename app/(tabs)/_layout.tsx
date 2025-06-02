import { Tabs } from 'expo-router';
import { Chrome as Home, Search, Bookmark, User, Crown } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import Colors from '@/constants/Colors';
import { BlurView } from 'expo-blur';
import { Platform } from 'react-native';
import MiniPlayer from '@/components/sound/MiniPlayer';
import { usePlayerContext } from '@/contexts/PlayerContext';

export default function TabLayout() {
  const { currentSound } = usePlayerContext();
  const showMiniPlayer = currentSound !== null;
  
  return (
    <View style={styles.container}>
      {showMiniPlayer && <MiniPlayer />}
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.secondary,
          tabBarStyle: [
            styles.tabBar,
            {
              height: 90,
              paddingBottom: 30,
              paddingTop: 12,
            },
          ],
          tabBarBackground: () => (
            Platform.OS === 'ios' ? 
              <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} /> : 
              <View style={[StyleSheet.absoluteFill, { backgroundColor: Colors.background }]} />
          ),
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="library"
          options={{
            title: 'Library',
            tabBarIcon: ({ color, size }) => <Bookmark size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="premium"
          options={{
            title: 'Premium',
            tabBarIcon: ({ color, size }) => <Crown size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    position: 'absolute',
    borderTopWidth: 0,
    elevation: 0,
    backgroundColor: 'transparent',
  },
});