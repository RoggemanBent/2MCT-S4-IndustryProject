import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import { firebaseConfig } from '../../utils/firebaseConfig';

import UserData from '../../models/user';
import { inputs } from '../../styles/components/Inputs';
import { neutral } from '../../styles/colors/colors';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
const provider = new firebase.auth.GoogleAuthProvider();

const Index = ({ navigation }: any) => {
  const [userData, setUserData] = useState<UserData>({
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: neutral[900] }}>
      <View style={{ flex: 1, backgroundColor: neutral[200] }}>
        <View style={{ alignSelf: 'center', paddingVertical: 20 }}></View>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <View style={inputs.titleBox}>
            <Text style={inputs.titleText}>Login</Text>
          </View>
          <View style={inputs.box}>
            <View>
              <Text style={inputs.text}>Email:</Text>
              <TextInput
                style={inputs.input}
                onFocus={() => {}}
                onChangeText={(text: string) => {
                  setUserData((oldUserData: UserData) => {
                    oldUserData.email = text;
                    return { ...oldUserData };
                  });
                }}
                value={userData?.email}
                autoCompleteType="email"
                keyboardType="email-address"
              />
              <Text style={inputs.error}>{emailError}</Text>
            </View>
            <View>
              <Text style={inputs.text}>Password:</Text>
              <TextInput
                style={inputs.input}
                onChangeText={(text: string) => {
                  setUserData((oldUserData: UserData) => {
                    oldUserData.password = text;
                    return { ...oldUserData };
                  });
                }}
                value={userData?.password}
                autoCompleteType="password"
                secureTextEntry={true}
              />
              <Text style={inputs.error}>{passwordError}</Text>
            </View>
          </View>
        </KeyboardAvoidingView>
        <Text style={inputs.error}>{error}</Text>
        <TouchableOpacity
          onPress={() => {
            if (userData.email === '') {
              setEmailError('Field cannot be empty');
            }
            if (userData.password === '') {
              setPasswordError('Field cannot be empty');
            }
            if (userData.password !== '' && userData.email !== '') {
              firebase
                .auth()
                .signInWithEmailAndPassword(userData.email, userData.password)
                .then((userCredential) => {
                  const user = userCredential.user;
                })
                .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  setError(errorMessage);
                });
            }
          }}
        >
          <View style={inputs.button}>
            <Text style={inputs.buttonText}>Login</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('SignUp');
          }}
        >
          <View style={inputs.buttonWhite}>
            <Text style={inputs.buttonText}>Signup</Text>
          </View>
        </TouchableOpacity>
        {error !== '' ? (
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('PasswordRecovery');
            }}
          >
            <Text
              style={[
                {
                  textAlign: 'center',
                  paddingVertical: 10,
                },
              ]}
            >
              Forgot Password
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Index;
