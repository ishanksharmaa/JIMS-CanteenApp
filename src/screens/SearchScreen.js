import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, Text, StyleSheet, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '../components/ThemeContext';
import ProductCard from '../components/ProductCard';
// import SearchBar from '../components/SearchBar';
import CustomButton from "../components/CustomButton";
import { TextInput } from 'react-native-gesture-handler';
import Ionicons from 'react-native-vector-icons/Ionicons';

const SearchScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);
    const searchInputRef = useRef(null);


     // Auto-focus effect
     useEffect(() => {
        // Add a small delay to ensure the component is mounted
        const timer = setTimeout(() => {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }, 100);

        return () => clearTimeout(timer);
    }, []);


    // Debounce effect for search
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchProducts(searchText);
        }, 500); // 500ms delay

        return () => clearTimeout(delayDebounce);
    }, [searchText]);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchInputRef.current) {
                searchInputRef.current.focus();
            }
        }, 100); // slight delay so layout finishes

        return () => clearTimeout(timer);
    }, []);



    // Function to fetch products based on name
    const fetchProducts = async (searchText) => {
        setLoading(true);
        const productName = searchText.toLowerCase().trim();
        const productCategory = productName;

        try {
            // Search by product name
            const querySnapshot = await firestore()
                .collection('Products')
                .where('name', '>=', productName)
                .where('name', '<=', productName + '\uf8ff') // For prefix match
                .get();

            // Search by category (array-contains query)
            const categoryQuerySnapshot = await firestore()
                .collection('Products')
                .where('category', 'array-contains', productCategory) // Match categories
                .get();

            // Combine products from both queries
            const products = [
                ...querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })),
                ...categoryQuerySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }))
            ];

            // Remove duplicates (if any)
            const uniqueProducts = Array.from(new Set(products.map(a => a.id)))
                .map(id => products.find(a => a.id === id));

            setFilteredProducts(uniqueProducts);
        } catch (err) {
            console.error("Error fetching products:", err);
            alert("Error loading products");
        } finally {
            setLoading(false);
        }
    };




    return (
        <View style={styles.container}>
            {/* <Text style={styles.header}>Menu</Text> */}
            <View style={styles.searchContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder={"Search food, menu..."}
                    placeholderTextColor={"grey"}
                    onChangeText={setSearchText}
                    onSubmitEditing={() => fetchProducts(searchText)}
                />
            </View>

            <View style={styles.searchBtn}>
                {/* <CustomButton
                    title="Search"
                    // btnColor={theme.searchBtnColor}
                    btnColor={theme.customButtonBg}
                    textColor={theme.customButtonText}
                    onPress={() => fetchProducts(searchText)}
                    size={0.7}
                    radius={50}
                    opacity={1}
                /> */}
                <TouchableOpacity style={styles.searchBtn} activeOpacity={0.8} onPress={()=> fetchProducts(searchText)}>
                    {/* <Ionicons name="search" size={26} color={theme.customButtonBg} /> */}
                    <Ionicons name="search" size={26} color={"grey"} />
                </TouchableOpacity>
            </View>

            <View style={{ height: '72.2%', marginHorizontal: 9, backgroundColor: 'transparent', marginLeft: 7, }}>
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id}
                    horizontal={false}
                    numColumns={2}
                    showsHorizontalScrollIndicator={false}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center', color: theme.text }}>
                            {loading ? 'Loading...' : 'No products found'}
                        </Text>
                    }
                    renderItem={({ item }) => (
                        <View style={{ flex: 0, padding: 0, backgroundColor: 'transparent', marginHorizontal: 0 }}>
                            <ProductCard
                                image={{ uri: item.image }}
                                title={item.name}
                                price={item.price}
                                descr={item.description}
                                quantity={item.quantity}
                                qty={item.qty || 1}
                                amount={item.amount || item.price}
                                time={item.time}
                                available={item.available}
                                size={0.86} gapV={0} gapH={0}
                            />
                        </View>
                    )}
                />
            </View>
        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: {
        flex: 1,
        padding: 0,
        backgroundColor: theme.background,
    },
    searchContainer: {
        marginHorizontal: 17,
        marginTop: 62,
        marginBottom: 30,
    },
    searchBar: {
        backgroundColor: theme.searchBg,
        color: theme.searchText,
        height: 55,
        width: '96%',
        alignSelf: 'center',
        justifyContent: 'center',
        paddingHorizontal: '8%',
        borderRadius: 16,
        marginTop: 0,
    },
    notFoundText: {
        textAlign: 'center',
        fontSize: 18,
        color: theme.text,
        marginTop: 40,
    },
    searchBtn: {
        width: '30%',
        position: 'absolute',
        top: "8.4%",
        right: 14,
        opacity: 0.72,
    },
    header: {
        fontSize: 28,
        fontWeight: "bold",
        color: theme.text,
        margin: 16,
        marginTop: 70,
        marginBottom: 0,
        alignSelf: 'center',
    },
});

export default SearchScreen;
