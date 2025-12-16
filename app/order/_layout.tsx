import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import AddressContextProvider from '@/context/addressContext'
import FoodProvider from '@/context/foodContext'
import { UserProvider } from '@/context/userDataContext'

import { useColorScheme } from '@/hooks/useColorScheme';
import React from 'react';
import { CartProvider } from '@/context/CartContext';
import { OrderProvider } from '@/context/userOrderContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <UserProvider>
      <AddressContextProvider>
        <OrderProvider>
          <CartProvider>
            <FoodProvider>
              <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                <Stack>
                  <Stack.Screen name="index" options={{
                    headerShown: false
                  }} />
                  <Stack.Screen name="cart" options={{
                    headerShown: false
                  }} />
                  <Stack.Screen name="checkout" options={{
                    headerShown: false
                  }} />
                  <Stack.Screen name='_welcome' options={{
                    headerShown: false
                  }} />
                  <Stack.Screen name="+not-found" />
                  <Stack.Screen name='details/[id]' options={{
                    headerShown: false
                  }} />
                  <Stack.Screen name='order/[id]' options={{
                    headerShown: false
                  }} />
                  <Stack.Screen name='personalInfo' options={{
                    headerShown: false
                  }} />
                  <Stack.Screen name='success' options={{
                    headerShown: false
                  }} />
                  <Stack.Screen name='orderHistory' options={{
                    headerShown: false
                  }} />
                  <Stack.Screen name='addProduct' options={{
                    headerShown: false
                  }} />
                  <Stack.Screen
                    name='modal'
                    options={{
                      presentation: 'modal'
                    }}
                  />
                </Stack>
                <StatusBar style="auto" />
              </ThemeProvider>
            </FoodProvider>
          </CartProvider>
        </OrderProvider>
      </AddressContextProvider>
    </UserProvider>
  );
}
