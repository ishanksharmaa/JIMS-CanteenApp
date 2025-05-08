// BotScreen.js
import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text, FlatList } from "react-native";
import axios from "axios";
import { useTheme } from "../components/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";

const BotScreen = () => {
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState("");
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);

    const sendPrompt = async () => {
        if (!prompt.trim()) return;
        const YOUR_API_KEY = 'AIzaSyCLcYD0Y60VWj9uRqsqsdDGUSh5HnM4Uz8';

        const newMessages = [...messages, { type: "user", text: prompt }];
        setMessages(newMessages);
        setPrompt("");

        try {
            const response = await axios.post(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${YOUR_API_KEY}`,
                {
                    contents: [{
                        parts: [{
                            text: `Only answer questions about food, health, diet, fitness, or healthy habits. 
                        If the user asks anything unrelated, reply: 
                        "I can only help with food, health, fitness & lifestyle-related questions. 🙂"
                        
                        User question: ${prompt}`
                        }]
                    }]
                },
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const botReply = response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
                "Sorry, I couldn't understand that.";
            setMessages([...newMessages, { type: "bot", text: botReply }]);
        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            setMessages([...newMessages, { type: "bot", text: "Error connecting to the assistant." }]);
        }
    };

    const renderItem = ({ item }) => (
        <View style={[styles.messageBubble, item.type === "user" ? styles.userBubble : styles.botBubble]}>
            <Text style={styles.messageText}>{item.text}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.chatContainer}
            />

            <View style={styles.inputBox}>
                <TextInput
                    value={prompt}
                    onChangeText={setPrompt}
                    placeholder="Ask about food, health, fitness..."
                    placeholderTextColor="#aaa"
                    style={styles.textInput}
                />
                <TouchableOpacity onPress={sendPrompt} style={styles.sendButton}>
                    {/* <Text style={styles.sendButtonText}>Send</Text> */}
                    <Ionicons name="send" size={26} color={theme.primaryColor} />
                </TouchableOpacity>
            </View>
        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: {
        flex: 1,
        backgroundColor: theme.background,
        padding: 10,
    },
    chatContainer: {
        paddingBottom: 80,
        // backgroundColor: 'red',
        borderColor: theme.text,
        borderWidth: 2,
        height: "82%",
        marginTop: "10%",
        // marginBottom: "70%",
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
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    messageText: {
        color: theme.text,
        // color: 'red'
    },
    inputBox: {
        flexDirection: "row",
        position: "absolute",
        bottom: 30,
        left: 10,
        right: 10,
        backgroundColor: theme.background1,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: theme.background1,
        padding: 6,
    },
    textInput: {
        flex: 1,
        color: "white",
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
