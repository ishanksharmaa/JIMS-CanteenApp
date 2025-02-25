import React from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import { useTheme } from "../../components/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { Section, SettingItem } from "../../components/SettingsItem";
import { opacity } from "react-native-reanimated/lib/typescript/Colors";

const themes = [
    { name: "Rasgulla", color: "#eee", mode: "light", image: require("../../../assets/rasgulla.jpg") },
    { name: "Kala Jamun", color: "#222", mode: "dark", image: require("../../../assets/jamun.jpg") },
];

const AppearanceSetting = () => {
    const { theme, changeTheme, setPrimaryColor } = useTheme();
    const styles = dynamicTheme(theme);
    const navigation = useNavigation();

    return (
        <View style={styles.container}>

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
                        <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center' }}>
                            <TouchableOpacity
                                key={item.name}
                                style={[styles.themeCard, theme.mode === item.mode && {borderWidth: 2}]}
                                onPress={() => changeTheme(item.mode)}>

                                <ImageBackground source={item.image} style={styles.image}>
                                </ImageBackground>

                            </TouchableOpacity>
                            <Text style={styles.themeName}>{item.name}</Text>
                        </View>
                    ))}
                </View>

                {/* Primary Color Section */}
                <View style={styles.primaryColorSection}>
                    <Text style={styles.subHeader}>Primary Color</Text>

                    <View style={styles.colorPalatte}>
                        {['#ff7518', 'green', '#d2042d', '#FDDA0D'].map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[styles.coloring, { backgroundColor: color }, theme.primaryColor === color && { borderWidth: 2 }]}
                                onPress={() => setPrimaryColor(color)}
                            />
                        ))}
                    </View>
                </View>

                {/* Animation Section */}
                <View style={styles.animationSection}>
                    <Section title="Animation">
                        <SettingItem icon="logo-octocat" label="Meme Cats" hasSwitch onPress={() => navigation.navigate("")} isLast />
                    </Section>
                </View>

            </ScrollView>
        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: { flex: 1, backgroundColor: theme.background, padding: 16 },
    themeSection: { flexDirection: "row", justifyContent: "center", marginBottom: 40, backgroundColor: '' },
    themeCard: {
        width: 160,
        height: 200,
        backgroundColor: '',
        borderRadius: 12,
        borderWidth: 1.3,
        borderColor: theme.text,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 10,
        overflow: 'hidden',
    },
    themeName: { color: theme.text, fontWeight: "bold", textAlign: 'center', paddingTop: 10 },
    primaryColorSection: { marginTop: 20 },
    subHeader: { fontSize: 18, fontWeight: "bold", color: theme.text, marginBottom: 20, marginLeft: 10 },
    header: { marginHorizontal: 8, marginVertical: '12%', flexDirection: "row", alignItems: "center", backgroundColor: '', justifyContent: 'center' },
    title: { fontSize: 20, color: theme.text, fontWeight: 'bold', marginLeft: 0 },
    backBtn: { padding: 7, borderRadius: 20, backgroundColor: theme.backBtnBg, position: 'absolute', left: 0 },
    primaryColorSection: { backgroundColor: '', marginBottom: 50 },
    colorPalatte: { flexDirection: 'row' },
    coloring: { width: 75, height: 75, borderColor: theme.text, borderRadius: 50, marginHorizontal: 10 },
    animationSection: { backgroundColor: '' },
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
