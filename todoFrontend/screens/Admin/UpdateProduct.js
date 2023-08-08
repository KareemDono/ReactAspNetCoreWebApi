import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { TextInput, Button, Text } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";

const UpdateProduct = ({ navigation }) => {
  const [productId, setProductId] = useState("");
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("Phones");
  const categories = [
    "Phones",
    "Computers",
    "Accessories",
    "Printers",
    "Cameras",
    "Other",
  ];

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const removeImage = () => {
    setImage(null);
  };

  const handleSearchProduct = async () => {
    try {
      if (!productId) {
        alert("Please enter a Product ID");
        return;
      }

      const token = await AsyncStorage.getItem("token");
      const response = await fetch(
        `https://myshop2022.azurewebsites.net/api/Products/${productId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const productData = await response.json();
        console.log(productData); // Log the fetched data
        setName(productData.name);
        setBrand(productData.brand);
        setSelectedCategory(productData.category);
        setPrice(productData.price.toString());
        setDescription(productData.description);
        setImage(productData.imageUrl);
      } else {
        const responseData = await response.json();
        console.error("Product search error:", responseData);
      }
    } catch (error) {
      console.error("Error searching for product:", error);
    }
  };


  const handleUpdateProduct = async () => {
    try {
      if (
        !productId ||
        !name ||
        !brand ||
        !selectedCategory ||
        !price ||
        !description ||
        !image
      ) {
        alert("All fields are required");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("brand", brand);
      formData.append("category", selectedCategory);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("imageFile", {
        uri: image,
        type: "image/jpeg",
        name: "product_image.jpg",
      });

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `https://myshop2022.azurewebsites.net/api/Products/${productId}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        navigation.navigate("AdminPage"); // Navigate back to AdminPage
      } else {
        const responseData = await response.json();
        // Handle error cases here
        console.error("Product update error:", responseData);
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteProduct = async () => {
    try {
      if (!productId) {
        alert("Please enter a Product ID");
        return;
      }

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        `https://myshop2022.azurewebsites.net/api/Products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        navigation.navigate("AdminPage"); // Navigate back to AdminPage
      } else {
        const responseData = await response.json();
        console.error("Product delete error:", responseData);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <View style={styles.container}>
    <View style={styles.header}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>
      <Text style={styles.title}>Update Product</Text>
      <View style={{ width: 24 }}></View>
    </View>
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.formContainer}>
        <TextInput
          label="Product ID"
          value={productId}
          onChangeText={setProductId}
          style={styles.input}
          keyboardType="numeric"
          theme={{ colors: { primary: "gray" } }}
        />
        <Button
          mode="contained"
          onPress={handleSearchProduct}
          style={styles.searchButton}
          color="blue"
        >
          Search
        </Button>
        <TextInput
          label="Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          theme={{ colors: { primary: "gray" } }}
        />
        <TextInput
          label="Brand"
          value={brand}
          onChangeText={setBrand}
          style={styles.input}
          theme={{ colors: { primary: "gray" } }}
        />
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
          theme={{ colors: { primary: "gray" } }}
        >
          {categories.map((category) => (
            <Picker.Item label={category} value={category} key={category} />
          ))}
        </Picker>
        <TextInput
          label="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
          theme={{ colors: { primary: "gray" } }}
        />
        <TextInput
          label="Description"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          theme={{ colors: { primary: "gray" } }}
        />
        <Button
          mode="contained"
          onPress={handleImagePicker}
          style={styles.imagePickerButton}
          color="white"
        >
          Select Image
        </Button>
        {image && (
          <View style={styles.selectedImageContainer}>
            <Image source={{ uri: image }} style={styles.selectedImage} />
            <TouchableOpacity onPress={removeImage}>
              <Ionicons name="close-circle" size={24} color="red" />
            </TouchableOpacity>
          </View>
        )}
        <Button
          mode="contained"
          onPress={handleUpdateProduct}
          style={styles.updateButton}
          color="blue"
        >
          Update
        </Button>
        <Button
          mode="contained"
          onPress={handleDeleteProduct}
          style={styles.deleteButton}
          color="red"
        >
          Delete Product
        </Button>
      </View>
    </ScrollView>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 30,
    backgroundColor: "#f9f9f9",
    borderBottomWidth: 40,
    borderBottomColor: "white",
  },
  backButton: {
    marginRight: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "black",
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  formContainer: {
    width: "100%",
    paddingHorizontal: 16,
  },
  input: {
    marginBottom: 10,
  },
  searchButton: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: "gray",
  },
  updateButton: {
    marginTop: 20,
    backgroundColor: "green",
  },
  selectedImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  selectedImage: {
    width: 100,
    height: 100,
    marginRight: 10,
  },
  deleteButton: {
    marginTop: 20,
    backgroundColor: "red",
  },
});

export default UpdateProduct;
