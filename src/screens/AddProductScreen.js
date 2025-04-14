import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Keyboard, ScrollView } from "react-native";
import { useTheme } from "../components/ThemeContext";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useCart } from "../components/CartContext";
import firestore from '@react-native-firebase/firestore';

const AddProductScreen = ({ closeModal, product: initialProduct, mode }) => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);
    const { onAddtoCart } = useCart();

    const [product, setProduct] = useState(
        initialProduct
            ? {
                name: initialProduct.name,
                price: initialProduct.price ? initialProduct.price.toString() : "",
                description: initialProduct.description || "",
                quantity: initialProduct.quantity ? initialProduct.quantity.toString() : "",
                image: initialProduct.image || "",
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
                category: ""
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
                image: initialProduct.image || "",
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
                category: ""
            });
        }
    }, [initialProduct]);

    const handleChange = (field, value) => {
        setProduct(prevProduct => {
            let updatedValue = value;

            if (field === "price" || field === "quantity") {
                updatedValue = value.replace(/\D/g, ""); // Only numbers allowed for price and quantity
            }

            if (field === "category") {
                updatedValue = value
                    .trim()
                    .split(' ')
                    .map(word => word.toLowerCase())
                    .filter(word => word.length > 0);
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
        const docId = product.name.trim().toLowerCase().replace(/\s+/g, '-'); // Consistent lowercase IDs with hyphens

        const productData = {
            name: product.name.toLowerCase(),
            price: parseInt(product.price, 10),
            description: product.description,
            quantity: parseInt(product.quantity, 10),
            image: product.image,
            category: product.category,
            timestamp: firestore.FieldValue.serverTimestamp(),
        };

        try {
            if (mode === 'edit' && initialProduct?.id) {
                await productsRef.doc(initialProduct.id).update(productData);
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
                    <MaterialIcons name="cancel" size={27} color={'red'} />
                </TouchableOpacity>

                <ScrollView showsVerticalScrollIndicator={false}>
                    {product.image !== "" && (
                        <View style={styles.imageContainer}>
                            <Image source={{ uri: product.image } || require('../../assets/swaggy_cat.jpg')} style={styles.image} />
                            <TouchableOpacity style={styles.removeIcon} onPress={removeImage}>
                                <MaterialIcons name="cancel" size={24} color="red" />
                            </TouchableOpacity>
                        </View>
                    )}

                    <TextInput
                        style={styles.input}
                        placeholder="Name *"
                        value={product.name}
                        placeholderTextColor={'grey'}
                        onChangeText={(text) => handleChange("name", text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Description (optional)"
                        value={product.description}
                        placeholderTextColor={'grey'}
                        onChangeText={(text) => handleChange("description", text)}
                        multiline
                        textAlignVertical="top"
                    />
                    <View style={styles.row}>
                        <TextInput
                            style={styles.smallInput}
                            placeholder="₹ Price *"
                            keyboardType="numeric"
                            value={product.price}
                            placeholderTextColor={'grey'}
                            onChangeText={(text) => handleChange("price", text)}
                            returnKeyType="done"
                        />
                        <TextInput
                            style={styles.smallInput}
                            placeholder="Quantity *"
                            value={product.quantity}
                            placeholderTextColor={'grey'}
                            onChangeText={(text) => handleChange("quantity", text)}
                            keyboardType="numeric"
                        />
                    </View>

                    <TextInput
                        style={styles.input}
                        placeholder="@ Paste Image URL Here (optional)"
                        value={product.image}
                        placeholderTextColor={'grey'}
                        onChangeText={(text) => handleChange("image", text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="# Categories (separate by space) *"
                        // value={Array.isArray(product.category) ? product.category.join(' ') : product.category}
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
                </ScrollView>
            </View>
        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: { flex: 1, backgroundColor: theme.modalBg },
    card: {
        backgroundColor: theme.cardBg,
        borderRadius: 15,
        padding: 20,
        margin: 16,
        maxHeight: '100%',
        marginTop: 20,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    },
    headerTitle: { color: theme.primaryColor, fontSize: 22, fontWeight: 'bold', alignSelf: 'center', marginBottom: 20 },
    input: {
        // borderWidth: 1,
        borderColor: theme.borderColor,
        borderRadius: 8,
        padding: 12,
        marginVertical: 10,
        fontSize: 16,
        color: theme.text,
        backgroundColor: theme.loginInput,
        // backgroundColor: theme.inputBg,
    },
    row: { flexDirection: "row", justifyContent: "space-between" },
    smallInput: {
        // borderWidth: 1,
        borderColor: theme.borderColor,
        borderRadius: 8,
        padding: 12,
        marginVertical: 10,
        fontSize: 16,
        color: theme.text,
        width: "48%",
        backgroundColor: theme.loginInput,
    },
    button: { padding: 12, borderRadius: 8, alignItems: "center", marginTop: 20 },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    imageContainer: { position: "relative", alignItems: "center", marginBottom: 10 },
    image: { width: "100%", height: 200, borderRadius: 10, resizeMode: 'contain' },
    removeIcon: { position: "absolute", top: 5, right: 5, backgroundColor: "white", borderRadius: 12, padding: 2 },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: theme.cardBg,
        borderRadius: 14,
        padding: 2,
    },
});

export default AddProductScreen;