import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AdminPage = ({ navigation }) => {
  const handleLogout = async () => {
    // Delete the token from AsyncStorage
    await AsyncStorage.removeItem("token");
    // Navigate back to the Login page
    navigation.navigate("Login");
  };

    const handleGetAllUsers = () => {
    // Add navigation logic for Get All Users
    navigation.navigate("AllUsers"); // Replace with your screen name
  };
  
  const handleGetUserById = () => {
    navigation.navigate("UserId");
  };
  const handleCreateProduct = () => {
    navigation.navigate("CreateProduct"); // Replace with your screen name
  };

  const handleUpdateProduct = () => {
    navigation.navigate("UpdateProduct"); // Replace with your screen name
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Admin</Text>
      <TouchableOpacity
        style={styles.option}
        onPress={handleGetAllUsers} // Call the handler when pressed
      >
        <Ionicons name="ios-list" size={24} color="black" />
        <Text style={styles.optionText}>Get All Users</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={handleGetUserById} // Call the handler when pressed
      >
        <Ionicons name="ios-person" size={24} color="black" />
        <Text style={styles.optionText}>Get User By Id</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={handleCreateProduct}
      >
        <Ionicons name="ios-add-circle" size={24} color="black" />
        <Text style={styles.optionText}>Create Product</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.option}
        onPress={handleUpdateProduct}
      >
        <Ionicons name="ios-create" size={24} color="black" />
        <Ionicons name="ios-trash" size={24} color="black" />
        <Text style={styles.optionText}>Update/Delete Product</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  optionText: {
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: "red",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  logoutButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default AdminPage;
