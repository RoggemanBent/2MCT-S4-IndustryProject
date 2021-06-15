import React, { useState } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import firebase from 'firebase';
import 'firebase/auth';
import { firebaseConfig } from './utils/firebaseConfig';

import Login from './screens/login/index';
import Singup from './screens/login/signup';
import PasswordRecovery from './screens/login/passwordRecovery';
import HomeScreen from './screens/home/index';
import { neutral } from './styles/colors/colors';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  firebase.auth().onAuthStateChanged((user) => {
    if (user !== null) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  return (
    <NavigationContainer>
      <View
        style={{
          backgroundColor: neutral[200],
        }}
      >
        <StatusBar style="light" />
      </View>
      <Stack.Navigator headerMode="none">
        {isLoggedIn ? (
          <>
            <Stack.Screen name="Home" component={HomeScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="SignIn" component={Login} />
            <Stack.Screen name="SignUp" component={Singup} />
            <Stack.Screen
              name="PasswordRecovery"
              component={PasswordRecovery}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
