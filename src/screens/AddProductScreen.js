import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, StyleSheet, Keyboard } from "react-native";
import { useTheme } from "../components/ThemeContext";
import RefreshCompo from "../components/RefreshCompo";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { BlurView } from "@react-native-community/blur";

import firestore from '@react-native-firebase/firestore';


const AddProductScreen = () => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);

    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
        quantity: "",
        image: "",
        category: "",
    });

    const [uploading, setUploading] = useState(false);

    const handleChange = (field, value) => {
        setProduct(prevProduct => {
            let updatedValue = value;
    
            if (field === "price") {
                updatedValue = value.replace(/\D/g, ""); // Only numbers allowed for price
            }
    
            if (field === "category") {
                if (value.endsWith(" ")) { 
                    // Last character agar space hai, toh last word ke aage # laga do
                    updatedValue = value
                        .trim()
                        .split(' ')
                        .map(word => 
                            word.startsWith("#") 
                                ? word 
                                : `#${word.charAt(0).toUpperCase()}${word.slice(1).toLowerCase()}`
                        ) // Ensure first letter capital & rest small
                        .join(' ') + ' '; // Space maintain rakhne ke liye
                } else if (!value.endsWith(" ") && value[value.length - 1] === "#") {
                    // Agar last character # hai (matlab backspace se space remove hua), toh # hatao
                    updatedValue = value.slice(0, -1);
                }
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
            product.description.trim() !== "" &&
            product.quantity.trim() !== ""
            // && product.category.trim() !== ""
        );
    };

    const handleAddProduct = async () => {
        if (!isFormValid()) return;
    
        setUploading(true);
    
        const productsRef = firestore().collection("Products");
        const docId = product.name.trim(); // Title as doc ID
    
        const newProduct = {
            name: product.name,
            price: product.price,
            description: product.description,
            quantity: product.quantity,
            image: product.image,
            category: product.category,
            timestamp: firestore.FieldValue.serverTimestamp(),
        };
    
        try {
            const existingDoc = await productsRef.doc(docId).get();
            if (existingDoc.exists) {
                console.warn("Product with this title already exists!");
                setUploading(false);
                alert("Product already exist with this name!");
                return;
            }
    
            await productsRef.doc(docId).set(newProduct);
            console.log(`Product added successfully with ID: ${docId}`);
            setProduct({ name: "", price: "", description: "", quantity: "", image: "", category: "" });
    
        } catch (error) {
            console.error("Error adding product:", error);
        } finally {
            setUploading(false);
        }
    };
    
    

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add Product</Text>

            <View style={styles.card}>
                <Text style={styles.headerTitle}>Product Details:</Text>


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
                    placeholder="Product Name"
                    value={product.name}
                    placeholderTextColor={'grey'}
                    onChangeText={(text) => handleChange("name", text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Product Description"
                    value={product.description}
                    placeholderTextColor={'grey'}
                    onChangeText={(text) => handleChange("description", text)}
                />
                <View style={styles.row}>
                    <TextInput
                        style={styles.smallInput}
                        placeholder="₹ Price"
                        keyboardType="numeric"
                        value={product.price}
                        placeholderTextColor={'grey'}
                        onChangeText={(text) => handleChange("price", text)}
                    />
                    <TextInput
                        style={styles.smallInput}
                        placeholder="Quantity"
                        value={product.quantity}
                        placeholderTextColor={'grey'}
                        onChangeText={(text) => handleChange("quantity", text)}
                    />
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="@ Paste Image URL Here"
                    value={product.image}
                    placeholderTextColor={'grey'}
                    onChangeText={(text) => handleChange("image", text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="# Category"
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
                        <Text style={styles.buttonText}>Add Item</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
};

const dynamicTheme = (theme) => ({
    // blurBackground: { ...StyleSheet.absoluteFillObject, position: "absolute", },
    // container: { flex: 1, backgroundColor: '#FFFFFFA0', padding: 20, height: '100%', borderRadius: 20, justifyContent: 'center' },
    // header: { fontSize: 26, fontWeight: "bold", color: theme.text, textAlign: "center", marginBottom: 50, marginTop: 0, position: 'absolute', top: 33, alignSelf: 'center', },
    card: { backgroundColor: theme.cardBg, borderRadius: 15, padding: 20, elevation: 10, borderWidth: 1, borderColor: theme.primaryColor, marginHorizontal: 16, },
    headerTitle: { color: theme.primaryColor, fontSize: 22, fontWeight: 'bold', alignSelf: 'center', marginBottom: 20, },
    input: { borderWidth: 1.4, borderColor: theme.primaryColor, borderRadius: 8, padding: 12, marginVertical: 10, fontSize: 16, color: theme.text },
    row: { flexDirection: "row", justifyContent: "space-between" },
    smallInput: { borderWidth: 1.4, marginVertical: 10, borderColor: theme.primaryColor, borderRadius: 8, padding: 12, fontSize: 16, color: theme.text, width: "48%" },
    button: { padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10, backgroundColor: theme.primaryColor },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    imageContainer: { position: "relative", alignItems: "center" },
    image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 10 },
    removeIcon: { position: "absolute", top: 5, right: 5, backgroundColor: "white", borderRadius: 50, padding: 0 },
});

export default AddProductScreen;
