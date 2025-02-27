import React from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../components/ThemeContext";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Section, SettingItem } from "../components/SettingsItem";

const SettingsScreen = () => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);
    const navigation = useNavigation();
    const isDarkMode = theme.mode === "dark";
    // const isDarkMode = true;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.6} >
                    <Ionicons name={isDarkMode ? "chevron-back-outline" : "chevron-back"} size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
            </View>

            <ScrollView style={{ flex: 1, backgroundColor: theme.background, paddingTop: 20 }}>
                <Section title="General">
                    <SettingItem icon={isDarkMode ? "notifications-outline" : "notifications"} label="Notifications" hasSwitch />
                    <SettingItem icon={isDarkMode ? "color-palette-outline" : "color-palette"} label="Appearance" isThemeSwitch onPress={() => navigation.navigate("Appearance")} isLast />
                </Section>

                <Section title="Account">
                    <SettingItem icon={isDarkMode ? "person-circle-outline" : "person-circle"} label="Profile" />
                    <SettingItem icon={isDarkMode ? "lock-closed-outline" : "lock-closed"} label="Privacy" isLast />
                </Section>

                <Section title="Support">
                    <SettingItem icon={isDarkMode ? "help-circle-outline" : "help-circle"} label="Help & Support" />
                    <SettingItem icon={isDarkMode ? "information-circle-outline" : "information-circle"} label="About" isLast />
                </Section>
            </ScrollView>
        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: { flex: 1, backgroundColor: theme.background },
    header: { margin: 20, marginTop: '14%', flexDirection: "row", alignItems: "center", justifyContent: 'center' },
    title: { fontSize: 30, color: theme.text, fontWeight: 'bold', marginLeft: 12 },
    backBtn: { padding: 7, borderRadius: 20, backgroundColor: theme.backBtnBg, position: 'absolute', left: 2 },
});

export default SettingsScreen;
