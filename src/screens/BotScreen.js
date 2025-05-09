import React, { useState, useEffect, useRef } from "react";
import { View, TextInput, TouchableOpacity, Text, FlatList, Keyboard, Modal } from "react-native";
import Sound from 'react-native-sound';
import axios from "axios";
import { useTheme } from "../components/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import { HeaderBackIcon } from "./CartScreen";
import ThemeToggle from "../components/ThemeToggle";
import { useMemeCat } from "../components/MemeCatContext";
import ThreeDotMenu from "../components/ThreeDotMenu";

// Initialize sound module
Sound.setCategory('Playback');

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
    const [isSoundModalVisible, setIsSoundModalVisible] = useState(false);

    const [selectedSentSound, setSelectedSentSound] = useState('switch');
    const [selectedReceivedSound, setSelectedReceivedSound] = useState('winxp');

    const soundOptions = [
        { name: 'switch', file: require('../../assets/sounds/switch.mp3') },
        { name: 'push', file: require('../../assets/sounds/push.mp3') },
        { name: 'mint', file: require('../../assets/sounds/mint.mp3') },
        { name: 'step1', file: require('../../assets/sounds/step1.mp3') },
        { name: 'step', file: require('../../assets/sounds/step.mp3') },
        { name: 'pop', file: require('../../assets/sounds/pop.mp3') },
        { name: 'duck', file: require('../../assets/sounds/duck.mp3') },
        { name: 'winxp', file: require('../../assets/sounds/winxp.mp3') },
        // Add more as needed
    ];

    // Audio objects
    const sentSoundRef = useRef(null);
    const receivedSoundRef = useRef(null);

    // Load sounds
    useEffect(() => {
        // Sent sound
        sentSoundRef.current = new Sound(
            // require('../../assets/sounds/step.mp3'),
            require('../../assets/sounds/switch.mp3'),
            Sound.MAIN_BUNDLE,
            (error) => {
                if (error) {
                    console.log('Failed to load sent sound', error);
                    return;
                }
            }
        );

        // Received sound
        receivedSoundRef.current = new Sound(
            require('../../assets/sounds/winxp.mp3'),
            // require('../../assets/sounds/step.mp3'),
            Sound.MAIN_BUNDLE,
            (error) => {
                if (error) {
                    console.log('Failed to load received sound', error);
                    return;
                }
            }
        );

        // Cleanup on unmount
        return () => {
            if (sentSoundRef.current) sentSoundRef.current.release();
            if (receivedSoundRef.current) receivedSoundRef.current.release();
        };
    }, []);

    const playSentSound = () => {
        if (sentSoundRef.current) {
            sentSoundRef.current.play((success) => {
                if (!success) {
                    console.log('Failed to play sent sound');
                }
            });
        }
    };

    const playReceivedSound = () => {
        if (receivedSoundRef.current) {
            receivedSoundRef.current.play((success) => {
                if (!success) {
                    console.log('Failed to play received sound');
                }
            });
        }
    };

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
            scrollRef.current.scrollToOffset({ offset: 0, animated: true });
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

        playSentSound();
        setMessages(prevMessages => [{ type: "user", text: prompt }, ...prevMessages]);
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

            playReceivedSound();
            setMessages(prevMessages => [{ type: "bot", text: botReply }, ...prevMessages]);

        } catch (error) {
            console.error("API Error:", error.response?.data || error.message);
            setMessages(prevMessages => [{ type: "bot", text: "Error connecting to the assistant." }, ...prevMessages]);

        } finally {
            setIsLoading(false); // End loading
            Keyboard.dismiss();
        }
    };

    const renderItem = ({ item, index }) => (
        <View style={[styles.messageBubble, item.type === "user" ? styles.userBubble : styles.botBubble]}>
            {isLoading && item.type === "bot" && index === 0 && (
                <View style={styles.botBubble}>
                    <Text style={{ color: 'gray', fontSize: 20 }}>Thinking...</Text>
                </View>
            )}
            <Text style={item.type === "user" ? styles.userText : styles.botText}>{item.text}</Text>
        </View>
    );

    const menuItems = [
        {
            text: theme.mode === "dark" ? 'Dark Theme' : "Light Theme",
            textColor: theme.text,
            icon: theme.mode === "dark" ? "moon" : "sunny",
            iconColor: theme.primaryColor,
            onPress: () => changeTheme(theme.mode === "dark" ? "light" : "dark")
        },
        {
            text: !chatDownEnabled ? 'Flow Upward' : 'Flow Down',
            // textColor: theme.text,
            textColor: theme.text,
            icon: !chatDownEnabled ? 'arrow-up' : 'arrow-down',
            iconColor: !chatDownEnabled ? theme.primaryColor : theme.primaryColor,
            onPress: toggleInvertChat,
        },
        {
            text: 'Select sounds',
            textColor: theme.text,
            icon: 'musical-note',
            iconColor: theme.text,
            onPress: () => setIsSoundModalVisible(true),
        },
    ];

    return (
        <View style={[styles.container]}>
            {/* <HeaderBackIcon title="ChatBite AI" /> */}
            <HeaderBackIcon
                title={
                    <Text>
                        <Text style={{ color: theme.text }}>Chat</Text>
                        <Text style={{ color: theme.text }}>Bite</Text>
                        <Text style={{ color: theme.primaryColor }}>AI</Text>
                        {/* <Text style={{ color: theme.primaryColor }}>Snack</Text> */}
                        {/* <Text style={{ color: theme.text }}>Bot</Text> */}
                    </Text>
                }
            />

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
                inverted={chatDownEnabled}
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

            {/* Sound selection Modal */}

            <Modal visible={isSoundModalVisible} transparent animationType="fade">
                <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', padding: 20 }}>
                    <View style={{ backgroundColor: theme.background1, borderRadius: 10, padding: 15 }}>
                        <Text style={{ color: theme.text, fontSize: 18, marginBottom: 10, fontWeight: 'bold' }}>Select Sent Sound:</Text>
                        <TouchableOpacity activeOpacity={0.8} onPress={()=> setIsSoundModalVisible(false)} style={{position: 'absolute', top: 10, right: 10}}>
                            <Ionicons name="close" size={24} color={theme.text} />
                        </TouchableOpacity>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            {soundOptions.map((sound, index) => (
                                <TouchableOpacity
                                    key={`sent-${index}`}
                                    style={{
                                        width: '48%',
                                        padding: 10,
                                        backgroundColor: selectedSentSound === sound.name ? theme.primaryColor : theme.background2,
                                        borderRadius: 8,
                                        marginBottom: 8,
                                    }}
                                    onPress={() => {
                                        setSelectedSentSound(sound.name);
                                        const s = new Sound(sound.file, Sound.MAIN_BUNDLE, () => s.play());
                                    }}
                                >
                                    <Text style={{ color: theme.text }}>{sound.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <Text style={{ color: theme.text, fontSize: 18, marginVertical: 10, fontWeight: 'bold' }}>Select Received Sound:</Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                            {soundOptions.map((sound, index) => (
                                <TouchableOpacity
                                    key={`received-${index}`}
                                    style={{
                                        width: '48%',
                                        padding: 10,
                                        backgroundColor: selectedReceivedSound === sound.name ? theme.primaryColor : theme.background2,
                                        borderRadius: 8,
                                        marginBottom: 8,
                                    }}
                                    onPress={() => {
                                        setSelectedReceivedSound(sound.name);
                                        const s = new Sound(sound.file, Sound.MAIN_BUNDLE, () => s.play());
                                    }}
                                >
                                    <Text style={{ color: theme.text }}>{sound.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            onPress={() => {
                                setIsSoundModalVisible(false);
                                sentSoundRef.current = new Sound(soundOptions.find(s => s.name === selectedSentSound).file, Sound.MAIN_BUNDLE);
                                receivedSoundRef.current = new Sound(soundOptions.find(s => s.name === selectedReceivedSound).file, Sound.MAIN_BUNDLE);
                            }}
                            style={{ marginTop: 15, alignSelf: 'flex-end' }}
                        >
                            <Text style={{ color: theme.primaryColor, fontWeight: 'bold' }}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


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
        ...(chatDownEnabled ? { paddingTop: 100 } : { paddingBottom: 100 }),
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
    alertText: { fontSize: 14, marginBottom: 5, color: theme.text },
    okBtn: { marginTop: 20, color: theme.primaryColor, textAlign: 'right' }

});

export default BotScreen;
