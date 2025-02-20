import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from "@react-navigation/native"; 

const ProductCard = ({ image, title, price, onAddtoCart }) => {
  const navigation = useNavigation(); 

  return (
    <TouchableOpacity 
      style={styles.productCard} 
      onPress={() => navigation.navigate("ProductDetail", { image, title, price })}
    >
      <Image source={image} style={styles.productImage} />
      <View style={styles.textContainer}>
        <Text style={styles.productTitle}>{title}</Text>
        <Text style={styles.productPrice}>{price}</Text>
      </View>

      {/* ✅ Add to Cart Button */}
      <TouchableOpacity 
        style={styles.addIconContainer} 
        onPress={() => onAddtoCart(title, "Added to cart")}
      >
        <FontAwesome name="circle-plus" size={45} color="green" />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  productCard: { 
    backgroundColor: '#fff', 
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
  productTitle: { textAlign: "left", fontSize: 16, fontWeight: 'bold', color: '#333' },
  productPrice: { textAlign: "left", fontSize: 14, fontWeight: 'bold', color: '#666' },
  addIconContainer: { position: "absolute", bottom: 16, right: 16 }
});

export default ProductCard;
