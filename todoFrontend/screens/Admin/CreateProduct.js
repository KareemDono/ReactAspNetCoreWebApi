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

const CreateProduct = ({ navigation }) => {
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

  const handleCreateProduct = async () => {
    try {
      if (!name || !brand || !selectedCategory || !price || !description || !image) {
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
        type: "image/jpeg", // Update with the correct image type if needed
        name: "product_image.jpg", // Update with the desired image file name
      });

      const token = await AsyncStorage.getItem("token");

      const response = await fetch(
        "https://myshop2022.azurewebsites.net/api/Products",
        {
          method: "POST",
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
        console.error("Product creation error:", responseData);
      }
    } catch (error) {
      console.error("Error creating product:", error);
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
        <Text style={styles.title}>Create a Product</Text>
        <View style={{ width: 24 }}></View>
      </View>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.formContainer}>
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
            onPress={handleCreateProduct}
            style={styles.createButton}
            color="green"
          >
            Create
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
        backgroundColor: "#f9f9f9", // You can change the background color here
        borderBottomWidth: 40,
        borderBottomColor: "white", // You can change the border color here
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
  picker: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    color: "gray",
  },
  imagePickerButton: {
    marginVertical: 10,
    backgroundColor: "black",
  },
  selectedImageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  selectedImage: {
    width: 50,
    height: 50,
    resizeMode: "cover",
    marginRight: 10,
  },
  createButton: {
    marginTop: 20,
    backgroundColor: "green",
  },
});

export default CreateProduct;
