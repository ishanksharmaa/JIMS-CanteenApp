import React, { useState } from "react";
import { Text, View, Image, StyleSheet, FlatList, StatusBar } from "react-native";

import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { TextInput } from "react-native-gesture-handler";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ProductCard from '../components/ProductCard';


const categories = [
    { id: '1', title: 'Fast Food', image: require('../../assets/mayuri.jpg') },
    { id: '2', title: 'Drinks', image: require('../../assets/mayuri.jpg') },
    { id: '3', title: 'Lunch', image: require('../../assets/mayuri.jpg') },
    { id: '4', title: 'Rice', image: require('../../assets/mayuri.jpg') },
    { id: '5', title: 'Dessert', image: require('../../assets/mayuri.jpg') },
    { id: '6', title: 'Drinks', image: require('../../assets/mayuri.jpg') },
    { id: '7', title: 'Sushi', image: require('../../assets/mayuri.jpg') },
    { id: '8', title: 'Steak', image: require('../../assets/mayuri.jpg') },
    { id: '9', title: 'Tacos', image: require('../../assets/mayuri.jpg') },
    { id: '10', title: 'Noodles', image: require('../../assets/mayuri.jpg') },
];
const productItems = [
    { id: '1', title: 'FarmFresh Cheese Pizza ', image: require('../../assets/pepper.jpg'), price: '₹45' },
    { id: '2', title: 'Cheese Burger', image: require('../../assets/pepper.jpg'), price: '₹40' },
    { id: '3', title: 'Creamy Pasta', image: require('../../assets/pepper.jpg'), price: '₹30' },
    { id: '4', title: 'Fresh Salad', image: require('../../assets/pepper.jpg'), price: '₹20' },
    { id: '5', title: 'Chocolate Lava Cake', image: require('../../assets/pepper.jpg'), price: '₹65' },
    { id: '6', title: 'Cold Coffee', image: require('../../assets/pepper.jpg'), price: '₹80' },
];


const HomeScreen = () => {
    const [text, setText] = useState('');
    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
            <View style={styles.header}>
                {/* Profile Section */}
                <View style={styles.profileSection}>
                    <Image
                        source={require('../../assets/mayuri.jpg')} // Replace with your profile image path
                        style={styles.profileImage}
                    />
                    <View>
                        <Text style={styles.profileName}>Ishank Sharma</Text>
                        <Text style={{ fontSize: 12, }}>Room A202</Text>
                    </View>
                </View>

                {/* Header Icons */}
                <View style={styles.headerIcons}>
                    <MaterialIcons name="near-me" size={28} color="black" style={styles.trackIcon} />
                    <Ionicons
                        name="notifications"
                        size={28}
                        color="black"
                        style={styles.bellIcon}
                    />
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
                <FlatList style={{marginHorizontal: -10, marginVertical: 0}}
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
                renderItem={({ item }) => <ProductCard image={item.image} title={item.title} price={item.price} />}
            />
            </View>
        </View> // container end
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        padding: 20,
    },
    header: {
        marginTop: 30,
        flexDirection: 'row', // Ensures Profile and Icons are in the same row
        alignItems: 'center', // Vertically centers the content within the row
        justifyContent: 'space-between', // Space between profile and icons
        marginBottom: 0,
        backgroundColor: "",
        width: '100%',
    },
    profileSection: {
        backgroundColor: "",
        flexDirection: 'row', // Horizontally align profile image and name
        alignItems: 'center', // Vertically align profile image and name
    },
    profileImage: {
        width: 60,  // Set the image width
        height: 60, // Set the image height
        borderRadius: 50, // Make it a circle
        borderColor: 'orangered',
        borderWidth: 2,
        marginRight: 10, // Space between image and text
    },
    profileName: {
        fontSize: 15,
        fontWeight: '500',
        color: 'black',
    },
    headerIcons: {
        backgroundColor: "",
        flexDirection: 'row', // Arrange icons horizontally in the header
        alignItems: 'center', // Vertically center the icons
        marginRight: 0,
        height: '100%',
        width: '25%',
        paddingHorizontal: 5,
        justifyContent: 'space-between',
    },
    bellIcon: {
        marginLeft: 0, // Add space between the icons
    },
    trackIcon: {
        marginRight: 0, // Add space between the icons
    },
    searchBar: {
        backgroundColor: "#ddd",
        color: '#333',
        height: 55,
        width: '96%',
        alignSelf: 'center',
        justifyContent: 'center',
        paddingHorizontal: '8%',
        borderRadius: 16,
        marginTop: 30,
    },
    heading: {
        backgroundColor:"",
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: '7%',
        marginHorizontal: 5,
    },
    categoryContainer: {
        backgroundColor:"",
        height: 'auto',
        marginTop: 10,
    },
    categoryItem: { alignItems: 'center', marginHorizontal: 10 },
    categoryImage: { width: 80, height: 80, borderRadius: 50 },
    categoryTitle: { marginTop: 5, fontSize: 14, fontWeight: 'bold', color: '#333' },

    productContainer: {
        backgroundColor:'',
        height: 'auto',
    },
});

export default HomeScreen;
