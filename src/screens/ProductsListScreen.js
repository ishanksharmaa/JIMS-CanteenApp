import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, Modal, Alert } from "react-native";
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

    const [selectedItems, setSelectedItems] = useState([]);
    const [selectionMode, setSelectionMode] = useState(false);

    const fadedPrimary = `#ffdddd30`; // hex opacity (80  ~50%)

    const toTitleCase = str => {
        return str
            ?.toLowerCase()
            .split(' ')
            .map(word => {
                if (word.startsWith('#')) {
                    // return '#' + word.slice(1, 2).toLowerCase() + word.slice(2);
                    return '#' + word.slice(1, 2).toUpperCase() + word.slice(2);
                } else {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }
            })
            .join(' ');
    };


    useEffect(() => {
        const unsubscribe = firestore()
            .collection("Products")
            .orderBy("timestamp", "desc")
            .onSnapshot(snapshot => {
                const productList = snapshot.docs.map(doc => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        ...data,
                        category: toTitleCase(data.category),
                    };
                });

                setProducts(productList);
                setLoading(false);
            });
        return () => unsubscribe();
    }, []);

    const toggleSelection = (id) => {
        if (selectedItems.includes(id)) {
            const updatedSelection = selectedItems.filter(item => item !== id);
            setSelectedItems(updatedSelection);
            if (updatedSelection.length === 0) {
                cancelSelection();
            }
        } else {
            const updatedSelection = [...selectedItems, id];
            setSelectedItems(updatedSelection);
            // alert(updatedSelection.length);
        }
    };


    const handleLongPress = (id) => {
        setSelectionMode(true);
        toggleSelection(id);
    };

    const cancelSelection = () => {
        setSelectionMode(false);
        setSelectedItems([]);
    };

    const deleteSelectedItems = async () => {
        Alert.alert("Delete", "Are you sure you want to delete selected items?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Delete",
                style: "destructive",
                onPress: async () => {
                    try {
                        const batch = firestore().batch();

                        selectedItems.forEach(id => {
                            const ref = firestore().collection("Products").doc(id);
                            batch.delete(ref);
                        });

                        await batch.commit();
                        cancelSelection();
                    } catch (error) {
                        console.error("Error deleting items: ", error);
                    }
                }
            }
        ]);
    };



    return (
        <View style={styles.container}>
            <View style={styles.headerContainer}>
                <HeaderBackIcon title={"Products List"} />
            </View>

            {/* Plus or Delete icon */}
            <TouchableOpacity
                onPress={selectionMode ? deleteSelectedItems : () => setModalVisible(true)}
                style={{ position: 'absolute', top: '8%', right: '5.7%', zIndex: 1 }}
            >
                <MaterialIcons
                    name={selectionMode ? "delete" : "add"}
                    size={28}
                    color={theme.primaryColor}
                />
            </TouchableOpacity>

            {selectionMode && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: theme.background, position: 'absolute', top: 60, alignSelf: 'center', alignItems: 'center', width: '102%', height: '6%', zIndex: 20 }}>
                    <TouchableOpacity onPress={cancelSelection}>
                        <Text style={{ color: theme.text, fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={deleteSelectedItems}>
                        <Text style={{ color: "#d32f2f", fontWeight: 'bold' }}>Delete ({selectedItems.length})</Text>
                    </TouchableOpacity>
                </View>
            )}


            {/* Search */}
            <View style={styles.searchContainer}>
                <SearchBar placeholder="Search the product list..." onChange={setText} navigatePage={null} editable={true} />
            </View>

            {loading ? (
                <Text style={styles.loadingText}>Loading...</Text>
            ) : (
                <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item, index }) => (
                        <View>
                            <TouchableOpacity
                                onLongPress={() => handleLongPress(item.id)}
                                onPress={() =>
                                    selectionMode ? toggleSelection(item.id) : null
                                }
                                activeOpacity={0.8}
                                style={[
                                    {
                                        backgroundColor:
                                            selectionMode && selectedItems.includes(item.id)
                                                ? fadedPrimary
                                                : theme.card,
                                        marginVertical: 6,
                                        padding: 12,
                                        borderRadius: 10,
                                        flexDirection: "row",
                                        alignItems: "center",
                                    },
                                ]}
                            >
                                {selectionMode && (
                                    <MaterialIcons
                                        name={
                                            selectedItems.includes(item.id)
                                                ? "check-circle"
                                                : "radio-button-unchecked"
                                        }
                                        size={24}
                                        color={selectedItems.includes(item.id) ? "#ff5555" : "#999"}
                                        style={{ marginRight: 10 }}
                                    />
                                )}

                                <View style={{ flex: 1 }}>
                                    <Text style={{ color: theme.text, fontWeight: "bold", fontSize: 16, textTransform: 'capitalize' }}>
                                        {item.name}
                                    </Text>

                                    {/* Price & Quantity side by side */}
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                            marginVertical: 4,
                                        }}
                                    >
                                        <Text style={{ color: theme.text }}>₹{item.price}</Text>
                                        {/* <Text style={{ color: theme.text }}>{item.quantity ? " | " : ""}</Text> */}
                                        <Text style={{ color: theme.text }}>Qty: {item.quantity}</Text>
                                    </View>

                                    {item.category !== "" && (
                                        <Text style={{ color: theme.primaryColor, marginTop: 5 }}>
                                            {item.category}
                                        </Text>
                                    )}
                                </View>
                            </TouchableOpacity>

                            {/* Line below item except last one */}
                            {index !== products.length - 1 && (
                                <View style={{ height: 1, backgroundColor: "#ccc", marginTop: -7, marginBottom: -7 }} />
                            )}
                        </View>
                    )}
                    ListEmptyComponent={() =>
                        !loading && (
                            <Text style={{ color: theme.text, textAlign: "center", marginTop: 40 }}>
                                No products found.
                            </Text>
                        )
                    }
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
    searchContainer: { marginBottom: 40 },
    loadingText: { fontSize: 18, color: theme.text, textAlign: "center", marginTop: 20 },
    productCard: {
        backgroundColor: theme.cardBg,
        padding: 15,
        marginBottom: 0,
        borderBottomWidth: 1,
        borderColor: theme.primaryColor,
        flexDirection: 'row',
        justifyContent: "space-between",
        borderRadius: 0,
        elevation: 5,
    },
    productName: { fontSize: 18, fontWeight: "bold", color: theme.text, textTransform: 'capitalize' },
    productPrice: { fontSize: 16, fontWeight: "bold", color: theme.primaryColor },
    modalContainer: { flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.5)", paddingHorizontal: 10 },
    closeButton: {
        backgroundColor: "red",
        width: '71%',
        paddingVertical: 16.2,
        borderRadius: 22,
        margin: 28,
        alignItems: "center",
        alignSelf: 'center',
    },
    closeText: { color: "white", fontSize: 16, fontWeight: "bold" },
});

export default ProductsListScreen;
