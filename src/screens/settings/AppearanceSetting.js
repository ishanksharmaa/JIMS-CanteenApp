import React, { useState, useEffect } from "react";
import { View, Text, Switch, TouchableOpacity, ScrollView, ImageBackground, BackHandler, Modal } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../../components/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import MemeCat from "../../components/MemeCat";
import { useMemeCat } from "../../components/MemeCatContext";
import { Section, SettingItem } from "../../components/SettingsItem";
// import { ColorPicker } from 'react-native-color-picker';
import Slider from '@react-native-community/slider';
import WheelColorPicker from 'react-native-wheel-color-picker';


const themes = [
    { name: "Light Theme", color: "#eee", mode: "light", image: require("../../../assets/rasgulla.jpg") },
    { name: "Dark Theme", color: "#222", mode: "dark", image: require("../../../assets/jamun.jpg") },
];

const AppearanceSetting = () => {
    const { theme, changeTheme, setPrimaryColor } = useTheme();
    const styles = dynamicTheme(theme);
    const navigation = useNavigation();
    const { isMemeCatsEnabled, toggleMemeCat, isHeaderEnabled, toggleHeader, isNavHeaderEnabled, toggleNavHeader } = useMemeCat();
    const [color, setColor] = useState(theme.primaryColor);

    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false); // To control the visibility of the color picker
    const [tempColor, setTempColor] = useState(color); //Temporary color to preview before saving


    const handleColorChange = (newColor) => {
        setTempColor(newColor); // Update temp color for preview
    };

    const saveColor = () => {
        setPrimaryColor(tempColor); // Save the selected color globally
        setColor(tempColor); // Update local state for color
        setIsColorPickerVisible(false); // Close the color picker
    };

    const closeColorPicker = () => {
        setIsColorPickerVisible(false); // Close the color picker without saving
        setTempColor(color); // Reset temp color to the original one
    };

    // useEffect(() => {
    //     setColor(theme.primaryColor); // Sync color state with theme's primary color whenever theme changes
    // }, [theme.primaryColor]);


    return (
        <View style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.6} >
                    <Ionicons name="chevron-back-outline" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Appearance</Text>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>

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
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 0, backgroundColor: 'transparent', alignItems: 'center', marginBottom: 7 }}>
                        <Text style={styles.subHeader}>Primary Color</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={() => setPrimaryColor(theme.text)} style={{ backgroundColor: 'transparent', padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Text style={{ color: "#007AFF", fontSize: 14, fontWeight: "500", paddingHorizontal: -50 }} >Reset</Text>
                        </TouchableOpacity>
                    </View>

                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} >
                        <TouchableOpacity style={{ height: 75, width: 75, backgroundColor: theme.background1, borderRadius: "50%", alignItems: 'center', justifyContent: 'center', marginHorizontal: 10 }} onPress={() => setIsColorPickerVisible(true)} activeOpacity={0.8} >
                            <Ionicons name={"color-filter-outline"} size={32} color={theme.primaryColor} />
                            <Text style={{ color: theme.text, fontSize: 14, fontWeight: 500, position: 'absolute', bottom: -30 }}>Picker</Text>
                        </TouchableOpacity>
                        <View style={styles.colorPalatte}>
                            {[
                                // { color: theme.text, name: "default" },
                                { color: "#e65c00", name: "santra" },
                                // { color: "#ff7518", name: "santra" },
                                { color: "#02802D", name: "veg" },
                                // { color: "green", name: "veg" },
                                { color: "#d2042d", name: "anar" },
                                { color: "#FF69B4", name: "gulabi" },
                                { color: "#F33A6A", name: "rose" },
                                { color: "#FFC000", name: "mango" },
                                { color: "#800080", name: "jamun" },
                                { color: "#e74c3c", name: "cherry" },

                                { color: "#2980b9", name: "ocean" },
                                { color: "#f39c12", name: "sunflower" },
                                { color: "#34495e", name: "slate" },
                                { color: "#8e44ad", name: "lavender" },
                                { color: "#16a085", name: "turquoise" },


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


                    {/* Color Picker Modal*/}
                    <Modal
                        visible={isColorPickerVisible}
                        animationType="fade"
                        transparent={true}
                        onRequestClose={closeColorPicker}
                    >
                        <View style={{
                            flex: 1,
                            backgroundColor: 'rgba(0,0,0,0.6)',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <View style={{
                                width: '85%',
                                height: "60%",
                                backgroundColor: 'red',
                                backgroundColor: theme.background1,
                                padding: 20,
                                borderRadius: 16,
                                elevation: 5,
                                shadowColor: '#000',
                                shadowOpacity: 0.2,
                                shadowOffset: { width: 0, height: 2 },
                            }}>
                                {/* Close icon top-right */}
                                <TouchableOpacity
                                    style={{ position: 'absolute', top: 10, right: 10, zIndex: 1 }}
                                    onPress={closeColorPicker}
                                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                    <Ionicons name="close" size={24} color={theme.text} />
                                </TouchableOpacity>

                                {/* Color Picker */}
                                <WheelColorPicker
                                    initialColor={color}
                                    // onColorChangeComplete={handleColorChange}
                                    onColorChange={handleColorChange}
                                    style={{ width: "100%", height: 200 }}
                                />

                                {/* Apply Button */}
                                <TouchableOpacity
                                    onPress={saveColor}
                                    style={{
                                        marginTop: 30,
                                        backgroundColor: tempColor,
                                        paddingVertical: 12,
                                        borderRadius: 50,
                                        width: "80%",
                                        alignItems: 'center',
                                        alignSelf: 'center',
                                    }}
                                >
                                    <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Apply this color</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>


                </View>

                {/* Animation Section */}
                <View style={styles.animationSection}>
                    <Section title="Toggle Styles">
                        <SettingItem
                            icon="phone-portrait"
                            label="Show top header background on Home"
                            hasSwitch
                            onPress={toggleHeader}
                            switchValue={isHeaderEnabled}
                            height={17}
                            isFirst
                        />
                        <SettingItem
                            icon="color-fill"
                            label="Side-Nav top header color"
                            hasSwitch
                            onPress={toggleNavHeader}
                            switchValue={isNavHeaderEnabled}
                            height={17}
                        />
                        <SettingItem
                            icon="logo-octocat"
                            label="Meme Cats"
                            hasSwitch
                            onPress={toggleMemeCat}
                            switchValue={isMemeCatsEnabled}
                            height={17}
                        />
                    </Section>
                    {/* <Section title="Home background" marginBottom={16}>
                    </Section>
                    <Section title="SideNav background" marginBottom={16}>
                    </Section> */}
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
    themeSection: { flexDirection: "row", justifyContent: "center", marginBottom: 36, backgroundColor: '' },
    themeCard: {
        width: 160,
        height: 200,
        borderRadius: 12,
        opacity: 0.75,
        borderWidth: 0,
        borderColor: theme.primaryColor,
        borderColor: theme.text,
        alignItems: "center",
        justifyContent: "center",
        paddingBottom: 10,
        overflow: 'hidden',
    },
    themeName: { color: theme.text, fontWeight: "bold", textAlign: 'center', paddingTop: 10 },
    primaryColorSection: { marginBottom: 10, backgroundColor: '' },
    subHeader: { fontSize: 18, fontWeight: "bold", color: theme.text, paddingVertical: 10, marginLeft: 10 },
    header: { marginHorizontal: 8, marginVertical: '12%', flexDirection: "row", alignItems: "center", justifyContent: 'center' },
    title: { fontSize: 20, color: theme.text, fontWeight: 'bold' },
    backBtn: { padding: 7, borderRadius: 20, backgroundColor: theme.backBtnBg, position: 'absolute', left: 0 },
    colorPalatte: { flexDirection: 'row', marginBottom: 30, },
    coloring: { width: 75, height: 75, borderColor: theme.text, borderRadius: 50, marginHorizontal: 10 },
    colorText: { fontSize: 14, color: theme.text, textAlign: 'center', paddingTop: 10, textTransform: 'capitalize' },
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
