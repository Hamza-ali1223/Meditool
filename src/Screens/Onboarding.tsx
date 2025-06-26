import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vs, s } from 'react-native-size-matters';
import colors from '../colors';
import MainButton from '../components/MainButton';
import { useNavigation } from '@react-navigation/native';
import images from '../assets/img/images';

const Onboarding = () => {
  const Navigation = useNavigation();

  const [mobileNumber, SetmobileNumber] = useState('');

  const handlePress = () => {
    Navigation.navigate('Login');
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ImageBackground source={images.splash} style={{ flex: 1 }}>
        <View>
          <Image
            source={images.doctor}
            style={styles.doctorImage}
            resizeMode="contain"
          ></Image>
        </View>
        <View style={styles.onboardingView}>
          <View style={styles.onboardingSubView}>
            <Text style={styles.titleText}>Welcome to Meditool</Text>
            <Text
              style={{
                fontSize: 18,
                paddingVertical: vs(15),
                alignSelf: 'center',
                paddingHorizontal: s(5),
                textAlign: 'center',
                fontFamily: 'Lato-Regular',
                color: 'grey',
              }}
            >
              Book an appointment with your favourite doctors. Chat with doctor
              via appointment letter and get consultation
            </Text>
            <View style={{ bottom: -180, position: 'absolute' }}>
              <MainButton Label={'Get Started'} onPress={handlePress} />
            </View>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  doctorImage: {
    height: vs(400),
    width: s(300),
    alignSelf: 'center',
  },
  onboardingView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    flex: 1,
    borderTopRightRadius: 12,
    marginHorizontal: s(1),
  },
  onboardingSubView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontFamily: 'Lato-Bold',
    paddingVertical: vs(10),
  },
});
