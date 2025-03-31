import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { useTheme } from "../components/ThemeContext";

const SearchBar = ({ placeholder = "Search here...", onChange }) => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);

    return (
        <View style={styles.searchContainer}>
            <TextInput
                style={styles.searchBar}
                placeholder={placeholder}
                placeholderTextColor={"grey"}
                onChangeText={onChange}
            />
        </View>
    );
};

const dynamicTheme = (theme) => StyleSheet.create({
    // searchContainer: {
    //     margin: 10,
    //     backgroundColor: theme.cardBg,
    //     borderRadius: 10,
    //     paddingHorizontal: 10,
    //     paddingVertical: 5,
    // },
    searchBar: {
        backgroundColor: theme.searchBg,
        color: theme.searchText,
        height: 55,
        width: '96%',
        alignSelf: 'center',
        justifyContent: 'center',
        paddingHorizontal: '8%',
        borderRadius: 16,
        marginTop: 30,
    },
});

export default SearchBar;
