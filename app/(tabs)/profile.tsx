import { View, Text, StyleSheet, Switch, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import Header from '@/components/ui/Header';
import { useState } from 'react';
import { User, LogOut, Bell, Clock, CircleHelp as HelpCircle, Info, ChevronRight } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileScreen() {
  const [notifications, setNotifications] = useState(true);
  const [sleepTimer, setSleepTimer] = useState(false);
  const { user, signOut } = useAuth();
  
  const menuItems = [
    { 
      id: 'account',
      title: 'Account',
      items: [
        { id: 'profile', icon: User, label: 'Edit Profile', action: () => {} },
        { id: 'notifications', icon: Bell, label: 'Notifications', toggle: true, value: notifications, onToggle: setNotifications },
        { id: 'sleepTimer', icon: Clock, label: 'Default Sleep Timer', toggle: true, value: sleepTimer, onToggle: setSleepTimer },
      ]
    },
    {
      id: 'support',
      title: 'Support',
      items: [
        { id: 'help', icon: HelpCircle, label: 'Help Center', action: () => {} },
        { id: 'about', icon: Info, label: 'About SoundWave', action: () => {} },
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Profile" />
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            {user ? (
              <Image 
                source={{ uri: "https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg" }}
                style={styles.avatar}
              />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <User size={32} color={Colors.lightGray} />
              </View>
            )}
          </View>
          
          {user ? (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              
              <TouchableOpacity style={styles.logoutButton} onPress={signOut}>
                <LogOut size={16} color={Colors.error} />
                <Text style={styles.logoutText}>Log Out</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.authButtons}>
              <TouchableOpacity style={styles.signInButton}>
                <Text style={styles.signInText}>Sign In</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.signUpButton}>
                <Text style={styles.signUpText}>Create Account</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        {menuItems.map((section) => (
          <View key={section.id} style={styles.menuSection}>
            <Text style={styles.menuTitle}>{section.title}</Text>
            
            {section.items.map((item) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.menuItem}
                onPress={item.action}
                disabled={item.toggle}
              >
                <View style={styles.menuItemLeft}>
                  <View style={styles.iconContainer}>
                    <item.icon size={20} color={Colors.white} />
                  </View>
                  <Text style={styles.menuItemLabel}>{item.label}</Text>
                </View>
                
                {item.toggle ? (
                  <Switch
                    value={item.value}
                    onValueChange={item.onToggle}
                    trackColor={{ false: Colors.border, true: Colors.primary }}
                    thumbColor={Colors.white}
                  />
                ) : (
                  <ChevronRight size={20} color={Colors.lightGray} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
        
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
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
  content: {
    paddingBottom: 120,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 4,
  },
  userEmail: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    color: Colors.error,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
    marginLeft: 8,
  },
  authButtons: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
  },
  signInButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  signInText: {
    color: Colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  signUpButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  signUpText: {
    color: Colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  menuSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  menuTitle: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
    marginBottom: 12,
    textTransform: 'uppercase',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemLabel: {
    color: Colors.white,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  versionText: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
});