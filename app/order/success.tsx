import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const OrderConfirmationScreen = () => {
  const handleContinueShopping = () => {
    console.log('Continue Shopping pressed');
    // Add your navigation logic here
    // Example: navigation.navigate('Home');
  };

  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Progress Indicator */}
      <View style={styles.progressContainer}>
        <View style={styles.stepContainer}>
          <View style={styles.stepInactive}>
            <Text style={styles.stepTextInactive}>1</Text>
          </View>
          <Text style={styles.stepLabel}>Cart</Text>
        </View>
        
        <View style={styles.progressLine} />
        
        <View style={styles.stepContainer}>
          <View style={styles.stepInactive}>
            <Text style={styles.stepTextInactive}>2</Text>
          </View>
          <Text style={styles.stepLabel}>Payment</Text>
        </View>
        
        <View style={styles.progressLine} />
        
        <View style={styles.stepContainer}>
          <View style={styles.stepActive}>
            <Text style={styles.stepTextActive}>3</Text>
          </View>
          <Text style={styles.stepLabelActive}>Confirmation</Text>
        </View>
      </View>

      {/* Middle Section - Success Icon and Messages */}
      <View style={styles.middleSection}>
        <View style={styles.iconContainer}>
          <Feather name="check" size={80} color="#FFA500" />
        </View>
        
        <Text style={styles.successTitle}>Successful !</Text>
        
        <Text style={styles.orderNumber}>
          Your order number is <Text style={styles.orderNumberHighlight}>#253698</Text>
        </Text>
        
        <Text style={styles.confirmationText}>
          You will receive the order confirmation email shortly.
        </Text>
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomSection}>
       
        
        <TouchableOpacity 
          style={styles.button}
          onPress={()=>router.push("/orderHistory")}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Order Detail</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 60,
    paddingHorizontal: 10,
  },
  stepContainer: {
    alignItems: 'center',
  },
  stepInactive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepActive: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepTextInactive: {
    color: '#999999',
    fontSize: 14,
    fontWeight: '600',
  },
  stepTextActive: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  stepLabel: {
    fontSize: 12,
    color: '#666666',
  },
  stepLabelActive: {
    fontSize: 12,
    color: '#FFA500',
    fontWeight: '600',
  },
  progressLine: {
    width: 40,
    height: 2,
    backgroundColor: '#E0E0E0',
    marginHorizontal: 8,
    marginBottom: 28,
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF5E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 30,
  },
  orderNumber: {
    fontSize: 16,
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  orderNumberHighlight: {
    color: '#FFA500',
    fontWeight: '600',
  },
  confirmationText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  bottomSection: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  thankYouText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#FFA500',
    height: 50,
    width: '90%',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FFA500',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default OrderConfirmationScreen;
