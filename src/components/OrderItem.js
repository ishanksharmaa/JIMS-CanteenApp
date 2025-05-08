import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { Swipeable } from "react-native-gesture-handler";
import { useTheme } from "./ThemeContext";
import { useUser } from "./UserContext";
import { useCart } from "./CartContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from "@react-navigation/native";


const OrderItem = ({ image, title, price, descr, quantity, qty, time, available, status, orderedAt }) => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme, status);
    const {user, userEmail} = useUser();
    const { removedFromCart, updateQuantity, formatOrderDate, fetchOrders } = useCart();
    const [count, setCount] = useState(qty); // Default count 1
    const swipeableRef = useRef(null);
    const navigation = useNavigation();

    useEffect(() => {
        console.log("Status changed to:", status);
        // fetchOrders(userEmail);
    }, [status]);

    const handleSwipeOpen = () => {
        setTimeout(() => {
            swipeableRef.current?.close();
        }, 2300); // 100ms baad close
    };

    const renderRightActions = () => (
        <TouchableOpacity style={styles.deleteBtn} onPress={() => removedFromCart?.(title)}>
            {/* <Ionicons name="trash-bin" size={24} color="#fff" style={{ marginBottom: 5 }} /> */}
            <Text style={styles.actionText}>Remove</Text>
        </TouchableOpacity>
    );

    const renderLeftActions = () => (
        <TouchableOpacity style={styles.holdBtn}>
            {/* <Ionicons name="ban" size={24} color="#fff" style={{ marginBottom: 5 }} /> */}
            <Text style={styles.actionText}>Hold</Text>
        </TouchableOpacity>
    );

    return (
        // <Swipeable
        //     ref={swipeableRef}
        //     renderLeftActions={renderLeftActions} renderRightActions={renderRightActions}
        //     friction={2.3}
        //     overshootRight={false}
        //     overshootLeft={true}
        //     rightThreshold={100}
        //     leftThreshold={100}
        //     onSwipeableWillOpen={handleSwipeOpen}
        // >
        <View style={styles.orderItem}>
            <TouchableOpacity
                onPress={() => navigation.navigate("ProductScreen", { image, title, price, descr, quantity, qty: 1, amount: price, time, available })}
                activeOpacity={0.8} >
                {image ? (
                    <Image
                        source={typeof image === 'string' ? { uri: image } : image}
                        style={styles.image}
                        onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
                        resizeMode="cover"
                    />
                ) : (
                    <View style={[styles.image, { backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
                        <Ionicons name="image-outline" size={30} color="#ccc" />
                    </View>
                )}
            </TouchableOpacity>
                <Text style={[styles.descr, {position: 'absolute', right: 12, top: 8, textTransform: 'capitalize'}]}>{status ? "Ready" : "Pending..."}</Text>
            <View>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.descr}>{descr}</Text>
                {/* <Text style={styles.price}>{'₹ ' + price}</Text> */}
                <Text style={styles.billAmount}>{`Total: ₹${price} X ${count} = ₹ ` + price * count}</Text>
                <Text style={styles.orderedAt}>{formatOrderDate(orderedAt)}</Text>
            </View>
        </View>
        // </Swipeable>
    );
};

const dynamicTheme = (theme, status) => {
    const lightPrimaryColor = status ? `${"#19860D"}24` : `${"#C40233"}24`; // Adds 20% opacity (hex 33)

    return {
        orderItem: {
            flexDirection: "row",
            alignItems: "center",
            paddingVertical: 20,
            paddingHorizontal: 20,
            marginVertical: 8,
            borderRadius: 12,
            margin: 20,
            borderWidth: 1,
            // elevation: 3,
            shadowColor: theme.primaryColor,
            backgroundColor: lightPrimaryColor,
            borderColor: status ? "#19860D" : "#C40233",
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
            color: theme.primaryColor,
            color: theme.text,
            textTransform: 'capitalize',
        },
        descr: {
            fontSize: 12,
            fontWeight: 400,
            color: theme.text,
        },
        orderedAt: {
            fontSize: 12,
            fontWeight: 400,
            color: theme.text,
        },
        price: {
            fontSize: 14,
            color: "#aaa",
        },
        billAmount: {
            fontSize: 14,
            paddingTop: 2,
            color: theme.primaryColor,
            color: theme.text,
        },
        deleteBtn: {
            backgroundColor: "#FF3B30", // iOS delete red
            justifyContent: "center",
            alignItems: "center",
            alignSelf: 'center',
            width: 100,
            height: 80,
            borderRadius: 15,
            marginRight: 10,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 6,
        },
        holdBtn: {
            backgroundColor: "#8E8E93", // iOS-style gray
            justifyContent: "center",
            alignItems: "center",
            alignSelf: 'center',
            width: 100,
            height: 80,
            marginLeft: 10,
            borderRadius: 15,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 6,
        },
        actionText: {
            color: "white",
            fontSize: 16,
            fontWeight: "bold",
        },
        countHandler: { backgroundColor: '', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', height: '50%', position: 'absolute', right: '5%', top: 6.5 },
    }
};

export default OrderItem;
