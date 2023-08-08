import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";

const BottomMenu = ({ navigation }) => {
  return (
    <View style={styles.bottomMenu}>
      <TouchableOpacity
        style={[styles.menuItem, styles.menuItemWithBorder]}
        onPress={() => navigation.navigate("MainShop")}
      >
        <Icon name="home" type="ionicon" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.menuItem, styles.menuItemWithBorder]}
        onPress={() => navigation.navigate("Cart")}
      >
        <Icon name="cart" type="ionicon" size={30} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.menuItem}
        onPress={() => navigation.navigate("Profile")}
      >
        <Icon name="person" type="ionicon" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomMenu: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 12,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#f9f9f9",
    paddingBottom: 20,
    backgroundColor: "black",
  },
  menuItem: {
    flex: 1,
    alignItems: "center",
  },
  menuItemWithBorder: {
    borderRightWidth: 2,
    borderColor: "gray",
  },
});

export default BottomMenu;
