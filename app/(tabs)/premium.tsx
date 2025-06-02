import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import Header from '@/components/ui/Header';
import { Check, Crown } from 'lucide-react-native';
import Button from '@/components/ui/Button';

export default function PremiumScreen() {
  const features = [
    'Access to all sound collections',
    'Download sounds for offline listening',
    'Ad-free experience',
    'High quality audio',
    'Customizable sleep timer',
    'Advanced sound mixing',
    'New sounds added weekly'
  ];

  const plans = [
    { id: 'monthly', name: 'Monthly', price: '$4.99', period: 'month', popular: false },
    { id: 'yearly', name: 'Yearly', price: '$39.99', period: 'year', popular: true, savings: 'Save 33%' }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Premium" />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <View style={styles.headerSection}>
          <View style={styles.crownContainer}>
            <Crown size={32} color={Colors.gold} />
          </View>
          <Text style={styles.title}>Unlock Premium Experience</Text>
          <Text style={styles.subtitle}>
            Elevate your sound experience with premium features and exclusive content
          </Text>
        </View>
        
        <View style={styles.featuresSection}>
          <Text style={styles.sectionTitle}>Premium Features</Text>
          {features.map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <View style={styles.checkIcon}>
                <Check size={16} color={Colors.primary} />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.plansSection}>
          <Text style={styles.sectionTitle}>Choose Your Plan</Text>
          
          {plans.map((plan) => (
            <TouchableOpacity 
              key={plan.id} 
              style={[
                styles.planCard,
                plan.popular && styles.popularPlan
              ]}
            >
              {plan.popular && (
                <View style={styles.popularBadge}>
                  <Text style={styles.popularText}>BEST VALUE</Text>
                </View>
              )}
              
              <View style={styles.planHeader}>
                <Text style={styles.planName}>{plan.name}</Text>
                {plan.savings && <Text style={styles.savingsText}>{plan.savings}</Text>}
              </View>
              
              <View style={styles.priceContainer}>
                <Text style={styles.price}>{plan.price}</Text>
                <Text style={styles.period}>/{plan.period}</Text>
              </View>
              
              <Button 
                title={`Get ${plan.name} Plan`}
                onPress={() => {}}
                style={styles.planButton}
                isPrimary={plan.popular}
              />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.guaranteeSection}>
          <Text style={styles.guaranteeText}>
            7-day money-back guarantee. Cancel anytime.
          </Text>
        </View>
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
  headerSection: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  crownContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.cardBackground,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  featuresSection: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureText: {
    color: Colors.white,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
  },
  plansSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  planCard: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  popularPlan: {
    borderColor: Colors.primary,
  },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: {
    color: Colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: 12,
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  planName: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 18,
  },
  savingsText: {
    color: Colors.primary,
    fontFamily: 'Inter-Medium',
    fontSize: 14,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 16,
  },
  price: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 28,
  },
  period: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginLeft: 4,
  },
  planButton: {
    marginTop: 8,
  },
  guaranteeSection: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  guaranteeText: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    textAlign: 'center',
  },
});