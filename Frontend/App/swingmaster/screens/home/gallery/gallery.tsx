import React, { useEffect, useState } from 'react';
import {
  Text,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as MediaLibrary from 'expo-media-library';
import { MediaType } from 'expo-media-library';
import * as VideoThumbnails from 'expo-video-thumbnails';
import Play from '../../../assets/icons/play';
import SmallArrow from '../../../assets/icons/smallarrow';
import { neutral } from '../../../styles/colors/colors';

const Gallery = ({ navigation }: any) => {
  const [hasPermission, setHasPermission] = useState<any>(null);
  const [gallery, setGallery] = useState<any>([]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getVideos();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    (async () => {
      const { status: mediaLibraryStatus } =
        await MediaLibrary.requestPermissionsAsync();
      if (mediaLibraryStatus === 'granted') {
        setHasPermission('granted');
        getVideos();
      }
    })();
  }, []);

  const getVideos = async () => {
    const album = await MediaLibrary.getAlbumAsync('swingmaster');
    if (album !== null) {
      const albumVideos = await MediaLibrary.getAssetsAsync({
        album: album,
        mediaType: MediaType.video,
      });

      const cardsArray = [];
      for (let i = 0; i < albumVideos.assets.length; i++) {
        const card = await createVideoCards(albumVideos.assets[i]);
        cardsArray.unshift(card);
      }
      setGallery(cardsArray);
      return;
    }
    setGallery(null);
  };

  const createVideoCards = async (v: any) => {
    const tumbnail = await generateThumbnail(v.uri);
    const date = new Date(v.creationTime);
    const timeStamp = `${date.getDate()}/${date.getMonth()}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    const id = v.id;
    const duration = v.duration;
    let filename = v.filename.replace('.mp4', '');
    if (filename.length > 25) {
      filename = `${filename.slice(0, 25)}...`;
    }
    let minutes: number = 0,
      seconds: number,
      durationTime: string,
      secondsFormat: string;
    seconds = Math.round(duration % 60);
    if (duration >= 60) {
      minutes = Math.round((duration - seconds) / 60);
    }
    secondsFormat = seconds % 60 > 0 ? `0${seconds}` : `${seconds}`;
    durationTime = `${minutes}:${secondsFormat}`;

    return (
      <TouchableOpacity
        key={id}
        style={{
          marginBottom: 5,
        }}
        onPress={() => {
          navigation.navigate('Detail', { video: v, tumbnail: tumbnail });
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            shadowColor: '#000',
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,

            elevation: 5,
          }}
        >
          <View
            style={{
              width: 100,
              height: 100,
              backgroundColor: neutral[800],
              display: 'flex',
              flexDirection: 'row',
            }}
          >
            <Image
              source={{ uri: tumbnail }}
              style={{ width: 100, height: 100, opacity: 0.5 }}
            />
            <View
              style={{
                position: 'absolute',
                display: 'flex',
                justifyContent: 'space-around',
                alignContent: 'center',
                paddingVertical: 10,
                width: 100,
                height: 100,
              }}
            >
              <View style={{ alignSelf: 'center' }}>
                <Play />
              </View>
              <Text
                style={{
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  color: 'white',
                }}
              >
                {durationTime}
              </Text>
            </View>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              flex: 1,
            }}
          >
            <View style={{ marginHorizontal: 15, alignSelf: 'center' }}>
              <Text style={{ fontSize: 16 }}>{filename}</Text>
              <Text style={{ fontSize: 14, color: neutral[800] }}>
                {timeStamp}
              </Text>
            </View>
            <View style={{ alignSelf: 'center', marginRight: 20 }}>
              <SmallArrow />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const generateThumbnail = async (videoUri: string): Promise<string> => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(videoUri, {
        time: 500,
      });
      return uri;
    } catch (e) {
      console.warn(e);
      return '';
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to Media library</Text>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: neutral[900] }}>
      <ScrollView style={{ backgroundColor: neutral[200] }}>
        {gallery !== null && gallery !== undefined ? (
          gallery.length === 0 ? (
            <ActivityIndicator size="large" />
          ) : (
            gallery
          )
        ) : (
          <Text
            style={{
              fontSize: 20,
              fontWeight: 'bold',
              textAlign: 'center',
              marginTop: 30,
            }}
          >
            No videos found
          </Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Gallery;
