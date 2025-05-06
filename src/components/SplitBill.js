import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useTheme } from './ThemeContext';
import CustomButton from './CustomButton';


const SplitBill = ({ visible, onClose, totalAmount }) => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);
    const [amount, setAmount] = useState(String(totalAmount) ?? '');
    const [people, setPeople] = useState(String(2) || 1);
    const [result, setResult] = useState('');

    const calculateSplit = () => {
        const amt = parseFloat(amount);
        const ppl = parseInt(people);
        if (!isNaN(amt) && !isNaN(ppl) && ppl > 0) {
            setResult((amt / ppl).toFixed(2));
        } else {
            setResult('Invalid input');
        }
    };

    useEffect(() => {
        setAmount(String(totalAmount));
        setResult(totalAmount / people);
    }, [totalAmount]);


    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.heading}>Split Amount</Text>
                    <TouchableOpacity style={styles.closeBtn} onPress={onClose} >
                        <Ionicons name="close" size={26} color={theme.text} />
                    </TouchableOpacity>
                    {/* <TextInput
                        style={styles.input}
                        keyboardType="numeric"
                        placeholder="Total Amount"
                        placeholderTextColor={"grey"}
                        value={amount}
                        onChangeText={setAmount}
                    /> */}
                    <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
                        <Text style={{ color: theme.primaryColor, marginRight: 8 }}>Amount ₹:</Text>
                        <TextInput
                            style={{ flex: 1, color: theme.text }}
                            keyboardType="numeric"
                            placeholder="Splitting Amount"
                            placeholderTextColor="grey"
                            value={amount}
                            onChangeText={setAmount}
                        />
                    </View>
                    <View style={[styles.input, { flexDirection: 'row', alignItems: 'center' }]}>
                        <Text style={{ color: theme.primaryColor, marginRight: 8 }}>Among People:</Text>
                        <TextInput
                            style={{ flex: 1, color: theme.text }}
                            keyboardType="numeric"
                            placeholder="No. of people"
                            placeholderTextColor="grey"
                            value={people}
                            onChangeText={setPeople}
                        />
                    </View>
                    <Text style={styles.resultText}>Per Person: ₹ {result}</Text>
                    <CustomButton btnColor={theme.customButtonBg} textColor='#eee' title="Calculate" onPress={calculateSplit} />
                    {/* <Button title="Close" onPress={onClose} color="red" /> */}
                </View>
            </View>
        </Modal>
    );
};
// theme
const dynamicTheme = (theme) => ({
    overlay: {
        flex: 1,
        backgroundColor: '#000000aa',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContainer: {
        width: '85%',
        backgroundColor: theme.mode === 'light' ? theme.background1 : "#1a1a1a",
        borderRadius: 20,
        padding: 20,
        elevation: 10,
    },
    closeBtn: {
        position: 'absolute',
        top: 18,
        right: 18,
    },
    heading: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 26,
        textAlign: 'center',
        color: theme.text,
    },
    input: {
        borderBottomWidth: 0,
        borderRadius: 10,
        marginTop: 16,
        paddingVertical: 10,
        paddingHorizontal: 14,
        fontSize: 16,
        backgroundColor: theme.loginBg,
        color: theme.text,
    },
    resultText: {
        fontSize: 18,
        marginTop: 15,
        marginBottom: 20,
        textAlign: 'center',
        color: theme.text,
        // color: theme.primaryColor,
    },
});

export default SplitBill;
