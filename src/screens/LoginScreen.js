import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import CustomButton from "../components/CustomButton";
import HandleBar from "../components/HandleBar";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../components/ThemeContext";
import Ionicons from 'react-native-vector-icons/Ionicons';

import auth from '@react-native-firebase/auth';

const LoginScreen = ({ navigation }) => {
    const { theme, changeTheme } = useTheme();
    const styles = dynamicTheme(theme);

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

    const handleLogin = () => {
        if (!email || !password) {
            setErrorMessage("All fields are required!");
        } else {
            auth()
                .signInWithEmailAndPassword("laddu@vasu.com", "radhe")
                .then(() => {
                    // Login successful, navigate to Home screen
                    Keyboard.dismiss();
                    navigation.replace("Home");
                })
                .catch((error) => {
                    // Handle errors here
                    if (error.code === 'auth/user-not-found') {
                        setErrorMessage("No user found with this email.");
                    } else if (error.code === 'auth/wrong-password') {
                        setErrorMessage("Incorrect password.");
                    } else {
                        setErrorMessage("Something went wrong. Please try again.");
                    }
                });
        }
    };
    

    // const checkPasswordValidation = (password, confirmPassword) => {

    //     const isFilled = password && confirmPassword;
    //     const isMatch = password === confirmPassword;

    //     setErrorMessage(isFilled && !isMatch ? "Passwords do not match!" : "");
    //     setIsPasswordValid(isFilled && isMatch);
    //     return isFilled && isMatch;
    // }

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <View style={[styles.screen, { flex: 1 }]}>
                <View style={{ alignSelf: 'center', position: 'absolute', top: 120, transform: [{ scale: 5 }], zIndex: 5 }}>
                    <ThemeToggle iconColor={'transparent'} />
                </View>
                <Image source={theme.logo} style={styles.logo} />

                <View style={[styles.container, { marginTop: keyboardVisible ? "10%" : "60%" }]}>
                    <HandleBar />
                    <Text style={[styles.title, { marginTop: keyboardVisible ? "5%" : "5%" }]}>Login</Text>

                    <View style={styles.emailContainer}>
                        {/* <TextInput
                            style={styles.inputStyle}
                            placeholder="Email or Username"
                            placeholderTextColor={"grey"}
                            autoCapitalize="none"
                            value={username}
                            onChangeText={setUsername}
                            keyboardType="default"
                        /> */}
                        <TextInput 
                        style={styles.inputStyle} 
                        placeholder="Email" 
                        placeholderTextColor={"grey"} 
                        autoCapitalize="none" 
                        value={email} 
                        onChangeText={setEmail} 
                        keyboardType="email-address" 
                    />

                        <View style={styles.passwordArea}>
                            <View style={styles.passwordContainer}>
                                {/* ✅ Password Input */}
                                <TextInput style={styles.passwordInput}
                                    placeholder="Password"
                                    placeholderTextColor={"grey"}
                                    autoCapitalize="none"
                                    value={password}
                                    onChangeText={(text) => setPassword(text.replace(/\s/g, ""))}
                                    secureTextEntry={!isPasswordVisible}  // Toggle Password Visibility
                                />
                                {/* Eye Icon */}
                                <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)} style={styles.eyeIconContainer} activeOpacity={0.8}>
                                    <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={22} color={theme.text} style={styles.eyeIcon} />
                                </TouchableOpacity>
                            </View>
                            {/* Forgot Password */}
                            <TouchableOpacity>
                                <Text style={{ color: theme.customGoogleButtonText, marginLeft: 10, marginTop: 7 }}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={styles.buttonPosition}>
                        <CustomButton btnColor={theme.customButtonBg} textColor={theme.customButtonText} title="Login" onPress={handleLogin} />
                        <TouchableOpacity onPress={() => { Keyboard.dismiss, navigation.replace("SignUp"); }} >
                            <Text style={{ textAlign: 'center', marginVertical: 20, color: theme.text }}>Create an account</Text>
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center', marginVertical: 20, color: theme.text }}>____________  or  ____________</Text>
                        <CustomButton btnColor={theme.customGoogleButtonBg} textColor={theme.customGoogleButtonText} title="Continue with Google" onPress={() => navigation.replace("Home")} />
                    </View>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const dynamicTheme = (theme) => ({
    logo: {
        width: 200,
        height: 200,
        backgroundColor: 'transparent',
        resizeMode: "contain",
        position: "absolute",
        top: 35,
        alignSelf: "center",
    },
    screen: { flex: 1, backgroundColor: theme.screenColor },
    container: {
        height: '100%',
        flex: 1,
        justifyContent: "",
        backgroundColor: theme.loginBg,
        borderTopLeftRadius: 60,
        borderTopRightRadius: 60,
        paddingBottom: 0,
        zIndex: 10,
    },
    emailContainer: { justifyContent: "center", alignItems: "center", marginTop: "14%" },
    title: { color: theme.text, fontWeight: "bold", fontSize: 35, textAlign: "center" },

    inputStyle: {
        backgroundColor: theme.loginInput,
        color: theme.text,
        borderRadius: 12,
        paddingHorizontal: 22,
        height: 60,
        width: "80%",
        textAlignVertical: "center",
        //marginVertical: 20,
    },

    passwordArea: {
        marginVertical: 20,
    },

    /* ✅ Password Input Style */
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.loginInput,
        borderRadius: 12,
        width: "80%",
        paddingHorizontal: 15,
        height: 60,
    },
    passwordInput: {
        flex: 1,
        color: theme.text,
        fontSize: 16,
    },
    eyeIconContainer: {
        padding: 10,
    },
    eyeIcon: {
        width: 24,
        height: 24,
        opacity: 0.22,
        tintColor: "black",  // ✅ Adjust color as needed
    },

    buttonPosition: { alignSelf: "center", width: "100%", marginTop: 10, justifyContent: 'space-around' },
});

export default LoginScreen;
