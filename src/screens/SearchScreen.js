import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet, Keyboard, TouchableWithoutFeedback, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useTheme } from '../components/ThemeContext';
import ProductCard from '../components/ProductCard';
import SearchBar from '../components/SearchBar';
import CustomButton from "../components/CustomButton";

const SearchScreen = () => {
    const [searchText, setSearchText] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { theme } = useTheme();
    const styles = dynamicTheme(theme);

    // Load initial data
    // useEffect(() => {
    //     fetchProducts('');
    // }, []);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            fetchProducts(searchText);
        }, 500); // 0.5 second debounce

        return () => clearTimeout(delayDebounce);
    }, [searchText]);

    // const fetchProducts = async (searchText) => {
    //     setLoading(true);

    //     try {
    //         let query = firestore().collection('Products');

    //         if (searchText.trim()) {
    //             const lowerCaseSearch = searchText.toLowerCase().trim();
    //             query = query
    //                 .where('name_lowercase', '>=', lowerCaseSearch)
    //                 .where('name_lowercase', '<=', lowerCaseSearch + '\uf8ff');
    //         }

    //         const snapshot = await query.get();
    //         const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    //         setFilteredProducts(products);
    //     } catch (err) {
    //         console.error("Error:", err);
    //         alert("Error loading products");
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const fetchProducts = async (searchText) => {
        setLoading(true);
        const lowerCaseSearch = searchText.toLowerCase().trim();
        console.log("Searching:", lowerCaseSearch);
    
        try {
            let query = firestore().collection('Products');
    
            if (!lowerCaseSearch) {
                const allSnapshot = await query.get();
                const allProducts = allSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setFilteredProducts(allProducts);
                return;
            }
    
            query = query
                .where('name_lowercase', '>=', lowerCaseSearch)
                .where('name_lowercase', '<=', lowerCaseSearch + '\uf8ff');
    
            const snapshot = await query.get();
            console.log("Snapshot size:", snapshot.size);
    
            const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            console.log("Products found:", products);
    
            setFilteredProducts(products);
        } catch (err) {
            console.error("Error:", err);
            alert("Error loading products");
        } finally {
            setLoading(false);
        }
    };
    



    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <SearchBar
                    placeholder='Search food, menu...'
                    onChangeText={setSearchText}
                    onSubmitEditing={() => fetchProducts(searchText.toLowerCase())}
                />
            </View>
            <View style={styles.searchBtn}>
                <CustomButton
                    title="Search" btnColor={"#333"} textColor={theme.customButtonText}
                    onPress={() => fetchProducts(searchText)} size={0.7} radius={50} opacity={1}
                />
            </View>

            <View style={{ height: 300 }}>
                <FlatList
                    data={filteredProducts}
                    keyExtractor={(item) => item.id}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                    ListEmptyComponent={
                        <Text style={{ textAlign: 'center' }}>
                            {loading ? 'Loading...' : 'No products found'}
                        </Text>
                    }
                    renderItem={({ item }) => (
                        <ProductCard
                            image={{ uri: item.image }}
                            title={item.name}
                            price={item.price}
                            descr={item.description}
                        />
                    )}
                />
            </View>
        </View>
    );
};

const dynamicTheme = (theme) => ({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: theme.background,
    },
    searchContainer: {
        marginTop: 24,
        marginHorizontal: 7,
    },
    notFoundText: {
        textAlign: 'center',
        fontSize: 18,
        color: theme.text,
        marginTop: 40,
    },
    searchBtn: {
        // backgroundColor: 'red',
        width: '30%',
        position: 'absolute',
        top: 62,
        right: 10,
    },
});

export default SearchScreen;
