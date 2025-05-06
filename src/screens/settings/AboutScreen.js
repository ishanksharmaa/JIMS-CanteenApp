import React from 'react';
import { View, Text, Linking, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../components/ThemeContext';
import { HeaderBackIcon } from '../CartScreen';


const AboutScreen = () => {
    const openLink = (url) => Linking.openURL(url);
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.headerContainer}>
                <HeaderBackIcon title="About" />
            </View>

            {/* App Info Block */}
            <View style={styles.card}>
                <Text style={styles.heading}>🍽️ JIMS Canteen App</Text>
                <Text style={styles.paragraph}>
                    A smooth and student-friendly app to browse, order, and enjoy delicious food right from your campus canteen. Designed with love for the JIMS community ❤️
                </Text>
            </View>

            {/* Developer Block */}
            <View style={styles.card}>
                <Text style={styles.sectionTitle}>👨‍💻 The Developer</Text>
                <Text style={styles.paragraph}>
                    Hey! I'm Ishank — an MCA student, app developer, and designer. I love building real-world solutions with clean UIs and powerful functionality.
                </Text>

                <Text style={styles.connectText}>🌐 Connect with me:</Text>
                <View style={styles.socialLinks}>
                    <TouchableOpacity onPress={() => openLink('https://github.com/ishanksharmaa')} style={styles.linkItem} activeOpacity={0.8} >
                        <FontAwesome name="github" size={24} color="#333" />
                        <Text style={styles.linkText}>GitHub</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openLink('https://linkedin.com/in/ishanksharmaa')} style={styles.linkItem} activeOpacity={0.8} >
                        <FontAwesome name="linkedin-square" size={24} color="#0077B5" />
                        <Text style={styles.linkText}>LinkedIn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => openLink('https://instagram.com/ishanksharmaa')} style={styles.linkItem} activeOpacity={0.8} >
                        <Feather name="instagram" size={24} color="#E1306C" />
                        <Text style={styles.linkText}>Instagram</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const dynamicTheme = (theme) => ({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#f9f9f9',
        paddingTop: 0,
    },
    headerContainer: { flexDirection: "column", marginBottom: 0, marginTop: 0, marginHorizontal: -15 },
    card: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        elevation: 4,
    },
    heading: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#222',
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '700',
        color: '#444',
        marginBottom: 12,
    },
    paragraph: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
    connectText: {
        marginTop: 18,
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    socialLinks: {
        gap: 12,
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        paddingVertical: 6,
    },
    linkText: {
        fontSize: 16,
        color: '#1e90ff',
    },
});

export default AboutScreen;
