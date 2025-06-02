import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';

interface HeaderProps {
  title: string;
}

export default function Header({ title }: HeaderProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  title: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 28,
  },
});