import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import axios from "axios";
import Navbar from "../components/Navbar";
import BottomMenu from "../components/ButtomMenu";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = ({ navigation }) => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
  });

  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [addressError, setAddressError] = useState(null);

  useEffect(() => {
    // Fetch user profile data from the backend
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const token = "Bearer " + (await getToken()); // Get the JWT token from your JWTReader service
      const response = await axios.get(
        "https://myshop2022.azurewebsites.net/api/Account/Profile",
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setProfileData(response.data);
    } catch (error) {
      // Handle errors appropriately
      console.error("Error fetching user profile:", error);
    }
  };

  const getToken = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      return token;
    } catch (error) {
      console.error("Error retrieving token from AsyncStorage:", error);
      return null;
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = "Bearer " + (await getToken());
      const response = await axios.put(
        "https://myshop2022.azurewebsites.net/api/Account/UpdateProfile",
        profileData,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setProfileData(response.data);
      // Optionally, you can display a success message or perform other actions after successful update
      Alert.alert("Success", "Profile updated successfully.");
    } catch (error) {
      console.error("Error updating user profile:", error);
      // Optionally, you can display an error message or perform other actions on error
    }
  };

  const handleLogout = async () => {
    try {
      // Clear the token from AsyncStorage
      await AsyncStorage.removeItem("token");
      // Navigate to the Login screen
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error logging out:", error);
      // Optionally, you can display an error message or perform other actions on error
    }
  };

  // Helper function to validate first name format
  const validateFirstName = () => {
    if (!profileData.firstName) {
      setFirstNameError("First name is required");
    } else if (!isValidName(profileData.firstName)) {
      setFirstNameError("First name can only contain letters.");
    } else {
      setFirstNameError(null);
    }
  };

  // Helper function to validate last name format
  const validateLastName = () => {
    if (!profileData.lastName) {
      setLastNameError("Last name is required");
    } else if (!isValidName(profileData.lastName)) {
      setLastNameError("Last name can only contain letters.");
    } else {
      setLastNameError(null);
    }
  };

  // Helper function to validate email format
  const validateEmail = () => {
    if (!profileData.email) {
      setEmailError("Email address is required");
    } else if (!isValidEmail(profileData.email)) {
      setEmailError("Email format: mail@domain.com");
    } else {
      setEmailError(null);
    }
  };

  // Helper function to validate phone number
  const validatePhone = () => {
    if (!profileData.phone) {
      setPhoneError("Phone number is required");
    } else if (!isValidPhoneNumber(profileData.phone)) {
      setPhoneError("Invalid phone number (should be 9 numbers)");
    } else {
      setPhoneError(null);
    }
  };

  // Helper function to validate address format
  const validateAddress = () => {
    if (!profileData.address) {
      setAddressError("Address is required");
    } else if (!isValidAddress(profileData.address)) {
      setAddressError("Invalid address format");
    } else {
      setAddressError(null);
    }
  };

  const isValidName = (name) => {
    const nameRegex = /^[A-Za-z]{2,}$/;
    return nameRegex.test(name);
  };

  const isValidAddress = (address) => {
    const addressRegex = /^[A-Za-z0-9\s,'-]*$/;
    return addressRegex.test(address);
  };

  const isValidEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^\d{9}$/;
    return phoneRegex.test(phone);
  };

  return (
    <View style={styles.container}>
      <Navbar />

      {/* Main content */}
      <View style={styles.content}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Update Profile</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={profileData.firstName}
            onChangeText={(text) => {
              setProfileData((prevState) => ({
                ...prevState,
                firstName: text,
              }));
              validateFirstName(); // Call the validation function for first name
            }}
            placeholder="First Name"
          />
          <Text style={styles.errorText}>{firstNameError}</Text>
          {/* Display the error message */}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={profileData.lastName}
            onChangeText={(text) => {
              setProfileData((prevState) => ({ ...prevState, lastName: text }));
              validateLastName(); // Call the validation function for last name
            }}
            placeholder="Last Name"
          />
          <Text style={styles.errorText}>{lastNameError}</Text>
          {/* Display the error message */}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            value={profileData.email}
            onChangeText={(text) => {
              setProfileData((prevState) => ({ ...prevState, email: text }));
              validateEmail(); // Call the validation function for email
            }}
            placeholder="Email"
          />
          <Text style={styles.errorText}>{emailError}</Text>
          {/* Display the error message */}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            value={profileData.phone}
            onChangeText={(text) => {
              setProfileData((prevState) => ({ ...prevState, phone: text }));
              validatePhone(); // Call the validation function for phone number
            }}
            placeholder="Phone"
          />
          <Text style={styles.errorText}>{phoneError}</Text>
          {/* Display the error message */}
        </View>
        <View style={styles.fieldContainer}>
          <Text style={styles.label}>Address</Text>
          <TextInput
            style={styles.input}
            value={profileData.address}
            onChangeText={(text) => {
              setProfileData((prevState) => ({ ...prevState, address: text }));
              validateAddress(); // Call the validation function for address
            }}
            placeholder="Address"
          />
          <Text style={styles.errorText}>{addressError}</Text>
          {/* Display the error message */}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.updateButton}
            onPress={handleUpdateProfile}
          >
            <Text style={styles.updateButtonText}>Update</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomMenu navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  // Update Button
  errorText: {
    color: "red",
    marginTop: 5,
  },
  updateButton: {
    backgroundColor: "#4CAF50", // Green color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  updateButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },

  // Logout Button
  logoutButton: {
    backgroundColor: "#ff5555", // Red color
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  fieldContainer: {
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
  },
  input: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});

export default ProfileScreen;
