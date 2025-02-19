import React from "react";
import { Text, View, FlatList } from "react-native";
import ProductCard from "../components/ProductCard";
import CartItem from "../components/CartItem";

const CartScreen = ({ route }) => {
    const cartItems = route.params?.cartItems || []; // ✅ Get Cart Data

    return (
        <View>
            <Text style={{ fontWeight: "bold", fontSize: 30, alignSelf: "center", marginTop: '16%', marginBottom: 20 }}>
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
