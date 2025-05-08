import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from './ThemeContext';

const ThreeDotMenu = ({ 
    icon = 'menu-outline', 
    iconColor = '#000',
    iconSize = 25,
    menuItems = [],
    menuStyle = {},
    itemStyle = {},
    itemTextStyle = {},
}) => {
    const [visible, setVisible] = useState(false);

    const toggleMenu = () => setVisible(!visible);
    const {theme} = useTheme();
    const styles = dynamicTheme(theme);

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={toggleMenu} activeOpacity={0.8}>
                <Ionicons name={visible ? "close" : icon} size={iconSize} color={iconColor} />
            </TouchableOpacity>
            
            {visible && (
                <View style={[styles.menu, menuStyle]}>
                    {menuItems.map((item, index) => (
                        <TouchableOpacity 
                            key={index}
                            style={[styles.menuItem, itemStyle, index > 0 && styles.menuItemBorder]}
                            onPress={() => {
                                item.onPress();
                                setVisible(false);
                            }}
                        >
                            <Ionicons 
                                name={item.icon} 
                                size={20} 
                                color={item.iconColor || iconColor} 
                                style={styles.icon}
                            />
                            <Text style={[styles.menuItemText, itemTextStyle, {color: item.textColor}]}>
                                {item.text}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            )}
        </View>
    );
};

const dynamicTheme = (theme)=>({
    container: {
        position: 'relative',
        // backgroundColor: 'green'
    },
    menu: {
        position: 'absolute',
        right: 0,
        top: 40,
        backgroundColor: 'white',
        borderRadius: 5,
        padding: 5,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 100,
        minWidth: 150,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 9,
        paddingHorizontal: 12,
    },
    menuItemBorder: {
        borderTopWidth: 1,
        borderTopColor: "grey",
    },
    menuItemText: {
        marginLeft: 10,
        fontSize: 16,
    },
    icon: {
        width: 20,
    }
});

export default ThreeDotMenu;