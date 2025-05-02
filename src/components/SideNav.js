import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Section, SettingItem } from "../components/SettingsItem";
import { useTheme } from './ThemeContext';

const { width, height } = Dimensions.get('window'); // Full screen width & height

const SideNav = ({ isVisible, toggleVisibility }) => {
    const [slideAnim] = useState(new Animated.Value(-width / 1.5));
    const { theme } = useTheme();
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
            {/* <View style={styles.header}>
                <TouchableOpacity onPress={toggleVisibility}>
                    <MaterialIcons name="close" size={28} color={theme.text} />
                </TouchableOpacity>
                <Text style={styles.headerText}>Menu</Text>
            </View> */}

            <View style={styles.menu}>
                <SettingItem icon={isDarkMode ? "notifications-outline" : "notifications"} label="Appearance" isFirst arrow={false} height={20} />
                <SettingItem icon={isDarkMode ? "time-outline" : "time"} label="Order History" arrow={false} height={20} />
                <SettingItem icon={isDarkMode ? "cog-outline" : "cog"} label="Settings" arrow={false} height={20} />
                <SettingItem icon={isDarkMode ? "help-circle-outline" : "help-circle"} label="About" arrow={false} height={20} />
                <SettingItem icon={isDarkMode ? "notifications-outline" : "notifications"} label="FAQ" arrow={false} height={20} />
            </View>
        </Animated.View>
    );
};

const dynamicTheme = (theme) => ({
    container: {
        position: 'absolute',
        top: '17%',
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: 30,
        paddingHorizontal: 20,
        height: '12%',
        backgroundColor: 'red',
        // backgroundColor: 'transparent',
    },
    headerText: {
        color: theme.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    menu: {
        // paddingHorizontal: 10,
        // paddingVertical: 10,
        // gap: 16,
        // marginTop: 20,
        // backgroundColor: '#ccc'
    },
});

export default SideNav;
