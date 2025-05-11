import React from 'react';
import { View, Text, Linking, Image, StyleSheet, ScrollView, TouchableOpacity, Animated, Easing, Dimensions } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { useTheme } from '../../components/ThemeContext';
import { HeaderBackIcon } from '../CartScreen';

const { width } = Dimensions.get('window');

const AboutScreen = () => {
    const openLink = (url) => Linking.openURL(url);
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);

    const scaleValue = new Animated.Value(0.95);
    const opacityValue = new Animated.Value(0);

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(scaleValue, {
                toValue: 1,
                duration: 0,
                easing: Easing.out(Easing.cubic),
                useNativeDriver: true
            }),
            Animated.timing(opacityValue, {
                toValue: 1,
                duration: 0,
                useNativeDriver: true
            })
        ]).start();
    }, []);

    const socialLinks = [
        {
            name: 'GitHub',
            icon: <FontAwesome name="github" size={24} color={theme.mode === 'dark' ? '#f0f0f0' : '#333'} />,
            url: 'https://github.com/ishanksharmaa',
            color: theme.mode === 'dark' ? '#f0f0f0' : '#333'
        },
        {
            name: 'LinkedIn',
            icon: <FontAwesome name="linkedin-square" size={24} color="#0077B5" />,
            url: 'https://linkedin.com/in/ishanksharmaa',
            color: '#0077B5'
        },
        {
            name: 'Instagram',
            icon: <Feather name="instagram" size={24} color="#E1306C" />,
            url: 'https://instagram.com/ishanksharmaa',
            color: '#E1306C'
        }
    ];

    return (
        <Animated.ScrollView
            contentContainerStyle={[styles.container, { opacity: opacityValue, transform: [{ scale: scaleValue }] }]}
        >
            <View style={styles.headerContainer}>
                <HeaderBackIcon title="About" />
            </View>

            {/* App Info Block */}
            <View style={[styles.card, styles.appCard]}>
                {/* <Text style={styles.heading}>🍽️ JIMS Canteen App</Text> */}
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Text style={styles.heading}>The App 📱</Text>
                    <Image
                        source={require('../../../assets/app_logo.jpeg')} // Your image path
                        style={styles.appLogo}
                    />
                </View>
                <Text style={styles.paragraph}>
                    A smooth and student-friendly app to browse, order, and enjoy delicious food right from your campus canteen. Designed with love for the JIMS community ❤️
                </Text>

                <View style={styles.divider} />

                <View style={styles.featureContainer}>
                    <View style={styles.featureItem}>
                        <Feather name="zap" size={18} color={theme.primaryColor} style={styles.featureIcon} />
                        <Text style={styles.featureText}>Fast</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Feather name="shield" size={18} color={theme.primaryColor} style={styles.featureIcon} />
                        <Text style={styles.featureText}>Secure</Text>
                    </View>
                    <View style={styles.featureItem}>
                        <Feather name="heart" size={18} color={theme.primaryColor} style={styles.featureIcon} />
                        <Text style={styles.featureText}>Simple</Text>
                    </View>
                </View>
            </View>

            {/* Developer Block */}
            <View style={[styles.card, { marginBottom: 20 }]}>
                {/* <Text style={styles.sectionTitle}>👨‍💻 The Developer</Text> */}
                <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Text style={styles.sectionTitle}>The Developer 👨‍💻</Text>
                    <Image
                        source={require('../../../assets/dev_photo.jpg')} // Your image path
                        style={styles.developerImage}
                    />
                </View>
                <Text style={styles.paragraph}>
                    Hey! I'm Ishank — an MCA student, app developer, and designer. I love building real-world solutions with clean UIs and powerful functionality.
                </Text>

                <Text style={styles.connectText}>🌐 Connect with me:</Text>
                <View style={styles.socialLinks}>
                    {socialLinks.map((link, index) => (
                        <TouchableOpacity
                            key={index}
                            onPress={() => openLink(link.url)}
                            style={styles.linkItem}
                            activeOpacity={0.7}
                        >
                            {link.icon}
                            <Text style={[styles.linkText, { color: link.color }]}>{link.name}</Text>
                            <Feather
                                name="chevron-right"
                                size={18}
                                color={theme.mode === 'dark' ? '#aaa' : '#888'}
                                style={styles.chevronIcon}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
            </View>

            <Text style={styles.versionText}>Version 1.0.0</Text>
        </Animated.ScrollView>
    );
};

const dynamicTheme = (theme) => ({
    container: {
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: theme.background,
        minHeight: '100%',
    },
    headerContainer: {
        marginBottom: 8.46,
        // backgroundColor: 'red',
    },
    card: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: theme.mode === 'dark' ? '#000' : '#888',
        shadowOpacity: theme.mode === 'dark' ? 0.3 : 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 2 },
        backgroundColor: theme.cardBg,
        elevation: 3,
        width: '100%',
    },
    heading: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12,
        color: theme.text,
        lineHeight: 26,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.text,
        marginBottom: 12,
        lineHeight: 26,
    },
    paragraph: {
        fontSize: 15,
        color: theme.mode === 'dark' ? '#ccc' : '#555',
        lineHeight: 22,
        marginBottom: 8,
    },
    connectText: {
        marginTop: 16,
        fontSize: 16,
        fontWeight: '600',
        color: theme.text,
        marginBottom: 12,
    },
    socialLinks: {
        gap: 8,
    },
    linkItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
        backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
    },
    linkText: {
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
    },
    chevronIcon: {
        opacity: 0.7,
    },
    divider: {
        height: 1,
        backgroundColor: theme.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
        marginVertical: 12,
    },
    featureContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
    },
    featureIcon: {
        marginRight: 6,
    },
    featureText: {
        fontSize: 13,
        color: theme.mode === 'dark' ? '#aaa' : '#666',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 13,
        color: theme.mode === 'dark' ? '#666' : '#999',
        marginVertical: 16,
    },
    appLogo: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
        marginBottom: 10, // Add space below image if needed
    },
    developerImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
        marginBottom: 10, // Add space below image if needed
    },
});

export default AboutScreen;