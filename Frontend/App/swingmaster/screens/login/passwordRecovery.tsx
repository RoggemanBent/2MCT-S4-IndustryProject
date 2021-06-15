import React, { useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import firebase from 'firebase';
import 'firebase/auth';
import { firebaseConfig } from '../../utils/firebaseConfig';

import UserData from '../../models/user';
import BackArrow from '../../assets/icons/backarrow';
import { neutral } from '../../styles/colors/colors';
import { inputs } from '../../styles/components/Inputs';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}
const provider = new firebase.auth.GoogleAuthProvider();

const Login = ({ navigation }: any) => {
  const [userData, setUserData] = useState<UserData>({
    email: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState<string>('');
  const [emailError, setEmailError] = useState<string>('');

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
              navigation.goBack();
            }}
          >
            <BackArrow color={neutral[900]} />
          </TouchableOpacity>
        </View>
        <View>
          <View>
            <View style={{ alignSelf: 'center', paddingVertical: 20 }}></View>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
              <View style={inputs.titleBox}>
                <Text style={inputs.titleText}>Password reset</Text>
              </View>
              <View style={inputs.box}>
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
                <Text>{emailError}</Text>
              </View>
            </KeyboardAvoidingView>
            <Text>{error}</Text>
            <TouchableOpacity
              style={inputs.button}
              onPress={() => {
                const auth = firebase.auth();

                auth
                  .sendPasswordResetEmail(userData.email)
                  .then(function () {
                    Alert.alert(`Password reset email`, `has been send`, [
                      {
                        text: 'Ok',
                        onPress: () => {
                          navigation.goBack();
                        },
                        style: 'default',
                      },
                    ]);
                  })
                  .catch(function (error) {
                    // An error happened.
                  });
              }}
            >
              <Text>Reset password</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
