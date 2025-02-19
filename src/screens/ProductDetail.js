import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useRoute } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";

const ProductDetail = () => {
  const route = useRoute();
  const { image, title, price } = route.params; 

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.productImage} />
      <Text style={styles.productTitle}>{title}</Text>
      <Text style={styles.productPrice}>{price}</Text>
      <CustomButton title="Order Now" onPress={null} style={styles.orderBtn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "left", padding: 0, backgroundColor:'' },
  productImage: { width: '100%', height: 250, borderRadius: 10, marginBottom: 20, marginTop: 40 },
  productTitle: { fontSize: 22, fontWeight: "bold", color: "#333", marginLeft:20 },
  productPrice: { fontSize: 18, color: "#666", marginTop: 10, marginLeft:20 },
  orderBtn: {position:'absolute', bottom:10, right: 10},
});

export default ProductDetail;
