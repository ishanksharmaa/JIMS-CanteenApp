import React, { useContext, useCallback } from "react";
import { Text, View, FlatList, TouchableOpacity } from "react-native";
import CartItem from "../components/CartItem";
import { useCart } from "../components/CartContext";  // ✅ Context se Data Fetch karenge
import { useTheme } from "../components/ThemeContext";
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackBtn from "../components/BackBtn";
import CustomButton from "../components/CustomButton";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useUser } from "../components/UserContext";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';

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
    const { cartItems } = useCart();  // ✅ Cart Items Receive
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);
    const { userEmail, setUserEmail, username, setUsername, name, setName, dob, setDob, location, setLocation, refreshUser, user, addedToCart } = useUser();

    useFocusEffect(
        useCallback(() => {
            refreshUser();
            // fetchProducts(setProductItems);

            // const unsubscribe = auth().onAuthStateChanged((user) => {
            //     if (user) {
            //         setUserEmail(user.email);  // saved at global state (passed to UserContext.js)
            //         setUsername(user.username || "User");
            //         setName(user.name || "Guest");
            //         setDob(user.dob);
            //         setLocation(user.location || "location");
            //     }
            // });

            // return () => unsubscribe(); // Cleanup function to avoid memory leaks
        }, [])
    );

    return (
        <View style={styles.container}>
            <HeaderBackIcon title="Cart" />
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
                            id={item.id}
                            image={item.image}
                            title={item.title}
                            price={item.price}
                        />
                    }
                />
            )}

            <View style={styles.orderBtn}>
                <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
                    <MaterialIcons name="call-split" size={29} color={theme.customButtonBg} />
                </TouchableOpacity>
                <View style={styles.buttonContainer}>
                    <CustomButton btnColor={theme.customButtonBg} textColor={theme.customButtonText} title="Order Now" onPress={null} />
                </View>
            </View>

        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: { backgroundColor: theme.background, height: '100%' },
    header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12, backgroundColor: '', },
    addIcon: { position: 'absolute', top: '8%', right: '5.7%' },
    title: { fontWeight: "bold", fontSize: 30, alignSelf: "center", marginTop: '16%', marginBottom: 20, color: theme.text },
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

export default CartScreen;
