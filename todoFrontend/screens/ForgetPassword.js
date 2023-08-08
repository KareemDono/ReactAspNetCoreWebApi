import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native"; // Import navigation hook
import Constants from 'expo-constants';
import CardMessage from "../components/CardMessage";

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [showSuccess, setShowSuccess] = useState(false); // State to control success message display
  const navigation = useNavigation(); // Get the navigation object

  
  const handleForgotPassword = async () => {
    if (email.trim() === '') {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }
  
    try {
      const apiUrl = Constants.manifest.extra.apiUrl;
      const response = await axios.post(`${apiUrl}/Account/ForgotPassword?email=${email}`);
  
      console.log(response.data);

      // Show success message when password reset is successful
      setShowSuccess(true);
    } catch (error) {
      console.error('API Error:', error.message);
      if (error.response) {
        console.error('Response Data:', error.response.data);
        console.error('Response Status:', error.response.status);
      } else if (error.request) {
        console.error('No response from the server.');
      } else {
        console.error('An unexpected error occurred:', error.message);
      }
  
      Alert.alert('Error', 'Password reset failed. Please try again later.');
    }
  };

  // Function to navigate to ResetPassword component
  const handleOkButton = () => {
    setShowSuccess(false); // Hide success message
    navigation.navigate("ResetPassword"); // Navigate to ResetPassword component
  };

  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password 🔒</Text>
      {showSuccess ? (
        // Use CardMessage component to display success message
        <CardMessage
          message="Instructions sent to email"
          buttonText="OK"
          onPressButton={handleOkButton}
        />
      ) : (
      <View>
        <View style={styles.emailInputContainer}>
          <TextInput
            style={styles.emailInput}
            placeholder="Enter your email"
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>
        <TouchableOpacity style={styles.resetButton} onPress={handleForgotPassword}>
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    )}
  </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        marginTop: 40,
      },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  emailInputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  emailInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    width: "100%",
  },
  resetButton: {
    backgroundColor: "green",
    borderRadius: 5,
    padding: 10,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ForgotPasswordScreen;
