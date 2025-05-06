import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from "../components/ThemeContext";

export const Section = ({ title, children, marginBottom = 22 }) => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);

    return (
        <View style={{ marginBottom: marginBottom }}>
            <Text style={{ color: "#8e8e93", fontSize: 14, paddingHorizontal: 16, marginBottom: 8 }}>
                {title}
            </Text>
            <View style={styles.card}>
                {children}
            </View>
        </View>
    );
};

export const SettingItem = ({ icon, label, hasSwitch, isThemeSwitch, onPress, isFirst, switchValue, arrow = true, height = 11, marginBottom = 0, marginTop = 0, show = true }) => {
    const { theme, changeTheme } = useTheme();
    const styles = dynamicTheme(theme);

    if (!show) { return null };
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: height,
                paddingHorizontal: 11,
                marginBottom: marginBottom,
                marginTop: marginTop,
                borderTopColor: theme.mode === "dark" ? "#333" : "#ececec",
                borderTopWidth: isFirst ? 0 : 1,
            }}
            activeOpacity={0.8}
        >
            <Ionicons name={icon} size={24} color={theme.primaryColor} style={{ marginRight: 16 }} /> {/* #007AFF */}
            <Text style={{ flex: 1, fontSize: 16, color: theme.text }}>{label}</Text>
            {hasSwitch ? (
                <Switch
                    // value={isThemeSwitch ? theme.mode.toLowerCase() === "dark" : isMemeCatsEnabled}
                    value={switchValue}
                    onValueChange={onPress}
                    trackColor={{ false: "#d3d3d3", true: theme.primaryColor }}
                    thumbColor={theme.mode === "dark" ? "#ffffff" : "#f4f3f4"}
                    style={{ transform: [{ scaleX: 1.3 }, { scaleY: 1.3 }] }}
                />
            ) : (
                arrow ?
                    <Ionicons name="chevron-forward-outline" size={20} color="#8e8e93" /> : ""
            )}
        </TouchableOpacity>
    );
};

const dynamicTheme = (theme) => ({
    card: { backgroundColor: theme.settingsCard, borderRadius: 12, marginHorizontal: 16, padding: 10 },
});

// export {Section, SettingItem};