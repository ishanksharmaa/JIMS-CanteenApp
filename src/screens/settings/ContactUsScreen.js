import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Linking,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    ActivityIndicator,
    Dimensions
} from 'react-native';
import { useTheme } from '../../components/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { HeaderBackIcon } from '../CartScreen';

const { width } = Dimensions.get('window');

const COMPANY_EMAIL = 'mr.robotmonkeyking@gmail.com';
const APP_FEEDBACK_SUBJECT = 'Canteen App Feedback';

const SOCIAL_LINKS = [
    {
        name: 'Instagram',
        url: 'https://instagram.com/ishanksharmaa',
        icon: 'logo-instagram',
        color: '#E1306C',
    },
    {
        name: 'LinkedIn',
        url: 'https://www.linkedin.com/in/ishank-sharma-110b80297/',
        icon: 'logo-linkedin',
        color: '#007AFF',
    },
    {
        name: 'GitHub',
        url: 'https://github.com/ishanksharmaa',
        icon: 'logo-github',
        color: '#333',
    },
    {
        name: 'Email',
        url: `mailto:${COMPANY_EMAIL}`,
        icon: 'mail-outline',
        color: '#D44638',
    },
];

export default function ContactUsScreen({ navigation }) {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);
    const [feedback, setFeedback] = useState('');
    const [isSending, setIsSending] = useState(false);

    const handleLinkPress = async (url) => {
        const supported = await Linking.canOpenURL(url);

        if (!supported) {
            Alert.alert('Oops!', "We can't open that link right now.");
            return;
        }

        try {
            await Linking.openURL(url);
        } catch (e) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        }
    };

    const handleSendFeedback = async () => {
        if (!feedback.trim()) {
            Alert.alert('Hold on!', 'Please share your thoughts with us.');
            return;
        }

        setIsSending(true);

        try {
            const subject = encodeURIComponent(APP_FEEDBACK_SUBJECT);
            const body = encodeURIComponent(feedback);
            const mailUrl = `mailto:${COMPANY_EMAIL}?subject=${subject}&body=${body}`;

            await Linking.openURL(mailUrl);
            setFeedback('');
            setTimeout(() => {
                Alert.alert('Thank You!', 'Your feedback means the world to us!');
            }, 500);
        } catch (e) {
            Alert.alert('Oh no!', "We couldn't send your feedback. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.background || '#f8f9fa' }]}>
            <KeyboardAvoidingView
                style={styles.keyboardView}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <ScrollView
                        contentContainerStyle={styles.scrollContainer}
                        showsVerticalScrollIndicator={false}
                    >
                        {/* Header */}
                        <View style={styles.header}>
                            <HeaderBackIcon title="Contact Us" />
                        </View>

                        {/* Main Card */}
                        <View style={[styles.card, { backgroundColor: theme.cardBg }]}>
                            {/* Contact Section */}
                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                                    Connect with me
                                </Text>
                                <Text style={[styles.sectionSubtitle, { color: theme.text }]}>
                                    {/* We're always happy to connect with you */}
                                    Let's make connections! 🤝
                                </Text>

                                <View style={styles.socialLinks}>
                                    {SOCIAL_LINKS.map((item) => (
                                        <TouchableOpacity
                                            key={item.name}
                                            style={[
                                                styles.socialButton,
                                                { backgroundColor: item.color }
                                            ]}
                                            onPress={() => handleLinkPress(item.url)}
                                            activeOpacity={0.8}
                                        >
                                            <Ionicons
                                                name={item.icon}
                                                size={20}
                                                color="#fff"
                                            />
                                            <Text style={styles.socialText}>
                                                {item.name}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </View>
                            </View>

                            {/* Divider */}
                            <View style={[styles.divider, { backgroundColor: theme.loginInput || '#eee' }]} />

                            {/* Feedback Section*/}
                            <View style={styles.section}>
                                <Text style={[styles.sectionTitle, { color: theme.text }]}>
                                    Share your thoughts 🧠
                                </Text>
                                <Text style={[styles.sectionSubtitle, { color: theme.text }]}>
                                    Your feedback helps us improve
                                </Text>

                                <TextInput
                                    style={[
                                        styles.feedbackInput,
                                        {
                                            color: theme.text || '#333',
                                            backgroundColor: theme.loginInput || '#f8f9fa',
                                            borderColor: theme.border || '#ddd',
                                        }
                                    ]}
                                    placeholder="What do you love? What can we do better?"
                                    placeholderTextColor={theme.placeholder || '#aaa'}
                                    multiline
                                    numberOfLines={5}
                                    value={feedback}
                                    onChangeText={setFeedback}
                                    textAlignVertical="top"
                                    editable={!isSending}
                                />

                                <TouchableOpacity
                                    style={[styles.sendButton, { backgroundColor: theme.primaryColor || '#6C63FF' }]}
                                    onPress={handleSendFeedback}
                                    activeOpacity={0.8}
                                    disabled={isSending}
                                >
                                    {isSending ? (
                                        <ActivityIndicator color="#fff" />
                                    ) : (
                                        <>
                                            <Text style={styles.sendButtonText}>
                                                Send Message
                                            </Text>
                                            <Ionicons
                                                name="paper-plane-outline"
                                                size={18}
                                                color="#fff"
                                                style={{ marginLeft: 8 }}
                                            />
                                        </>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* Footer */}
                        <View style={styles.footer}>
                            <Text style={[styles.footerText, { color: theme.textSecondary || '#666' }]}>
                                © {new Date().getFullYear()} JIMS-CanteenApp. All rights reserved.
                            </Text>
                        </View>
                    </ScrollView>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </View>
    );
}

const dynamicTheme = (theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.background,
    },
    keyboardView: {
        flex: 1,
        backgroundColor: theme.background,
    },
    scrollContainer: {
        flexGrow: 1,
        paddingBottom: 40,
    },
    card: {
        borderRadius: 20,
        marginHorizontal: 20,
        padding: 25,
        elevation: 3,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
    },
    section: {
        backgroundColor: 'transparent',
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    sectionSubtitle: {
        fontSize: 14,
        marginBottom: 20,
    },
    socialLinks: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    socialButton: {
        width: width > 400 ? '48%' : '100%',
        flexDirection: 'row',
        alignItems: 'center',
        padding: 14,
        borderRadius: 10,
        marginBottom: 15,
        justifyContent: 'center',
        elevation: 2,
    },
    socialText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
        marginLeft: 10,
    },
    divider: {
        height: 1,
        marginVertical: 20,
    },
    feedbackInput: {
        width: '100%',
        minHeight: 140,
        borderRadius: 12,
        borderWidth: 1,
        padding: 18,
        fontSize: 15,
        marginBottom: 20,
        textAlignVertical: 'top',
    },
    sendButton: {
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        elevation: 2,
    },
    sendButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
    footer: {
        marginTop: 30,
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    footerText: {
        fontSize: 12,
    },
});