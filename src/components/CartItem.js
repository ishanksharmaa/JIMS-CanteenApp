import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useTheme } from "./ThemeContext";

const CartItem = ({ image, title, price }) => {
  const { theme } = useTheme();
  const styles = dynamicTheme(theme);

  const renderRightActions = () => (
    <TouchableOpacity style={styles.deleteBtn} onPress={() => removeFromCart(title)}>
      <Text style={styles.actionText}>Remove</Text>
    </TouchableOpacity>
  );

  const renderLeftActions = () => (
    <TouchableOpacity style={styles.holdBtn}>
      <Text style={styles.actionText}>Hold</Text>
    </TouchableOpacity>
  );

  return (
    <Swipeable
      renderLeftActions={renderLeftActions} renderRightActions={renderRightActions}
      friction={2}
      overshootRight={false}
      overshootLeft={true}
      rightThreshold={100}
      leftThreshold={100}

    >
      <View style={styles.cartItem}>
        <Image source={image} style={styles.image} />
        <View>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.price}>{price}</Text>
        </View>
      </View>
    </Swipeable>
  );
};

const dynamicTheme = (theme) => ({
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.cartItemBg,
    padding: 10,
    marginVertical: 8,
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
    color: theme.text,
  },
  price: {
    fontSize: 14,
    color: "gray",
  },
  deleteBtn: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: 'center',
    width: 100,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  holdBtn: {
    backgroundColor: "gray",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: 'center',
    width: 100,
    height: 80,
    marginLeft: 10,
    borderRadius: 10,
  },
  actionText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default CartItem;
