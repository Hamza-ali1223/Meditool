import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react'; // We added useEffect here!
import { vs, s } from 'react-native-size-matters';
import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import images from '../../assets/img/images';
import { GOOGLE_CLIENT_ID, test } from '@env';
import { useNavigation } from '@react-navigation/native';
import { authenticate } from '../api/auth';
import keychain from 'react-native-keychain'
import AsyncStorage from '@react-native-async-storage/async-storage'

const GoogleSignInButton = () => {
  const Navigation = useNavigation();

  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_CLIENT_ID,
    });
  }, []);

  const setupGoogleSignIn = () => {
    console.log(GOOGLE_CLIENT_ID);
  };

  const signInWithGoogle = async () => {
    setupGoogleSignIn();
    console.log('Google Sign In Method Called');
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      console.log(`Response: ${JSON.stringify(response?.data?.user?.name)}`);
      await AsyncStorage.setItem("userName":response?.data?.user?.name);

      if (isSuccessResponse(response)) {
        console.log('Logged In');
        authenticate(response.data)
          .then(async authResponse => {
            
            console.log('Received JWT Token:', authResponse.token);
            await keychain.setGenericPassword('authToken',authResponse?.token)     
            Navigation.navigate('Main');
          })
          .catch(err => console.log(err));

        // Your logic to call the backend API goes here, like high-fiving your friends!
      }
    } catch (error) {
      console.log(error); // This will show the error in the console for us to see
    }
  };

  return (
    <TouchableOpacity onPress={signInWithGoogle}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: vs(40),
          width: s(300),
          paddingHorizontal: s(30),
          alignItems: 'center',
          backgroundColor: 'grey',
          justifyContent: 'center',
          paddingVertical: vs(10),
          borderRadius: s(12),
        }}
      >
        <Image source={images.googleIcon} />
        <Text
          style={{
            fontSize: 18,
            color: 'white',
            fontFamily: 'Lato-Regular',
          }}
        >
          {' '}
          Continue with Google
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;

const styles = StyleSheet.create({});
