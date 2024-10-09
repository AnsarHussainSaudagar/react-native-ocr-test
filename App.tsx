/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import {
  mediaDevices,
  RTCPeerConnection,
  RTCView,
  RTCIceCandidate,
  RTCSessionDescription,
  MediaStreamTrack
} from 'react-native-webrtc';

import notifee, { AndroidImportance } from '@notifee/react-native';


type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
}

const viewstyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  video: {
    width: 200,
    height: 200
  },
});

function App(): React.JSX.Element {

  const [localStream, setLocalStream] = useState(null);
  const [startStream, setStartStream] = useState(0);

  // mediaDevices.getUserMedia({
  //   audio: true,
  //   video: true
  // }).then(stream =>{
  //   console.log(stream);
    
  // })
  useEffect(() => {

    const startLocalStream = async () => {
      try {
        const channelId = await notifee.createChannel( {
          id: 'screen_capture',
          name: 'Screen Capture',
          lights: false,
          vibration: false,
          importance: AndroidImportance.DEFAULT
        } );
      
        await notifee.displayNotification( {
          title: 'Screen Capture',
          body: 'This notification will be here until you stop capturing.',
          android: {
            channelId,
            asForegroundService: true
          }
        } );
      } catch( err ) {
        // Handle Error
        console.log(err);
      };

      try {
        const stream : any = await mediaDevices.getDisplayMedia({ audio: true });
        
        setLocalStream(stream);

      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    startLocalStream();

    async function stopFService() {
      try {
        // console.log("check stop");
        
        await notifee.stopForegroundService();
      } catch( err ) {
        // Handle Error
      };
    }

    // Clean up stream when component is unmounted
    return () => {
      if (localStream) {
        localStream.getTracks().forEach((track :any )=> track.stop());
      }

      stopFService();
    };
  }, [startStream])
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const onClickStart = () =>{
    setStartStream(startStream + 1);

  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <Header />
        <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One">
            <Button title='Start' onPress={onClickStart}></Button>
          </Section>
          {/* <video src=""></video> */}
          {/* <View style={viewstyles.container}> */}
            {localStream && (
              <RTCView
                streamURL={localStream.toURL()} // Converts stream to a URL for RTCView
                style={viewstyles.video}
                objectFit="cover"
                // mirror={true} // Set to false if you don't want a mirrored view
              />
            )}
          {/* </View> */}
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
