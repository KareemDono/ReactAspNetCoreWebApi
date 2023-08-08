import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen.js';
import OnboardingScreen from '../screens/OnboardingScreen.js';
import Signup from '../screens/Signup.js';
import Login from '../screens/Login.js';
import ForgetPassword from '../screens/ForgetPassword.js';
import ResetPassword from '../screens/ResetPassword.js';
import MainShop from '../screens/MainShop.js';
import ProfileScreen from '../screens/Profile.js';
import ProductCard from '../screens/ProductCard.js';
import Cart from '../screens/Cart.js';
import AdminPage from '../screens/Admin/AdminPage.js';
import AllUsers from '../screens/Admin/AllUsers.js';
import UserId from '../screens/Admin/UserId.js';
import CreateProduct from '../screens/Admin/CreateProduct.js';
import UpdateProduct from '../screens/Admin/UpdateProduct.js';
import DeleteProduct from '../screens/Admin/DeleteProduct.js';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const showOnboarding = true;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={showOnboarding ? 'Onboarding' : 'Home'}>
        {showOnboarding ? (
          <Stack.Screen name="Onboarding" options={{ headerShown: false }} component={OnboardingScreen} />
        ) : null}
        <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
        <Stack.Screen name="Signup" options={{ headerShown: false }} component={Signup} />
        <Stack.Screen name="Login" options={{ headerShown: false }} component={Login} />
        <Stack.Screen name="ForgetPassword" options={{ headerShown: false }} component={ForgetPassword} />
        <Stack.Screen name="ResetPassword" options={{ headerShown: false }} component={ResetPassword} />
        <Stack.Screen name="MainShop" options={{ headerShown: false }} component={MainShop} />
        <Stack.Screen name="Profile" options={{ headerShown: false }} component={ProfileScreen} />
        <Stack.Screen name="ProductCard" options={{ headerShown: false }} component={ProductCard} />
        <Stack.Screen name="Cart" options={{ headerShown: false }} component={Cart} />
        <Stack.Screen name="AdminPage" options={{ headerShown: false }} component={AdminPage} />
        <Stack.Screen name="AllUsers" options={{ headerShown: false }} component={AllUsers} />
        <Stack.Screen name="UserId" options={{ headerShown: false }} component={UserId} />
        <Stack.Screen name="CreateProduct" options={{ headerShown: false }} component={CreateProduct} />
        <Stack.Screen name="UpdateProduct" options={{ headerShown: false }} component={UpdateProduct} />
        <Stack.Screen name="DeleteProduct" options={{ headerShown: false }} component={DeleteProduct} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}