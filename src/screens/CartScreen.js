import React, { useContext } from "react";
import { Text, View, FlatList } from "react-native";
import CartItem from "../components/CartItem";
import { useCart } from "../components/CartContext";  // ✅ Context se Data Fetch karenge
import { useTheme } from "../components/ThemeContext";
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const CartScreen = () => {
    const { cartItems } = useCart();  // ✅ Cart Items Receive
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>
                    Cart
                </Text>
            </View>
            <Ionicons name="add" size={29} color={theme.text} style={styles.addIcon} />

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

const dynamicTheme = (theme) => ({
    container: { backgroundColor: theme.background, height: '100%' },
    header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12, backgroundColor: '', },
    addIcon: { position: 'absolute', top: '9%', right: '6%' },
    title: { fontWeight: "bold", fontSize: 30, alignSelf: "center", marginTop: '16%', marginBottom: 20, color: theme.text },
});

export default CartScreen;
