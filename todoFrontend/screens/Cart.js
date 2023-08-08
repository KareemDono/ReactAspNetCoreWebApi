import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import Navbar from "../components/Navbar";
import BottomMenu from "../components/ButtomMenu";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const Cart = ({ route, navigation }) => {
  const [cartData, setCartData] = useState({ cartItems: [] });

  // Fetch cart data based on the selected product ID
  const fetchCartData = async (productId) => {
    try {
      const response = await axios.get(
        `https://myshop2022.azurewebsites.net/api/Cart?productIdentifiers=${productId}`
      );
      console.log("Cart API response:", response.data);

      if (response.data.cartItems && response.data.cartItems.length > 0) {
        const productToAdd = response.data.cartItems[0];

        setCartData((prevCartData) => {
          const updatedCartItems = [...prevCartData.cartItems];

          const existingProductIndex = updatedCartItems.findIndex(
            (item) => item.product.id === productToAdd.product.id
          );

          if (existingProductIndex !== -1) {
            // Product already exists in cart, update quantity
            updatedCartItems[existingProductIndex].quantity += 1;
          } else {
            // Add new product with quantity 1
            updatedCartItems.push({ ...productToAdd, quantity: 1 });
          }

          return {
            ...prevCartData,
            cartItems: updatedCartItems,
          };
        });
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  // Function to save cart data to AsyncStorage
  const saveCartDataToStorage = async (data) => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem("cartData", jsonValue);
      console.log("Cart data saved to AsyncStorage.");
    } catch (error) {
      console.error("Error saving cart data to AsyncStorage:", error);
    }
  };

  const handleRemoveFromCart = (index) => {
    setCartData((prevCartData) => ({
      ...prevCartData,
      cartItems: prevCartData.cartItems.filter((item, i) => i !== index),
    }));
  };

  // Function to retrieve cart data from AsyncStorage
  const getCartDataFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("cartData");
      const storedCartData = jsonValue
        ? JSON.parse(jsonValue)
        : { cartItems: [] };
      setCartData(storedCartData);
    } catch (error) {
      console.error("Error retrieving cart data from AsyncStorage:", error);
    }
  };

  // useEffect to fetch cartData based on the selected product ID when the component mounts
  useEffect(() => {
    getCartDataFromStorage(); // Load cart data from AsyncStorage
    const selectedProductId = route.params?.productId;
    if (selectedProductId) {
      fetchCartData(selectedProductId);
    }
  }, []);

  // useEffect to update cartData in AsyncStorage when it changes
  useEffect(() => {
    saveCartDataToStorage(cartData);
  }, [cartData]);

  const calculateTotalPrice = () => {
    if (cartData) {
      return cartData.cartItems.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );
    }
    return 0;
  };

  // Render cart item
  const renderCartItem = ({ item, index }) => (
    <View key={index} style={styles.cartItemContainer}>
      {/* Display the product image here */}
      <Image
        source={{
          uri: `https://productimages4262.blob.core.windows.net/productimages/${item.product.imageFileName}`,
        }}
        style={styles.cartItemImage}
      />
      <View style={styles.cartItemContent}>
        <Text style={styles.cartItemName}>{item.product.name}</Text>
        <Text style={styles.cartItemPrice}>Price: ${item.product.price}</Text>
        <Text style={styles.cartItemQuantity}>Quantity: {item.quantity}</Text>
      </View>
      <TouchableOpacity onPress={() => handleRemoveFromCart(index)}>
        <Ionicons name="trash-outline" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  // Render the Cart screen
  return (
    <View style={styles.container}>
      <Navbar />

      <View style={styles.cartContent}>
        {cartData && cartData.cartItems.length > 0 ? (
          <FlatList
            data={cartData.cartItems}
            renderItem={renderCartItem}
            keyExtractor={(item, index) => index.toString()} // Use the index as the key
          />
        ) : (
          <View style={styles.noItemsContainer}>
            <Text style={styles.noItemsText}>Your cart is empty.</Text>
          </View>
        )}

        <View style={styles.totalPriceContainer}>
          <Text style={styles.totalPriceText}>
            Total Price: ${calculateTotalPrice()}
          </Text>
          <TouchableOpacity
            style={styles.payNowButton}
            onPress={() => alert("todo")}
          >
            <Text style={styles.payNowButtonText}>Pay Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomMenu navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cartContent: {
    flex: 1,
  },
  noItemsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noItemsText: {
    fontSize: 16,
    color: "gray",
  },
  cartItemContainer: {
    flexDirection: "row",
    padding: 15, // Increase padding
    borderBottomWidth: 2, // Increase border width
    borderBottomColor: "#999", // Darker border color
  },
  cartItemImage: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    marginRight: 10,
  },
  cartItemContent: {
    flex: 1,
  },
  cartItemName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cartItemPrice: {
    fontSize: 16,
    color: "#6c757d",
  },
  cartItemQuantity: {
    fontSize: 16,
  },
  cartSummaryContainer: {
    padding: 20,
    backgroundColor: "#f0f0f0",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  totalPriceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    paddingTop: 10,
  },
  totalPriceText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  payNowButton: {
    backgroundColor: "black",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  payNowButtonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default Cart;
