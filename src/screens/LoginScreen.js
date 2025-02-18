import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import CustomButton from "../components/CustomButton";

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isPasswordVisible, setPasswordVisible] = useState(false);  // ✅ Toggle Password Visibility
    const [keyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        const keyboardShowListener = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
        const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    }, []);

    return (
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.screen}>
            <Image source={require("../../assets/app_logo2.png")} style={styles.logo} />
            
            <View style={[styles.container, { marginTop: keyboardVisible ? "0%" : "60%" }]}>
                <Text style={styles.title}>Login</Text>

                <View style={styles.inputPosition}>
                    <TextInput 
                        style={styles.inputStyle} 
                        placeholder="Username" 
                        placeholderTextColor={"grey"} 
                        autoCapitalize="none" 
                        value={username} 
                        onChangeText={setUsername} 
                        keyboardType="default" 
                    />
                    <TextInput 
                        style={styles.inputStyle} 
                        placeholder="Email" 
                        placeholderTextColor={"grey"} 
                        autoCapitalize="none" 
                        value={email} 
                        onChangeText={setEmail} 
                        keyboardType="email-address" 
                    />

                    {/* ✅ Password Input with Show/Hide Eye Icon */}
                    <View style={styles.passwordContainer}>
                        <TextInput 
                            style={styles.passwordInput} 
                            placeholder="Password" 
                            placeholderTextColor={"grey"} 
                            autoCapitalize="none" 
                            value={password} 
                            onChangeText={(text) => setPassword(text.replace(/\s/g, ""))}
                            secureTextEntry={!isPasswordVisible}  // ✅ Toggle Password Visibility
                        />
                        <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)} style={styles.eyeIconContainer}>
                            <Image 
                                source={isPasswordVisible ? require("../../assets/eye-open.png") : require("../../assets/eye-closed.png")}  
                                style={styles.eyeIcon} 
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.buttonPosition}>
                    <CustomButton title="Login" onPress={() => navigation.navigate("Home")} />
                    <Text style={{ textAlign: 'center', marginTop: 20 }}>Create an account</Text>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    logo: { 
        width: 200, 
        height: 200,
        resizeMode: "contain",
        position: "absolute",
        top: 20, 
        alignSelf: "center",
    },
    screen: { flex: 1, backgroundColor: "#bbb" },
    container: { 
        flex: 1, 
        justifyContent: "center", 
        backgroundColor: "#ffc300", 
        backgroundColor: "#ddd", 
        borderTopLeftRadius: 60, 
        borderTopRightRadius: 60 
    },
    inputPosition: { justifyContent: "center", alignItems: "center", marginTop: "10%" },
    title: { color: "black", fontWeight: "bold", fontSize: 35, textAlign: "center", marginTop: "-16%" },
    
    inputStyle: { 
        backgroundColor: "#ccc", 
        color: "black", 
        borderRadius: 12, 
        paddingHorizontal: 22, 
        height: 60, 
        width: "80%", 
        textAlignVertical: "center", 
        marginVertical: 10 
    },

    /* ✅ Password Input Style */
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#ccc",
        borderRadius: 12,
        width: "80%",
        paddingHorizontal: 15,
        height: 60,
        marginVertical: 10,
    },
    passwordInput: {
        flex: 1,
        color: "black",
        fontSize: 16,
    },
    eyeIconContainer: {
        padding: 10,
    },
    eyeIcon: {
        width: 24,
        height: 24,
        tintColor: "black",  // ✅ Adjust color as needed
    },

    buttonPosition: { alignSelf: "center", width: "100%", marginTop: 20 },
});

export default LoginScreen;
