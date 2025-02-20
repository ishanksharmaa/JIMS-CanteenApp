import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ProductCard from '../components/ProductCard';

const combos = [
    { id: '1', title: 'Cheese Burger', price: '₹45', time: '7 min', image: 'https://images.pexels.com/photos/1639564/pexels-photo-1639564.jpeg' },
    { id: '2', title: 'Paneer Wrap', price: '₹70', time: '7 min', image: 'https://images.pexels.com/photos/376464/pexels-photo-376464.jpeg' },
    { id: '3', title: 'Veg Pizza', price: '₹120', time: '10 min', image: 'https://images.pexels.com/photos/825661/pexels-photo-825661.jpeg' },
    { id: '4', title: 'French Fries', price: '₹50', time: '5 min', image: 'https://images.pexels.com/photos/1583884/pexels-photo-1583884.jpeg' },
    { id: '5', title: 'Cold Coffee', price: '₹80', time: '8 min', image: 'https://images.pexels.com/photos/302901/pexels-photo-302901.jpeg' }
];


const ProfileScreen = () => {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.profileBack}>
                <TouchableOpacity>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Text style={styles.title}>Profile</Text>
                </View>
                <View style={styles.headerIcons}>
                    <Ionicons name="notifications-outline" size={24} color="black" />
                    <Ionicons name="settings-outline" size={24} color="black" style={{ marginLeft: 10 }} />
                </View>
            </View>

            {/* Profile Info */}
            <View style={styles.profileSection}>
                <Image
                    source={require('../../assets/mayuri.jpg')} // Replace with your profile image path
                    style={styles.profileImage}
                />
                <View>
                    <Text style={styles.profileName}>Komi Chan</Text>
                    <Text style={styles.username}>@komi.chan</Text>
                    <Text style={styles.roomText}>Room A202</Text>
                </View>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.historyButton}>
                    <Ionicons name="time-outline" size={20} color="white" />
                    <Text style={styles.buttonText}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reorderButton}>
                    <Ionicons name="repeat-outline" size={20} color="white" />
                    <Text style={styles.buttonText}>Re-Order</Text>
                </TouchableOpacity>
            </View>

            {/* Your Combos Section */}
            <Text style={styles.sectionTitle}>Your Combos</Text>
            <FlatList style={{ marginHorizontal: -20, paddingHorizontal: 20 }}
                    data={combos}
                    keyExtractor={(item) => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => <ProductCard image={{uri: item.image}} title={item.title} price={item.price} />}
                />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: 'white' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, marginTop: 40, paddingVertical: 5 },
    profileBack: {flexDirection: 'row', alignItems:'center', backgroundColor:'', width:'28%', justifyContent:'space-between'},
    title: { fontSize: 20, fontWeight: 'bold' },
    headerIcons: { flexDirection: 'row', marginHorizontal: 10, width:'18%', backgroundColor:'' , justifyContent:'space-between'},
    profileSection: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    profileImage: { width: 80, height: 80, borderRadius: 40, marginRight: 15 },
    profileName: { fontSize: 18, fontWeight: 'bold' },
    username: { fontSize: 14, color: 'gray' },
    roomText: { fontSize: 14, color: 'gray' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 8 },
    historyButton: { backgroundColor: '#1E90FF', padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10, justifyContent: 'center' },
    reorderButton: { backgroundColor: '#FF1493', padding: 15, borderRadius: 10, flexDirection: 'row', alignItems: 'center', flex: 1, marginLeft: 10, justifyContent: 'center' },
    buttonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
    sectionTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, marginTop: 16 },
    comboCard: { backgroundColor: 'white', borderRadius: 10, padding: 10, marginRight: 10, alignItems: 'center', elevation: 5 },
    comboImage: { width: 100, height: 100, borderRadius: 10 },
    comboTime: { fontSize: 12, color: 'gray', marginTop: 5 },
    comboTitle: { fontSize: 16, fontWeight: 'bold' },
    comboPrice: { fontSize: 14, color: 'gray' },
    addIcon: { position: 'absolute', bottom: 5, right: 5 },
});

export default ProfileScreen;
