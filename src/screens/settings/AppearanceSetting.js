import React, { useState, useEffect } from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../components/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import MemeCat from "../../components/MemeCat";
import { useMemeCat } from "../../components/MemeCatContext";
import { Section, SettingItem } from "../../components/SettingsItem";

const themes = [
    { name: "Light Theme", color: "#eee", mode: "light", image: require("../../../assets/rasgulla.jpg") },
    { name: "Dark Theme", color: "#222", mode: "dark", image: require("../../../assets/jamun.jpg") },
];

const AppearanceSetting = () => {
    const { theme, changeTheme, setPrimaryColor } = useTheme();
    const styles = dynamicTheme(theme);
    const navigation = useNavigation();
    const {isMemeCatsEnabled, toggleMemeCat} = useMemeCat();

    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.6} >
                    <Ionicons name="chevron-back-outline" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Appearance</Text>
            </View>

            <ScrollView>

                {/* Theme Section */}
                <View style={styles.themeSection}>
                    {themes.map((item) => (
                        <View key={item.name} style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                            <TouchableOpacity
                                style={[styles.themeCard, theme.mode === item.mode && { borderWidth: 2.5, opacity: 1 }]}
                                onPress={() => changeTheme(item.mode)}
                            >
                                <ImageBackground source={item.image} style={styles.image} />
                            </TouchableOpacity>
                            <Text style={styles.themeName}>{item.name}</Text>
                        </View>
                    ))}
                </View>

                {/* Primary Color Section */}
                <View style={styles.primaryColorSection}>
                    <Text style={styles.subHeader}>Primary Color</Text>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={styles.colorPalatte}>
                            {[
                                { color: theme.text, name: "default" },
                                { color: "#ff7518", name: "fanta" },
                                // { color: "#02802D", name: "veg" },
                                { color: "green", name: "veg" },
                                { color: "#d2042d", name: "anar" },
                                { color: "#FDDA0D", name: "lemon" }
                            ].map(({ color, name }) => (
                                <View key={color} style={styles.colorWrapper}>
                                    <TouchableOpacity
                                        style={[
                                            styles.coloring,
                                            { backgroundColor: color },
                                            theme.primaryColor === color && !(theme.mode === "light" && color === "#FDDA0D") && {
                                                borderWidth: 2.5,
                                                opacity: 0.8,
                                            },
                                        ]}
                                        onPress={() => setPrimaryColor(color)}
                                    />
                                    <Text style={styles.colorText}>{name}</Text>
                                </View>
                            ))}
                        </View>
                    </ScrollView>
                </View>

                {/* Animation Section */}
                <View style={styles.animationSection}>
                    <Section title="Animation">
                        <SettingItem 
                            icon="logo-octocat" 
                            label="Meme Cats" 
                            hasSwitch 
                            onPress={toggleMemeCat} 
                            switchValue={isMemeCatsEnabled}
                            isLast 
                        />
                    </Section>
                </View>

            </ScrollView>

            {/* Pass prop but don't render */}
            {/* {isMemeCatsEnabled ? <MemeCat available={false} isMemeCatsEnabled={isMemeCatsEnabled} /> : false} */}
        </View>
    );
};

// Dynamic Theme Styles
const dynamicTheme = (theme) => ({
    container: { flex: 1, backgroundColor: theme.background, padding: 16 },
    themeSection: { flexDirection: "row", justifyContent: "center", marginBottom: 36, backgroundColor:'' },
    themeCard: {
        width: 160,
        height: 200,
        borderRadius: 12,
        borderWidth: 0,
        opacity: 0.75,
        borderColor: "#007AFF",
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 10,
        overflow: 'hidden',
    },
    themeName: { color: theme.text, fontWeight: "bold", textAlign: 'center', paddingTop: 10 },
    primaryColorSection: { marginBottom: 36, backgroundColor:'' },
    subHeader: { fontSize: 18, fontWeight: "bold", color: theme.text, marginBottom: 20, marginLeft: 10 },
    header: { marginHorizontal: 8, marginVertical: '12%', flexDirection: "row", alignItems: "center", justifyContent: 'center' },
    title: { fontSize: 20, color: theme.text, fontWeight: 'bold' },
    backBtn: { padding: 7, borderRadius: 20, backgroundColor: theme.backBtnBg, position: 'absolute', left: 0 },
    colorPalatte: { flexDirection: 'row' },
    coloring: { width: 75, height: 75, borderColor: theme.text, borderRadius: 50, marginHorizontal: 10 },
    colorText: { fontSize: 14, color: theme.text, textAlign: 'center', paddingTop: 10, textTransform: 'capitalize' },
    animationSection: {backgroundColor: ''},
    image: {
        width: "100%",
        height: "105%",
        opacity: 0.9,
        justifyContent: "center",
        alignItems: "center",
        alignSelf: 'center',
    },
});

export default AppearanceSetting;
