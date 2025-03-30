import React, { useState } from "react";
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from "react-native";

import { PermissionsAndroid, Platform } from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import { useTheme } from "../components/ThemeContext";
// ICONS
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const AddProductScreen = () => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);

    const [product, setProduct] = useState({
        name: "",
        price: "",
        description: "",
        quantity: "",
        image: null,
    });

    const handleChange = (field, value) => {
        if ((field === "price" || field === "quantity") && !/^\d*$/.test(value)) {
            return; // Only allow numbers
        }
        setProduct({ ...product, [field]: value });
    };

    const pickImage = async () => {
        const hasPermission = await requestMediaPermission();
        
        if (!hasPermission) {
            console.log("Permission denied!");
            return;
        }
    
        const options = { mediaType: "photo", quality: 1 };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log("User cancelled image picker");
            } else if (response.errorMessage) {
                console.log("ImagePicker Error: ", response.errorMessage);
            } else {
                const { uri } = response.assets[0];
                console.log(uri); // Ensure uri is logged correctly
                setProduct({ ...product, image: uri });
            }
        });
    };
    
    

    const removeImage = () => {
        setProduct({ ...product, image: null });
    };

    // Validation Function (excluding image)
    const isFormValid = () => {
        return (
            product.name.trim() !== "" &&
            product.price.trim() !== "" &&
            product.description.trim() !== "" &&
            product.quantity.trim() !== ""
        );
    };

    const requestMediaPermission = async () => {
        if (Platform.OS === "android") {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES, // Android 13+
                    {
                        title: "Media Access Permission",
                        message: "App ko gallery access karne ke liye permission chahiye.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK",
                    }
                );
    
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        }
        return true; // For iOS
    };
    
    
    

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Add Product</Text>


            <View style={styles.card}>
                {product.image && (
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

                <TouchableOpacity style={styles.button} onPress={pickImage}>
                    <Text style={styles.buttonText}>Pick Image</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.button, { backgroundColor: isFormValid() ? 'green' : 'gray' }]}
                    onPress={isFormValid() ? () => console.log("Product Added!") : null}
                    disabled={!isFormValid()}
                >
                    <Text style={styles.buttonText}>Add Item</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        padding: 20,
    },
    header: {
        fontSize: 26,
        fontWeight: "bold",
        color: theme.text,
        textAlign: "center",
        marginBottom: 20,
        marginTop: 30,
        paddingVertical: 10,
        borderBottomWidth: 2,
        borderBottomColor: theme.text,
    },
    card: {
        backgroundColor: theme.cardBg,
        borderRadius: 15,
        marginTop: '10%',
        padding: 20,
        elevation: 10,
        borderWidth: 1,
        borderColor: theme.primaryColor,
        shadowColor: theme.primaryColor,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    input: {
        borderWidth: 1,
        borderColor: theme.primaryColor,
        borderRadius: 8,
        padding: 12,
        marginVertical: 10,
        fontSize: 16,
        color: theme.text,
        backgroundColor: theme.loginInput,
        width: "100%",
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    smallInput: {
        borderWidth: 1,
        marginVertical: 10,
        borderColor: theme.primaryColor,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: theme.text,
        backgroundColor: theme.loginInput,
        width: "48%",
    },
    button: {
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
        backgroundColor: theme.primaryColor,
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
    imageContainer: {
        position: "relative",
        alignItems: "center",
    },
    image: {
        width: "100%",
        height: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    removeIcon: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "white",
        borderRadius: 50,
        padding: 0,
    },
});

export default AddProductScreen;
