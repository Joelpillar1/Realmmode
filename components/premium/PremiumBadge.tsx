import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/Colors';
import { Crown } from 'lucide-react-native';

export default function PremiumBadge() {
  return (
    <View style={styles.container}>
      <Crown size={12} color={Colors.dark} />
      <Text style={styles.text}>PREMIUM</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gold,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  text: {
    color: Colors.dark,
    fontFamily: 'Inter-Bold',
    fontSize: 10,
    marginLeft: 4,
  },
});