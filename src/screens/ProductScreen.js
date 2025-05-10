import React, { useState, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import CustomButton from "../components/CustomButton";
import { useTheme } from "../components/ThemeContext";
import { useCart } from "../components/CartContext";
import { useUser } from "../components/UserContext";
// import {handleAddtoCart} from "../components/ProductCard";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import { runOnJS } from 'react-native-reanimated';
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withSpring, withTiming, withRepeat, withDelay, runOnJS } from 'react-native-reanimated';
import { GestureDetector, Gesture } from 'react-native-gesture-handler';

const ProductScreen = () => {
  const route = useRoute();
  const { image, title, price, descr, quantity, qty, amount, time, available } = route.params;
  const { theme } = useTheme();
  const { addedToCart, toggleFavoriteItem, isFavorite, cartItems, removedFromCart, user, updateQuantity, onAddtoCart, fetchProductByTitle, handlingPayment, singleProduct, setSingleProduct } = useCart();
  const styles = dynamicTheme(theme, available);
  const navigation = useNavigation();
  const { refreshUser } = useUser();
  const isInCart = cartItems.some(item => item.title === title);
  const item = cartItems.find(cartItem => cartItem.title === title);
  const [count, setCount] = useState(1); // Default count 1
  const [productData, setProductData] = useState(null);

  const scaleBag = useSharedValue(1);
  const scaleFav = useSharedValue(1);
  const scaleText = useSharedValue(1);
  const bagOffset = useSharedValue(1);

  useEffect(() => {
    const loadProductData = async () => {
      try {
        setLoading(true);
        const data = await fetchProductByTitle(title);
        setProductData(data);
      } catch (err) {
        setError(err.message);
        console.error("Failed to load product:", err);
      } finally {
        setLoading(false);
      }
    };

    loadProductData();
  }, [title]);


  const animatedBagStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleBag.value }],
    };
  });
  const animatedFavStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleFav.value }],
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scaleText.value }],
    };
  });

  const bounceBag = () => {
    scaleBag.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withSpring(1)
    );
  };
  const bounceFav = () => {
    scaleFav.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withSpring(1)
    );
  };
  const bounceText = () => {
    scaleText.value = withSequence(
      withTiming(1.2, { duration: 100 }),
      withSpring(1)
    );
  };

  useEffect(() => {
    if (item) {
      setCount(item.qty); // Set the quantity from cartItems
    }
  }, [item]);  // Runs only when item changes


  const bagAnimationAuto = () => {
    if (isInCart) {
      bagOffset.value = withRepeat(
        withSequence(
          withTiming(-21, { duration: 800 }),  // Move up
          withTiming(0, { duration: 500 }),    // Move down
          withDelay(2000, withTiming(0, { duration: 0 })) // 0.5s pause
        ),
        -1, // infinite repeat
        true // reverse
      );
    }
    else {
      bagOffset.value = 0; // reset on unmount
    }
  }

  const swipeUp = Gesture.Pan()
    .onBegin(() => {
      // Cancel auto animation when user starts dragging
      bagOffset.value = 0;
    })
    .onUpdate((e) => {
      // Only allow dragging UP (negative Y) & limit to -21px  
      if (e.translationY < 0) {
        bagOffset.value = Math.max(e.translationY, -80);
      }
    })
    .onEnd((e) => {
      // If dragged up enough (-15px threshold), go to Cart  
      if (e.translationY < -60) {
        runOnJS(navigation.navigate)("Cart");
      }

      // Return to 0 position then restart auto animation
      bagOffset.value = withSpring(0, {}, (finished) => {
        if (finished) runOnJS(bagAnimationAuto)();
      });
    });


  const swipeHintStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: bagOffset.value }],
    };
  });




  useEffect(() => {
    bagAnimationAuto();

    return () => {
      bagOffset.value = 0; // reset on unmount
    };
  }, [isInCart]);





  const handleCartAction = (count) => {
    if (!user) {
      onAddtoCart("alert-circle", "Login required!", "or SignUp to continue", true, 2000);
    }
    if (isInCart) {
      removedFromCart(title);
      bounceBag();
      updateQuantity(title, 1)
    } else {
      const product = { image, title, price, descr, quantity, qty: count, amount: price * count };
      addedToCart(product);
      bounceBag();
      updateQuantity(title, count);
      // checkCart();
    }
    refreshUser();
  };


  const displayImage = productData?.image || image;
  const displayTitle = productData?.title || title;
  const displayPrice = productData?.price || price;
  const displayDescr = productData?.descr || descr;
  const displayQuantity = productData?.quantity || quantity;
  const displayTime = productData?.time || time;
  const displayAvailable = productData?.available || available;
  const product = { image, title, price, descr, quantity, qty: count, amount: price * count };


  return (
    <View style={styles.container}>

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()} activeOpacity={0.6} >
        <Ionicons name="chevron-back" size={24} color={theme.text} />
      </TouchableOpacity>

      <View style={styles.headerIcons}>
        <TouchableOpacity style={styles.shareBtn} onPress={() => navigation.goBack()} activeOpacity={0.6} >
          <Ionicons name="share-outline" size={24} color={theme.text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.favBtn} onPress={() => { toggleFavoriteItem(title); bounceFav(); }} activeOpacity={0.6} >
          <Animated.View style={animatedFavStyle}>
            <Ionicons name={isFavorite(title) ? "heart" : "heart-outline"} size={24} color={isFavorite(title) ? theme.customButtonBg : theme.text} />
          </Animated.View>
        </TouchableOpacity>

      </View>
      <Image source={displayImage} style={styles.productImage} />

      <View style={styles.bigContainer}>

        <Text style={styles.productTitle}>{displayTitle}</Text>
        <Text style={styles.productPrice}>{'₹' + displayPrice}</Text>
        <Text style={styles.productQuantity}>{'Qty: ' + displayQuantity}</Text>

        <View style={styles.countHandler}>
          <TouchableOpacity activeOpacity={1}
            // onPress={() => setCount((prev) => (prev > 1 ? prev - 1 : 1))}
            onPress={() => {
              const newCount = count - 1;
              if (newCount >= 1) {
                bounceText();
                setCount(newCount);
                if (isInCart) {
                  updateQuantity(title, newCount);
                }
              }
            }}
          >
            <Ionicons name="remove-circle" size={58} color={"grey"} />
          </TouchableOpacity>

          <Animated.View style={animatedTextStyle}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', textAlign: 'center', color: theme.text }}>{count}</Text>
          </Animated.View>

          <TouchableOpacity activeOpacity={1}
            // onPress={() => setCount((prev) => (prev = prev + 1))}
            onPress={() => {
              const newCount = count + 1;
              if (newCount >= 1) {
                bounceText();
                setCount(newCount);
                if (isInCart) {
                  updateQuantity(title, newCount);
                }
              }
            }}
          >
            <Ionicons name="add-circle" size={58} color={theme.customButtonBg} />
          </TouchableOpacity>
        </View>

        <View style={styles.descContainer}>
          <Text style={styles.descTitle}>description: { }</Text>
          <ScrollView>
            <Text style={styles.descContent}>{item?.descr || displayDescr || "Info not provided..."}</Text>
            {/* <Text style={styles.descContent}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</Text> */}
          </ScrollView>

        </View>

        <View style={styles.moreInfoContainer}>

          <View style={styles.productInfoCard}>
            <Text style={{ fontSize: 18, textAlign: 'center', color: theme.text }}>4.5 ⭐</Text>
            <Text style={styles.infoTitle}>Ratings</Text>
          </View>
          <View style={styles.productInfoCard}>
            {/* <Ionicons name="time-outline" size={28} color={theme.text} /> */}
            <Text style={{ color: theme.text, paddingTop: 6 }}>🕒 {displayTime}</Text>
            <Text style={styles.infoTitle}>Pickup Time</Text>
          </View>
          <View style={styles.productInfoCard}>
            {displayAvailable ? (
              <Ionicons name="checkmark-circle-outline" size={28} color={"green"} />
            ) : (
              <Ionicons name="close-circle-outline" size={28} color={"red"} />
              // <Ionicons name="close" size={28} color={"red"} />
            )
            }
            <Text style={styles.infoTitle}>{displayAvailable ? "Available" : "Unavailable"}</Text>
          </View>

        </View>


        <View style={styles.orderBtn}>

          {!displayAvailable ? (
            <Text style={{ color: 'red', fontSize: 16, marginBottom: 20 }}>Currently unavailable!</Text>
          ) :
            (
              <>
                < GestureDetector gesture={swipeUp}>
                  <Animated.View style={[styles.iconButton, animatedBagStyle, swipeHintStyle]}>
                    <TouchableOpacity
                      // style={styles.iconButton}
                      onPress={() => handleCartAction(count)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={isInCart ? "bag" : "bag-outline"}
                        size={29}
                        color={theme.customButtonBg}
                      />
                    </TouchableOpacity>
                  </Animated.View>
                </GestureDetector>


                <View style={styles.buttonContainer}>
                  <CustomButton btnColor={theme.customButtonBg} textColor={theme.customButtonText} title={`Order for ₹${(parseFloat(price) * count).toFixed(0)}`} onPress={() => handlingPayment(false, (parseFloat(price) * count).toFixed(0), product)} />
                </View>
              </>
            )}
        </View>
      </View>
    </View >
  );
};

const dynamicTheme = (theme, available) => ({
  container: { flex: 1, alignItems: "", padding: 0, backgroundColor: theme.background },
  bigContainer: { flex: 1, borderTopLeftRadius: '6%', borderTopRightRadius: '6%', backgroundColor: theme.background, paddingTop: 14 },
  headerIcons: { flexDirection: 'row', width: '23%', justifyContent: 'space-between', position: 'absolute', right: 20, top: 55, zIndex: 10 },

  backBtn: { padding: 7, borderRadius: 20, backgroundColor: theme.backBtnBg, position: 'absolute', left: 15, top: 55, zIndex: 10 },
  shareBtn: { padding: 7, borderRadius: 20, backgroundColor: theme.backBtnBg },
  favBtn: { padding: 7, borderRadius: 20, backgroundColor: theme.backBtnBg },

  productImage: { width: '100%', height: 250, borderRadius: 10, marginBottom: 0, marginTop: 40 },
  productTitle: { fontSize: 24, fontWeight: "bold", color: theme.text, marginLeft: 20, width: '50%', backgroundColor: 'transparent', textTransform: 'capitalize' },
  productPrice: { fontSize: 22.5, color: theme.cardPrice, marginTop: 10, marginLeft: 20, fontWeight: 'bold' },
  productQuantity: { fontSize: 14, color: theme.cardPrice, marginTop: 10, marginLeft: 20, fontWeight: 'bold' },

  countHandler: { backgroundColor: '', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '36%', position: 'absolute', right: '5%', top: '6.5%' },

  descContainer: { alignItems: 'left', backgroundColor: 'transparent', maxHeight: '22%', margin: 20, overflow: 'hidden' },
  descTitle: { fontWeight: 'bold', textTransform: 'capitalize', paddingBottom: 5, color: theme.text },
  descContent: { textAlign: 'left', color: theme.text },

  moreInfoContainer: { backgroundColor: '', width: '100%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 30, paddingHorizontal: 10 },
  productInfoCard: {
    // backgroundColor: '#eee',
    backgroundColor: theme.productInfoCard,
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 13,
    height: 85,
    marginHorizontal: 10,
    borderRadius: 10,
    shadowColor: '#000', // Shadow color
    shadowOffset: { width: 0, height: 4 }, // Shadow direction
    shadowOpacity: 0.1, // Shadow opacity
    shadowRadius: 2, // Shadow blur radius
    elevation: 2, // For Android shadow
  },
  infoTitle: { color: 'grey' },


  orderBtn: {
    position: 'absolute',
    bottom: 20,
    flexDirection: 'row',
    width: '100%',
    alignSelf: 'center',
    justifyContent: available ? 'space-between' : 'center',
    alignItems: 'center',
    paddingLeft: available ? 30 : 0,
    backgroundColor: 'transparent',
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
});

export default ProductScreen;
