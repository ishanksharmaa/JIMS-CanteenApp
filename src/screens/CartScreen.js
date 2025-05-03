import React, { useContext, useCallback } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import CartItem from "../components/CartItem";
import { useTheme } from "../components/ThemeContext";
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackBtn from "../components/BackBtn";
import CustomButton from "../components/CustomButton";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useUser } from "../components/UserContext";
import { useCart } from "../components/CartContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useEffect } from "react";

export const HeaderBackIcon = ({ title }) => {
    // const { cartItems } = useCart();  // ✅ Cart Items Receive
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);

    return (
        <View style={styles.header}>
            <BackBtn position='absolute' left={16} top={70} />
            <Text style={styles.title}>{title}</Text>
        </View>
    );
};

const CartScreen = () => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);
    const navigation = useNavigation();
    const { refreshUser, user } = useUser();
    const { cartItems, fetchCart, totalAmount } = useCart();

    useEffect(() => {
        fetchCart();
    }, []);


    return (
        <View style={styles.container}>
            <HeaderBackIcon title={cartItems.length == 0 ? "Cart" : `Cart (${cartItems.length})`} />
            {
                user ? (
                    <Ionicons name="add" size={29} color={"transparent"} style={styles.addIcon} />
                ) : (
                    <TouchableOpacity style={styles.saveButton} onPress={() => navigation.navigate("Login")} activeOpacity={0.8}>
                        <Text style={styles.saveButtonText}>{user ? "Save" : "Sign In"}</Text>
                    </TouchableOpacity>
                )
            }



            {/* <View style={[{ flex: 1 }, cartItems.length === 0 && { justifyContent: "center" }]}> */}

            {
                !user ? (
                    <Text style={{ textAlign: "center", marginTop: "70%", fontSize: 18, fontWeight: "600", color: theme.text }}>
                        Please <Text onPress={() => navigation.navigate("Login")} style={{ fontWeight: "700", color: theme.primaryColor }}>SignIn</Text> to add items in the cart!
                    </Text>

                ) : cartItems.length === 0 ? (
                    <Text style={{ textAlign: "center", marginTop: "70%", fontSize: 18, color: "gray" }}>
                        Cart is empty
                    </Text>
                ) : (
                    <View style={styles.flatListContainer}>
                        <FlatList
                            data={cartItems}
                            keyExtractor={(item) => item.title}
                            renderItem={({ item }) => (
                                <CartItem
                                    image={item.image}
                                    title={item.title}
                                    price={item.price}
                                    descr={item.description}
                                    quantity={item.quantity}
                                    qty={item.qty}
                                />
                            )}
                            contentContainerStyle={{ paddingBottom: 50 }}
                        />
                    </View>
                )
            }

            {/* </View> */}

            {user && (
                <View style={styles.orderBtn}>
                    <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                        <MaterialIcons name="call-split" size={29} color={theme.customButtonBg} />
                    </TouchableOpacity>
                    <View style={styles.buttonContainer}>
                        <CustomButton btnColor={theme.customButtonBg} textColor={theme.customButtonText} title={`Order for ₹${totalAmount}`} onPress={() => alert("Order placed! (Functionality coming soon)")} />
                    </View>
                </View>
            )}

        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: { backgroundColor: theme.background, height: '100%' },
    header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12, backgroundColor: '', },
    addIcon: { position: 'absolute', top: '8%', right: '5.7%' },
    title: { fontWeight: "bold", fontSize: 30, alignSelf: "center", marginTop: '16%', marginBottom: 20, color: theme.text },
    flatListContainer: {
        height: '75%',
        paddingHorizontal: 5,
    },
    orderBtn: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        width: '100%', // Yeh ensure karega ki dono buttons achhe se dikhein
        alignSelf: 'center', // Center mein maintain karega
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 30, // Vertical padding thoda aur acha lagne ke liye
        paddingBottom: 20,
        zIndex: 10,
        // backgroundColor: theme.background,
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

    saveButton: {
        // marginTop: 20,
        // position: 'absolute',
        // top: 40,
        // right: 22,
        backgroundColor: theme.primaryColor,
        padding: 10,
        borderRadius: 30,
        width: "20%",
        alignItems: "center",
        position: 'absolute',
        top: "8%",
        right: '5.7%',
    },
    saveButtonText: {
        color: "white",
        fontSize: 13,
        fontWeight: "bold",
    },
});

export default CartScreen;
