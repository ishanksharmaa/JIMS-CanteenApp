import React, { useContext } from "react";
import { Text, View, FlatList } from "react-native";
import CartItem from "../components/CartItem";
import { CartContext } from "../components/CartContext";  // ✅ Context se Data Fetch karenge
import { useTheme } from "../components/ThemeContext";

const CartScreen = () => {
    const { cartItems } = useContext(CartContext);  // ✅ Cart Items Receive
    const { theme } = useTheme();

    return (
        <View style={{backgroundColor: theme.background, height: '100%'}}>
            <Text style={{ fontWeight: "bold", fontSize: 30, alignSelf: "center", marginTop: '16%', marginBottom: 20, color: theme.text }}>
                Cart
            </Text>

            {cartItems.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20, fontSize: 16, color: "gray" }}>
                    Cart is empty
                </Text>
            ) : (
                <FlatList 
                    data={cartItems}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) =>
                        <CartItem 
                            image={item.image} 
                            title={item.title} 
                            price={item.price} 
                        />
                    }
                />
            )}
        </View>
    );
};

export default CartScreen;
