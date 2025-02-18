import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome6';

const ProductCard = ({ image, title, price }) => {
  return (
    <View style={styles.productCard}>
      <Image source={image} style={styles.productImage} />
      <View style={styles.textContainer}>
        <Text style={styles.productTitle}>{title}</Text>
        <Text style={styles.productPrice}>{price}</Text>
      </View>
      <TouchableOpacity style={styles.addIconContainer}>
        <FontAwesome name="circle-plus" size={28} color="black" style={{ color: 'green', fontSize: 45 }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 0,
    width: 200,
    height: 220,
    marginRight: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    alignItems: "center", // Saara content center align
  },
  productImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  textContainer: {
    backgroundColor: '',
    flexGrow: 0,  // Ye ensure karega ki text space le aur icon hamesha neeche ho
    justifyContent: 'space-between', // Text upar rahe, icon bottom pe
    alignSelf: 'stretch',
    padding: 10,
  },
  productTitle: {
    textAlign: "left",
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1, // Agar text bada ho to wrap ho jaye
  },
  productPrice: {
    textAlign: "left",
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
  },
  addIconContainer: {
    position: "absolute",
    bottom: 16, // Icon ko hamesha neeche rakhne ke liye
    right: 16,  // Right side pe adjust karne ke liye
  }
});

export default ProductCard;
