import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons"; // Import icon library

import SplashScreen from "./src/screens/SplashScreen";
import GetStartedScreen from "./src/screens/GetStartedScreen";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CartScreen from "./src/screens/CartScreen";
import Toast from 'react-native-toast-message';
import CustomToast from "./src/components/CustomToast";

// Create Tab Navigator
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const BottomTabs = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#0E3386", // Background color of the tab bar
          backgroundColor: "#ddd", // Background color of the tab bar
          borderTopWidth: 0, // Remove the top border line
          height: 80, // Adjust the height
          paddingBottom: 10, // Add some space at the bottom
          borderRadius: 50,
          marginBottom: 15,
          marginHorizontal: 20,
        },
        tabBarLabelStyle: {
          fontSize: 12, // Label font size
          fontWeight: "bold", // Make labels bold
          paddingTop: 4,
        },
        tabBarActiveTintColor: "#333", // Active tab text color
        tabBarInactiveTintColor: "#aaa", // Inactive tab text color
        tabBarIconStyle: {
          marginTop: 7, // Icon margin
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Favorites"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="heart" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Menu"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Orders"
        component={CartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="GetStarted" component={GetStartedScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Cart" component={CartScreen} />
        <Stack.Screen name="Home" component={BottomTabs} />
      </Stack.Navigator>
      <Toast config={CustomToast} />
    </NavigationContainer>
  );
};

export default App;
