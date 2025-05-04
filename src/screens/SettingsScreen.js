import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useTheme } from "../components/ThemeContext";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Section, SettingItem } from "../components/SettingsItem";
import {SideNav} from "../components/SideNav";
import { ProfileSection } from "./ProfileScreen";
import { useUser } from "../components/UserContext";
import FontAwesome6Icon from "react-native-vector-icons/FontAwesome6";
import AsyncStorage from '@react-native-async-storage/async-storage';
// import { useImage } from "../components/ImageContext";


// Firebase Auth used as an Instance (MO CHANGES!!)
// import { getAuth, signOut } from 'firebase/auth';
import auth from '@react-native-firebase/auth';

const SettingsScreen = () => {
    const { user, userEmail, name, username, dob, location, refreshUser } = useUser();
    const { theme } = useTheme();
    // const { profileImage } = useImage();
    const styles = dynamicTheme(theme);
    const navigation = useNavigation();
    const isDarkMode = theme.mode === "dark";
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    // const isUserFresh = false;
    // const isDarkMode = true;
    // const auth = getAuth();

    const handleLogout = () => {
        if (!user) {
            navigation.navigate("Login");
            return;
        }

        Alert.alert(
            "Confirm Logout",
            "Are you sure you want to logout?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Logout",
                    onPress: async () => {
                        try {
                            console.log("Attempting to sign out...");
                            await auth().signOut();
                            await AsyncStorage.clear();
                            refreshUser();
                            // setUser(null);
                            setIsLoggedIn(false);
                            navigation.replace("Login");
                        } catch (error) {
                            console.log("Error signing out:", error);
                            Alert.alert("Error", error.message);
                        }
                    },
                    style: "destructive",
                },
            ]
        );
    };


    useFocusEffect(
        useCallback(() => {
            refreshUser();
        }, [])
    );



    return (
        <View style={styles.container}>
            {/* <SideNav isVisible={false} toggleVisibility={null} handleLogout={handleLogout} /> */}

            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.6} >
                    <Ionicons name={isDarkMode ? "chevron-back-outline" : "chevron-back"} size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
                <TouchableOpacity activeOpacity={0.8} style={styles.editIcon} onPress={() => navigation.navigate("UserInfo", { isUserFresh: false })}>
                    {/* <Text style={{ fontSize: 17, color: theme.primaryColor, fontWeight: '500'}}>Edit</Text> */}
                    <FontAwesome6Icon name="pen-to-square" size={21} color={theme.primaryColor} />
                </TouchableOpacity>
            </View>

            <ScrollView style={{ flex: 1, backgroundColor: theme.background, paddingTop: 20, marginBottom: '20%' }}>
                <View style={{ flex: 0, justifyContent: 'center', alignItems: 'center', marginBottom: 10, paddingLeft: 10, backgroundColor: '' }}>
                    <ProfileSection flexDirection='column' gap={10} scale={1.1} />
                </View>
                <Section title="General">
                    <SettingItem icon={isDarkMode ? "notifications-outline" : "notifications"} label="Notifications" hasSwitch isFirst />
                    <SettingItem icon={isDarkMode ? "color-palette-outline" : "color-palette"} label="Appearance" isThemeSwitch onPress={() => navigation.navigate("Appearance")} />
                    <SettingItem icon={isDarkMode ? "time-outline" : "time"} label="Order History" />
                </Section>

                <Section title="Account">
                    <SettingItem icon={isDarkMode ? "person-circle-outline" : "person-circle"} label="Edit Profile" onPress={() => navigation.navigate("UserInfo", { isUserFresh: false })} isFirst />
                    <SettingItem icon={isDarkMode ? "lock-closed-outline" : "lock-closed"} label="Privacy & Security" />
                </Section>

                <Section title="Support">
                    <SettingItem icon={isDarkMode ? "help-circle-outline" : "help-circle"} label="Help & Support" isFirst />
                    <SettingItem icon={isDarkMode ? "star-outline" : "star"} label="Feedback" />
                    <SettingItem icon={isDarkMode ? "information-circle-outline" : "information-circle"} label="About" />
                </Section>

                <Section title="Exit">
                    <SettingItem icon={isDarkMode ? "exit-outline" : "exit"} label={user ? "LogOut" : "Login"} onPress={handleLogout} isFirst />
                    {!user && (
                        <SettingItem icon={isDarkMode ? "add" : "add"} label="Create account" onPress={() => navigation.navigate("SignUp")} />
                    )}
                </Section>
            </ScrollView>
        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: { flex: 1, backgroundColor: theme.background },
    header: { margin: 20, marginTop: '14%', flexDirection: "row", alignItems: "center", justifyContent: 'center', backgroundColor: '' },
    title: { fontSize: 29, color: theme.text, fontWeight: 'bold', marginLeft: 12 },
    backBtn: { padding: 7, borderRadius: 20, backgroundColor: theme.backBtnBg, position: 'absolute', left: 2 },
    editIcon: { position: 'absolute', right: 3, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 9, backgroundColor: 'transparent' },
});

export default SettingsScreen;
