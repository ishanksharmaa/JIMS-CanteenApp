import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import CustomToast from "./src/components/CustomToast";
import { CartProvider } from "./src/components/CartContext"; // ✅ CartContext Import

import SplashScreen from "./src/screens/SplashScreen";
import GetStartedScreen from "./src/screens/GetStartedScreen";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CartScreen from "./src/screens/CartScreen";
import FavoriteScreen from "./src/screens/FavoriteScreen";
import ProductDetail from "./src/screens/ProductDetail";
import ProfileScreen from "./src/screens/ProfileScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabs = () => (
  <Tab.Navigator
    initialRouteName="Home"
    screenOptions={{
      headerShown: false,
      tabBarStyle: {
        backgroundColor: "#ddd",
        borderTopWidth: 0,
        height: 80,
        paddingBottom: 10,
        borderRadius: 50,
        marginBottom: 15,
        marginHorizontal: 20,
      },
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: "bold",
        paddingTop: 4,
      },
      tabBarActiveTintColor: "#333",
      tabBarInactiveTintColor: "#aaa",
      tabBarIconStyle: { marginTop: 7 },
    }}
  >
    <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }} />
    <Tab.Screen name="Favorites" component={FavoriteScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} /> }} />
    <Tab.Screen name="Menu" component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} /> }} />
    <Tab.Screen name="Orders" component={CartScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="cart" color={color} size={size} /> }} />
  </Tab.Navigator>
);

const App = () => {
  return (
    <CartProvider> {/* ✅ Wrap with CartProvider */}
      <NavigationContainer>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Favorites" component={FavoriteScreen} />
          <Stack.Screen name="Home" component={BottomTabs} />
          <Stack.Screen name="ProductDetail" component={ProductDetail} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
        </Stack.Navigator>
        <Toast config={CustomToast} />
      </NavigationContainer>
    </CartProvider>
  );
};

export default App;
