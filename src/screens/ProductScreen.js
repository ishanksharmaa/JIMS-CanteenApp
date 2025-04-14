import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { useTheme } from "../components/ThemeContext";
import { useCart } from "../components/CartContext";
// import {handleAddtoCart} from "../components/ProductCard";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ProductScreen = () => {
  const route = useRoute();
  const { image, title, price, descr, quantity, qty, amount } = route.params;
  const { theme } = useTheme();
  const { addedToCart, toggleFavoriteItem, isFavorite } = useCart();
  const styles = dynamicTheme(theme);
  const navigation = useNavigation();
  const [count, setCount] = useState(1); // Default count 1


  const handleAddtoCart = () => {
    const product = { image, title, price, quantity, qty, amount }
    addedToCart(product);
  };


  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.6} >
        <Ionicons name="chevron-back" size={24} color={theme.text} />
      </TouchableOpacity>

      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.shareBtn} onPress={() => navigation.goBack()} activeOpacity={0.6} >
          <Ionicons name="share-outline" size={24} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.favBtn} onPress={() => toggleFavoriteItem(title)} activeOpacity={0.6} >
          <Ionicons name={isFavorite(title) ? "heart" : "heart-outline"} size={24} color={isFavorite(title) ? theme.customButtonBg : theme.text} />
        </TouchableOpacity>
      </View>
      <Image source={image} style={styles.productImage} />

      <View style={styles.bigContainer}>

        <Text style={styles.productTitle}>{title}</Text>
        <Text style={styles.productPrice}>{'₹' + price}</Text>
        <Text style={styles.productQuantity}>{'Qty: ' + quantity}</Text>

        <View style={styles.countHandler}>
          <TouchableOpacity activeOpacity={1} onPress={() => setCount((prev) => (prev > 1 ? prev - 1 : 1))}>
            <Ionicons name="remove-circle" size={58} color={"grey"} />
          </TouchableOpacity>

          <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: theme.text }}>{count}</Text>

          <TouchableOpacity activeOpacity={1} onPress={() => setCount((prev) => (prev = prev + 1))}>
            <Ionicons name="add-circle" size={58} color={theme.customButtonBg} />
          </TouchableOpacity>
        </View>

        <View style={styles.descContainer}>
          <Text style={styles.descTitle}>description: { }</Text>
          <ScrollView>
            <Text style={styles.descContent}>{descr || "Info not provided..."}</Text>
            {/* <Text style={styles.descContent}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text> */}
          </ScrollView>

        </View>

        <View style={styles.moreInfoContainer}>

          <View style={styles.productInfoCard}>
            <Text style={{ fontSize: 18, textAlign: 'center', color: theme.text }}>4.5 ⭐</Text>
            <Text style={styles.infoTitle}>Ratings</Text>
          </View>
          <View style={styles.productInfoCard}>
            <Ionicons name="time-outline" size={28} color={theme.text} />
            <Text style={styles.infoTitle}>Pickup Time</Text>
          </View>
          <View style={styles.productInfoCard}>
            <Ionicons name="checkmark-circle-outline" size={28} color={theme.text} />
            <Text style={styles.infoTitle}>Availability</Text>
          </View>

        </View>


        <View style={styles.orderBtn}>
          <TouchableOpacity style={styles.iconButton} onPress={handleAddtoCart} activeOpacity={0.7}>
            <Ionicons name="bag" size={29} color={theme.customButtonBg} />
          </TouchableOpacity>
          <View style={styles.buttonContainer}>
            <CustomButton btnColor={theme.customButtonBg} textColor={theme.customButtonText} title={`Order for ₹${parseFloat(price) * count}`} onPress={null} />
          </View>
        </View>
      </View>
    </View>
  );
};

const dynamicTheme = (theme) => ({
  container: { flex: 1, alignItems: "", padding: 0, backgroundColor: theme.background },
  bigContainer: { flex: 1, borderTopLeftRadius: '6%', borderTopRightRadius: '6%', backgroundColor: theme.background, paddingTop: 14 },
  headerIcons: { flexDirection: 'row', width: '23%', justifyContent: 'space-between', position: 'absolute', right: 20, top: 55, zIndex: 10 },

  backBtn: { padding: 7, borderRadius: 20, backgroundColor: theme.backBtnBg, position: 'absolute', left: 15, top: 55, zIndex: 10 },
  shareBtn: { padding: 7, borderRadius: 20, backgroundColor: theme.backBtnBg },
  favBtn: { padding: 7, borderRadius: 20, backgroundColor: theme.backBtnBg },

  productImage: { width: '100%', height: 250, borderRadius: 10, marginBottom: 0, marginTop: 40 },
  productTitle: { fontSize: 24, fontWeight: "bold", color: theme.text, marginLeft: 20, width: '50%', backgroundColor: 'transparent', textTransform: 'capitalize' },
  productPrice: { fontSize: 22.5, color: theme.cardPrice, marginTop: 10, marginLeft: 20, fontWeight: 'bold' },
  productQuantity: { fontSize: 14, color: theme.cardPrice, marginTop: 10, marginLeft: 20, fontWeight: 'bold' },

  countHandler: { backgroundColor: '', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '36%', position: 'absolute', right: '5%', top: '6.5%' },

  descContainer: { alignItems: 'left', backgroundColor: 'transparent', maxHeight: '22%', margin: 20, overflow: 'hidden' },
  descTitle: { fontWeight: 'bold', textTransform: 'capitalize', paddingBottom: 5, color: theme.text },
  descContent: { textAlign: 'left', color: theme.text },

  moreInfoContainer: { backgroundColor: '', width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, paddingHorizontal: 10 },
  productInfoCard: {
    // backgroundColor: '#eee',
    backgroundColor: theme.productInfoCard,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    height: 85,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow direction
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 2, // Shadow blur radius
    elevation: 2, // For Android shadow
  },
  infoTitle: { color: 'grey' },


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
    marginLeft: 8,
  },
});

export default ProductScreen;
