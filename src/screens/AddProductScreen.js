import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Keyboard,
    ScrollView,
    Modal,
    FlatList
} from "react-native";
import { useTheme } from "../components/ThemeContext";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useCart } from "../components/CartContext";
import firestore from '@react-native-firebase/firestore';

const AddProductScreen = ({ closeModal, product: initialProduct, mode }) => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);
    const { onAddtoCart } = useCart();

    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [showImages, setShowImages] = useState(false);

    // const defaultImage = "https://thumbs.dreamstime.com/b/empty-plate-spoon-fork-knife-wooden-base-71530589.jpg?w=768";
    // const defaultImage = "https://images.pexels.com/photos/4170023/pexels-photo-4170023.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
    const defaultImage = "https://media.istockphoto.com/id/183038818/photo/isolated-shot-of-plate-with-cutlery-on-white-background.jpg?s=2048x2048&w=is&k=20&c=fGckdZGiEc67O6QiGO86gWGnaoRcqpe1--mKBJoBoTY=";

    const selectImage = (url) => {
        setProduct({ ...product, image: url });
        setShowImages(false);
    };

    const fetchImages = async () => {
        if (!searchTerm.trim()) return;
        try {
            const response = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(searchTerm)}&per_page=30`, {
                headers: {
                    Authorization: 'o2oiDjMfhR7DhHdE77U8Fxz3N5MHI7e7TPRzJMGQJyFkOq1OKfoi3sJL',
                },
            });
            const data = await response.json();
            const urls = data.photos.map(photo => photo.src.medium);
            setSearchResults(urls);
            setShowImages(true);
        } catch (error) {
            console.error('Error fetching images:', error);
        }
    };

    const [product, setProduct] = useState(
        initialProduct
            ? {
                name: initialProduct.name,
                price: initialProduct.price ? initialProduct.price.toString() : "",
                description: initialProduct.description || "",
                quantity: initialProduct.quantity ? initialProduct.quantity.toString() : "",
                image: initialProduct.image || defaultImage,
                time: initialProduct.time ? initialProduct.time.toString() : "",
                category: Array.isArray(initialProduct.category)
                    ? initialProduct.category.join(' ')
                    : initialProduct.category || ""
            }
            : {
                name: "",
                price: "",
                description: "",
                quantity: "",
                image: "",
                category: "",
                time: ""
            }
    );

    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (initialProduct) {
            setProduct({
                name: initialProduct.name,
                price: initialProduct.price ? initialProduct.price.toString() : "",
                description: initialProduct.description || "",
                quantity: initialProduct.quantity ? initialProduct.quantity.toString() : "",
                image: initialProduct.image || defaultImage,
                time: initialProduct.time ? initialProduct.time.toString() : "",
                category: Array.isArray(initialProduct.category)
                    ? initialProduct.category.join(' ')
                    : initialProduct.category || ""
            });
        } else {
            setProduct({
                name: "",
                price: "",
                description: "",
                quantity: "",
                image: "",
                category: "",
                time: ""
            });
        }
    }, [initialProduct]);

    const handleChange = (field, value) => {
        setProduct(prevProduct => {
            let updatedValue = value;

            if (field === "price") {
                updatedValue = value.replace(/\D/g, "");
            }

            return { ...prevProduct, [field]: updatedValue };
        });
    };

    const removeImage = () => {
        setProduct({ ...product, image: "" });
    };

    const isFormValid = () => {
        return (
            product.name.trim() !== "" &&
            product.price.trim() !== "" &&
            product.quantity.trim() !== "" &&
            product.category.length > 0
        );
    };

    const handleAddProduct = async () => {
        if (!isFormValid()) {
            alert("Please fill all required fields");
            return;
        }

        setUploading(true);
        Keyboard.dismiss();

        const productsRef = firestore().collection("Products");
        const docId = product.name.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9-]/g, ''); // Remove special characters;

        const categoryArray = product.category
            .trim()
            .split(' ')
            .map(word => word.toLowerCase())
            .filter(word => word.length > 0);

        const timeValue = product.time.trim() === "" ? "Ready" : product.time;

        const productData = {
            name: product.name.toLowerCase(),
            price: parseInt(product.price, 10),
            description: product.description,
            quantity: product.quantity.toLowerCase(),
            image: product.image.trim() === "" ? defaultImage : product.image,
            time: timeValue,
            category: categoryArray,
            available: true,
            timestamp: firestore.FieldValue.serverTimestamp(),
        };

        try {
            if (mode === 'edit' && initialProduct?.id) {
                if (initialProduct.name.toLowerCase() !== product.name.toLowerCase()) {
                    // Name changed - we need to create new doc and delete old one
                    await productsRef.doc(docId).set(productData);
                    await productsRef.doc(initialProduct.id).delete();
                } else {
                    // no name changed - just update
                    await productsRef.doc(initialProduct.id).update(productData);
                }
                onAddtoCart("refresh", `${product.name} Updated`, "Product Updated!");
            } else {
                const existingDoc = await productsRef.doc(docId).get();
                if (existingDoc.exists) {
                    alert("Product already exists with this name!");
                    return;
                }
                await productsRef.doc(docId).set(productData);
                onAddtoCart("pricetag", `${product.name} Added`, "New Product Added!");
            }

            if (mode !== 'edit') {
                setProduct({
                    name: "",
                    price: "",
                    description: "",
                    quantity: "",
                    image: "",
                    time: "",
                    category: ""
                });
            }
            closeModal?.();

        } catch (error) {
            console.error("Error saving product:", error);
            alert("Error saving product: " + error.message);
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <Text style={styles.headerTitle}>
                    {mode === 'edit' ? 'Edit Product' : 'Add New Product'}
                </Text>
                <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                    {/* <MaterialIcons name="cancel" size={27} color={theme.text} /> */}
                    <Ionicons name="close" size={23} color={theme.text} />

                </TouchableOpacity>

                <ScrollView showsVerticalScrollIndicator={false}>

                    <TextInput
                        style={styles.input}
                        placeholder="Name*"
                        value={product.name}
                        placeholderTextColor={'grey'}
                        onChangeText={(text) => {
                            // Step 1: Sanitize the input
                            const sanitizedText = text
                                .replace(/\s{2,}/g, ' ')       // Replace multiple spaces with single space
                                .replace(/[^a-zA-Z0-9() -]/g, ''); // Remove special chars except ()-

                            // Step 2: Update state via handleChange
                            handleChange("name", sanitizedText);
                        }}
                        maxLength={50}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Description"
                        value={product.description}
                        placeholderTextColor={'grey'}
                        onChangeText={(text) => handleChange("description", text)}
                        multiline
                        textAlignVertical="top"
                    />
                    <View style={styles.row}>
                        <TextInput
                            style={styles.smallInput}
                            placeholder="₹ Price*"
                            keyboardType="numeric"
                            value={product.price}
                            placeholderTextColor={'grey'}
                            onChangeText={(text) => handleChange("price", text)}
                            returnKeyType="done"
                        />
                        <TextInput
                            style={styles.smallInput}
                            placeholder="Quantity*"
                            value={product.quantity}
                            placeholderTextColor={'grey'}
                            onChangeText={(text) => handleChange("quantity", text)}
                        />
                        <TextInput
                            style={styles.smallInput}
                            placeholder="Time"
                            value={product.time}
                            placeholderTextColor={'grey'}
                            onChangeText={(text) => handleChange("time", text)}
                        />
                    </View>

                    <View style={styles.searchRow}>
                        <TextInput
                            style={[styles.input, { width: "90%", fontSize: 16 }]}
                            placeholder="@ Search or Paste *Image* URL"
                            value={product.image}
                            placeholderTextColor={'grey'}
                            onChangeText={(text) => {
                                handleChange("image", text);
                                setSearchTerm(text);
                            }}
                            onSubmitEditing={fetchImages}
                            returnKeyType="search"
                        />
                        <TouchableOpacity onPress={fetchImages} hitSlop={{ right: 50, left: 0, top: 0, bottom: 0 }} style={{ paddingHorizontal: 8 }}>
                            <MaterialIcons name="search" size={28} color={theme.primaryColor} />
                        </TouchableOpacity>
                    </View>

                    <Modal visible={showImages} transparent animationType="fade">
                        <View style={styles.imageModal}>
                            <TouchableOpacity style={styles.closeIcon} onPress={() => setShowImages(false)}>
                                <Text style={{ fontSize: 22, color: 'white' }}>✕</Text>
                            </TouchableOpacity>

                            <FlatList
                                data={searchResults}
                                keyExtractor={(item, index) => index.toString()}
                                numColumns={3}
                                contentContainerStyle={styles.gridContainer}
                                renderItem={({ item }) => (
                                    <TouchableOpacity onPress={() => selectImage(item)} style={styles.gridItem}>
                                        <Image source={{ uri: item }} style={styles.selectableImage} />
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    </Modal>



                    <TextInput
                        style={styles.input}
                        placeholder="Category*: drinks coffee dinner plate"
                        value={product.category}
                        placeholderTextColor={'grey'}
                        onChangeText={(text) => handleChange("category", text)}
                    />

                    {uploading ? (
                        <ActivityIndicator size="large" color="green" style={{ marginTop: 10 }} />
                    ) : (
                        <TouchableOpacity
                            style={[styles.button, { backgroundColor: isFormValid() ? 'green' : 'gray' }]}
                            onPress={handleAddProduct}
                            disabled={!isFormValid()}
                        >
                            <Text style={styles.buttonText}>
                                {mode === 'edit' ? 'Update Item' : 'Add Item'}
                            </Text>
                        </TouchableOpacity>
                    )}

                    {/* {product.image !== "" && ( */}
                    <View style={styles.imageContainer}>
                        {/* <Image source={{ uri: product.image || defaultImage }} style={styles.image} /> */}
                        <Image source={{ uri: product.image.trim() === "" ? defaultImage : product.image }} style={styles.image} />
                        <TouchableOpacity style={styles.removeIcon} onPress={removeImage}>
                            <MaterialIcons name="cancel" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                    {/* )} */}

                </ScrollView>
            </View >
        </View >
    );
};

const dynamicTheme = (theme) => ({
    container: { flex: 1, backgroundColor: theme.modalBg },
    card: {
        backgroundColor: theme.cardBg,
        borderRadius: 15,
        padding: 20,
        margin: 16,
        marginTop: 20,
        height: "90%",
        maxHeight: '90%',
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    headerTitle: { color: theme.primaryColor, fontSize: 22, fontWeight: 'bold', alignSelf: 'center', marginBottom: 20 },
    input: {
        borderColor: theme.borderColor,
        borderRadius: 8,
        padding: 12,
        marginVertical: 10,
        fontSize: 16,
        color: theme.text,
        backgroundColor: theme.loginInput,
    },
    row: { flexDirection: "row", justifyContent: "space-between" },
    smallInput: {
        borderColor: theme.borderColor,
        borderRadius: 8,
        padding: 12,
        marginVertical: 10,
        fontSize: 16,
        height: 46,
        color: theme.text,
        width: "30%",
        backgroundColor: theme.loginInput,
    },
    button: { padding: 12, borderRadius: 8, alignItems: "center", marginTop: 20, marginBottom: 20 },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    imageContainer: { position: "relative", alignItems: "center", marginBottom: 10 },
    image: { width: "100%", height: 200, borderRadius: 10, resizeMode: 'contain' },
    removeIcon: { position: "absolute", top: 0, right: 0, backgroundColor: "white", borderRadius: 12, padding: 1 },
    closeButton: {
        position: 'absolute',
        top: 20,
        right: 11,
        padding: 2,
    },
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        // paddingHorizontal: 10,
        // marginVertical: 10,
        width: "100%",
    },
    imageModal: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        paddingTop: 40,
        paddingHorizontal: 20,
    },

    closeIcon: {
        position: 'absolute',
        top: 40,
        right: 30,
        zIndex: 1,
    },

    gridContainer: {
        paddingTop: 60,
        alignItems: 'center',
    },

    gridItem: {
        margin: 5,
    },

    selectableImage: {
        width: 100,
        height: 100,
        borderRadius: 8,
    },


});

export default AddProductScreen;
