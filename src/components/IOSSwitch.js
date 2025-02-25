import React, { useState } from "react";
import { View, Animated, Pressable } from "react-native";

const IOSSwitch = ({ value, onValueChange }) => {
    const [translateX] = useState(new Animated.Value(value ? 20 : 2));

    const toggleSwitch = () => {
        const newValue = !value;
        onValueChange(newValue);
        Animated.timing(translateX, {
            toValue: newValue ? 20 : 2, // Thumb position
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    return (
        <Pressable onPress={toggleSwitch} style={styles.container}>
            <View style={[styles.track, { backgroundColor: value ? "#34C759" : "#ccc" }]}>
                <Animated.View style={[styles.thumb, { transform: [{ translateX }] }]} />
            </View>
        </Pressable>
    );
};

const styles = {
    container: {
        width: 52, // iOS default size
        height: 32, // Increased for thick track
        justifyContent: "center",
    },
    track: {
        width: 50,
        height: 28, // Mota track
        borderRadius: 20,
        padding: 2,
    },
    thumb: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: "#fff",
        position: "absolute",
    },
};

export default IOSSwitch;
