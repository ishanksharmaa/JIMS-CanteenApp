import React, {useState} from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useTheme } from "./ThemeContext";
import { useCart } from "./CartContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CartItem = ({ image, title, price }) => {
  const { theme } = useTheme();
  const styles = dynamicTheme(theme);
  const { removeFromCart } = useCart();
  const [count, setCount] = useState(1); // Default count 1

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
          {/* <Text style={styles.price}>{'₹ ' + price}</Text> */}
          <Text style={styles.totalAmount}>{`Total: ${price} X ${count} = ₹ ` + price * count}</Text>
        </View>

         <View style={styles.countHandler}>
                  <TouchableOpacity activeOpacity={1} onPress={() => setCount((prev) => (prev = prev + 1))}>
                    <FontAwesome name="caret-up" size={32} color={theme.customButtonBg}/>
                    {/* <FontAwesome name="plus" size={32} color={theme.customButtonBg}/> */}
                  </TouchableOpacity>
        
                  <Text style={{ fontSize: 14, fontWeight: 'bold', textAlign: 'center', color: theme.text }}>{count}</Text>
        
                  <TouchableOpacity activeOpacity={1} onPress={() => setCount((prev) => (prev > 1 ? prev - 1 : 1))}>
                    <FontAwesome name="caret-down" size={32} color={"grey"}/>
                    {/* <FontAwesome name="minus" size={32} color={theme.customButtonBg}/> */}
                  </TouchableOpacity>
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
    color: "#aaa",
  },
  totalAmount: {
    fontSize: 14,
    paddingTop: 2,
    color: "#aaa",
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
  countHandler: { backgroundColor: '', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '50%', position: 'absolute', right: '5%', top: 6.5 },

});

export default CartItem;
