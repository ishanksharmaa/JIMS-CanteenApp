import React, { useState, useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useTheme } from "../components/ThemeContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import firestore from "@react-native-firebase/firestore";
import { useUser } from "../components/UserContext";
import ProductCard from '../components/ProductCard';

const FavoriteScreen = () => {
  const { theme } = useTheme();
  const { userEmail } = useUser();
  const styles = dynamicTheme(theme);

  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uid, setUid] = useState(null);

  // Get user's UID from email
  useEffect(() => {
    if (!userEmail) return;

    const fetchUserId = async () => {
      try {
        const userSnapshot = await firestore()
          .collection("Users")
          .where("email", "==", userEmail)
          .get();

        if (!userSnapshot.empty) {
          setUid(userSnapshot.docs[0].id);
        }
      } catch (error) {
        console.error("Error fetching user ID:", error);
        setLoading(false);
      }
    };

    fetchUserId();
  }, [userEmail]);

  // Fetch favorites based on title field
  useEffect(() => {
    if (!uid) return;

    const unsubscribe = firestore()
      .collection("Users")
      .doc(uid)
      .collection("Favorites")
      .onSnapshot(async (favoritesSnapshot) => {
        const favoriteTitles = favoritesSnapshot.docs.map(doc => doc.data().title);

        if (favoriteTitles.length === 0) {
          setFavoriteProducts([]);
          setLoading(false);
          return;
        }

        try {
          // Fetch products where name matches any favorite title
          const productsSnapshot = await firestore()
            .collection("Products")
            .where("name", "in", favoriteTitles)
            .get();

          const products = productsSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setFavoriteProducts(products);
        } catch (error) {
          console.error("Error fetching favorite products:", error);
        } finally {
          setLoading(false);
        }
      });

    return () => unsubscribe();
  }, [uid]);

  // const renderProduct = ({ item }) => (
  //   <TouchableOpacity style={styles.productCard}>
  //     <View style={styles.productInfo}>
  //       <Text style={styles.productName}>{item.name}</Text>
  //       <Text style={styles.productPrice}>₹{item.price}</Text>
  //       {item.category && (
  //         <Text style={styles.productCategory}>{item.category}</Text>
  //       )}
  //     </View>
  //     <MaterialIcons name="favorite" size={24} color="red" />
  //   </TouchableOpacity>
  // );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={theme.primaryColor} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {favoriteProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart" size={80} color="red" />
          <Text style={styles.text}>No Favorites Yet</Text>
        </View>
      ) : (
        <>
          <Text style={styles.header}>Favorites</Text>
          <FlatList
            style={styles.listContainer}
            data={favoriteProducts}
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
              <View style={{ flex: 1, padding: 0, backgroundColor: 'transparent', margin: 0 }}>
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
    marginBottom: '19%'
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