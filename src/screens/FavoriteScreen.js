import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "../components/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from "@react-native-firebase/firestore";
import { useUser } from "../components/UserContext";
import ProductCard from '../components/ProductCard';
import { useCart } from "../components/CartContext";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

const FavoriteScreen = () => {
  const { theme } = useTheme();
  const { userEmail, user } = useUser();
  const styles = dynamicTheme(theme);

  const [loading, setLoading] = useState(true);
  const { fetchFavorites, favItems, setFavItems, setCartItems } = useCart();

  useEffect(() => {
    let unsubscribe;

    const loadFavorites = async () => {
      try {
        if (user) {
          // Use real-time listener instead of one-time fetch
          unsubscribe = await fetchFavorites(user.email);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);


  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.primaryColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart" size={80} color="red" />
          <Text style={styles.text}>No Favorites Yet</Text>
        </View>
      ) : (
        <>
          <Text style={styles.header}>Favorites</Text>
          <FlatList
            style={styles.listContainer}
            data={favItems}
            keyExtractor={(item) => item.id}
            numColumns={2}
            horizontal={false}
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={
              <Text style={{ textAlign: 'center' }}>
                {loading ? 'Loading...' : 'No products found'}
              </Text>
            }
            renderItem={({ item }) => (
              <View style={{ flex: 1, padding: 0, backgroundColor: 'transparent', margin: 1 }}>
                <ProductCard
                  image={{ uri: item.image }}
                  title={item.name}
                  price={item.price}
                  descr={item.description}
                  size={0.9} gapV={0} gapH={0}
                />
              </View>
            )}
          />
        </>
      )}
    </View>
  );
};

// ... (keep the same dynamicTheme and export as before)

const dynamicTheme = (theme) => ({
  container: {
    backgroundColor: theme.background,
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    marginHorizontal: 8,
    // backgroundColor: 'red',
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
    color: theme.text,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    color: theme.text,
    margin: 16,
    marginTop: 70,
    marginBottom: 40,
    alignSelf: 'center',
  },
});

export default FavoriteScreen;