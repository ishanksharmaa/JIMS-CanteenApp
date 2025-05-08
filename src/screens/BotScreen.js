import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, TouchableOpacity, Text, FlatList, Keyboard, Modal } from "react-native";
import axios from "axios";
import { useTheme } from "../components/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { HeaderBackIcon } from "./CartScreen";
import ThemeToggle from "../components/ThemeToggle";
import { useMemeCat } from "../components/MemeCatContext";
import ThreeDotMenu from "../components/ThreeDotMenu";

const BotScreen = () => {
    const scrollRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [prompt, setPrompt] = useState("");
    const { theme, changeTheme } = useTheme();
    const { chatDownEnabled, toggleInvertChat } = useMemeCat();
    const styles = dynamicTheme(theme, chatDownEnabled);
    const [keyboardVisible, setKeyboardVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(true);

    useEffect(() => {
        setShowAlert(true);
    }, []);

    useEffect(() => {
        const show = Keyboard.addListener("keyboardDidShow", () => setKeyboardVisible(true));
        const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardVisible(false));
        return () => {
            show.remove();
            hide.remove();
        };
    }, [keyboardVisible]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollToEnd({ animated: true });
        }
    }, [messages, isLoading]);

    useEffect(() => {
        // Run only once when screen mounts
        const showImportantAlert = async () => {
            await CustomAlert({
                title: "Important Info",
                message: (
                    <View>
                        <Text>• Point 1</Text>
                        <Text>• Point 2</Text>
                        <Text>• Point 3</Text>
                    </View>
                ),
                confirmText: "OK",
                onConfirm: () => console.log("User accepted"),
            });
        };

        showImportantAlert();
    }, []);


    const sendPrompt = async () => {
        if (!prompt.trim()) return;

        if (chatDownEnabled) {
            setMessages(prevMessages => [{ type: "user", text: prompt }, ...prevMessages]);
        } else {
            setMessages(prevMessages => [...prevMessages, { type: "user", text: prompt }]);
        }
        setPrompt("");

        setIsLoading(true);
        Keyboard.dismiss();

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
            if (chatDownEnabled) {
                setMessages(prevMessages => [{ type: "bot", text: botReply }, ...prevMessages]);
            } else {
                setMessages(prevMessages => [...prevMessages, { type: "bot", text: botReply }]);
            }

        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            if (chatDownEnabled) {
                setMessages(prevMessages => [{ type: "bot", text: "Error connecting to the assistant." }, ...prevMessages]);
            } else {
                setMessages(prevMessages => [...prevMessages, { type: "bot", text: "Error connecting to the assistant." }]);
            }
        } finally {
            setIsLoading(false); // End loading
            Keyboard.dismiss();
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

    const menuItems = [
        {
            text: theme.mode === "dark" ? 'Light Theme' : "Dark Theme",
            textColor: theme.text,
            icon: theme.mode === "dark" ? "sunny" : "moon",
            iconColor: theme.text,
            onPress: () => changeTheme(theme.mode === "dark" ? "light" : "dark")
        },
        {
            // text: chatDownEnabled ? 'Chat Upward' : 'Chat Downw',
            text: chatDownEnabled ? 'Flow Upward' : 'Flow Down',
            textColor: theme.text,
            icon: chatDownEnabled ? 'arrow-up' : 'arrow-down',
            iconColor: chatDownEnabled ? theme.primaryColor : theme.text,
            onPress: toggleInvertChat,
        },
    ];

    return (
        <View style={[styles.container]}>
            <HeaderBackIcon title="ChatBite AI" />
            <View style={{ position: 'absolute', top: 72.5, right: 23 }}>
                <ThreeDotMenu
                    icon="ellipsis-horizontal"
                    iconColor={theme.text}
                    menuItems={menuItems}
                    menuStyle={{
                        backgroundColor: theme.background2,
                        borderWidth: 1,
                        borderColor: "grey",
                    }}
                    itemStyle={{
                        // borderTopWidth: 0,
                        // borderBottomColor: theme.text + '20'
                    }}
                    itemTextStyle={{
                        color: theme.text
                    }}
                    style={styles.addIcon}
                />
            </View>
            <FlatList
                ref={scrollRef}
                data={messages}
                keyExtractor={(_, index) => index.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.chatContainer}
                keyboardShouldPersistTaps="handled"
                scrollEnabled={true}
                inverted={chatDownEnabled ? false : true}
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
            {showAlert && (
                <Modal transparent animationType="fade">
                    <View style={styles.overlay}>
                        <View style={styles.alertBox}>
                            <Text style={styles.title}>Important Info</Text>
                            <Text style={styles.alertText}>• Chats will not be preserved.</Text>
                            <Text style={styles.alertText}>• It has limited usage. </Text>
                            <Text style={styles.alertText}>• Sometimes msgs sequence may affected{"\n"}{"\t"} by inverting Chat-Flow.</Text>

                            <TouchableOpacity onPress={() => setShowAlert(false)}>
                                <Text style={styles.okBtn}>OK</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

        </View>
    );
};

const dynamicTheme = (theme, chatDownEnabled) => ({
    container: {
        flex: 1,
        backgroundColor: theme.mode === "dark" ? theme.background2 : theme.background1,
        padding: 10,
        paddingTop: 0,
    },
    chatContainer: {
        // paddingBottom: chatDownEnabled ? 100 : 0,
        ...(chatDownEnabled ? { paddingBottom: 100 } : { paddingTop: 100 }),
        // borderWidth: 2,
        borderColor: theme.text,
        flexGrow: 1,
        justifyContent: "flex-end",
        // backgroundColor: 'red'
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
        backgroundColor: theme.mode === "dark" ? theme.background1 : theme.background2,
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
        marginHorizontal: 4.5,
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

    overlay: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0006' },
    alertBox: { backgroundColor: theme.background2, padding: 20, borderRadius: 12, width: "80%" },
    title: { fontWeight: 'bold', fontSize: 18, marginBottom: 10, color: theme.text },
    alertText: {fontSize: 14, marginBottom: 5, color: theme.text },
    okBtn: { marginTop: 20, color: theme.primaryColor, textAlign: 'right' }

});

export default BotScreen;
