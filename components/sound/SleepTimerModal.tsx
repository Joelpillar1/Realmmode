import { View, Text, StyleSheet, Modal, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import Colors from '@/constants/Colors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X } from 'lucide-react-native';
import Button from '@/components/ui/Button';

interface SleepTimerModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function SleepTimerModal({ visible, onClose }: SleepTimerModalProps) {
  const insets = useSafeAreaInsets();
  
  const timeOptions = [
    { value: 5, label: '5 minutes' },
    { value: 15, label: '15 minutes' },
    { value: 30, label: '30 minutes' },
    { value: 60, label: '1 hour' },
    { value: 120, label: '2 hours' },
  ];

  const handleSetTimer = (minutes: number) => {
    // Set timer logic here
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={[styles.container, { paddingBottom: Math.max(20, insets.bottom) }]}>
              <View style={styles.header}>
                <Text style={styles.title}>Sleep Timer</Text>
                <TouchableOpacity 
                  style={styles.closeButton}
                  onPress={onClose}
                >
                  <X size={20} color={Colors.white} />
                </TouchableOpacity>
              </View>
              
              <Text style={styles.description}>
                Set a timer to automatically stop the sound playback
              </Text>
              
              <View style={styles.optionsContainer}>
                {timeOptions.map((option) => (
                  <TouchableOpacity 
                    key={option.value}
                    style={styles.option}
                    onPress={() => handleSetTimer(option.value)}
                  >
                    <Text style={styles.optionText}>{option.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              <Button 
                title="End of current sound"
                onPress={() => handleSetTimer(-1)}
                style={styles.endButton}
              />
              
              <Button 
                title="Cancel Timer"
                onPress={onClose}
                isPrimary={false}
                style={styles.cancelButton}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    color: Colors.white,
    fontFamily: 'Inter-Bold',
    fontSize: 20,
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: {
    color: Colors.lightGray,
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    marginBottom: 24,
  },
  optionsContainer: {
    marginBottom: 24,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: Colors.cardBackground,
    borderRadius: 12,
    marginBottom: 12,
  },
  optionText: {
    color: Colors.white,
    fontFamily: 'Inter-Medium',
    fontSize: 16,
  },
  endButton: {
    marginBottom: 12,
  },
  cancelButton: {
    marginBottom: 8,
  },
});