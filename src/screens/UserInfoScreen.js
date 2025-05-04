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
import { useImage } from '../components/ImageContext';
import { launchImageLibrary } from "react-native-image-picker";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRoute } from '@react-navigation/native';
// import DateTimePicker from '@react-native-community/datetimepicker';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, query, where } from "firebase/firestore";

const UserInfoScreen = ({ navigation }) => {
    const route = useRoute();
    const { isUserFresh } = route.params || {};
    const { userEmail, user } = useUser();
    const { theme } = useTheme();
    const { setProfileImage } = useImage();
    const [isKeyboardVisible, setKeyboardVisible] = useState(false);
    const styles = dynamicTheme(theme, isKeyboardVisible);
    const [isInputFocused, setIsInputFocused] = useState(false);

    // const auth = getAuth();
    const db = getFirestore();

    // const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [dob, setDob] = useState("");
    const [location, setLocation] = useState("");
    const [image, setImage] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (userEmail) {
            fetchData();
        }
        else {
            if (user) {
                alert("data not fetched!")
                return;
            }
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
        if (isUserFresh) {
            if (!name || !location) {
                alert("Name and Location are required!");
                return;
            }
        }

        const db = getFirestore();
        // const auth = getAuth();
        // const user = auth.currentUser;

        // if (!user || !user.email) {
        //     alert("User not logged in properly!");
        //     return;
        // }

        try {
            console.log("Logged-in Email:", email); //Debugging

            if (email) {
                // const email = user.email;
                // const userRef = doc(db, "Users", user.uid);
                const userRef = collection(db, "Users");
                const q = query(userRef, where("email", "==", email.toLowerCase()));
                const snapshot = await getDocs(q);

                if (!snapshot.empty) {
                    const userDoc = snapshot.docs[0];
                    const userIdToUpdate = userDoc.id;
                    // const currentData = userDoc.data();

                    // Use image from state if available, otherwise keep existing
                    const profilePicToSave = image || userDoc.data().profilePic;
                    // const profilePicToSave = image || currentData.profilePic;

                    await updateDoc(doc(db, "Users", userIdToUpdate), {
                        username,
                        name,
                        dob,
                        location,
                        profilePic: profilePicToSave,
                    });

                    // Update context with the saved image
                    if (profilePicToSave) {
                        setProfileImage(profilePicToSave);
                    }

                    if (!isUserFresh) {
                        alert("Profile updated!");
                    }
                    // navigation.replace("Settings"); // for fast info update in settings but double back to go Home

                    navigation.reset({
                        index: 1,
                        routes: [{ name: "Home" }, { name: isUserFresh ? "Home" : "Settings" }],
                    });


                } else {
                    alert("User not found!");
                }
            }
            else {
                navigation.navigate("Login");

                // alert("Email not found!");
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
                setProfileImage(response.assets[0].uri);
                // setProfileImage(uri); // Also store in context
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
                        <Text style={styles.saveButtonText}>{user ? "Save" : "Sign In"}</Text>
                    </TouchableOpacity>
                </View>

                {!isUserFresh && (
                    <Text style={styles.headerTitle}>Edit Profile</Text>
                )}

                {(!isKeyboardVisible && !isUserFresh) && (
                    <TouchableOpacity onPress={pickImage} activeOpacity={0.85} style={styles.imageContainer}>
                        <Image source={image ? { uri: image } : require("../../assets/banana_cat.jpg")} style={styles.profileImage} />
                        <Ionicons name="create-outline" size={30} color={theme.primaryColor} style={styles.editIcon} />
                    </TouchableOpacity>
                )}


                <View style={[styles.inputContainer, { marginTop: isKeyboardVisible ? 0 : 0 }]}>
                    <TextInput placeholder="Username" value={username} onChangeText={usernameValidation} placeholderTextColor={theme.text}
                        onFocus={() => setIsInputFocused('username')} onBlur={() => setIsInputFocused(null)}
                        style={[
                            styles.inputStyle, {
                                textTransform: 'lowercase',
                                borderWidth: isInputFocused === 'username' ? 1 : 0,
                                // color: isInputFocused === 'username' ? theme.primaryColor : theme.text,
                            }]}
                    />

                    {!isUserFresh && (
                        <TextInput placeholder="Email" value={email} onChangeText={setEmail} placeholderTextColor={theme.text} editable={false}
                            onFocus={() => setIsInputFocused('email')} onBlur={() => setIsInputFocused(null)}
                            style={[styles.inputStyle, { color: 'grey', opacity: 1, textTransform: 'lowercase' }]} />
                    )}

                    <TextInput placeholder="Name (Required)" value={name} onChangeText={setName} placeholderTextColor={theme.text}
                        onFocus={() => setIsInputFocused('name')} onBlur={() => setIsInputFocused(null)}
                        style={[styles.inputStyle, {
                            borderWidth: isInputFocused === 'name' ? 1 : 0,
                            // color: isInputFocused === 'name' ? theme.primaryColor : theme.text,
                        }]} />

                    <TextInput placeholder="Date of Birth" value={dob} onChangeText={setDob} placeholderTextColor={theme.text}
                        onFocus={() => setIsInputFocused('dob')} onBlur={() => setIsInputFocused(null)}
                        style={[styles.inputStyle, {
                            borderWidth: isInputFocused === 'dob' ? 1 : 0,
                            // color: isInputFocused === 'dob' ? theme.primaryColor : theme.text,
                        }]} />

                    <TextInput placeholder="Location in College" value={location} onChangeText={setLocation} placeholderTextColor={theme.text}
                        onFocus={() => setIsInputFocused('location')} onBlur={() => setIsInputFocused(null)}
                        style={[styles.inputStyle, {
                            borderWidth: isInputFocused === 'location' ? 1 : 0,
                            // color: isInputFocused === 'location' ? theme.primaryColor : theme.text,
                        }]} />
                </View>
            </View>
        </TouchableWithoutFeedback>

    );
};

const dynamicTheme = (theme, isKeyboardVisible) => ({
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
        width: "20%",
        alignItems: "center",
    },
    saveButtonText: {
        color: "white",
        fontSize: 13,
        fontWeight: "bold",
    },

    headerTitle: {
        color: theme.text,
        fontSize: 21,
        fontWeight: 'bold',
        alignSelf: 'center',
        position: 'absolute',
        top: 55,
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
        marginVertical: isKeyboardVisible ? 9 : 16,
        borderColor: theme.primaryColor,
        // alignSelf: 'center',
    },

});

export default UserInfoScreen;
