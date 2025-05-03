import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions, Alert } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Section, SettingItem } from "../components/SettingsItem";
import ThemeToggle from "../components/ThemeToggle";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from './ThemeContext';
import { useUser } from './UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import auth from '@react-native-firebase/auth';


const { width, height } = Dimensions.get('window'); // Full screen width & height

const SideNav = ({ isVisible, toggleVisibility }) => {
    const [slideAnim] = useState(new Animated.Value(-width / 1.5));
    const { theme } = useTheme();
    const { refreshUser, user } = useUser();
    const navigation = useNavigation();
    const styles = dynamicTheme(theme);
    const isDarkMode = theme.mode === 'dark';

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
                    {/* <MaterialIcons name="close" size={27} color={'#eee'} /> */}
                </TouchableOpacity>
                <View style={styles.themeIcon}>
                    <ThemeToggle iconColor={"#eee"} size={24} />
                </View>
                {/* <Image source={require("../../assets/app_logo_black.png")} style={styles.bannerPic} /> */}
                <Image source={theme.logo} style={styles.bannerPic} />
                {/* <Text style={styles.headerText}>JIMS Canteen</Text> */}
            </View>

            <View style={styles.menu}>
                <SettingItem icon={isDarkMode ? "enter-outline" : "enter"} label="SignIn" arrow={false} height={13} onPress={() => navigation.navigate("Login")} isFirst show={user ? false : true} />
                <SettingItem icon={isDarkMode ? "add-outline" : "add"} label="Create an account" arrow={false} height={14} marginBottom={12} onPress={() => navigation.navigate("SignUp")} isFirst show={user ? false : true} />

                <View style={{ borderTopWidth: user ? 0 : 1.1, borderTopColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.093)' : 'rgba(0, 0, 0, 0.097)', marginHorizontal: 8 }} />
                <SettingItem icon={isDarkMode ? "color-palette-outline" : "color-palette"} label="Appearance" arrow={false} height={18} onPress={() => navigation.navigate("Appearance")} isFirst={user ? true : true} />
                <SettingItem icon={isDarkMode ? "time-outline" : "time"} label="Order History" arrow={false} height={18} onPress={() => navigation.navigate("History")} isFirst />
                <SettingItem icon={isDarkMode ? "cog-outline" : "cog"} label="Settings" arrow={false} height={20} onPress={() => navigation.navigate("Settings")} isFirst />

                <View style={{ borderTopWidth: 1.1, borderTopColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.093)' : 'rgba(0, 0, 0, 0.097)', marginHorizontal: 8 }} />
                <SettingItem icon={isDarkMode ? "mail-open-outline" : "mail-open"} label="Feedback" arrow={false} height={18} onPress={() => navigation.navigate("FAQ")} isFirst />
                <SettingItem icon={isDarkMode ? "people-outline" : "people"} label="Contact Us" arrow={false} height={18} onPress={() => navigation.navigate("FAQ")} isFirst />
                {/* <SettingItem icon={isDarkMode ? "help-circle-outline" : "help-circle"} label="About" arrow={false} height={18} onPress={() => navigation.navigate("UserInfo")} isFirst /> */}
                <SettingItem icon={isDarkMode ? "information-circle-outline" : "information-circle"} label="About" arrow={false} height={18} onPress={() => navigation.navigate("UserInfo")} isFirst />

                <View style={{ borderTopWidth: user ? 1.1 : 0, borderTopColor: theme.mode === 'dark' ? 'rgba(255, 255, 255, 0.093)' : 'rgba(0, 0, 0, 0.097)', marginHorizontal: 8 }} />
                <SettingItem icon={isDarkMode ? "exit-outline" : "exit"} label="LogOut" arrow={false} height={18} onPress={handleLogout} isFirst show={user ? true : false} />
            </View>
        </Animated.View>
    );
};

const dynamicTheme = (theme) => ({
    container: {
        position: 'absolute',
        // top: '17%',
        top: 0,
        bottom: 0,
        left: 0,
        width: width / 1.5, // Half of screen width
        height: height,    // Full screen height
        backgroundColor: theme.searchBg,
        // backgroundColor: theme.background,
        // backgroundColor: 'red',
        zIndex: 9999,
        paddingTop: 0,
    },
    header: {
        borderBottomRightRadius: "24%",
        flexDirection: 'column',
        alignItems: 'start',
        justifyContent: 'center',
        gap: 15,
        paddingLeft: 11,
        // paddingTop: 50,
        marginBottom: 10,
        paddingHorizontal: 20,
        height: '20%',
        backgroundColor: theme.mode === 'dark' ? theme.primaryColor : theme.customButtonBg,
        backgroundColor: theme.primaryColor,
        // backgroundColor: 'transparent',
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
        paddingHorizontal: 9,
        paddingVertical: 3,
        // backgroundColor: 'green'
    },
    closeIcon: {
        position: 'absolute',
        top: 50,
        left: 22,
    },
    themeIcon: {
        position: 'absolute',
        top: 45,
        right: 22,
    },
    bannerPic: {
        height: '90%',
        width: '65%',
        alignSelf: 'center',
        marginTop: 16,
    },
});

export default SideNav;
