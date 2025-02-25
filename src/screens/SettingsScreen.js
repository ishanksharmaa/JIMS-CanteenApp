import React from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView } from "react-native";
import { useNavigation } from "@react-navigation/native";
// import { Switch } from "react-native-paper";
import { useTheme } from "../components/ThemeContext";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { IOSSwitch } from "../components/IOSSwitch"
import {Section, SettingItem} from "../components/SettingsItem"

const SettingsScreen = () => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.6} >
                    <Ionicons name="chevron-back-outline" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
            </View>

            <ScrollView style={{ flex: 1, backgroundColor: theme.background, paddingTop: 20 }}>
                <Section title="General">
                    <SettingItem icon="notifications-outline" label="Notifications" hasSwitch />
                    <SettingItem icon="color-palette-outline" label="Appearance" isThemeSwitch onPress={() => navigation.navigate("Appearance")} isLast />
                </Section>

                <Section title="Account">
                    <SettingItem icon="person-circle-outline" label="Profile" />
                    <SettingItem icon="lock-closed-outline" label="Privacy" isLast />
                </Section>

                <Section title="Support">
                    <SettingItem icon="help-circle-outline" label="Help & Support" />
                    <SettingItem icon="information-circle-outline" label="About" isLast />
                </Section>
            </ScrollView>
        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: { flex: 1, backgroundColor: theme.background },
    header: { margin: 20, marginTop: '14%', flexDirection: "row", alignItems: "center", backgroundColor: '', justifyContent: 'center' },
    title: { fontSize: 30, color: theme.text, fontWeight: 'bold', marginLeft: 12 },
    backBtn: { padding: 7, borderRadius: 20, backgroundColor: theme.backBtnBg, position: 'absolute', left: 2 },
});

export default SettingsScreen;
