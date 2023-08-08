import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import axios from "axios";
import Constants from 'expo-constants';
import { useNavigation } from "@react-navigation/native"; // Import navigation hook


const ResetPasswordScreen = () => {
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigation(); // Get the navigation object


  const handleUpdatePassword = async () => {
    if (token.trim() === '' || password.trim() === '') {
      Alert.alert('Error', 'Please enter both the token and your new password.');
      return;
    }

    try {
      const apiUrl = Constants.manifest.extra.apiUrl;
      const response = await axios.post(`${apiUrl}/Account/ResetPassword`, null, {
        params: {
          token: token,
          password: password,
        }
      });

      console.log(response.data);

      navigation.navigate("Login");

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


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Credentials to Reset Your Password 🔓</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Token</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter the token received in the email"
          value={token}
          onChangeText={(text) => setToken(text)}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your new password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
      </View>
      <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePassword}>
        <Text style={styles.updateButtonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    width: "100%",
  },
  updateButton: {
    backgroundColor: "#007BFF",
    borderRadius: 5,
    padding: 10,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ResetPasswordScreen;
