import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react'; // We added useEffect here!
import { vs, s } from 'react-native-size-matters';
import {
  GoogleSignin,
  isSuccessResponse,
} from '@react-native-google-signin/google-signin';
import images from '../../assets/img/images';
import { GOOGLE_CLIENT_ID, test } from '@env';
import { useNavigation } from '@react-navigation/native';
import { authenticate } from '../api/auth';
import keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getMyAppointments } from '../api/appointment';
import { setInitialAppointment } from '../../store/features/appointment';
import { useDispatch } from 'react-redux';
interface Username {
  userName: String;
}
const GoogleSignInButton = () => {
  const Navigation = useNavigation();

  const dispatch=useDispatch();
  const [isLoading, SetisLoading] = useState(false);
  useEffect(() => {
    GoogleSignin.configure({
      webClientId: GOOGLE_CLIENT_ID,
    });
  }, []);

  const setupGoogleSignIn = () => {
    console.log(GOOGLE_CLIENT_ID);
  };

  useEffect(() => {
    setupGoogleSignIn(), [];
  });

  const signInWithGoogle = async () => {
    console.log('Google Sign In Method Called');
    try {
      await GoogleSignin.hasPlayServices();
      if (isLoading) return;
      const response = await GoogleSignin.signIn();
      SetisLoading(true);
      console.log(`Response: ${JSON.stringify(response?.data?.user?.name)}`);
      const userName = response?.data?.user?.name;
      console.log(userName);
      await AsyncStorage.setItem('userName', userName);
      const photo = response?.data?.user?.photo;
      await AsyncStorage.setItem('photo', photo);

      if (isSuccessResponse(response)) {
        console.log('Logged In');
        authenticate(response.data)
          .then(async authResponse => {
            console.log('Received JWT Token:', authResponse.token);
            console.log('Fetching user appointments...');
            const appointments = await getMyAppointments(authResponse.token);

            console.log('Storing appointments in Redux...');
            dispatch(setInitialAppointment(appointments));
            await keychain.setGenericPassword('authToken', authResponse?.token);
            console.log('Setup complete. Navigating to Main screen.');
           // After successful Google login:
            Navigation.navigate('RoleSelection');  // ← Just navigate, no context needed here
          })
          .catch(err => console.log(err));

        // Your logic to call the backend API goes here, like high-fiving your friends!
      }
    } catch (error) {
      console.log(error); // This will show the error in the console for us to see
    } finally {
      SetisLoading(false);
    }
  };

  return (
    <TouchableOpacity onPress={signInWithGoogle} disabled={isLoading}>
      <View
        style={{
          flexDirection: 'row',
          marginTop: vs(40),
          width: s(300),
          paddingHorizontal: s(30),
          alignItems: 'center',
          backgroundColor: 'white',
          justifyContent: 'center',
          paddingVertical: vs(10),
          borderRadius: s(30),
          borderWidth:1,
        }}
      >
        <Image source={images.googleIcon} />
        
        <Text
          style={{
            fontSize: 18,
            color: 'black',
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
function dispatch(arg0: any) {
  throw new Error('Function not implemented.');
}

function setInitialAppointments(appointments: any): any {
  throw new Error('Function not implemented.');
}
