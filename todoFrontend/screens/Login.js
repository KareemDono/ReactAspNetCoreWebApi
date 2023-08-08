import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Checkbox from "expo-checkbox";
import Button from "../components/Button";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";


const Login = ({ navigation }) => {
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    const loginUrl = `https://myshop2022.azurewebsites.net/api/Account/Login?email=${encodeURIComponent(
      email
    )}&password=${encodeURIComponent(password)}`;
  
    try {
      const response = await axios.post(loginUrl);
      console.log("API Response:", response.data);
      
      const token = response.data.token;
      await AsyncStorage.setItem("token", token);
    
      const userRole = response.data.user.role; // Make sure to access 'role' correctly
      console.log("User Role:", userRole);
  
      if (userRole === "admin") {
        console.log("Navigating to AdminPage");
        navigation.navigate("AdminPage");
      } else {
        console.log("Navigating to MainShop");
        navigation.navigate("MainShop");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.log("Error message:", error.message);
      console.log("Error response data:", error.response?.data);
      setError("Email or password incorrect");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
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
            Hi Welcome Back ! 👋
          </Text>

          <Text
            style={{
              fontSize: 16,
              color: "black",
            }}
          >
            We missed you! Login to continue.
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
            Email address
          </Text>

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Enter your email address"
              placeholderTextColor="black"
              keyboardType="email-address"
              style={{ width: "100%" }}
              onChangeText={(text) => setEmail(text)} // Update the email state
            />
          </View>
        </View>

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

          <View
            style={{
              width: "100%",
              height: 48,
              borderColor: "black",
              borderWidth: 1,
              borderRadius: 8,
              alignItems: "center",
              justifyContent: "center",
              paddingLeft: 22,
            }}
          >
            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="black"
              secureTextEntry={!isPasswordShown}
              style={{ width: "100%" }}
              onChangeText={(text) => setPassword(text)} // Update the password state
            />

            <TouchableOpacity
              onPress={() => setIsPasswordShown(!isPasswordShown)}
              style={{
                position: "absolute",
                right: 12,
              }}
            >
              {isPasswordShown == true ? (
                <Ionicons name="eye-off" size={24} color={"black"} />
              ) : (
                <Ionicons name="eye" size={24} color={"black"} />
              )}
            </TouchableOpacity>
          </View>
          <View style={{ flexDirection: "row", marginTop: 8 }}>
            <Text style={{ fontSize: 16, color: "#007260" }}>
              Forgot Password?{" "}
            </Text>
            <Pressable onPress={() => navigation.navigate("ForgetPassword")}>
              <Text
                style={{ fontSize: 16, color: "#007260", fontWeight: "bold" }}
              >
                Reset here.
              </Text>
            </Pressable>
          </View>
        </View>

        <Button
          title="Login"
          filled
          onPress={handleLogin}
          style={{
            marginTop: 18,
            marginBottom: 4,
          }}
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginVertical: 20,
          }}
        >
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "grey",
              marginHorizontal: 10,
            }}
          />
          <Text style={{ fontSize: 14 }}>Or Login with</Text>
          <View
            style={{
              flex: 1,
              height: 1,
              backgroundColor: "grey",
              marginHorizontal: 10,
            }}
          />
        </View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
          }}
        ></View>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginVertical: 22,
          }}
        >
          <Text style={{ fontSize: 16, color: "black" }}>
            Don't have an account ?{" "}
          </Text>
          <Pressable onPress={() => navigation.navigate("Signup")}>
            <Text
              style={{
                fontSize: 16,
                color: "#007260",
                fontWeight: "bold",
                marginLeft: 6,
              }}
            >
              Register
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
