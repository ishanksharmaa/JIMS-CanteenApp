import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal } from "react-native";
import { useTheme } from "../components/ThemeContext";
import firestore from "@react-native-firebase/firestore";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AddProductScreen from "./AddProductScreen";
import SearchBar from "../components/SearchBar";
import { HeaderBackIcon } from "./CartScreen";

const ProductsListScreen = () => {
    const [text, setText] = useState('');
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection("Products")
            .orderBy("timestamp", "desc")
            .onSnapshot(snapshot => {
                const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setProducts(productList);
                setLoading(false);
            });
        return () => unsubscribe();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <HeaderBackIcon title={"Products List"} />
            </View>


            <TouchableOpacity onPress={() => setModalVisible(true)} style={{ position: 'absolute', top: '8%', right: '5.7%' }}>
                <MaterialIcons name="add" size={28} color={theme.primaryColor} />
            </TouchableOpacity>

            {/* SEARCH BAR HERE */}
            <View style={styles.searchContainer}>
                <SearchBar placeholder="Search your products..." onChange={setText} />
            </View>


            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.productCard}>
                            <Text style={styles.productName}>{item.name}</Text>
                            {/* <Text style={styles.productDesc}>{item.description}</Text> */}
                            <Text style={styles.productPrice}>₹{item.price} | Qty: {item.quantity}</Text>
                        </View>
                    )}
                />
            )}

            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <AddProductScreen />
                    <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.closeText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: { flex: 1, backgroundColor: theme.background, paddingHorizontal: 20 },
    headerContainer: { flexDirection: "column", marginBottom: -33, marginTop: 0, marginHorizontal: -20 },
    header: { fontSize: 26, fontWeight: "bold", color: theme.text, },
    searchContainer: { marginBottom: 40 },
    loadingText: { fontSize: 18, color: theme.text, textAlign: "center", marginTop: 20 },
    productCard: { backgroundColor: theme.cardBg, padding: 15, borderRadius: 0, marginBottom: 0, elevation: 5, borderTopWidth: 0, borderBottomWidth: 1, borderColor: theme.primaryColor, flexDirection: 'row', justifyContent: "space-between" },
    productName: { fontSize: 18, fontWeight: "bold", color: theme.text },
    productDesc: { fontSize: 14, color: theme.text, marginVertical: 5 },
    productPrice: { fontSize: 16, fontWeight: "bold", color: theme.primaryColor },
    modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 10 },
    closeButton: { backgroundColor: "red", width: '71%', paddingVertical: 16.2, borderRadius: 22, margin: 28, alignItems: "center", alignSelf: 'center', },
    closeText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default ProductsListScreen;
