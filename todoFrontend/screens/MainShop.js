import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from "react-native";
import Navbar from "../components/Navbar";
import BottomMenu from "../components/ButtomMenu";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

const MainShop = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("id");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null); // Step 1

  // Fetch products from the API based on the applied filters
  const fetchProducts = async () => {
    setError(null);
    setLoading(true); // Show the loading indicator for initial data fetching and filtering
    try {
      const response = await axios.get(
        "https://myshop2022.azurewebsites.net/api/Products",
        {
          params: {
            search,
            category,
            minPrice,
            maxPrice,
            sort,
            order,
            page,
          },
        }
      );

      // Log the API response data
      console.log("API Response:", response.data);

      if (response.data.products) {
        setProducts(response.data.products);
        setTotalPages(response.data.totalPages);
      } else {
        setProducts([]);
        setTotalPages(0);
      }
    } catch (error) {
      // Log the error if the API request fails
      console.error("Error fetching products:", error);
      setError("Error fetching products. Please try again later.");
    } finally {
      setLoading(false); // Hide the loading indicator for initial data fetching and filtering
      setSearchLoading(false); // Hide the loading indicator for search
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search, category, minPrice, maxPrice, sort, order, page]);

  // Function to generate page names [1][2][3]...
  const renderPageNames = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <TouchableOpacity
          key={i}
          onPress={() => handlePageChange(i)}
          style={styles.pageButton}
        >
          <Text style={styles.pageText}>{i}</Text>
        </TouchableOpacity>
      );
    }
    return pages;
  };

  // Check if there's an error
  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Show loading indicator while fetching products

  const handleSearch = () => {
    // Perform the search
    setSearchLoading(false);
    fetchProducts();
  };

  // Function to add a product to the cart

  // Function to handle sorting change
  const handleSortChange = (newSort) => {
    setSort(newSort);
  };

  // Function to handle order change
  const handleOrderChange = (newOrder) => {
    setOrder(newOrder);
  };

  // Function to handle pagination
  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  // Function to navigate to ProductCard screen
  const handleProductCardPress = (productId) => {
    setSelectedProductId(productId); // Step 2
    navigation.navigate("ProductCard", { productId });
  };

  const handleCartNavigation = (productId) => {
    navigation.navigate("Cart", { productId: productId }); // Pass the productId directly
  };

  // Render product card
  const renderProductCard = ({ item }) => (
    <TouchableOpacity onPress={() => handleProductCardPress(item.id)}>
      <View style={styles.productCard}>
        <Image
          source={{
            uri: `https://productimages4262.blob.core.windows.net/productimages/${item.imageFileName}`,
          }}
          style={styles.productImage}
        />
        <View style={styles.productContent}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={() => handleCartNavigation(item.id)} // Pass the productId directly
          >
            <Text style={styles.addToCartButtonText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // Search component
  const renderSearch = () => (
    <View style={styles.searchContainer}>
      {/* Search icon */}
      <Ionicons
        name="search"
        size={20}
        color="black"
        style={styles.searchIcon}
      />
      {/* Search input */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
        onSubmitEditing={handleSearch} // Call handleSearch when the user presses the search/submit button
      />
      {/* Clear search button */}
      {search.length > 0 && (
        <TouchableOpacity
          onPress={() => setSearch("")}
          style={styles.clearSearchButton}
        >
          <Ionicons name="close" size={20} color="black" />
        </TouchableOpacity>
      )}
      {/* Sort icon */}
      <TouchableOpacity
        onPress={() => handleSortChange(sort === "price" ? "name" : "price")}
      >
        <Ionicons
          name="ios-swap-vertical"
          size={20}
          color="black"
          style={styles.sortIcon}
        />
      </TouchableOpacity>
    </View>
  );

  // Pagination component
  const renderPagination = () => (
    <View style={styles.paginationContainer}>{renderPageNames()}</View>
  );

  return (
    <View style={styles.container}>
      <Navbar />

      {/* Search, Sort, and Filter options */}
      {renderSearch()}

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          // Show loading indicator while fetching products
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="blue" />
          </View>
        ) : products.length === 0 ? (
          // Show message if no products available
          <View style={styles.noProductsContainer}>
            <Text style={styles.noProductsText}>No products available.</Text>
          </View>
        ) : (
          // Render product cards if products are available
          products.map((product) => (
            <View
              key={product.id}
              style={[styles.productCard, { width: "95%" }]}
            >
              {renderProductCard({ item: product })}
            </View>
          ))
        )}
      </ScrollView>

      {/* Pagination */}
      {renderPagination()}

      <BottomMenu navigation={navigation} style={styles.bottomMenu} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    backgroundColor: "#f0f0f0",
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  sortIcon: {
    marginLeft: 10,
  },
  filterIcon: {
    marginLeft: 10,
  },
  // Pagination styles
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  pageButton: {
    marginHorizontal: 5,
  },
  pageText: {
    fontSize: 16,
    color: "blue",
  },
  bottomMenu: {
    position: "absolute",
    bottom: 10,
    width: "100%",
  },
  productCardContainer: {
    width: "100%",
    alignItems: "center", // Center horizontally
  },
  productCard: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
    // Adjust the width here as needed
    // For example, you can set it to 95% to make it slightly wider than the parent container
    width: "50%",
    alignSelf: "center", // Center horizontally
  },
  productCardContent: {
    alignItems: "center", // Center horizontally
  },
  productImage: {
    width: 150,
    height: 200,
    resizeMode: "cover",
    marginBottom: 10,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: "green",
    marginBottom: 5,
  },
  addToCartButton: {
    backgroundColor: "black",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 4,
    alignItems: "center", // Center horizontally
  },
  addToCartButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noProductsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noProductsText: {
    fontSize: 16,
    color: "gray",
  },
});

export default MainShop;
