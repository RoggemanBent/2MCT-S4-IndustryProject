import React, { useState } from 'react';
import {
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/database';
import { firebaseConfig } from '../../utils/firebaseConfig';

import UserData from '../../models/user';

import ValidateSignup from '../../components/validateSignup';
import { inputs } from '../../styles/components/Inputs';
import { neutral } from '../../styles/colors/colors';
import BackArrow from '../../assets/icons/backarrow';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
const provider = new firebase.auth.GoogleAuthProvider();
const db = firebase.firestore();

const Signup = ({ navigation }: any) => {
  const [userData, setUserData] = useState<UserData>({
    email: '',
    username: '',
    password: '',
  });
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');
  const [usernameError, setUsernameError] = useState<string>('');
  const [passwordError, setPasswordError] = useState<string>('');
  const [passwordConfirmError, setPasswordConfirmError] = useState<string>('');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: neutral[900] }}>
      <View style={{ flex: 1, backgroundColor: neutral[200] }}>
        <View>
          <TouchableOpacity
            style={{
              marginLeft: 30,
              marginTop: 30,
              width: 17,
              height: 33,
            }}
            onPress={() => {
              navigation.navigate('SignIn');
            }}
          >
            <BackArrow color={neutral[900]} />
          </TouchableOpacity>
        </View>
        <View>
          <View>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View style={inputs.titleBox}>
                <Text style={inputs.titleText}>Signup</Text>
              </View>
              <View style={inputs.box}>
                <View>
                  <Text style={inputs.text}>Email:</Text>
                  <TextInput
                    style={inputs.input}
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
                  <Text style={inputs.text}>Username:</Text>
                  <TextInput
                    style={inputs.input}
                    onChangeText={(text: string) => {
                      setUserData((oldUserData: UserData) => {
                        oldUserData.username = text;
                        return { ...oldUserData };
                      });
                    }}
                    value={userData?.username}
                    autoCompleteType="username"
                  />
                  <Text style={inputs.error}>{usernameError}</Text>
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
                </View>
                <Text style={inputs.error}>{passwordError}</Text>
                <View>
                  <Text style={inputs.text}>Confirm password:</Text>
                  <TextInput
                    style={inputs.input}
                    onChangeText={(text: string) => {
                      setPasswordConfirm(text);
                    }}
                    value={passwordConfirm}
                    autoCompleteType="password"
                    secureTextEntry={true}
                  />
                  <Text style={inputs.error}>{passwordConfirmError}</Text>
                </View>
              </View>
            </KeyboardAvoidingView>
            <Text style={inputs.error}>{error}</Text>
            <TouchableOpacity
              onPress={() => {
                console.log('pressed');

                const validated = ValidateSignup(userData, passwordConfirm);
                validated.validated
                  ? (() => {
                      firebase
                        .auth()
                        .createUserWithEmailAndPassword(
                          userData.email,
                          userData.password
                        )
                        .then(async (userCredential) => {
                          // Signed in
                          const user = userCredential.user;

                          const loggedInUser = firebase.auth().currentUser;

                          if (loggedInUser) {
                            loggedInUser
                              .updateProfile({
                                displayName: userData.username,
                              })
                              .then(function () {})
                              .catch(function (error) {});
                          }
                        })
                        .catch((error) => {
                          const errorCode = error.code;
                          const errorMessage = error.message;
                          setError(errorMessage);
                        });
                    })()
                  : (() => {
                      setEmailError('');
                      setUsernameError('');
                      setPasswordError('');
                      setPasswordConfirmError('');
                      setError('');
                      switch (validated.field) {
                        case 'email':
                          setEmailError(validated.error);
                          break;
                        case 'username':
                          setUsernameError(validated.error);
                          break;
                        case 'password':
                          setPasswordError(validated.error);
                          break;
                        case 'passwordconfirm':
                          setPasswordConfirmError(validated.error);
                          break;

                        default:
                          setError(validated.error);
                          break;
                      }
                    })();
              }}
            >
              <View style={inputs.button}>
                <Text style={inputs.buttonText}>Signup</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Signup;
