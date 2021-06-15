import React, { useEffect, useState } from 'react';
import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/storage';
import { firebaseConfig } from '../../utils/firebaseConfig';
import { inputs } from '../../styles/components/Inputs';
import { neutral } from '../../styles/colors/colors';

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const Profile = ({ navigation }: any) => {
  const [user, setUser] = useState<any>();
  const [displayName, setDisplayName] = useState<any>();

  const userRef = firebase.firestore().collection('users');

  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      setUser(user);
      setDisplayName(user.displayName);
    }
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: neutral[900] }}>
      <View style={{ flex: 1, backgroundColor: neutral[200] }}>
        <View>
          <TouchableOpacity
            onPress={() => {
              navigation.goBack();
            }}
          ></TouchableOpacity>
        </View>
        <View>
          <View style={inputs.titleBox}>
            <Text style={inputs.titleTextSmall}>Hi {displayName} 👋</Text>
          </View>
          <View></View>
          <TouchableOpacity
            onPress={() => {
              console.log('signing out');

              firebase
                .auth()
                .signOut()
                .then(() => {
                  console.info('signing out');
                })
                .catch((error) => {
                  console.error(error);
                });
            }}
          >
            <View style={inputs.buttonWhite}>
              <Text style={inputs.buttonText}>Logout</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              Alert.alert(
                `Do you want to delete your account`,
                `When you tap delete, things are lost forever!`,
                [
                  {
                    text: 'Cancel',
                    onPress: () => {},
                    style: 'cancel',
                  },
                  {
                    text: 'Remove',
                    onPress: () => {
                      if (user) {
                        user
                          .delete()
                          .then(function () {})
                          .catch(function (error: string) {
                            console.error(error);
                            Alert.alert(
                              `Signin expired`,
                              `You need to resignin to delete your account`,
                              [
                                {
                                  text: 'Cancel',
                                  onPress: () => {},
                                  style: 'cancel',
                                },
                                {
                                  text: 'ok',
                                  onPress: () => {
                                    firebase
                                      .auth()
                                      .signOut()
                                      .then(() => {
                                        console.info('signing out');
                                      })
                                      .catch((error) => {
                                        console.error(error);
                                      });
                                  },
                                  style: 'default',
                                },
                              ]
                            );
                          });
                      }
                    },
                    style: 'destructive',
                  },
                ]
              );
            }}
          >
            <View style={inputs.buttonWhite}>
              <Text style={[inputs.buttonText, inputs.error]}>
                Delete Account
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
