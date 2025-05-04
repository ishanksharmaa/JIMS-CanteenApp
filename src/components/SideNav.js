import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Section, SettingItem } from "../components/SettingsItem";
import ThemeToggle from "../components/ThemeToggle";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from './ThemeContext';
import { useUser } from './UserContext';
import { useMemeCat } from "../components/MemeCatContext";

import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';


const { width, height } = Dimensions.get('window'); // Full screen width & height

const SideNav = ({ isVisible, toggleVisibility }) => {
    const [slideAnim] = useState(new Animated.Value(-width / 1.5));
    const { theme } = useTheme();
    const { isMemeCatsEnabled, isNavHeaderEnabled } = useMemeCat();
    const { refreshUser, user } = useUser();
    const navigation = useNavigation();
    const isDarkMode = theme.mode === 'dark';
    const lineDividerWidth = 7;

    // const headerBg = "transparent";
    const themeIconColor = 'transparent';
    const headerBg = theme.primaryColor;
    // const themeIconColor = "#eee";
    const styles = dynamicTheme(theme, headerBg, themeIconColor, isNavHeaderEnabled);


    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: isVisible ? 0 : -width / 1.5,
            duration: 300,
            easing: Easing.out(Easing.ease),
            useNativeDriver: false,
        }).start();
    }, [isVisible]);

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


    return (
        <Animated.View style={[styles.container, { left: slideAnim }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleVisibility} style={styles.closeIcon}>
                    <MaterialIcons name="close" size={26} color={theme.closeNavIcon} />
                </TouchableOpacity>
                <View style={styles.themeIcon}>
                    <ThemeToggle iconColor={themeIconColor} size={100} />
                </View>
                {/* <Image source={require("../../assets/app_logo_black.png")} style={styles.bannerPic} /> */}
                <Image source={theme.logo} style={styles.bannerPic} />
                {/* <Text style={styles.headerText}>JIMS Canteen</Text> */}
            </View>

            <View style={styles.menu}>
                <SettingItem icon={isDarkMode ? "enter-outline" : "enter"} label="SignIn" arrow={false} height={13} onPress={() => navigation.navigate("Login")} isFirst show={user ? false : true} />
                <SettingItem icon={isDarkMode ? "add-outline" : "add"} label="Create an account" arrow={false} height={14} marginBottom={12} onPress={() => navigation.navigate("SignUp")} isFirst show={user ? false : true} />

                <View style={{ borderTopWidth: user ? 0 : 1.1, borderTopColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.093)' : 'rgba(0, 0, 0, 0.097)', marginHorizontal: lineDividerWidth }} />
                <SettingItem icon={isDarkMode ? "color-palette-outline" : "color-palette"} label="Appearance" arrow={false} height={18} onPress={() => navigation.navigate("Appearance")} isFirst={user ? true : true} />
                <SettingItem icon={isDarkMode ? "create-outline" : "create"} label="Edit Profile" arrow={false} height={18} onPress={() => navigation.navigate("UserInfo")} isFirst />
                <SettingItem icon={isDarkMode ? "time-outline" : "time"} label="Order History" arrow={false} height={18} onPress={() => navigation.navigate("History")} isFirst />
                <SettingItem icon={isDarkMode ? "cog-outline" : "cog"} label="Settings" arrow={false} height={20} onPress={() => navigation.navigate("Settings")} isFirst />

                <View style={{ borderTopWidth: 1.1, borderTopColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.093)' : 'rgba(0, 0, 0, 0.097)', marginHorizontal: lineDividerWidth }} />
                <SettingItem icon={isDarkMode ? "mail-open-outline" : "mail-open"} label="Feedback" arrow={false} height={18} onPress={() => navigation.navigate("FAQ")} isFirst />
                <SettingItem icon={isDarkMode ? "people-outline" : "people"} label="Contact Us" arrow={false} height={18} onPress={() => navigation.navigate("FAQ")} isFirst />
                {/* <SettingItem icon={isDarkMode ? "help-circle-outline" : "help-circle"} label="About" arrow={false} height={18} onPress={() => navigation.navigate("UserInfo")} isFirst /> */}
                <SettingItem icon={isDarkMode ? "information-circle-outline" : "information-circle"} label="About" arrow={false} height={18} onPress={() => navigation.navigate("UserInfo")} isFirst />

                <View style={{ borderTopWidth: user ? 1.1 : 0, borderTopColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.093)' : 'rgba(0, 0, 0, 0.097)', marginHorizontal: lineDividerWidth }} />
                <SettingItem icon={isDarkMode ? "exit-outline" : "exit"} label="LogOut" arrow={false} height={18} onPress={handleLogout} isFirst show={user ? true : false} />
            </View>
        </Animated.View>
    );
};

const dynamicTheme = (theme, headerBg, themeIconColor, isNavHeaderEnabled) => ({
    container: {
        position: 'absolute',
        // top: '17%',
        top: 0,
        bottom: 0,
        left: 0,
        width: width / 1.5, // Half of screen width
        height: height,    // Full screen height
        backgroundColor: theme.screenBg,
        // backgroundColor: theme.background,
        // backgroundColor: 'red',
        zIndex: 999,
        paddingTop: 0,
    },
    header: {
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'center',
        gap: 15,
        paddingLeft: 11,
        marginBottom: 10,
        paddingHorizontal: 20,
        height: '20%',
        width: "91%",
        backgroundColor: isNavHeaderEnabled ? headerBg : 'transparent',
        borderBottomRightRadius: 50,
        borderTopRightRadius: 100,
        borderBottomRightRadius: 100,
        // backgroundColor: theme.mode === 'dark' ? theme.primaryColor : theme.customButtonBg,
        // marginTop: 40,
    },
    headerText: {
        // color: theme.text,
        color: '#eee',
        fontSize: 24,
        fontWeight: 'bold',
        // marginBottom: 10,
        marginTop: 90,
        alignSelf: 'center',
    },
    menu: {
        paddingHorizontal: 14,
        paddingVertical: 3,
        // backgroundColor: 'green'
    },
    closeIcon: {
        position: 'absolute',
        top: 50,
        right: -140,
    },
    themeIcon: {
        position: 'absolute',
        top: 45,
        left: 20,
        zIndex: 500,
    },
    bannerPic: {
        height: '90%',
        width: '63%',
        alignSelf: 'start',
        marginLeft: -12,
        marginTop: 14,
    },
});

export default SideNav;
