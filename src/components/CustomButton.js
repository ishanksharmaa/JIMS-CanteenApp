import React from "react";
import {Text, View, StyleSheet, TouchableOpacity} from "react-native";

const CustomButton = ({title, onPress}) => {
    return(
        <View style={{ alignItems: "center" }}>
            <TouchableOpacity style={styles.buttonStyle} onPress={onPress}>
                <Text style={styles.buttonText}>{title}</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
  buttonStyle: { backgroundColor: '#111', borderRadius: 50, paddingVertical: 16, width: '80%', alignItems:'center' },
  buttonText: { color: "white", fontSize: 18 }
});

export default CustomButton;