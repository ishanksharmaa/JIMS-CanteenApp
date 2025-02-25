import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useRoute } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { useTheme } from "../components/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";

const ProductScreen = () => {
  const route = useRoute();
  const { image, title, price } = route.params;
  const { theme } = useTheme();
  const styles = dynamicTheme(theme);

  return (
    <View style={styles.container}>
      <Image source={image} style={styles.productImage} />
      <Text style={styles.productTitle}>{title}</Text>
      <Text style={styles.productPrice}>{price}</Text>
      <View style={styles.orderBtn}>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="bag" size={29} color= {theme.cartBagBtnIcon} />
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
          <CustomButton btnColor={theme.customButtonBg} textColor="#ddd" title="Order Now" onPress={null} />
        </View>
      </View>
    </View>
  );
};

const dynamicTheme = (theme) => ({
  container: { flex: 1, alignItems: "left", padding: 0, backgroundColor: theme.background },
  productImage: { width: '100%', height: 250, borderRadius: 10, marginBottom: 20, marginTop: 40 },
  productTitle: { fontSize: 22, fontWeight: "bold", color: theme.text, marginLeft: 20 },
  productPrice: { fontSize: 18, color: theme.cardPrice, marginTop: 10, marginLeft: 20, fontWeight:'bold' },
  orderBtn: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    width: '100%', // Yeh ensure karega ki dono buttons achhe se dikhein
    alignSelf: 'center', // Center mein maintain karega
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 30, // Vertical padding thoda aur acha lagne ke liye
    backgroundColor: 'transparent', // Red hata diya taki design clean lage
  },
  iconButton: {
    backgroundColor: theme.cartBagBtn,
    padding: 15,
    borderRadius: 18,
    elevation: 5,
  },
  buttonContainer: {
    flex: 1,
    marginLeft: 10,
  },
});

export default ProductScreen;
