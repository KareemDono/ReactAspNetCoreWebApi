import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../components/Navbar';
import BottomMenu from '../components/ButtomMenu';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Import AsyncStorage

const ProductCard = ({ route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigation = useNavigation(); // Get the navigation object using useNavigation()

  // Load cart data from AsyncStorage
  const [cartData, setCartData] = useState({ cartItems: [] });

  useEffect(() => {
    getCartDataFromStorage(); // Load cart data from AsyncStorage
    fetchProductDetails();
  }, []);

  // Function to retrieve cart data from AsyncStorage
  const getCartDataFromStorage = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('cartData');
      const storedCartData = jsonValue ? JSON.parse(jsonValue) : { cartItems: [] };
      setCartData(storedCartData);
    } catch (error) {
      console.error('Error retrieving cart data from AsyncStorage:', error);
    }
  };

  const handleAddToCart = () => {
    const updatedCartItems = [...cartData.cartItems]; // Get a copy of the current cart items

    const existingProductIndex = updatedCartItems.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingProductIndex !== -1) {
      // Product already exists in cart, update quantity
      updatedCartItems[existingProductIndex].quantity += quantity;
    } else {
      // Add new product with selected quantity
      updatedCartItems.push({ product, quantity });
    }

    setCartData((prevCartData) => ({
      ...prevCartData,
      cartItems: updatedCartItems,
    }));

    saveCartDataToStorage(updatedCartItems); // Save updated cart data to AsyncStorage

    navigation.navigate('Cart'); // Navigate to the Cart page after adding to cart
  };

  const saveCartDataToStorage = async (cartItems) => {
    try {
      const updatedCartData = { cartItems };
      const jsonValue = JSON.stringify(updatedCartData);
      await AsyncStorage.setItem('cartData', jsonValue);
      console.log('Cart data saved to AsyncStorage.');
    } catch (error) {
      console.error('Error saving cart data to AsyncStorage:', error);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      const response = await axios.get(
        `https://myshop2022.azurewebsites.net/api/Products/${productId}`
      );
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product details:', error);
    }
  };

  const handleQuantityIncrement = () => {
    // Ensure the quantity does not exceed the maximum value of 10
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const handleQuantityDecrement = () => {
    // Ensure the quantity does not go below the minimum value of 1
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!product) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Navbar at the top */}
      <Navbar />

      {/* Main content */}
      <View style={styles.content}>
        <View style={styles.productImageContainer}>
          <Image
            source={{
              uri: `https://productimages4262.blob.core.windows.net/productimages/${product.imageFileName}`,
            }}
            style={styles.productImage}
          />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.productName}>{product.name}</Text>
          <Text style={styles.productPrice}>${product.price}</Text>
          <Text style={styles.productDescription}>{product.description}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity onPress={handleQuantityDecrement}>
              <Text style={styles.quantityButton}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{quantity}</Text>
            <TouchableOpacity onPress={handleQuantityIncrement}>
              <Text style={styles.quantityButton}>+</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* BottomMenu at the bottom */}
      <BottomMenu navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  productImageContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  productImage: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  contentContainer: {
    alignItems: 'center',
  },
  productName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  productPrice: {
    fontSize: 20,
    color: '#6c757d',
    marginBottom: 10,
  },
  productDescription: {
    fontSize: 16,
    marginBottom: 20,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: 100,
  },
  quantityButton: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#007BFF',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  addToCartButton: {
    marginTop: 20,
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  addToCartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ProductCard;
