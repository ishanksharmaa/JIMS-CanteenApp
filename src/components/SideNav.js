import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Section, SettingItem } from "../components/SettingsItem";
import ThemeToggle from "../components/ThemeToggle";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from './ThemeContext';

const { width, height } = Dimensions.get('window'); // Full screen width & height

const SideNav = ({ isVisible, toggleVisibility }) => {
    const [slideAnim] = useState(new Animated.Value(-width / 1.5));
    const { theme } = useTheme();
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

    return (
        <Animated.View style={[styles.container, { left: slideAnim }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={toggleVisibility} style={styles.closeIcon}>
                    <MaterialIcons name="close" size={27} color={'#eee'} />
                </TouchableOpacity>
                <View style={styles.themeIcon}>
                    <ThemeToggle iconColor={"#eee"} size={24} />
                </View>
                <Text style={styles.headerText}>JIMS Canteen</Text>
            </View>

            <View style={styles.menu}>
                <SettingItem icon={isDarkMode ? "color-palette-outline" : "color-palette"} label="Appearance" isFirst arrow={false} height={20} onPress={() => navigation.navigate("Appearance")} />
                <SettingItem icon={isDarkMode ? "time-outline" : "time"} label="Order History" arrow={false} height={20} onPress={() => navigation.navigate("History")} />
                <SettingItem icon={isDarkMode ? "cog-outline" : "cog"} label="Settings" arrow={false} height={20} onPress={() => navigation.navigate("Settings")} />
                <SettingItem icon={isDarkMode ? "mail-open-outline" : "mail-open"} label="Feedback" arrow={false} height={20} onPress={() => navigation.navigate("FAQ")} />
                <SettingItem icon={isDarkMode ? "people-outline" : "people"} label="Contact Us" arrow={false} height={20} onPress={() => navigation.navigate("FAQ")} />
                <SettingItem icon={isDarkMode ? "help-circle-outline" : "help-circle"} label="About" arrow={false} height={20} onPress={() => navigation.navigate("UserInfo")} />
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
        width: width / 1.6, // Half of screen width
        height: height,    // Full screen height
        backgroundColor: theme.searchBg,
        // backgroundColor: theme.background,
        // backgroundColor: 'red',
        zIndex: 9999,
        paddingTop: 0,
    },
    header: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-end',
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
        color: theme.text,
        color: '#eee',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10
    },
    menu: {
        // paddingHorizontal: 10,
        // paddingVertical: 10,
        // gap: 16,
        // marginTop: 20,
        // backgroundColor: '#ccc'
    },
    closeIcon: {
        position: 'absolute',
        top: 50,
        left: 22,
    },
    themeIcon: {
        position: 'absolute',
        top: 50,
        right: 22,
    },
});

export default SideNav;
