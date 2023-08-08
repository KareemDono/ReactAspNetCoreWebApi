import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Button from "../components/Button";
import { TextInputMask } from "react-native-masked-text";
import TermsAndConditions from "../components/TermsAndConditions";
import axios from "axios";

const Signup = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isConfirmPasswordShown, setIsConfirmPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  //checking fields
  const [firstNameError, setFirstNameError] = useState(null);
  const [lastNameError, setLastNameError] = useState(null);
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState(null);

  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const addressRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);

  // Helper function to validate first name format
  const validateFirstName = () => {
    if (!firstName) {
      setFirstNameError("First name is required");
    } else if (!isValidName(firstName)) {
      setFirstNameError("first name can only contain letters.");
    } else {
      setFirstNameError(null);
    }
  };

  // Helper function to validate last name format
  const validateLastName = () => {
    if (!lastName) {
      setLastNameError("Last name is required");
    } else if (!isValidName(lastName)) {
      setLastNameError("last name can only contain letters.");
    } else {
      setLastNameError(null);
    }
  };

  // Helper function to validate email format
  const validateEmail = () => {
    if (!email) {
      setEmailError("Email address is required");
    } else if (!isValidEmail(email)) {
      setEmailError("email format: mail@domain.com");
    } else {
      setEmailError(null);
    }
  };

  // Helper function to validate phone number
  const validatePhone = () => {
    if (!phone) {
      setPhoneError("Phone number is required");
    } else if (!isValidPhoneNumber(phone)) {
      setPhoneError("Invalid phone number (should be 9 numbers)");
    } else {
      setPhoneError(null);
    }
  };

  // Helper function to validate address format
  const validateAddress = () => {
    if (!address) {
      setAddressError("Address is required");
    } else if (!isValidAddress(address)) {
      setAddressError("Invalid address format");
    } else {
      setAddressError(null);
    }
  };

  // Helper function to validate password format
  const validatePassword = () => {
    if (!password) {
      setPasswordError("Password is required");
    } else if (!isValidPassword(password)) {
      setPasswordError(
        "Password should be at least 8 characters with at least one lowercase and one uppercase letter"
      );
    } else {
      setPasswordError(null);
    }
  };

  // Helper function to validate confirm password
  const validateConfirmPassword = () => {
    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
    } else {
      setConfirmPasswordError(null);
    }
  };

  // Update error messages on every input change
  const handleFirstNameChange = (value) => {
    setFirstName(value);
    validateFirstName();
  };

  const handleLastNameChange = (value) => {
    setLastName(value);
    validateLastName();
  };

  const handleEmailChange = (value) => {
    setEmail(value);
    validateEmail();
  };

  const handlePhoneChange = (value) => {
    setPhone(value);
    validatePhone();
  };

  const handleAddressChange = (value) => {
    setAddress(value);
    validateAddress();
  };

  const handlePasswordChange = (value) => {
    setPassword(value);
    validatePassword();
  };

  const handleConfirmPasswordChange = (value) => {
    setConfirmPassword(value);
    validateConfirmPassword();
  };

  const isValidName = (name) => {
    const nameRegex = /^[A-Za-z]{2,}$/;
    return nameRegex.test(name);
  };

  // Helper function to validate address format
  const isValidAddress = (address) => {
    const addressRegex = /^[A-Za-z0-9\s,'-]*$/;
    return addressRegex.test(address);
  };

  // Helper function to validate email format
  const isValidEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  // Helper function to validate phone number
  const isValidPhoneNumber = (phone) => {
    const phoneRegex = /^\d{9}$/;
    return phoneRegex.test(phone);
  };

  // Helper function to validate password format
  const isValidPassword = (password) => {
    // Password should be at least 8 characters with at least one lowercase and one uppercase letter
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    return passwordRegex.test(password);
  };

  const handleTermsPress = () => {
    setShowTermsModal(true);
  };

  const handleExitTerms = (accepted) => {
    setShowTermsModal(false);

    if (accepted) {
      setIsChecked(true);
    }
  };

  const handleSignUp = () => {
    // Reset previous error messages
    setFirstNameError("");
    setLastNameError("");
    setEmailError("");
    setPhoneError("");
    setAddressError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Perform validation
    let isValid = true;

    // Perform validation for first name
    if (!firstName) {
      setFirstNameError("First name is required");
      isValid = false;
    } else if (!isValidName(firstName)) {
      setFirstNameError("Invalid first name format");
      isValid = false;
    }

    // Perform validation for last name
    if (!lastName) {
      setLastNameError("Last name is required");
      isValid = false;
    } else if (!isValidName(lastName)) {
      setLastNameError("Invalid last name format");
      isValid = false;
    }

    if (!email) {
      setEmailError("Email address is required");
      isValid = false;
    } else if (!isValidEmail(email)) {
      setEmailError("Invalid email format");
      isValid = false;
    }

    if (!phone) {
      setPhoneError("Phone number is required");
      isValid = false;
    } else if (!isValidPhoneNumber(phone)) {
      setPhoneError("Invalid phone number (should be 9 numbers)");
      isValid = false;
    }

    // Perform validation for address
    if (!address) {
      setAddressError("Address is required");
      isValid = false;
    } else if (!isValidAddress(address)) {
      setAddressError("Invalid address format");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (!isValidPassword(password)) {
      setPasswordError(
        "Password should be at least 8 characters with at least one lowercase and one uppercase letter"
      );
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    // Send the user data to the backend using your API
    const userData = {
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Phone: phone,
      Address: address,
      Password: password,
    };

    axios
      .post(
        "https://myshop2022.azurewebsites.net/api/Account/Register",
        userData
      )
      .then((response) => {
        setShowSuccessModal(true);
        console.log(response.data);
      })
      .catch((error) => {});
  };

  const SuccessModal = () => {
    return (
      <Modal
        visible={showSuccessModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalContainer}>
          <View style={styles.cardContainer}>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}
            >
              Registered successfully!
            </Text>
            <Ionicons
              name="checkmark-circle-outline"
              size={80}
              color="#007260"
            />
            <TouchableOpacity onPress={handleLoginButtonPress}>
              <Text style={{ color: "#007260", fontSize: 18, marginTop: 20 }}>
                Login
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  const handleLoginButtonPress = () => {
    // Reset the form fields and navigate to the login screen
    setShowSuccessModal(false);
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setPassword("");
    setConfirmPassword("");
    setIsChecked(false);
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={{ flex: 1, marginHorizontal: 22 }}>
            <View style={{ marginVertical: 22 }}>
              <Text
                style={{
                  fontSize: 22,
                  fontWeight: "bold",
                  marginVertical: 12,
                  color: "black",
                }}
              >
                Create an account!
              </Text>
            </View>

            <View style={{ marginBottom: 12 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "normal",
                  marginVertical: 8,
                }}
              >
                First Name
              </Text>
              <View style={styles.inputContainer}>
                <TextInput
                  ref={firstNameRef}
                  placeholder="Enter your first name"
                  placeholderTextColor={"black"}
                  value={firstName}
                  onChangeText={handleFirstNameChange}
                  style={{ width: "100%" }}
                  onSubmitEditing={() => lastNameRef.current.focus()}
                />
                {firstNameError ? (
                  <Ionicons
                    name="close-circle-outline"
                    size={24}
                    color="red"
                    style={{ position: "absolute", right: 12 }}
                  />
                ) : firstName ? (
                  <Ionicons
                    name="checkmark-circle-outline"
                    size={24}
                    color="green"
                    style={{ position: "absolute", right: 12 }}
                  />
                ) : null}
              </View>
              {firstNameError ? (
                <Text style={{ color: "red", fontSize: 12 }}>
                  {firstNameError}
                </Text>
              ) : null}
            </View>
             
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    marginVertical: 8,
                  }}
                >
                  Last Name
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={lastNameRef}
                    placeholder="Enter your last name"
                    placeholderTextColor={"black"}
                    value={lastName}
                    onChangeText={handleLastNameChange}
                    style={{ width: "100%" }}
                    onSubmitEditing={() => emailRef.current.focus()}
                  />
                  {lastNameError ? (
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="red"
                      style={{ position: "absolute", right: 12 }}
                    />
                  ) : lastName ? (
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={24}
                      color="green"
                      style={{ position: "absolute", right: 12 }}
                    />
                  ) : null}
                </View>
                {lastNameError ? (
                  <Text style={{ color: "red", fontSize: 12 }}>
                    {lastNameError}
                  </Text>
                ) : null}
              </View>

              {/* Email input */}
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    marginVertical: 8,
                  }}
                >
                  Email address
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={emailRef}
                    placeholder="Enter your email address"
                    placeholderTextColor={"black"}
                    keyboardType="email-address"
                    value={email}
                    onChangeText={handleEmailChange}
                    style={{ width: "100%" }}
                    onSubmitEditing={() => phoneRef.current.focus()}
                  />
                  {emailError ? (
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="red"
                      style={{ position: "absolute", right: 12 }}
                    />
                  ) : email ? (
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={24}
                      color="green"
                      style={{ position: "absolute", right: 12 }}
                    />
                  ) : null}
                </View>
                {emailError ? (
                  <Text style={{ color: "red", fontSize: 12 }}>
                    {emailError}
                  </Text>
                ) : null}
              </View>

              {/* Phone Number input */}
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    marginVertical: 8,
                  }}
                >
                  Phone Number
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={phoneRef}
                    placeholder="Enter your phone number"
                    placeholderTextColor={"black"}
                    value={phone}
                    onChangeText={handlePhoneChange}
                    style={{ width: "100%" }}
                    onSubmitEditing={() => addressRef.current.focus()}
                  />
                  {phoneError ? (
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="red"
                      style={{ position: "absolute", right: 12 }}
                    />
                  ) : phone ? (
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={24}
                      color="green"
                      style={{ position: "absolute", right: 12 }}
                    />
                  ) : null}
                </View>
                {phoneError ? (
                  <Text style={{ color: "red", fontSize: 12 }}>
                    {phoneError}
                  </Text>
                ) : null}
              </View>

              {/* Address input */}
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    marginVertical: 8,
                  }}
                >
                  Address
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={addressRef}
                    placeholder="Enter your address"
                    placeholderTextColor={"black"}
                    value={address}
                    onChangeText={handleAddressChange}
                    style={{ width: "100%" }}
                    onSubmitEditing={() => passwordRef.current.focus()}
                  />
                  {addressError ? (
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="red"
                      style={{ position: "absolute", right: 12 }}
                    />
                  ) : address ? (
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={24}
                      color="green"
                      style={{ position: "absolute", right: 12 }}
                    />
                  ) : null}
                </View>
                {addressError ? (
                  <Text style={{ color: "red", fontSize: 12 }}>
                    {addressError}
                  </Text>
                ) : null}
              </View>

              {/* Password input */}
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    marginVertical: 8,
                  }}
                >
                  Password
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={passwordRef}
                    placeholder="Enter your password"
                    placeholderTextColor={"black"}
                    secureTextEntry={isPasswordShown}
                    value={password}
                    onChangeText={handlePasswordChange}
                    style={{ width: "100%" }}
                    onSubmitEditing={() => confirmPasswordRef.current.focus()}
                  />
                  {passwordError ? (
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="red"
                      style={{ position: "absolute", right: 12 }}
                    />
                  ) : null}
                  {/* (existing eye icon code) */}
                </View>
                {passwordError ? (
                  <Text style={{ color: "red", fontSize: 12 }}>
                    {passwordError}
                  </Text>
                ) : null}
              </View>

              {/* Confirm Password input */}
              <View style={{ marginBottom: 12 }}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "normal",
                    marginVertical: 8,
                  }}
                >
                  Confirm Password
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    ref={confirmPasswordRef}
                    placeholder="Confirm your password"
                    placeholderTextColor={"black"}
                    secureTextEntry={isConfirmPasswordShown}
                    value={confirmPassword}
                    onChangeText={handleConfirmPasswordChange}
                    style={{ width: "100%" }}
                  />
                  {confirmPasswordError ? (
                    <Ionicons
                      name="close-circle-outline"
                      size={24}
                      color="red"
                      style={{ position: "absolute", right: 12 }}
                    />
                  ) : null}
                  {/* (existing eye icon code) */}
                </View>
                {confirmPasswordError ? (
                  <Text style={{ color: "red", fontSize: 12 }}>
                    {confirmPasswordError}
                  </Text>
                ) : null}
              </View>

              <View style={{ flexDirection: "row", marginVertical: 6 }}>
                <Checkbox
                  style={{ marginRight: 8 }}
                  value={isChecked}
                  onValueChange={setIsChecked}
                  tintColors={{ true: "#007260", false: "black" }}
                />

                <Text>
                  I agree to the{" "}
                  <Text
                    onPress={handleTermsPress}
                    style={{ textDecorationLine: "underline" }}
                  >
                    Terms and Conditions
                  </Text>
                </Text>
              </View>

              <Button
                title="Sign Up"
                filled
                style={{ marginTop: 18, marginBottom: 4 }}
                onPress={() => handleSignUp()}
              />

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  marginVertical: 22,
                }}
              >
                <Text style={{ fontSize: 16, color: "black" }}>
                  Already have an account?
                </Text>
                <Pressable onPress={() => navigation.navigate("Login")}>
                  <Text
                    style={{
                      fontSize: 16,
                      color: "#007260",
                      fontWeight: "bold",
                      marginLeft: 6,
                    }}
                  >
                    Login
                  </Text>
                </Pressable>
              </View>
              {/* Terms and Conditions Modal */}
              <Modal
                visible={showTermsModal}
                animationType="slide"
                transparent={true}
              >
                <View
                  style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.5)" }}
                >
                  <View style={styles.modalContainer}>
                    <ScrollView>
                      {/* Assuming you have a component named TermsAndConditions */}
                      <TermsAndConditions
                        onAccept={() => handleExitTerms(true)}
                      />
                    </ScrollView>

                    <TouchableOpacity
                      onPress={() => handleExitTerms(false)}
                      style={styles.closeButton}
                    >
                      <Ionicons name="close" size={24} color="black" />
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <SuccessModal />
    </SafeAreaView>
  );
};

const styles = {
  cardContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  inputContainer: {
    width: "100%",
    height: 48,
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 22,
  },
  modalContainer: {
    flex: 1,
    marginHorizontal: 22,
    marginTop: 50,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
  },
};

export default Signup;
