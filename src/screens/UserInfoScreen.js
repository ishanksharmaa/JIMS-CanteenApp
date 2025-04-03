import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
} from "react-native";
// import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../components/ThemeContext";
import { launchImageLibrary } from "react-native-image-picker";
import Ionicons from 'react-native-vector-icons/Ionicons';
// import DateTimePicker from '@react-native-community/datetimepicker';

import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, collection, doc, setDoc, getDoc, getDocs, updateDoc, query, where } from "firebase/firestore";

const UserInfoScreen = ({ navigation }) => {
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

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (authUser) => {
            if (authUser) {
                setUser(authUser);
                setEmail(authUser.email); // Ensure email is set
                fetchData(authUser); // Pass user directly
            } else {
                alert("User not logged in!");
            }
        });
        return () => unsubscribe();
    }, []);

    const fetchData = async (authUser) => { // Take user as parameter
        if (!authUser) return;

        try {
            console.log("Fetching data for UID:", authUser.uid); // Debugging
            const userDoc = await getDoc(doc(db, "Users", authUser.uid));

            if (userDoc.exists()) {
                const data = userDoc.data();
                setUsername(data.username || "");
                setEmail(data.email || "");
                setName(data.name || "");
                setDob(data.dob || "");
                setLocation(data.location || "");
                setImage(data.profilePic || null);
            } else {
                console.log("User document does not exist in Firestore.");
            }
        } catch (error) {
            alert("Error fetching data: " + error.message);
        }
    };


    // import { query, where } from "firebase/firestore";

    const saveData = async (user) => {
        if (!username || !dob || !location) {
            alert("Username, DOB, and Location are required!");
            return;
        }

        const db = getFirestore();
        // const auth = getAuth();
        // const user = auth.currentUser;

        // if (!user || !user.email) {
        //     alert("User not logged in properly!");
        //     return;
        // }

        try {
            // console.log("Logged-in Email:", user.email); // Debugging

            if (user) {
                // const email = user.email;
                // const userRef = doc(db, "Users", user.uid);
                const userRef = collection(db, "Users");
                const q = query(userRef, where("email", "==", user.email));
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
                    navigation.goBack();
                } else {
                    alert("User not found!");
                }
            }
        } catch (error) {
            alert("Error saving data: " + error.message);
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
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.closeButton}
                onPress={() => navigation.goBack()}
            >
                <Ionicons name="close" size={30} color={theme.text} />
            </TouchableOpacity>
            <TouchableOpacity onPress={pickImage} activeOpacity={0.85} style={styles.imageContainer}>
                <Image source={image ? { uri: image } : require("../../assets/banana_cat.jpg")} style={styles.profileImage} />
                <Ionicons name="create-outline" size={30} color={theme.primaryColor} style={styles.editIcon} />
            </TouchableOpacity>
            <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} placeholderTextColor={theme.text} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} placeholderTextColor={theme.text} />
            <TextInput placeholder="Name (Optional)" value={name} onChangeText={setName} style={styles.input} placeholderTextColor={theme.text} />
            <TextInput placeholder="Date of Birth*" value={dob} onChangeText={setDob} style={styles.input} placeholderTextColor={theme.text} />
            <TextInput placeholder="Location in College" value={location} onChangeText={setLocation} style={styles.input} placeholderTextColor={theme.text} />
            <TouchableOpacity style={styles.saveButton} onPress={() => saveData(user)}>
                <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: {
        flex: 1,
        padding: 20,
        alignItems: "center",
        backgroundColor: theme.background,
    },
    closeButton: {
        position: "absolute",
        top: 50,
        left: 30,
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor:'red',
        // width:'100%',
        marginTop: 80,
        padding: 30,
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 1,
        borderColor: theme.primaryColor,
        transform: [{ scale: 1.6 }]
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
    input: { borderWidth: 1.2, borderColor: theme.primaryColor, borderRadius: 8, paddingVertical: 16, paddingLeft: 18, marginVertical: 10, fontSize: 16, color: theme.text, width: '90%' },
    saveButton: {
        // marginTop: 20,
        position: 'absolute',
        top: 40,
        right: 22,
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
});

export default UserInfoScreen;
