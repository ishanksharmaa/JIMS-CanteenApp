import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useTheme } from "./ThemeContext";
import { useNavigation } from "@react-navigation/native";

const BackBtn = ({ position, left, right, top, bottom }) => {
    const { theme } = useTheme();
    const navigation = useNavigation();
    const styles = dynamicTheme(theme, position, left, right, top, bottom);

    return (
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.6} >
            <Ionicons name="chevron-back" size={24} color={theme.text} />
        </TouchableOpacity>
    );
};

const dynamicTheme = (theme, position, left, right, top, bottom) => ({
    backBtn: { padding: 7, borderRadius: 20, backgroundColor: theme.backBtnBg, position: position, left: left, top: top, zIndex: 10 },
});

export default BackBtn;