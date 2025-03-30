import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert } from "react-native";
import { useRoute } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { useTheme } from "../components/ThemeContext";

import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const UsernameScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);

    const [username, setUsername] = useState("");
    const [name, setName] = useState("");
    const [errorMessage, setErrorMessage] = useState(""); // ✅ Error message state
    const route = useRoute();

    const { email, password } = route.params;


    const handleCompleteSignup = async () => {
        const usernameRegex = /^(?=[a-z0-9_.]{3,16}$)[a-z0-9_]+[a-z0-9_.]*$/;

        if (!username.trim()) {
            // Alert.alert("Error", "Username is required");
            setErrorMessage("Username is required!");
            return;
        }

        const formattedUsername = username.toLowerCase(); // Auto convert to lowercase

        if (!usernameRegex.test(formattedUsername)) {
            setErrorMessage("Username can contain letters, numbers, (.) and (_)\n[3-16 characters long]");
            // Alert.alert("Error", "Invalid username! Must be 3-10 chars, no consecutive dots.");
            return;
        }

        console.log("Email:", email);
        console.log("Password:", password);

        auth()
            .createUserWithEmailAndPassword(email, password)
            .then(() => {
                auth().currentUser.updateProfile({
                    displayName: formattedUsername
                }).then(() => {
                    navigation.replace("Home");
                });
            })
            .catch((error) => {
                if (error.code === 'auth/email-already-in-use') {
                    setErrorMessage("This email address is already in use!");
                } else if (error.code === 'auth/invalid-email') {
                    setErrorMessage("Invalid email format!");
                } else {
                    setErrorMessage("Something went wrong. Please try again.");
                }
            });
    };


    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 23, fontWeight: "bold", color: theme.text, marginBottom: 70, marginTop: 70, }}>Choose a Username</Text>
            {errorMessage ? <Text style={{ color: "red", textAlign: "center", marginTop: 10, fontSize: 12, marginHorizontal: 30, }}>{errorMessage}</Text> : null}
            <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.inputStyle}
            />
            <TextInput
                placeholder="Name (Optional)"
                value={name}
                onChangeText={setName}
                style={styles.inputStyle}
            />

            <View style={styles.btnPosition}>
                <CustomButton btnColor={theme.customButtonBg} textColor={theme.customButtonText} title="Complete SignUp" onPress={handleCompleteSignup} />
            </View>
        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: {
        backgroundColor: theme.background,
        height: '100%',
        // justifyContent: 'center',
        alignItems: 'center',
    },

    inputStyle: {
        backgroundColor: theme.loginInput,
        color: theme.text,
        borderRadius: 12,
        paddingHorizontal: 22,
        height: 60,
        width: "80%",
        textAlignVertical: "center",
        marginVertical: 17,
        // alignSelf: 'center',
    },

    btnPosition: {
        position: 'absolute',
        bottom: 20,
        alignSelf: 'center',
        width: '100%',
    },

});

export default UsernameScreen;
