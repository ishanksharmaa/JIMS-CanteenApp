import React, { useState } from "react";
import { Text, View, Image, StyleSheet, FlatList, StatusBar, TouchableOpacity } from "react-native";
import Toast from 'react-native-toast-message';
import { TextInput } from "react-native-gesture-handler";
import { useNavigation } from "@react-navigation/native";

// ICONS
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

// COMPONENTS
import { useTheme } from "../components/ThemeContext";
import ProductCard from '../components/ProductCard';


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

const productItems = [
    { id: '1', title: 'FarmFresh Cheese Pizza', image: { uri: 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg' }, price: '₹45' },
    { id: '2', title: 'Cheese Burger', image: { uri: 'https://images.pexels.com/photos/1639564/pexels-photo-1639564.jpeg' }, price: '₹40' },
    { id: '3', title: 'Creamy Pasta', image: { uri: 'https://images.pexels.com/photos/1437267/pexels-photo-1437267.jpeg' }, price: '₹30' },
    { id: '4', title: 'Fresh Salad', image: { uri: 'https://images.pexels.com/photos/1435904/pexels-photo-1435904.jpeg' }, price: '₹20' },
    { id: '5', title: 'Chocolate Lava Cake', image: { uri: 'https://images.pexels.com/photos/4110002/pexels-photo-4110002.jpeg' }, price: '₹65' },
    { id: '6', title: 'Cold Coffee', image: { uri: 'https://images.pexels.com/photos/302901/pexels-photo-302901.jpeg' }, price: '₹80' },
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
    const navigation = useNavigation();
    const { theme, toggleTheme } = useTheme();
    const styles = dynamicTheme(theme);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <View style={styles.header}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <TouchableOpacity onPress={() => navigation.navigate("Profile")} activeOpacity={0.7}>
                        <Image
                            source={require('../../assets/mayuri.jpg')} // Replace with your profile image path
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                    <View>
                        <Text style={styles.profileName}>Ishank Sharma</Text>
                        <Text style={{ fontSize: 12, color: theme.text }}>Room A202</Text>
                    </View>
                </View>

                {/* Header Icons */}
                <View style={styles.headerIcons}>
                    {/* <TouchableOpacity onPress={toggleTheme}>
                        <MaterialIcons name="dark-mode" size={28} color={theme.text} />
                    </TouchableOpacity> */}
                    <Ionicons name="notifications" size={28} color={theme.text} style={styles.bellIcon} />
                </View> {/* headerIcons end */}

            </View> {/* header end */}
            <View style={styles.searchContainer}>
                <TextInput style={styles.searchBar}
                    placeholder="Search food, menu"
                    placeholderTextColor={"grey"}
                    onChange={setText}
                />
            </View> {/* searchContainer end */}
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
                    renderItem={({ item }) => <ProductCard image={item.image} title={item.title} price={item.price} onAddtoCart={showToast} />}
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
        borderColor: 'orangered',
        borderWidth: 2,
        marginRight: 10, // Space between image and text
    },
    profileName: {
        fontSize: 15,
        fontWeight: '500',
        color: theme.text,
    },
    headerIcons: {
        backgroundColor: '',
        flexDirection: 'row', // Arrange icons horizontally in the header
        alignItems: 'center', // Vertically center the icons
        marginRight: 0,
        height: '100%',
        width: '25%',
        paddingHorizontal: 5,
        justifyContent: 'flex-end',
    },
    bellIcon: {
        marginLeft: 0, // Add space between the icons
    },
    trackIcon: {
        marginRight: 0, // Add space between the icons
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
});

export default HomeScreen;
