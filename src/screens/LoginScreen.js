import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import CustomButton from "../components/CustomButton";
import HandleBar from "../components/HandleBar";
import { useTheme } from "../components/ThemeContext";

const LoginScreen = ({ navigation }) => {
    const { theme } = useTheme();
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

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <View style={[styles.screen, {flex: 1}]}>
                <Image source={theme.logo} style={styles.logo} />

                <View style={[styles.container, { marginTop: keyboardVisible ? "0%" : "75%" }]}>
                    <HandleBar />
                    <Text style={[styles.title, { marginTop: keyboardVisible ? "12%" : "5%" }]}>Login</Text>

                    <View style={styles.emailContainer}>
                        <TextInput
                            style={styles.inputStyle}
                            placeholder="Username"
                            placeholderTextColor={"grey"}
                            autoCapitalize="none"
                            value={username}
                            onChangeText={setUsername}
                            keyboardType="default"
                        />
                        {/* <TextInput 
                        style={styles.inputStyle} 
                        placeholder="Email" 
                        placeholderTextColor={"grey"} 
                        autoCapitalize="none" 
                        value={email} 
                        onChangeText={setEmail} 
                        keyboardType="email-address" 
                    /> */}

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
                        <CustomButton btnColor={theme.customButtonBg} textColor={theme.customButtonText} title="Login" onPress={() => { Keyboard.dismiss, navigation.navigate("Home"); }} />
                        <Text style={{ textAlign: 'center', marginVertical: 20, color: theme.text }}>Create an account</Text>
                        <Text style={{ textAlign: 'center', marginVertical: 20, color: theme.text }}>____________  or  ____________</Text>
                        <CustomButton btnColor="#FFFFFF33" textColor={"#ccc"} title="Continue with Google" onPress={() => navigation.navigate("https://www.google.com")} />
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

    /* ✅ Password Input Style */
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.loginInput,
        borderRadius: 12,
        width: "80%",
        paddingHorizontal: 15,
        height: 60,
        marginVertical: 20,
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
        tintColor: "black",  // ✅ Adjust color as needed
    },

    buttonPosition: { alignSelf: "center", width: "100%", marginTop: 10, justifyContent: 'space-around' },
});

export default LoginScreen;
