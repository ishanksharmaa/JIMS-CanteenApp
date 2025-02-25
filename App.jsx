import React from "react";
import { Appearance, StatusBar, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import CustomToast from "./src/components/CustomToast";
import { CartProvider } from "./src/components/CartContext"; // ✅ CartContext Import
import { ThemeProvider, useTheme } from "./src/components/ThemeContext";

import SplashScreen from "./src/screens/SplashScreen";
import GetStartedScreen from "./src/screens/GetStartedScreen";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CartScreen from "./src/screens/CartScreen";
import FavoriteScreen from "./src/screens/FavoriteScreen";
import ProductScreen from "./src/screens/ProductScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import AppearanceSetting from "./src/screens/settings/AppearanceSetting";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabs = () => {
  const { theme } = useTheme();
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBarBg,  // ✅ Dark/Light mode works here
          borderTopWidth: 0,
          height: 80,
          paddingVertical: theme.tabBarPaddingVertical,
          borderRadius: theme.tabBarRadius,
          marginBottom: theme.tabBarMarginBottom,
          marginHorizontal: theme.tabBarMarginHorizontal,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "bold",
          paddingTop: 4,
        },
        tabBarActiveTintColor: theme.tabBarIconActive,
        tabBarInactiveTintColor: theme.tabBarIcon,
        tabBarIconStyle: { marginTop: 7 },
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="home" color={color} size={size} /> }} />
      <Tab.Screen name="Favorites" component={FavoriteScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="heart" color={color} size={size} /> }} />
      <Tab.Screen name="Menu" component={ProfileScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} /> }} />
      <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="cart" color={color} size={size} /> }} />
    </Tab.Navigator>
  );
};

// ✅ This function ensures that `useTheme()` is available
const AppContent = () => {
  const { theme } = useTheme();  // ✅ Now NavigationContainer & StatusBar can use the theme
  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <NavigationContainer>
        <StatusBar backgroundColor="transparent" barStyle="default" translucent />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Home" component={BottomTabs} />
          <Stack.Screen name="Favorites" component={FavoriteScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="ProductScreen" component={ProductScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="Appearance" component={AppearanceSetting} />
        </Stack.Navigator>
        <Toast config={CustomToast} />
      </NavigationContainer>
    </View>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <CartProvider>
        <AppContent />  {/* ✅ Wrapping here so `useTheme()` works properly */}
      </CartProvider>
    </ThemeProvider>
  );
};

export default App;
