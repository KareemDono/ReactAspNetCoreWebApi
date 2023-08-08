import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Navbar = () => {
  return (
    <View style={styles.navbar}>
      <Text style={styles.navbarTitle}>MyShop</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  navbar: {
    backgroundColor: "black",
    height: 95,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 30,
  },
  navbarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});

export default Navbar;
