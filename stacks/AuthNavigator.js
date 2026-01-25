import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { authRoutes as routes } from '../constants/routes';
import { HomeScreen } from '../screens/auth';
import { Colors } from '../lib';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import * as WebBrowser from "expo-web-browser"
import TermsScreen from 'screens/auth/TermsScreen';
WebBrowser.maybeCompleteAuthSession()

const Stack = createNativeStackNavigator();
const AuthNavigator = () => {
   return (
      <Stack.Navigator
         initialRouteName={routes.HOME}
         screenOptions={{
            headerShown: false,
            contentStyle: {
               backgroundColor: Colors.white,
            },
         }}
      >
         <Stack.Screen component={HomeScreen} name={routes.HOME} />
         <Stack.Screen component={LoginScreen} name={routes.LOGIN} />
         <Stack.Screen component={RegisterScreen} name={routes.SIGNUP} />
         <Stack.Screen
            name={routes.TERMS}
            component={TermsScreen}
            options={{
               presentation: 'modal',
               headerShown: true,
               title: 'Términos y Condiciones de Workly',
            }}
         />
      </Stack.Navigator>
   );
};

export default AuthNavigator;