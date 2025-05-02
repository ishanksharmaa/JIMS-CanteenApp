import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "./ThemeContext";
import { useUser } from "../components/UserContext";
import { useCart } from "../components/CartContext";
import { transform } from "typescript";

const ProductCard = ({ image, title, price, descr, quantity, qty, amount, time, available = true, size = 1, gapV = 20, gapH = 20 }) => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const styles = dynamicTheme(theme, size, gapH, gapV);
  const { addedToCart, removedFromCart, toggleFavoriteItem, isFavorite, cartItems, setCartItems, setFavItems, fetchFavorites } = useCart();
  const { refreshUser, user, userEmail } = useUser();
  // const item = cartItems.find(cartItem => cartItem.title === title);
  const isInCart = cartItems.some(item => item.title === title);

  useEffect(() => {
    if (user) {
      fetchFavorites(userEmail);
    } else {
      setCartItems([]);
      setFavItems([]);
    }
  }, [user]);

  const handleCartAction = () => {
    if (isInCart) {
      removedFromCart(title);
    } else {
      const product = { image, title, price, descr, quantity, qty: 1, amount: price, time, available };
      addedToCart(product);
    }
    refreshUser();
  };


  return (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate("ProductScreen", { image, title, price, descr, quantity, qty: 1, amount: price, time, available })}
      activeOpacity={0.5}
    >
      <Image source={image} style={styles.productImage} />
      <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavoriteItem(title)} activeOpacity={0.6} >
        {/* <Ionicons name={isFavorite(title) ? "heart" : "heart-outline"} size={22} color={isFavorite(title) ? theme.customButtonBg : theme.text} /> */}
        {/* <Ionicons name={isFavorite(title) ? "heart" : "heart-outline"} size={22} color={isFavorite(title) ? theme.text : theme.text} /> */}
        <Ionicons name={user && isFavorite(title) ? "heart" : "heart-outline"} size={22} color={user && isFavorite(title) ? "#DC143C" : theme.text} />
      </TouchableOpacity>
      <View style={styles.textContainer}>
        <Text style={styles.productTitle}>{title}</Text>
        <Text style={styles.productPrice}>{'₹' + price}</Text>
        {/* <Text style={styles.productQuantity}>{'Qty: ' + quantity}</Text> */}
        <Text style={styles.productTime}>{'🕒 ' + time}</Text>
      </View>

      {/* ✅ Add to Cart Button */}
      {available ? (

        <TouchableOpacity
          style={styles.addIconContainer}
          onPress={() => {
            handleCartAction();
            refreshUser();
          }}
          activeOpacity={0.5}
        >
          <FontAwesome
            name={isInCart ? "circle-minus" : "circle-plus"}
            size={45}
            // color={isInCart ? "grey" : "#029232"}
            color={isInCart ? "grey" : theme.customButtonBg}

          // color={isInCart ? "#C40233" : "#029232"}
          // color={isInCart ? "#C40233" : theme.customButtonBg}
          />
        </TouchableOpacity>
      ) :
        <Text style={{ color: 'red', fontSize: 13 }}>Currently unavailable!</Text>
      }
    </TouchableOpacity>
  );
};

const dynamicTheme = (theme, size, gapH, gapV) => ({
  productCard: {
    transform: [{ scale: size }],
    backgroundColor: theme.cardBg,
    borderRadius: 15,
    width: 200,
    height: 220,
    marginRight: gapH,
    marginBottom: gapV,
    alignItems: "center",

    /* ✅ SOFTER SHADOW */
    elevation: 4, // 🔹 Android Shadow (was 8)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 }, // 🔹 Less height (was 4)
    shadowOpacity: 0.15, // 🔹 Lighter (was 0.3)
    shadowRadius: 3, // 🔹 Softer edges (was 5)
  },

  productImage: { width: '100%', height: 110, borderRadius: 10 },
  favBtn: {
    padding: 7, borderRadius: 20,
    // backgroundColor: theme.backBtnBg,
    backgroundColor: theme.cardBg,
    position: 'absolute',
    // top: 7,
    bottom: 87,
    right: 8,
  },
  textContainer: { flexGrow: 0, justifyContent: 'space-between', alignSelf: 'stretch', padding: 10 },
  productTitle: { textAlign: "left", fontSize: 16, fontWeight: 'bold', color: theme.cardTitle, textTransform: 'capitalize', },
  productPrice: { textAlign: "left", fontSize: 14, fontWeight: 'bold', color: theme.cardPrice },
  productQuantity: { textAlign: "left", fontSize: 12, fontWeight: 'bold', color: theme.cardPrice },
  productTime: { textAlign: "left", fontSize: 12, fontWeight: 'bold', color: theme.cardPrice },
  addIconContainer: { position: "absolute", bottom: 16, right: 16 },
});

export default ProductCard;
