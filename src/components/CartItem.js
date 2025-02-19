import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const CartItem = ({ image, title, price }) => {
  return (
    <View style={styles.cartItem}>
      <Image source={image} style={styles.image} />
      <View>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.price}>{price}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    marginVertical: 5,
    borderRadius: 20,
    margin: 20,
    elevation: 3,
  },
  image: {
    width: 90,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  price: {
    fontSize: 14,
    color: "gray",
  },
});

export default CartItem;
