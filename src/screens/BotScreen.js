import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, TouchableOpacity, Text, FlatList, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView } from "react-native";
import axios from "axios";
import { useTheme } from "../components/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { HeaderBackIcon } from "./CartScreen";
import ThemeToggle from "../components/ThemeToggle";

const BotScreen = () => {
    const scrollRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState("");
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
        const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
        return () => {
            show.remove();
            hide.remove();
        };
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollToEnd({ animated: true });
        }
    }, [messages, isLoading]);

    const sendPrompt = async () => {
        if (!prompt.trim()) return;

        setMessages(prevMessages => [{ type: "user", text: prompt }, ...prevMessages]);
        setPrompt("");

        setIsLoading(true);

        try {
            const YOUR_API_KEY = 'AIzaSyCLcYD0Y60VWj9uRqsqsdDGUSh5HnM4Uz8';

            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${YOUR_API_KEY}`,
                {
                    contents: [{ parts: [{ text: prompt }] }]
                },
                { headers: { "Content-Type": "application/json" } }
            );

            const botReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                "Sorry, I couldn't understand that.";
            setMessages(prevMessages => [{ type: "bot", text: botReply }, ...prevMessages]);
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            setMessages(prevMessages => [{ type: "bot", text: "Error connecting to the assistant." }, ...prevMessages]);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.messageBubble, item.type === "user" ? styles.userBubble : styles.botBubble]}>
            {isLoading && item.type === "bot" && (
                <View style={styles.botBubble}>
                    <Text style={{ color: 'gray', fontSize: 20 }}>Thinking...</Text>
                </View>
            )}
            <Text style={item.type === "user" ? styles.userText : styles.botText}>{item.text}</Text>
        </View>
    );

    return (
        <View style={[styles.container]}>
            <HeaderBackIcon title="ChatBite AI" />
            <View style={{ position: 'absolute', top: 70, right: 23 }}>
                <ThemeToggle iconColor={theme.text} size={23} />
            </View>
            <FlatList
                ref={scrollRef}
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.chatContainer}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={true}
                inverted={false} // Remove inverted, manage scrolling manually
            />

            <View style={[styles.inputBox, { marginBottom: keyboardVisible ? '37.5%' : 0 }]}>
                <TextInput
                    value={prompt}
                    onChangeText={setPrompt}
                    placeholder="Ask about food, health, fitness..."
                    placeholderTextColor="#aaa"
                    style={styles.textInput}
                    onSubmitEditing={sendPrompt}
                    returnKeyType="send"
                />
                <TouchableOpacity onPress={sendPrompt} style={styles.sendButton}>
                    <Ionicons name="send" size={26} color={theme.primaryColor} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.mode === "dark" ? theme.background2 : theme.background1,
        padding: 10,
        paddingTop: 0,
    },
    chatContainer: {
        paddingBottom: 100,
        // borderWidth: 2,
        borderColor: theme.text,
        flexGrow: 1,
        justifyContent: "flex-end",
    },
    messageBubble: {
        margin: 8,
        padding: 10,
        borderRadius: 10,
        maxWidth: "75%",
    },
    userBubble: {
        alignSelf: "flex-end",
        backgroundColor: theme.primaryColor,
    },
    botBubble: {
        alignSelf: "flex-start",
        // backgroundColor: theme.mode === "dark" ? "rgba(255,255,255,0.05)" : theme.background2,
        backgroundColor: theme.mode ==="dark" ? theme.background1 : theme.background2,
    },
    userText: {
        color: theme.text,
        color: "#eee",
    },
    botText: {
        color: theme.text,
    },
    inputBox: {
        flexDirection: "row",
        position: "absolute",
        bottom: 24,
        left: 10,
        right: 10,
        backgroundColor: theme.mode === "dark" ? theme.background1 : theme.background2,
        borderRadius: 30,
        borderColor: theme.background1,
        // borderWidth: 2,
        padding: 8,
        marginHorizontal: 1,
    },
    textInput: {
        flex: 1,
        color: theme.text,
        paddingHorizontal: 10,
    },
    sendButton: {
        paddingHorizontal: 10,
        justifyContent: "center",
    },
    sendButtonText: {
        color: theme.primaryColor,
        fontWeight: "bold",
    },
});

export default BotScreen;
