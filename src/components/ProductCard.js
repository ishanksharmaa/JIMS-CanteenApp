import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome6';

const ProductCard = ({ image, title, price, onAddtoCart }) => {
  return (
    <View style={styles.productCard}>
      <Image source={image} style={styles.productImage} />
      <View style={styles.textContainer}>
        <Text style={styles.productTitle}>{title}</Text>
        <Text style={styles.productPrice}>{price}</Text>
      </View>

      {/* ✅ Call addToCart function on Press */}
      <TouchableOpacity style={styles.addIconContainer} onPress={() => onAddtoCart(title, "Added to cart")}>
        <FontAwesome name="circle-plus" size={45} color="green" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  productCard: { backgroundColor: '#fff', borderRadius: 10, width: 200, height: 220, marginRight: 20, alignItems: "center" },
  productImage: { width: '100%', height: 110, borderRadius: 10 },
  textContainer: { flexGrow: 0, justifyContent: 'space-between', alignSelf: 'stretch', padding: 10 },
  productTitle: { textAlign: "left", fontSize: 16, fontWeight: 'bold', color: '#333' },
  productPrice: { textAlign: "left", fontSize: 14, fontWeight: 'bold', color: '#666' },
  addIconContainer: { position: "absolute", bottom: 16, right: 16 }
});

export default ProductCard;
