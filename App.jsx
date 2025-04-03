// import firebase from 'firebase/app';
import firebase, { FirebaseApp } from '@react-native-firebase/app';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Firebase Config
const firebaseConfig = {
  apiKey: 'AIzaSyAx1FL3xD-XUvVtBelREh25TQ4Wd6PtMf0',
  authDomain: 'jims-canteen.firebaseapp.com',
  projectId: 'jims-canteen',
  storageBucket: 'jims-canteen.firebasestorage.app',
  messagingSenderId: '396737801187',
  appId: '1:396737801187:android:614571dd069abdabd1ced6',
};

// Initialize Firebase (before any components)
// if (!firebase.apps.length) {
//   firebase.initializeApp(firebaseConfig);
// } else {
//   firebase.app(); // if already initialized
// }

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


import React, {useState, useEffect} from "react";
import { Appearance, StatusBar, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import CustomToast from "./src/components/CustomToast";
import { CartProvider } from "./src/components/CartContext"; // ✅ CartContext Import
import { ThemeProvider, useTheme } from "./src/components/ThemeContext";

// Firebase Import
// import { FirebaseApp } from '@react-native-firebase/app';
// import auth from '@react-native-firebase/auth';
// import firestore, {FieldValue} from '@react-native-firebase/firestore';


import SplashScreen from "./src/screens/SplashScreen";
import GetStartedScreen from "./src/screens/GetStartedScreen";
import LoginScreen from "./src/screens/LoginScreen";
import SignUpScreen from "./src/screens/SignUpScreen";
import UsernameScreen from "./src/screens/UsernameScreen";
import HomeScreen from "./src/screens/HomeScreen";
import CartScreen from "./src/screens/CartScreen";
import FavoriteScreen from "./src/screens/FavoriteScreen";
import MenuScreen from "./src/screens/MenuScreen";
import ProductScreen from "./src/screens/ProductScreen";
import AddProductScreen from "./src/screens/AddProductScreen";
import ProductsListScreen from "./src/screens/ProductsListScreen";
import ProfileScreen from "./src/screens/ProfileScreen";
import SettingsScreen from "./src/screens/SettingsScreen";
import UserInfoScreen from "./src/screens/UserInfoScreen";
import AppearanceSetting from "./src/screens/settings/AppearanceSetting";
import { MemeCatProvider } from "./src/components/MemeCatContext";

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
      <Tab.Screen name="Menu" component={MenuScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="book" color={color} size={size} /> }} />
      {/* <Tab.Screen name="Cart" component={CartScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="cart" color={color} size={size} /> }} /> */}
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarIcon: ({ color, size }) => <Ionicons name="cog" color={color} size={size+3} /> }} />
    </Tab.Navigator>
  );
};

// ✅ This function ensures that `useTheme()` is available
const AppContent = () => {
  const { theme } = useTheme();  // ✅ Now NavigationContainer & StatusBar can use the theme
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Get the auth instance
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    });

    return unsubscribe;  // Clean up the listener when the component is unmounted
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <NavigationContainer>
        <StatusBar backgroundColor="transparent" barStyle="default" translucent />
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="GetStarted" component={GetStartedScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
          <Stack.Screen name="UsernameScreen" component={UsernameScreen} />
          <Stack.Screen name="Home" component={BottomTabs} />
          <Stack.Screen name="Favorites" component={FavoriteScreen} />
          <Stack.Screen name="Menu" component={MenuScreen} />
          <Stack.Screen name="Cart" component={CartScreen} />
          <Stack.Screen name="Profile" component={ProfileScreen} />
          <Stack.Screen name="ProductScreen" component={ProductScreen} />
          <Stack.Screen name="Settings" component={SettingsScreen} />
          <Stack.Screen name="UserInfo" component={UserInfoScreen} />
          <Stack.Screen name="Appearance" component={AppearanceSetting} />
          <Stack.Screen name="AddProductScreen" component={AddProductScreen} />
          <Stack.Screen name="ProductsList" component={ProductsListScreen} />
        </Stack.Navigator>
        <Toast config={CustomToast} />
      </NavigationContainer>
    </View>
  );
};

const App = () => {
  return (
    <MemeCatProvider>
    <ThemeProvider>
      <CartProvider>
        <AppContent />  {/* ✅ Wrapping here so `useTheme()` works properly */}
      </CartProvider>
    </ThemeProvider>
    </MemeCatProvider>
  );
};

export default App;
