import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Card, Title, Paragraph } from "react-native-paper"; // Import Card, Title, and Paragraph
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Import AsyncStorage

const AllUsers = ({ navigation }) => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.get(
        "https://myshop2022.azurewebsites.net/api/Users",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("API Response:", response.data);

      if (response.data && response.data.users) {
        const userList = response.data.users;
        console.log("Fetched user data:", userList);
        setUsers(userList);
      } else {
        console.log("No user data found in the API response.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  console.log("Users state:", users);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>All Users</Text>
        <View style={{ width: 24 }}></View>
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Title>{`${item.firstName} ${item.lastName}`}</Title>
              <Paragraph>ID: {item.id}</Paragraph>
              <Paragraph>Email: {item.email}</Paragraph>
              <Paragraph>Phone: {item.phone}</Paragraph>
              <Paragraph>Address: {item.address}</Paragraph>
              <Paragraph>Role: {item.role}</Paragraph>
              <Paragraph>Created At: {item.createdAt}</Paragraph>
            </Card.Content>
          </Card>
        )}
      />
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
    marginTop: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  card: {
    marginBottom: 15, // Add margin to separate the cards
    elevation: 5, // Add shadow
  },
});

export default AllUsers;
