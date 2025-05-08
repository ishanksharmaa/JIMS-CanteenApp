import React, { useContext, useCallback, useState, useEffect } from "react";
import { Text, View, FlatList, TouchableOpacity, Alert, Modal, TextInput } from "react-native";
import OrderItem from "../components/OrderItem";
import { useTheme } from "../components/ThemeContext";
import Ionicons from 'react-native-vector-icons/Ionicons';
import BackBtn from "../components/BackBtn";
import CustomButton from "../components/CustomButton";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useUser } from "../components/UserContext";
import { useCart } from "../components/CartContext";
import SplitBill from "../components/SplitBill";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { HeaderBackIcon } from "./CartScreen";
import ThreeDotMenu from "../components/ThreeDotMenu";

const OrderScreen = () => {
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);
    const navigation = useNavigation();
    const { refreshUser, user, userEmail } = useUser();
    const { orderItems, fetchOrders, orderCount, totalAmount, orderPlaced, onAddtoCart } = useCart();
    const [splitBillVisible, setSplitBillVisible] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');

    // const isOrderEmpty = orderItems.length === 0 ? true : false;
    // const isOrderEmpty = false;

    useEffect(() => {
        fetchOrders(userEmail);
    }, []);

    const handleRefresh = () => {
        fetchOrders(userEmail);
    };

    const removeReadyItems = async () => {
        await fetchOrders(userEmail, true); // Wait for deletion to complete
        fetchOrders(userEmail); // Then refresh the list
    };
    const cancelOrders = () => {
        if (orderCount > 0) {
            setShowConfirmModal(true);
        } else{
            onAddtoCart("alert-circle", "Order List Empty!", "no order are there to cancel", true, 2000)
        }
    };

    const menuItems = [
        {
            text: 'Refresh',
            textColor: '#C40233',
            icon: 'refresh',
            iconColor: "#C40233",
            onPress: handleRefresh,
        },
        {
            text: 'Ready items',
            textColor: theme.text,
            icon: 'remove',
            iconColor: theme.text,
            onPress: removeReadyItems,
        },
        {
            text: 'Cancel order',
            textColor: theme.text,
            icon: 'close-circle',
            iconColor: theme.text,
            onPress: cancelOrders,
        },
    ];


    return (
        <View style={styles.container}>
            <HeaderBackIcon title="Your Orders" />
            <View style={{ position: 'absolute', top: 75, right: 20, zIndex: 200 }}>
                <ThreeDotMenu
                    icon="menu-outline"
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
            {
                user ? (
                    <Ionicons name="add" size={29} color={"transparent"} style={styles.addIcon} />
                ) : (
                    <TouchableOpacity style={styles.saveButton} onPress={() => navigation.navigate("Login")} activeOpacity={0.8}>
                        <Text style={styles.saveButtonText}>{user ? "Save" : "Sign In"}</Text>
                    </TouchableOpacity>
                )
            }



            {/* <View style={[{ flex: 1 }, orderItems.length === 0 && { justifyContent: "center" }]}> */}

            {
                !user ? (
                    <Text style={{ textAlign: "center", marginTop: "70%", fontSize: 18, fontWeight: "600", color: theme.text }}>
                        Please <Text onPress={() => navigation.navigate("Login")} style={{ fontWeight: "700", color: theme.primaryColor }}>SignIn</Text> to view Orders!
                    </Text>

                ) : orderItems.length === 0 ? (
                    <Text style={{ textAlign: "center", marginTop: "70%", fontSize: 18, color: "gray" }}>
                        Orders will appear here
                    </Text>
                ) : (
                    <View style={styles.flatListContainer}>
                        <FlatList
                            data={orderItems}
                            scroll
                            keyExtractor={(item) => item.title}
                            renderItem={({ item }) => (
                                <OrderItem
                                    image={item.image}
                                    title={item.title}
                                    price={item.price}
                                    descr={item.descr}
                                    quantity={item.quantity}
                                    qty={item.qty}
                                    time={item.time}
                                    available={item.available}
                                    status={item.status}
                                    orderedAt={item.orderedAt}
                                />
                            )}
                            contentContainerStyle={{ paddingBottom: 50 }}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                        />
                    </View>
                )
            }

            {/* </View> */}

            {/* {user && (
                <View style={styles.orderBtn}>
                    <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={() => setSplitBillVisible(true)} >
                        <MaterialIcons name="call-split" size={29} color={theme.customButtonBg} />
                    </TouchableOpacity>
                    <View style={styles.buttonContainer}>
                        <CustomButton btnColor={theme.customButtonBg} textColor={theme.customButtonText} title={`Order for ₹${totalAmount}`} onPress={async () => isOrderEmpty ? null : orderPlaced(userEmail) } />
                    </View>
                </View>
            )}

            <SplitBill visible={splitBillVisible} onClose={() => setSplitBillVisible(false)} totalAmount={totalAmount} /> */}

            {showConfirmModal && (
                <Modal
                    transparent
                    animationType="fade"
                    visible={showConfirmModal}
                    onRequestClose={() => setShowConfirmModal(false)}
                >
                    <View style={{ flex: 1, backgroundColor: '#000000aa', justifyContent: 'center', alignItems: 'center' }}>
                        <View style={{ width: '85%', backgroundColor: theme.background, padding: 20, borderRadius: 10 }}>
                            <Text style={{ color: theme.text, fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Cancel Orders?</Text>
                            <Text style={{ color: theme.text, marginBottom: 15 }}>
                                Canteen staff might not be able to see your order list after this.{"\n\n"}You can get the REFUND from canteen.
                            </Text>

                            <TextInput
                                placeholder="Type 'cancel order' to confirm"
                                placeholderTextColor={"grey"}
                                value={confirmationText}
                                onChangeText={setConfirmationText}
                                style={{
                                    borderWidth: 1,
                                    borderColor: "grey",
                                    borderRadius: 5,
                                    padding: 10,
                                    marginBottom: 20,
                                    // color: "grey",
                                    color: theme.text,
                                }}
                            />

                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 20 }}>
                                <TouchableOpacity onPress={() => { setShowConfirmModal(false); setConfirmationText("") }}>
                                    <Text style={{ color: theme.text, marginRight: 20 }}>No</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    disabled={confirmationText.toLowerCase() !== 'cancel order'}
                                    onPress={async () => {
                                        await fetchOrders(userEmail, false, true); // cancel
                                        fetchOrders(userEmail); // refresh
                                        setShowConfirmModal(false);
                                        setConfirmationText('');
                                    }}
                                >
                                    <Text style={{
                                        color: confirmationText.toLowerCase() === 'cancel order' ? '#C40233' : 'grey'
                                    }}>
                                        Yes
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}


        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: { backgroundColor: theme.background, height: "100%" },
    header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 12, backgroundColor: '', },
    addIcon: { position: 'absolute', top: '8%', right: '5.7%' },
    title: { fontWeight: "bold", fontSize: 30, alignSelf: "center", marginTop: '16%', marginBottom: 20, color: theme.text },
    flatListContainer: {
        height: '100%',
        flex: 1,
        paddingHorizontal: 5,
        // backgroundColor: 'red',
    },
    orderBtn: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        width: '100%', // Yeh ensure karega ki dono buttons achhe se dikhein
        alignSelf: 'center', // Center mein maintain karega
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: 30, // Vertical padding thoda aur acha lagne ke liye
        paddingBottom: 20,
        zIndex: 10,
        // backgroundColor: theme.background,
    },
    iconButton: {
        backgroundColor: theme.cartBagBtn,
        padding: 15,
        borderRadius: 18,
        elevation: 5,
    },
    buttonContainer: {
        flex: 1,
        marginLeft: 8,
    },

    saveButton: {
        // marginTop: 20,
        // position: 'absolute',
        // top: 40,
        // right: 22,
        backgroundColor: theme.primaryColor,
        padding: 10,
        borderRadius: 30,
        width: "20%",
        alignItems: "center",
        position: 'absolute',
        top: "8%",
        right: '5.7%',
    },
    saveButtonText: {
        color: "white",
        fontSize: 13,
        fontWeight: "bold",
    },
});

export default OrderScreen;
