import React, { useState, useEffect, useCallback, useRef } from "react";
import { Text, View, Image, StyleSheet, FlatList, StatusBar, TouchableOpacity, ScrollView, Pressable } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    withTiming, runOnJS, interpolate
} from 'react-native-reanimated';

import SearchBar from "../components/SearchBar";
import SideNav from "../components/SideNav";
import { useUser } from "../components/UserContext";
import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase Import
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { collection, query, where, getDocs } from "firebase/firestore";


import { TextInput, PanGestureHandler } from "react-native-gesture-handler";
import { useNavigation, useFocusEffect, StackActions, CommonActions } from "@react-navigation/native";
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
    { id: '8', title: 'Pan Cakes', image: { uri: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2' } },
    // { id: '8', title: 'Steak', image: { uri: 'https://images.pexels.com/photos/616354/pexels-photo-616354.jpeg' } },
    { id: '9', title: 'Tacos', image: { uri: 'https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg' } },
    { id: '10', title: 'Noodles', image: { uri: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg' } },
];

// const showToast = (productName, msg) => {
//     Toast.show({
//         type: 'success',
//         text1: productName,
//         text2: msg,
//         position: 'top',
//         visibilityTime: 4000,
//         autoHide: true,
//         topOffset: 50,
//     });
// };

const HomeScreen = () => {
    const [text, setText] = useState('');
    const [productItems, setProductItems] = useState([]);
    const navigation = useNavigation();
    const { theme, toggleTheme } = useTheme();
    const styles = dynamicTheme(theme);
    const { isMemeCatsEnabled } = useMemeCat();
    const [sideNavVisible, setSideNavVisible] = useState(false);
    // const scaleAnim = useRef(new Animated.Value(1)).current;
    // const translateXAnim = useRef(new Animated.Value(0)).current;
    const translateX = useSharedValue(0); // For translateX animation
    const translateXnav = useSharedValue(0); // For translateX sideNav animation
    const scale = useSharedValue(1); // For scale animation
    const { userEmail, setUserEmail, username, setUsername, name, setName, dob, setDob, location, setLocation, refreshUser, user, addedToCart } = useUser();

    const borderHome = 36;
    const scaleHomeXY = 0.71;
    const slideHomeX = 250;
    const rotateHomeX = 10;

    useFocusEffect(
        useCallback(() => {
            refreshUser();
            fetchProducts(setProductItems);
        }, [])
    );


    // const toggleSideNav = (slideHomeX) => {
    //     if (translateX.value > 0) {
    //         translateX.value = withTiming(0);
    //         setSideNavVisible(false);
    //     } else {
    //         translateX.value = withTiming(slideHomeX);
    //         setSideNavVisible(true);
    //     }
    // };
    const toggleSideNav = () => {
        const open = !sideNavVisible;
        setSideNavVisible(open);
        translateX.value = withTiming(open ? slideHomeX : 0, { duration: 300 });
    };



    const combinedGestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx) => {
            ctx.startX = translateX.value;
            ctx.startXnav = translateXnav.value;
        },
        onActive: (event, ctx) => {
            // Update both values independently
            const nextVal = ctx.startX + event.translationX;
            translateX.value = Math.min(Math.max(nextVal, 0), slideHomeX);

            const nextValNav = ctx.startXnav + event.translationX;
            translateXnav.value = Math.min(Math.max(nextValNav, 0), slideHomeX);
        },
        onEnd: () => {
            // Handle the end of gesture and snap both to the max values
            if (translateX.value < 150) {
                translateX.value = withTiming(0);
                runOnJS(setSideNavVisible)(false);
            } else {
                translateX.value = withTiming(slideHomeX);
                runOnJS(setSideNavVisible)(true);
            }

            if (translateXnav.value < 150) {
                translateXnav.value = withTiming(0, { duration: 300 });
            } else {
                translateXnav.value = withTiming(slideHomeX, { duration: 300 });
            }
        },
    });


    // React.useEffect(() => {
    //     translateX.value = withTiming(sideNavVisible ? slideHomeX : 0, { duration: 300 });
    //     translateXnav.value = withTiming(sideNavVisible ? slideHomeX : 0, { duration: 300 });
    //     scale.value = withTiming(sideNavVisible ? scaleHomeXY : 1, { duration: 300 });
    // }, [sideNavVisible]);

    // Merged animated styles for the main content
    const animatedStyle = useAnimatedStyle(() => {
        const clampedX = Math.min(Math.max(translateX.value, 0), slideHomeX);

        // Interpolating scale based on the translateX value
        const scaled = interpolate(clampedX, [0, slideHomeX], [1, scaleHomeXY]);

        // Rotate Y based on translateX
        const rotateY = interpolate(clampedX, [0, slideHomeX], [0, rotateHomeX]);

        return {
            transform: [
                { translateX: clampedX },
                { scale: scaled },
                { perspective: 1000 },
                { rotateY: `${rotateY}deg` },
            ],
            borderRadius: clampedX > 0 ? borderHome : 0,
        };
    });
    const animatedStyle1 = useAnimatedStyle(() => {
        const clampedX = Math.min(Math.max(translateX.value, 0), slideHomeX);
        const scaled = interpolate(clampedX, [0, slideHomeX], [1, scaleHomeXY * 0.87]);
        // const rotateY = interpolate(clampedX, [0, slideHomeX], [0, rotateHomeX * 0.9]);

        return {
            transform: [
                { translateX: clampedX * 0.72 },
                { scale: scaled },
                // { perspective: 1000 },
                // { rotateY: `${rotateY}deg` },
            ],
            borderRadius: clampedX > 0 ? borderHome * 0.9 : 0,
        };
    });

    const animatedStyle2 = useAnimatedStyle(() => {
        const clampedX = Math.min(Math.max(translateX.value, 0), slideHomeX);
        const scaled = interpolate(clampedX, [0, slideHomeX], [1, scaleHomeXY * 0.93]);
        // const rotateY = interpolate(clampedX, [0, slideHomeX], [0, rotateHomeX * 0.8]);

        return {
            transform: [
                { translateX: clampedX * 0.82 },
                { scale: scaled },
                // { perspective: 1000 },
                // { rotateY: `${rotateY}deg` },
            ],
            borderRadius: clampedX > 0 ? borderHome * 0.8 : 0,
        };
    });


    // SideNav animated style remains separate
    const sideNavAnimatedStyle = useAnimatedStyle(() => {
        const clampedX = Math.min(Math.max(translateX.value, 0), slideHomeX);
        return {
            transform: [
                { translateX: -slideHomeX + clampedX }, // Moves from left to right
            ],
        };
    });








    return (
        <View style={styles.container}>
            <PanGestureHandler
                // onGestureEvent={gestureHandler}
                onGestureEvent={combinedGestureHandler}
                enabled={sideNavVisible} // only detect when sidenav is open

            // onEnded={handleGestureEnd}
            >
                <Animated.View style={{ flex: 1 }}>
                    {/* <Animated.View style={[styles.backgroundScreen, { backgroundColor: 'red', transform: [{ translateX: -slideHomeX + translateX.value * 0.8 }] }, animatedStyle]} /> */}
                    {/* <Animated.View style={[styles.backgroundScreen, { backgroundColor: 'green', transform: [{ translateX: -slideHomeX + translateX.value * 0.6 }] }, animatedStyle]} /> */}
                    <Animated.View style={[styles.backgroundScreen, { backgroundColor: theme.background1 }, animatedStyle1]} />
                    <Animated.View style={[styles.backgroundScreen, { backgroundColor: theme.background2 }, animatedStyle2]} />

                    <Animated.View
                        style={[
                            styles.mainContent, animatedStyle
                            // {
                            //     transform: [
                            //         { scale: scaleAnim },
                            //         { translateX: translateXAnim },
                            //     ],
                            //     borderRadius: sideNavVisible ? 20 : 0,
                            // },
                        ]}
                    >
                        <MemeCat available={true} active={true} onTouch={() => console.log("Cat touched!")} isMemeCatsEnabled={isMemeCatsEnabled} />
                        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />


                        {/* <Animated.View style={[homeAnimatedStyle]}> */}
                        <View style={{ paddingHorizontal: 16, paddingBottom: 13, backgroundColor:'#bbb' }}>

                            <View style={styles.header}>
                                {/* Profile Section */}
                                <View style={styles.profileSection}>

                                    <TouchableOpacity
                                        onLongPress={() =>
                                            userEmail === "iishanksharma@gmail.com"
                                                ? navigation.navigate("ProductsList")
                                                : null
                                        }
                                        onPress={() => toggleSideNav(slideHomeX)}
                                        activeOpacity={0.7}
                                    >
                                        <Image
                                            // source={require("../../assets/swaggy_cat.jpg")}
                                            // source={require("../../assets/app_logo.jpeg")}
                                            source={theme.logo}
                                            style={styles.profileImage}
                                        />
                                    </TouchableOpacity>


                                    <TouchableOpacity style={styles.nameContainer} onPress={() => { (!user) ? navigation.navigate("GetStarted") : toggleSideNav(slideHomeX) }} activeOpacity={0.8}>
                                        <Text style={styles.profileName}>{user ? name || "Your Name" : "Sign In"}</Text>
                                        <Text style={{ fontSize: 12, color: theme.text }}>{user ? location || "location" : "or Register"}</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Header Icons */}
                                <View style={styles.headerIcons}>
                                    <TouchableOpacity style={styles.iconBg}>
                                        <Ionicons name="notifications-outline" size={23} color={theme.text} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => navigation.navigate("Cart")} style={styles.iconBg}>
                                        <Ionicons name="cart-outline" size={23} color={theme.text} />
                                    </TouchableOpacity>
                                </View> {/* headerIcons end */}
                            </View> {/* header end */}

                            {/* SEARCH BAR HERE */}
                            <TouchableOpacity style={styles.searchContainer} >
                                <SearchBar placeholder="Search food, menu..." onChange={setText} navigatePage="SearchPage" editable={false} />
                            </TouchableOpacity>

                        </View>

                        <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>

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
                                <FlatList style={{
                                    marginHorizontal: -10,
                                    paddingHorizontal: 9, flexGrow: 0
                                }}
                                    data={productItems}
                                    keyExtractor={(item) => item.id}
                                    horizontal={true}
                                    // numColumns={2}
                                    showsHorizontalScrollIndicator={false}
                                    renderItem={({ item }) => <ProductCard image={{ uri: item.image }} title={item.name} price={item.price} descr={item.description} quantity={item.quantity} qty={item.qty} amount={item.amount} time={item.time} available={item.available} size={0.94} gapV={5} gapH={7} />}
                                />
                            </View>
                        </ScrollView>

                        {/* </Animated.View> */}
                    </Animated.View>
                    <Animated.View style={[styles.sideNavAnimated, sideNavAnimatedStyle]}>
                        <SideNav isVisible={sideNavVisible} toggleVisibility={() => toggleSideNav(slideHomeX)} left={0} style={styles.fixedSideNav} />
                    </Animated.View>
                    {/* <SideNav isVisible={translateX.value > 0} toggleVisibility={toggleSideNav} left={0} style={styles.fixedSideNav} /> */}
                </Animated.View>

            </PanGestureHandler>

        </View> // container end
    );
};

const dynamicTheme = (theme) => ({
    container: {
        backgroundColor: theme.screenBg,
        flex: 1,
        justifyContent: 'flex-start',
        padding: 0,
    },
    backgroundScreen: {
        position: 'absolute', // Ensure the background screens are absolutely positioned behind the main content
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        // backgroundColor: 'rgba(0, 0, 0, 0.1)', // Adjust the background appearance
        // backgroundColor: 'red', // Adjust the background appearance
        zIndex: 1000, // Keeps the background behind the main content
    },
    mainContent: {
        flex: 1,
        backgroundColor: theme.background,
        position: 'relative',
        // backgroundColor: 'red',
        overflow: 'hidden',
        paddingBottom: 20,
        zIndex: 1001,
    },
    header: {
        marginTop: 40,
        flexDirection: 'row', // Ensures Profile and Icons are in the same row
        alignItems: 'center', // Vertically centers the content within the row
        justifyContent: 'space-between', // Space between profile and icons
        marginBottom: 4,
        backgroundColor: "",
        width: '100%',
        paddingLeft: 22.4,
        paddingTop: 14,
    },
    profileSection: {
        // backgroundColor: "red",
        marginLeft: -20,
        // paddingLeft: 12,
        width: '70%',
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
        // backgroundColor: 'red',
        flexDirection: 'row', // Arrange icons horizontally in the header
        alignItems: 'center', // Vertically center the icons
        marginRight: 0,
        height: '100%',
        width: '29%',
        paddingRight: 3,
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
        marginTop: 0,
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
        paddingLeft: 20
    },
    categoryItem: { alignItems: 'center', marginHorizontal: 10 },
    categoryImage: { width: 80, height: 80, borderRadius: 50 },
    categoryTitle: { marginTop: 5, fontSize: 14, fontWeight: 'bold', color: theme.text },

    productContainer: {
        backgroundColor: '',
        height: 'auto',
        paddingLeft: 20,
        paddingBottom: 210,
        // paddingBottom: 235,
    },
    iconBg: { backgroundColor: theme.iconBg, borderRadius: 50, borderWidth: 0, padding: 10, },

    fixedSideNav: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: 250, // Adjust the width of the side nav
        height: '100%',
        backgroundColor: theme.sideNavBackground,
        zIndex: 1000, // Ensures it stays on top of other content
        elevation: 1000, // For Android
    },
    sideNavAnimated: {
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        width: 250, // same as your toggle limit
        zIndex: 10,
    }
});

export default HomeScreen;
