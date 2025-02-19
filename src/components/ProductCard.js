import React, { useContext } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import FontAwesome from 'react-native-vector-icons/FontAwesome6';
import { useNavigation } from "@react-navigation/native"; 
import { CartContext } from "../components/CartContext";  // ✅ Cart Data ke liye

const ProductCard = ({ image, title, price, onAddtoCart }) => {
  const navigation = useNavigation(); 
  const { addToCart } = useContext(CartContext);  // ✅ CartScreen ke liye function

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

      {/* ✅ Add to Cart Button (Jo Bhi Item Click Hoga, CartScreen me Data Chala Jayega) */}
      <TouchableOpacity 
        style={styles.addIconContainer} 
        onPress={(event) => {
          event.stopPropagation();  // ✅ Prevent Click on Whole Card
          onAddtoCart(title, "Added to cart");  // ✅ Toast Show Hoga
          addToCart({ image, title, price });   // ✅ CartScreen ko Data Jayega
        }}
      >
        <FontAwesome name="circle-plus" size={45} color="green" />
      </TouchableOpacity>
    </TouchableOpacity>
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
