import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import CustomButton from "../components/CustomButton";
import HandleBar from "../components/HandleBar";
import ThemeToggle from "../components/ThemeToggle";
import { useTheme } from "../components/ThemeContext";
import Ionicons from 'react-native-vector-icons/Ionicons';
// import AsyncStorage from '@react-native-async-storage/async-storage';

// Firebase Auth Import
import auth from '@react-native-firebase/auth';

const SignUpScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState(""); // ✅ Added confirm password state
    const [isPasswordVisible, setPasswordVisible] = useState(false);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState(""); // ✅ Error message state
    const [successMessage, setSuccessMessage] = useState(""); // ✅ success message state
    const [isPasswordValid, setIsPasswordValid] = useState(null);
    const [isOTPSent, setIsOTPSent] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState(null);

    useEffect(() => {
        const keyboardShowListener = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
        const keyboardHideListener = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));

        return () => {
            keyboardShowListener.remove();
            keyboardHideListener.remove();
        };
    }, []);


    const gotoUsernameScreen = (email, password) => {
        navigation.navigate("UsernameScreen", {
            email: email,
            password: password,
        });
    }

    const handleSignUp = async () => {
        setErrorMessage("");
        // Email format validation using regex
        // const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!email || !password || !confirmPassword) {
            setErrorMessage("All fields are required!");
        }
        // else if (!emailRegex.test(email)) {
        //     setErrorMessage("Invalid email format.");
        // }
        else {
            const proceed = checkPasswordValidation(password, confirmPassword);
            if (proceed) {
                Keyboard.dismiss();

                // gotoUsernameScreen()

                // try {
                //     // await auth().createUserWithEmailAndPassword(email, password);
                //     const verified = await sendEmailVerification(email);
                // } catch (error) {
                //     if (error.code === "auth/email-already-in-use") {
                //         setErrorMessage("Email already in use!");
                //     } else {
                //         setErrorMessage("Error signing up. Try again!");
                //     }
                // }

                // if (verified) {

                auth()
                    .createUserWithEmailAndPassword(email, password)
                    .then(() => {
                        // Successful Sign-Up
                        navigation.replace("Home");
                    })
                    .catch((error) => {
                        // Handle errors here
                        if (error.code === 'auth/email-already-in-use') {
                            setErrorMessage("This email address is already in use!");
                        } else if (error.code === 'auth/invalid-email') {
                            setErrorMessage("Invalid email format!");
                        } else {
                            setErrorMessage("Password must be atleast 6 character(s) long");
                        }
                    });
            }
        }
    }


    // const sendEmailVerification = async (email) => {
    //     const actionCodeSettings = {
    //         url: "https://your-app.page.link",  // Replace with your dynamic link
    //         handleCodeInApp: true,
    //         android: { packageName: "com.yourapp", installApp: true },
    //         iOS: { bundleId: "com.yourapp.ios" }
    //     };

    //     try {
    //         await auth().sendSignInLinkToEmail(email, actionCodeSettings);
    //         setSuccessMessage("Verification link sent to email!");
    //         return true;
    //     } catch (error) {
    //         setErrorMessage("Failed to send verification link!");
    //         return false;
    //     }
    // };





    const checkPasswordValidation = (password, confirmPassword) => {

        const isFilled = password && confirmPassword;
        const isMatch = password === confirmPassword;

        setErrorMessage(isFilled && !isMatch ? "Passwords do not match!" : "");
        setIsPasswordValid(isFilled && isMatch);
        return isFilled && isMatch;
    }


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} >
            <View style={[styles.screen, { flex: 1 }]}>
                <View style={{ alignSelf: 'center', position: 'absolute', top: 120, right: null, transform: [{ scale: 5 }], zIndex: 5 }}>
                    <ThemeToggle iconColor={'transparent'} />
                </View>
                <Image source={theme.logo} style={styles.logo} />

                <View style={[styles.container, { marginTop: keyboardVisible ? "10%" : "55%" }]}>
                    <HandleBar />
                    <Text style={[styles.title, { marginTop: keyboardVisible ? "5%" : "5%" }]}>SignUp</Text>

                    {errorMessage ? <Text style={{ color: "red", textAlign: "center", marginTop: 10, marginBottom: -20, }}>{errorMessage}</Text> : null}

                    <View style={styles.emailContainer}>
                        <TextInput
                            style={styles.inputStyle}
                            placeholder="Email"
                            placeholderTextColor={"grey"}
                            autoCapitalize="none"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                        />

                        {/* <TextInput
                            style={styles.inputStyle}
                            placeholder="Username"
                            placeholderTextColor={"grey"}
                            autoCapitalize="none"
                            value={username}
                            onChangeText={setUsername}
                            keyboardType="default"
                        /> */}

                        {/* ✅ Password Input with Show/Hide Eye Icon */}
                        <View style={[styles.passwordContainer, {
                            borderColor: isPasswordValid === null ? "transparent" : isPasswordValid ? "green" : "red",
                            borderWidth: password && confirmPassword ? 2 : 0
                        }]}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Password"
                                placeholderTextColor={"grey"}
                                autoCapitalize="none"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    checkPasswordValidation(text, confirmPassword);
                                }}
                                secureTextEntry={!isPasswordVisible}
                            />
                            <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)} style={styles.eyeIconContainer} activeOpacity={0.8}>
                                <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={22} color={theme.text} style={styles.eyeIcon} />
                            </TouchableOpacity>
                        </View>

                        {/* ✅ Confirmation Password Input with Show/Hide Eye Icon */}
                        <View style={[styles.passwordContainer, {
                            borderColor: isPasswordValid === null ? "transparent" : isPasswordValid ? "green" : "red",
                            borderWidth: password && confirmPassword ? 2 : 0
                        }]}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="Confirm Password"
                                placeholderTextColor={"grey"}
                                autoCapitalize="none"
                                value={confirmPassword} // ✅ Use confirmPassword state
                                onChangeText={(text) => {
                                    setConfirmPassword(text);
                                    checkPasswordValidation(password, text);
                                }}
                                secureTextEntry={!isPasswordVisible}
                            />
                            <TouchableOpacity onPress={() => setPasswordVisible(!isPasswordVisible)} style={styles.eyeIconContainer} activeOpacity={0.8}>
                                <Ionicons name={isPasswordVisible ? "eye" : "eye-off"} size={22} color={theme.text} style={styles.eyeIcon} />
                            </TouchableOpacity>
                        </View>
                    </View>


                    <View style={styles.buttonPosition}>
                        <CustomButton btnColor={theme.customButtonBg} textColor={theme.customButtonText} title="SignUp" onPress={handleSignUp} />
                        <TouchableOpacity onPress={() => { Keyboard.dismiss, navigation.replace("Login"); }} >
                            <Text style={{ textAlign: 'center', marginVertical: 20, color: theme.text }}>Already have an account?</Text>
                        </TouchableOpacity>
                        <Text style={{ textAlign: 'center', marginVertical: 20, color: theme.text }}>____________  or  ____________</Text>
                        <CustomButton btnColor={theme.customGoogleButtonBg} textColor={theme.customGoogleButtonText} title="Continue with Google" onPress={gotoUsernameScreen} />
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
        zIndex: 10,
    },
    emailContainer: { justifyContent: "center", alignItems: "center", marginTop: "10%" },
    title: { color: theme.text, fontWeight: "bold", fontSize: 35, textAlign: "center" },

    inputStyle: {
        backgroundColor: theme.loginInput,
        color: theme.text,
        borderRadius: 12,
        paddingHorizontal: 22,
        height: 60,
        width: "80%",
        textAlignVertical: "center",
        marginVertical: 10,
    },

    /* ✅ Password Input Style */
    passwordContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: theme.loginInput,
        borderRadius: 12,
        borderWidth: 0,
        width: "80%",
        paddingHorizontal: 15,
        height: 60,
        marginVertical: 10,
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
        tintColor: "black",
    },

    buttonPosition: { alignSelf: "center", width: "100%", marginTop: 30, justifyContent: 'space-around' },
});

export default SignUpScreen;
