import React, { useState, useEffect, useCallback } from "react";
import { Text, View, Image, StyleSheet, FlatList, StatusBar, TouchableOpacity } from "react-native";
import SearchBar from "../components/SearchBar";
import { useUser } from "../components/UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase Import
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";



import Toast from 'react-native-toast-message';
import { TextInput } from "react-native-gesture-handler";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import MemeCat from "../components/MemeCat";
import { useMemeCat } from "../components/MemeCatContext";

// ICONS
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// COMPONENTS
import { useTheme } from "../components/ThemeContext";
import ProductCard from '../components/ProductCard';

const fetchProducts = async (setProductItems) => {
    try {

        const productPromise = firestore().collection("Products").get(); // Fetching products
        let productItems = [];

        const productSnapshot = await productPromise; // Awaiting the product data
        productSnapshot.forEach(doc => {
            productItems.push({ id: doc.id, ...doc.data() });
        });

        setProductItems(productItems);
    } catch (error) {
        console.error("Error fetching data:", error);
    }
};

const categories = [
    { id: '1', title: 'Fast Food', image: { uri: 'https://images.pexels.com/photos/1639564/pexels-photo-1639564.jpeg' } },
    { id: '2', title: 'Drinks', image: { uri: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg' } },
    { id: '3', title: 'Lunch', image: { uri: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg' } },
    { id: '4', title: 'Rice', image: { uri: 'https://images.pexels.com/photos/2271132/pexels-photo-2271132.jpeg' } },
    { id: '5', title: 'Dessert', image: { uri: 'https://images.pexels.com/photos/4110002/pexels-photo-4110002.jpeg' } },
    { id: '6', title: 'Quick Bites', image: { uri: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg' } },
    { id: '7', title: 'Sushi', image: { uri: 'https://images.pexels.com/photos/3026803/pexels-photo-3026803.jpeg' } },
    { id: '8', title: 'Steak', image: { uri: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg' } },
    { id: '9', title: 'Tacos', image: { uri: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg' } },
    { id: '10', title: 'Noodles', image: { uri: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg' } },
];

const showToast = (productName, msg) => {
    Toast.show({
        type: 'success',
        text1: productName,
        text2: msg,
        position: 'top',
        visibilityTime: 4000,
        autoHide: true,
        topOffset: 50,
    });
};

const HomeScreen = () => {
    const [text, setText] = useState('');
    const [productItems, setProductItems] = useState([]);
    const navigation = useNavigation();
    const { theme, toggleTheme } = useTheme();
    const styles = dynamicTheme(theme);
    const { isMemeCatsEnabled } = useMemeCat();
    const { userEmail, setUserEmail, username, setUsername, name, setName, dob, setDob, location, setLocation, refreshUser, user, addedToCart } = useUser();

    useFocusEffect(
        useCallback(() => {
            refreshUser();
            fetchProducts(setProductItems);

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
            <MemeCat available={true} active={true} onTouch={() => console.log("Cat touched!")} isMemeCatsEnabled={isMemeCatsEnabled} />

            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <View style={styles.header}>
                {/* Profile Section */}
                <View style={styles.profileSection}>

                    <TouchableOpacity
                        onPress={() =>
                            userEmail === "iishanksharma@gmail.com"
                                ? navigation.navigate("ProductsList")
                                : null
                        }
                        activeOpacity={0.7}
                    >
                        <Image
                            // source={require("../../assets/swaggy_cat.jpg")}
                            // source={require("../../assets/app_logo.jpeg")}
                            source={theme.logo}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>


                    <TouchableOpacity style={styles.nameContainer} onPress={() => { if (!user) navigation.navigate("GetStarted") }} activeOpacity={0.}>
                        <Text style={styles.profileName}>{user ? name || "Your Name" : "Sign In"}</Text>
                        <Text style={{ fontSize: 12, color: theme.text }}>{user ? location || "location" : "or Register"}</Text>
                    </TouchableOpacity>
                </View>

                {/* Header Icons */}
                <View style={styles.headerIcons}>
                    <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.iconBg}>
                        <Ionicons name="cart-outline" size={23} color={theme.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconBg}>
                        <Ionicons name="notifications-outline" size={23} color={theme.text} />
                    </TouchableOpacity>
                </View> {/* headerIcons end */}
            </View> {/* header end */}

            {/* SEARCH BAR HERE */}
            <View style={styles.searchContainer}>
                <SearchBar placeholder="Search food, menu..." onChange={setText} />
            </View>


            <View style={styles.categoryContainer}>
                <Text style={styles.heading}>Categories</Text>
                <FlatList style={{ marginHorizontal: -10, marginVertical: 0 }}
                    data={categories}
                    keyExtractor={(item) => item.id}
                    horizontal={true} // Enable horizontal scrolling
                    showsHorizontalScrollIndicator={false} // Hide scrollbar
                    renderItem={({ item }) => (
                        <View style={styles.categoryItem}>
                            <Image source={item.image} style={styles.categoryImage} />
                            <Text style={styles.categoryTitle}>{item.title}</Text>
                        </View>
                    )}
                />
            </View> {/* categoryContainer end */}
            <View style={styles.productContainer}>
                <Text style={styles.heading}>Recommended for you</Text>
                <FlatList style={{ marginHorizontal: -20, paddingHorizontal: 20 }}
                    data={productItems}
                    keyExtractor={(item) => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => <ProductCard image={{ uri: item.image }} title={item.name} price={item.price} descr={item.description} onAddtoCart={showToast} quantity={item.quantity} amount={item.amount} />}
                />
            </View>
        </View> // container end
    );
};

const dynamicTheme = (theme) => ({
    container: {
        backgroundColor: theme.background,
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
    },
    header: {
        marginTop: 40,
        flexDirection: 'row', // Ensures Profile and Icons are in the same row
        alignItems: 'center', // Vertically centers the content within the row
        justifyContent: 'space-between', // Space between profile and icons
        marginBottom: 0,
        backgroundColor: "",
        width: '100%',
    },
    profileSection: {
        backgroundColor: "",
        marginLeft: -10,
        flexDirection: 'row', // Horizontally align profile image and name
        alignItems: 'center', // Vertically align profile image and name
    },
    profileImage: {
        width: 58,  // Set the image width
        height: 58, // Set the image height
        borderRadius: 50, // Make it a circle
        borderColor: theme.text,
        borderWidth: 0.5,
        marginRight: 10, // Space between image and text
    },
    profileName: {
        fontSize: 15,
        fontWeight: '500',
        color: theme.text,
    },
    nameContainer: {},
    headerIcons: {
        backgroundColor: '',
        flexDirection: 'row', // Arrange icons horizontally in the header
        alignItems: 'center', // Vertically center the icons
        marginRight: 0,
        height: '100%',
        width: '28%',
        paddingHorizontal: 1,
        justifyContent: 'space-between',
        // justifyContent: 'flex-end',
    },
    searchBar: {
        backgroundColor: theme.searchBg,
        color: theme.searchText,
        height: 55,
        width: '96%',
        alignSelf: 'center',
        justifyContent: 'center',
        paddingHorizontal: '8%',
        borderRadius: 16,
        marginTop: 30,
    },
    heading: {
        backgroundColor: "",
        color: theme.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: '7%',
        marginHorizontal: 5,
    },
    categoryContainer: {
        backgroundColor: "",
        height: 'auto',
        marginTop: 0,
    },
    categoryItem: { alignItems: 'center', marginHorizontal: 10 },
    categoryImage: { width: 80, height: 80, borderRadius: 50 },
    categoryTitle: { marginTop: 5, fontSize: 14, fontWeight: 'bold', color: theme.text },

    productContainer: {
        backgroundColor: '',
        height: 'auto',
        paddingBottom: 20,
    },
    iconBg: { backgroundColor: theme.iconBg, borderRadius: 50, borderWidth: 0, padding: 10, },
});

export default HomeScreen;
