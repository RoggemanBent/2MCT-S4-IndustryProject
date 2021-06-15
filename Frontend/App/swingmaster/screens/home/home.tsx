import React, { useState, useEffect, useRef } from 'react';
import { Animated, View, Text, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { Camera } from 'expo-camera';
import { Audio } from 'expo-av';
import * as MediaLibrary from 'expo-media-library';

import CameraSwitchIcon from '../../assets/icons/cameraswitch';
import { neutral, validation } from '../../styles/colors/colors';

const Home = ({ navigation }: any) => {
  const [hasPermission, setHasPermission] = useState<any>(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [second, setSecond] = useState<String>('00');
  const [minute, setMinute] = useState<String>('00');
  const [isTimer, setIsTimer] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const isFocused = useIsFocused();
  const cameraRef = useRef<any>(null);

  const recordAnim = useRef(new Animated.Value(50)).current;

  const recordSquare = () => {
    Animated.timing(recordAnim, {
      useNativeDriver: true,
      toValue: 5,
      duration: 1500,
    }).start();
  };
  const recordCircle = () => {
    Animated.timing(recordAnim, {
      useNativeDriver: true,
      toValue: 50,
      duration: 1500,
    }).start();
  };

  useEffect(() => {
    let intervalId: any;

    if (isTimer) {
      intervalId = setInterval(() => {
        const secondCounter: number = counter % 60;
        const minuteCounter: number = Math.floor(counter / 60);

        const computedSecond =
          String(secondCounter).length === 1
            ? `0${secondCounter}`
            : secondCounter;
        const computedMinute =
          String(minuteCounter).length === 1
            ? `0${minuteCounter}`
            : minuteCounter;

        setSecond(`${computedSecond}`);
        setMinute(`${computedMinute}`);

        setCounter((counter) => counter + 1);
      }, 1000);
    }

    return () => clearInterval(intervalId);
  }, [isTimer, counter]);

  useEffect(() => {
    (async () => {
      const { status: videoStatus } = await Camera.requestPermissionsAsync();
      const { status: audioStatus } = await Audio.requestPermissionsAsync();
      const { status: mediaLibraryStatus } =
        await MediaLibrary.requestPermissionsAsync();
      if (
        videoStatus === 'granted' &&
        audioStatus === 'granted' &&
        mediaLibraryStatus === 'granted'
      ) {
        setHasPermission('granted');
      }
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: neutral[900] }}>
      <View style={{ flex: 1 }}>
        {isFocused ? (
          <Camera type={type} style={{ flex: 1 }} ratio="16:9" ref={cameraRef}>
            <View
              style={{
                display: 'flex',
                flex: 1,
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: 'column',
              }}
            >
              <TouchableOpacity
                style={{
                  right: 30,
                  top: 30,
                  position: 'absolute',
                  alignSelf: 'flex-end',
                }}
                onPress={() => {
                  setType(
                    type === Camera.Constants.Type.back
                      ? Camera.Constants.Type.front
                      : Camera.Constants.Type.back
                  );
                }}
              >
                <CameraSwitchIcon />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  const ref = cameraRef.current;
                  if (ref) {
                    if (!isRecording) {
                      recordSquare();
                      setIsTimer(true);
                      try {
                        const videoRecordPromise = ref.recordAsync({
                          quality: Camera.Constants.VideoQuality['720p'],
                          mute: true,
                        });
                        const album: string = 'swingmaster';
                        if (videoRecordPromise) {
                          setIsRecording(true);
                          const data = await videoRecordPromise;
                          const source = data.uri;
                          const asset = await MediaLibrary.createAssetAsync(
                            source
                          );
                          const albumExists = await MediaLibrary.getAlbumAsync(
                            album
                          );
                          if (albumExists === null) {
                            await MediaLibrary.createAlbumAsync(
                              album,
                              asset,
                              false
                            );
                          } else {
                            console.log(albumExists);

                            await MediaLibrary.addAssetsToAlbumAsync(
                              asset,
                              albumExists.id,
                              false
                            );
                          }
                        }
                      } catch (error) {
                        console.warn(error);
                      }
                    } else {
                      setIsRecording(false);
                      setIsTimer(false);
                      setCounter(0);
                      setMinute('00');
                      setSecond('00');
                      recordCircle();
                      ref.stopRecording();
                    }
                  }
                }}
              >
                <Animated.View
                  style={{
                    width: 65,
                    height: 65,
                    marginVertical: 20,
                    borderRadius: recordAnim,
                    backgroundColor: validation[900],
                  }}
                ></Animated.View>
                <Text
                  style={{
                    color: neutral[200],
                    textAlign: 'center',
                    marginBottom: 10,
                  }}
                >
                  {isTimer ? `${minute}:${second}` : ''}
                </Text>
              </TouchableOpacity>
            </View>
          </Camera>
        ) : (
          <Text>Camera not loaded</Text>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Home;
