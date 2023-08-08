import { View, Text, StyleSheet, Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Lottie from 'lottie-react-native';
import { useNavigation } from '@react-navigation/native';
import { removeItem } from '../utils/asyncStorage';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const navigation = useNavigation()

  const handleLogin = () => {
    navigation.push('Login');
  }

  const handleSignup = () => {
    navigation.push('Signup');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.lottie}>
        <Lottie source={require('../assets/animations/getstarted.json')} autoPlay loop />
      </View>
      <TouchableOpacity onPress={handleSignup} style={styles.resetButton}>
        <Text style={styles.buttonText}>Get Started!</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleLogin}>
        <Text style={styles.text}>Already have an account? Log in</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#52b69a' // Set the background color to light gray
  },
  lottie: {
    width: width * 0.9,
    height: width
  },
  buttonText: {
    fontSize: width * 0.09,
    color: 'black'
  },
  resetButton: {
    backgroundColor: '#83c5be',
    marginTop: 50,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: 'black'
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    color: 'black',
    textDecorationLine: 'underline'
  }
})
