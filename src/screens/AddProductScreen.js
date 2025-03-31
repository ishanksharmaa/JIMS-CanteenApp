import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useTheme } from "../components/ThemeContext";
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
    });

    const [uploading, setUploading] = useState(false);

    const handleChange = (field, value) => {
        if ((field === "price" || field === "quantity") && !/^\d*$/.test(value)) {
            return;
        }
        setProduct({ ...product, [field]: value });
    };

    const removeImage = () => {
        setProduct({ ...product, image: "" });
    };

    const isFormValid = () => {
        return (
            product.name.trim() !== "" &&
            product.price.trim() !== "" &&
            product.description.trim() !== "" &&
            product.quantity.trim() !== "" &&
            product.image.trim() !== ""
        );
    };

    const handleAddProduct = async () => {
        if (!isFormValid()) return;

        setUploading(true);

        const productsRef = firestore().collection("Products");
        const snapshot = await productsRef.orderBy("timestamp", "desc").limit(1).get();

        let newProductNumber = 1;
        if (!snapshot.empty) {
            const lastProductId = snapshot.docs[0].id;
            const lastProductNumber = parseInt(lastProductId.split("-")[1]);
            if (!isNaN(lastProductNumber)) {
                newProductNumber = lastProductNumber + 1;
            }
        }

        const newProductId = `product-${newProductNumber}`;

        const newProduct = {
            name: product.name,
            price: product.price,
            description: product.description,
            quantity: product.quantity,
            image: product.image, // Directly storing image URL
            timestamp: firestore.FieldValue.serverTimestamp(),
        };

        try {
            await productsRef.doc(newProductId).set(newProduct);
            console.log(`Product added successfully with ID: ${newProductId}`);
            setProduct({ name: "", price: "", description: "", quantity: "", image: "" });
        } catch (error) {
            console.error("Error adding product:", error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.container}>
            {/* <BlurView
                style={styles.blurBackground}
                blurType="light"
                blurAmount={10}
            /> */}
            <Text style={styles.header}>Add Product</Text>

            <View style={styles.card}>
                {product.image !== "" && (
                    <View style={styles.imageContainer}>
                        <Image source={{ uri: product.image }} style={styles.image} />
                        <TouchableOpacity style={styles.removeIcon} onPress={removeImage}>
                            <MaterialIcons name="cancel" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}

                <TextInput
                    style={styles.input}
                    placeholder="Product Name"
                    value={product.name}
                    onChangeText={(text) => handleChange("name", text)}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Product Description"
                    value={product.description}
                    onChangeText={(text) => handleChange("description", text)}
                />
                <View style={styles.row}>
                    <TextInput
                        style={styles.smallInput}
                        placeholder="₹ Price"
                        keyboardType="numeric"
                        value={product.price}
                        onChangeText={(text) => handleChange("price", text)}
                    />
                    <TextInput
                        style={styles.smallInput}
                        placeholder="Qty"
                        keyboardType="numeric"
                        value={product.quantity}
                        onChangeText={(text) => handleChange("quantity", text)}
                    />
                </View>

                <TextInput
                    style={styles.input}
                    placeholder="Paste Image URL Here"
                    value={product.image}
                    onChangeText={(text) => handleChange("image", text)}
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
    container: { flex: 1, backgroundColor: 'transparent', padding: 20 },
    // blurBackground: { ...StyleSheet.absoluteFillObject, position: "absolute", },
    header: { fontSize: 26, fontWeight: "bold", color: theme.text, textAlign: "center", marginBottom: 50, marginTop: 0 },
    card: { backgroundColor: theme.cardBg, borderRadius: 15, padding: 20, elevation: 10, borderWidth: 1, borderColor: theme.primaryColor, },
    input: { borderWidth: 1, borderColor: theme.primaryColor, borderRadius: 8, padding: 12, marginVertical: 10, fontSize: 16, color: theme.text },
    row: { flexDirection: "row", justifyContent: "space-between" },
    smallInput: { borderWidth: 1, marginVertical: 10, borderColor: theme.primaryColor, borderRadius: 8, padding: 12, fontSize: 16, color: theme.text, width: "48%" },
    button: { padding: 12, borderRadius: 8, alignItems: "center", marginTop: 10, backgroundColor: theme.primaryColor },
    buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
    imageContainer: { position: "relative", alignItems: "center" },
    image: { width: "100%", height: 200, borderRadius: 10, marginBottom: 10 },
    removeIcon: { position: "absolute", top: 5, right: 5, backgroundColor: "white", borderRadius: 50, padding: 0 },
});

export default AddProductScreen;
