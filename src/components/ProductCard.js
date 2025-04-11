import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "./ThemeContext";
import { useUser } from "../components/UserContext";
import { useCart } from "../components/CartContext";

const ProductCard = ({ image, title, price, descr, onAddtoCart, quantity, amount }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { addedToCart } = useCart();
  const styles = dynamicTheme(theme);
  const { userEmail, setUserEmail, username, setUsername, name, setName, dob, setDob, location, setLocation, refreshUser, user } = useUser();

  const handleAddtoCart = () => {
    const product = { image, title, price, descr, quantity: 1, amount: price }
    onAddtoCart(title, "Added to cart");
    addedToCart(product);
  };

  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate("ProductScreen", { image, title, price, descr, onAddtoCart, quantity: 1, amount: price })}
      activeOpacity={0.5}
    >
      <Image source={image} style={styles.productImage} />
      <View style={styles.textContainer}>
        <Text style={styles.productTitle}>{title}</Text>
        <Text style={styles.productPrice}>{'₹' + price}</Text>
      </View>

      {/* ✅ Add to Cart Button */}
      <TouchableOpacity
        style={styles.addIconContainer}
        onPress={() => {
          handleAddtoCart();
          refreshUser();
        }}
        activeOpacity={0.5}
      >
        <FontAwesome name="circle-plus" size={45} color="#029232" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const dynamicTheme = (theme) => ({
  productCard: {
    backgroundColor: theme.cardBg,
    borderRadius: 15,
    width: 200,
    height: 220,
    marginRight: 20,
    alignItems: "center",

    /* ✅ SOFTER SHADOW */
    elevation: 4, // 🔹 Android Shadow (was 8)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // 🔹 Less height (was 4)
    shadowOpacity: 0.15, // 🔹 Lighter (was 0.3)
    shadowRadius: 3, // 🔹 Softer edges (was 5)
  },

  productImage: { width: '100%', height: 110, borderRadius: 10 },
  textContainer: { flexGrow: 0, justifyContent: 'space-between', alignSelf: 'stretch', padding: 10 },
  productTitle: { textAlign: "left", fontSize: 16, fontWeight: 'bold', color: theme.cardTitle },
  productPrice: { textAlign: "left", fontSize: 14, fontWeight: 'bold', color: theme.cardPrice },
  addIconContainer: { position: "absolute", bottom: 16, right: 16 }
});

export default ProductCard;
