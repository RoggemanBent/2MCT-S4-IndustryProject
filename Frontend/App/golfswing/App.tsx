import React, {useState, useEffect} from 'react';
import {SafeAreaView, PermissionsAndroid, Text, View} from 'react-native';

// import {
//   RTCPeerConnection,
//   RTCIceCandidate,
//   RTCSessionDescription,
//   RTCView,
//   MediaStream,
//   MediaStreamTrack,
//   mediaDevices,
//   registerGlobals,
//   VideoTrack,
// } from 'react-native-webrtc';

//import {io} from 'socket.io-client';

const App = () => {
  // const [stream, setStream] = useState({toURL: () => null});
  // const [permissionsGranted, setPermissionsGranted] = useState<boolean>(false);
  // const [isFront, setIsFront] = useState(true);

  //const socket = io('10.2.167.3:5000');

  // const permissionCheck = async () => {
  //   try {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.CAMERA,
  //       {
  //         title: 'App Camera Permission',
  //         message: 'Needs access to your camera ',
  //         buttonNeutral: 'Ask Me Later',
  //         buttonNegative: 'Cancel',
  //         buttonPositive: 'OK',
  //       },
  //     );
  //     if (granted === PermissionsAndroid.RESULTS.GRANTED) {
  //       setPermissionsGranted(true);
  //       getStream();
  //     } else {
  //       setPermissionsGranted(false);
  //     }
  //   } catch (err) {
  //     console.warn(err);
  //   }
  // };

  // const getStream = () => {
  //   const configuration = {iceServers: [{url: 'stun:stun.l.google.com:19302'}]};
  //   const pc = new RTCPeerConnection(configuration);
  //   if (permissionsGranted) {
  //     mediaDevices.enumerateDevices().then(sourceInfos => {
  //       let videoSourceId;
  //       for (let i = 0; i < sourceInfos.length; i++) {
  //         const sourceInfo = sourceInfos[i];
  //         if (
  //           sourceInfo.kind == 'videoinput' &&
  //           sourceInfo.facing == (isFront ? 'front' : 'environment')
  //         ) {
  //           videoSourceId = sourceInfo.deviceId;
  //         }
  //       }
  //       mediaDevices
  //         .getUserMedia({
  //           audio: true,
  //           video: {
  //             flex: 1,
  //             frameRate: 30,
  //             facingMode: isFront ? 'user' : 'environment',
  //             deviceId: videoSourceId,
  //           },
  //         })
  //         .then((res: any) => {
  //           setStream(res);
  //           console.log(stream === null);

  //           if (stream === null) {
  //             console.log('rerun');

  //             getStream();
  //           }
  //         })
  //         .catch((error: any) => {
  //           console.error(error);
  //         });
  //     });
  //     pc.createOffer().then(desc => {
  //       pc.setLocalDescription(desc).then(() => {
  //         // Send pc.localDescription to peer
  //       });
  //     });

  //     pc.onicecandidate = function (event) {
  //       // send event.candidate to peer
  //     };
  //   }
  // };

  // useEffect(async () => {
  //   //permissionCheck();
  //   //getStream();
  // }, []);

  return (
    <View>
      <Text>App.js</Text>
      {/* {permissionsGranted && stream !== null ? (
          (console.log(stream.toURL()), (<Text>Camera</Text>))
        ) : (
          // <RTCView
          //   zOrder={2}
          //   mirror={true}
          //   objectFit={'cover'}
          //   style={{width: 640, height: 480, background: 'red'}}
          //   streamURL={stream.toURL()}
          // />
          <Text>Permission required</Text>
        )} */}
    </View>
  );
};

export default App;
