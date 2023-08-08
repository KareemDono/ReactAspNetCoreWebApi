import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const UserId = ({ navigation }) => {
  const [userId, setUserId] = useState("");
  const [userData, setUserData] = useState(null);

  const handleSearch = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `https://myshop2022.azurewebsites.net/api/Users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        setUserData(null);
        if (response.status === 404) {
          Alert.alert("User not found");
        } else {
          Alert.alert("An error occurred while fetching user data");
        }
        return;
      }

      const data = await response.json();
      setUserData(data);
    } catch (error) {
      console.error("Error fetching user data:", error);
      Alert.alert("An error occurred while fetching user data");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>User Details by ID</Text>
        <View style={{ width: 24 }}></View>
      </View>
      <TextInput
        style={styles.input}
        placeholder="Enter User ID"
        keyboardType="numeric"
        value={userId}
        onChangeText={(text) => setUserId(text)}
      />
      <View style={styles.searchContainer}>
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {userData && (
        <Card style={styles.userCard}>
          <Card.Content>
            <Title>ID: {userData.id}</Title>
            <Paragraph>
              Name: {userData.firstName} {userData.lastName}
            </Paragraph>
            <Paragraph>Email: {userData.email}</Paragraph>
            <Paragraph>Phone: {userData.phone}</Paragraph>
            <Paragraph>Address: {userData.address}</Paragraph>
            <Paragraph>Role: {userData.role}</Paragraph>
            <Paragraph>Created At: {userData.createdAt}</Paragraph>
          </Card.Content>
        </Card>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 30,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  searchContainer: {
    alignItems: "center",
  },
  searchButton: {
    borderWidth: 1,
    borderColor: "black",
    padding: 10,
    borderRadius: 5,
  },
  userCard: {
    marginTop: 20,
    elevation: 5,
  },
});

export default UserId;
