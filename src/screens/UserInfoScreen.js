import React, { useState, useEffect } from "react";
import {
    KeyboardAvoidingView,
    ScrollView,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { useUser } from "../components/UserContext";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Keyboard as RNKeyboard,
} from "react-native";
// import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../components/ThemeContext";
import { launchImageLibrary } from "react-native-image-picker";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
// import DateTimePicker from '@react-native-community/datetimepicker';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, query, where } from "firebase/firestore";

const UserInfoScreen = ({ navigation }) => {
    const route = useRoute();
    const { isUserFresh } = route.params || {};
    const { userEmail } = useUser();
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);

    // const auth = getAuth();
    const db = getFirestore();

    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);

    useEffect(() => {
        if (userEmail) {
            fetchData();
        }
        else {
            alert("data not fetched!")
            return;
        }

        const keyboardDidShowListener = RNKeyboard.addListener("keyboardDidShow", () => {
            setKeyboardVisible(true);
        });

        const keyboardDidHideListener = RNKeyboard.addListener("keyboardDidHide", () => {
            setKeyboardVisible(false);
        });

        return () => {
            keyboardDidShowListener.remove();
            keyboardDidHideListener.remove();
        };
    }, [userEmail]);


    const fetchData = async () => {
        if (!userEmail) return;

        try {
            const userRef = collection(db, "Users");
            const q = query(userRef, where("email", "==", userEmail));
            const snapshot = await getDocs(q);

            if (!snapshot.empty) {
                const userDoc = snapshot.docs[0];
                const data = userDoc.data();
                setUsername(data.username || "");
                setEmail(data.email || "");
                setName(data.name || "");
                setDob(data.dob || "");
                setLocation(data.location || "");
                setImage(data.profilePic || null);
            } else {
                console.log("User not found in Database!");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };


    const saveData = async (email) => {
        // if (!username || !dob || !location) {
        //     alert("Username, DOB, and Location are required!");
        //     return;
        // }

        const db = getFirestore();
        // const auth = getAuth();
        // const user = auth.currentUser;

        // if (!user || !user.email) {
        //     alert("User not logged in properly!");
        //     return;
        // }

        try {
            console.log("Logged-in Email:", email); // Debugging

            if (email) {
                // const email = user.email;
                // const userRef = doc(db, "Users", user.uid);
                const userRef = collection(db, "Users");
                const q = query(userRef, where("email", "==", email.toLowerCase()));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const userDoc = snapshot.docs[0];
                    const userIdToUpdate = userDoc.id;

                    await updateDoc(doc(db, "Users", userIdToUpdate), {
                        username,
                        name,
                        dob,
                        location,
                        profilePic: image,
                    });

                    alert("Profile updated!");
                    // navigation.replace("Settings"); // for fast info update in settings but double back to go Home

                    navigation.reset({
                        index: 1,
                        routes: [{ name: "Home" }, { name: "Settings" }],
                    });


                } else {
                    alert("User not found!");
                }
            }
            else {
                alert("Email not found!");
                return;
            }
        } catch (error) {
            alert("Error saving data: " + error.message);
        }
    };

    const usernameValidation = (input) => {
        let cleanedInput = input.toLowerCase().replace(/[^a-z0-9_.]/g, ""); // only valid chars

        // Limit max 3 consecutive dots or underscores
        cleanedInput = cleanedInput.replace(/(\.{4,})/g, "..."); // more than 3 dots -> ...
        cleanedInput = cleanedInput.replace(/(_{4,})/g, "___");  // more than 3 underscores -> ___

        setUsername(cleanedInput);

        const usernameRegex = /^(?=[a-z0-9_.]{3,16}$)[a-z0-9_]+[a-z0-9_.]*$/;

        if (!usernameRegex.test(cleanedInput)) {
            setErrorMessage("Username can contain letters, numbers, (.) and (_)\nMax 3 (.) or (_) in a row, 3-16 chars long");
        } else {
            setErrorMessage("");
        }
    };




    const pickImage = () => {
        launchImageLibrary({ mediaType: "photo", quality: 1 }, (response) => {
            if (!response.didCancel && !response.error) {
                setImage(response.assets[0].uri);
            }
        });
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>

                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name="close" size={30} color={theme.text} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={() => saveData(userEmail)}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>

                {(!isKeyboardVisible && !isUserFresh) && (
                    <TouchableOpacity onPress={pickImage} activeOpacity={0.85} style={styles.imageContainer}>
                        <Image source={image ? { uri: image } : require("../../assets/banana_cat.jpg")} style={styles.profileImage} />
                        <Ionicons name="create-outline" size={30} color={theme.primaryColor} style={styles.editIcon} />
                    </TouchableOpacity>
                )}


                <View style={styles.inputContainer}>
                    <TextInput placeholder="Username" value={username} onChangeText={usernameValidation} style={[styles.inputStyle, { textTransform: 'lowercase' }]} placeholderTextColor={theme.text} />
                    <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={[styles.inputStyle, { color: 'grey', opacity: 1 }]} placeholderTextColor={theme.text} editable={false} />
                    <TextInput placeholder="Name (Optional)" value={name} onChangeText={setName} style={styles.inputStyle} placeholderTextColor={theme.text} />
                    <TextInput placeholder="Date of Birth*" value={dob} onChangeText={setDob} style={styles.inputStyle} placeholderTextColor={theme.text} />
                    <TextInput placeholder="Location in College" value={location} onChangeText={setLocation} style={styles.inputStyle} placeholderTextColor={theme.text} />
                </View>
            </View>
        </TouchableWithoutFeedback>

    );
};

const dynamicTheme = (theme) => ({
    container: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        backgroundColor: theme.background,
    },


    header: { marginTop: 30, marginBottom: 40, paddingHorizontal: 4, backgroundColor: 'transparent', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', },
    closeButton: {
        // position: "absolute",
        // top: 50,
        // left: 30,
    },
    saveButton: {
        // marginTop: 20,
        // position: 'absolute',
        // top: 40,
        // right: 22,
        backgroundColor: theme.primaryColor,
        padding: 10,
        borderRadius: 30,
        width: "24%",
        alignItems: "center",
    },
    saveButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
    },


    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:'red',
        // width:'100%',
        marginTop: 0,
        padding: 30,
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: theme.primaryColor,
        transform: [{ scale: 1.4 }]
    },
    editIcon: {
        position: "absolute",
        bottom: 10,
        right: 10,
        alignSelf: 'center',
        backgroundColor: "white",
        borderRadius: 12,
        padding: 2,
    },


    inputContainer: { width: '100%', alignSelf: 'center', backgroundColor: 'transparent', justifyContent: 'center', alignItems: 'center', },
    input: { borderWidth: 1.2, borderColor: theme.primaryColor, borderRadius: 8, paddingVertical: 16, paddingLeft: 18, marginVertical: 10, fontSize: 16, color: theme.text, width: '85%' },

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

});

export default UserInfoScreen;
