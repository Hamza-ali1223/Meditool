import { Image, ImageBackground, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vs, s } from 'react-native-size-matters';
import colors from '../colors';
import MainButton from '../components/MainButton';
import { useNavigation } from '@react-navigation/native';
import images from '../assets/img/images';

const Onboarding = () => {
  const Navigation = useNavigation();

  const handlePress = () => {
    Navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <ImageBackground source={images.splash} style={styles.backgroundImage}>
        {/* Bigger mascot image area */}
        <View style={styles.topSection}>
          <Image
            source={images.doctor} // 2000x3000 mascot
            style={styles.doctorImage}
            resizeMode="contain"
          />
        </View>

        {/* Smaller white popup */}
        <View style={styles.bottomSection}>
          <Text style={styles.titleText}>Welcome to Docspot</Text>
          <Text style={styles.subtitleText}>
            Book an appointment with your favourite doctors. Chat with doctor
            via appointment letter and get consultation
          </Text>

          <View style={{ flex: 1 }} />
          <MainButton Label={'Get Started'} onPress={handlePress} />
          <View style={{ height: vs(15) }} />
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  backgroundImage: {
    flex: 1,
  },
  topSection: {
    flex: 1.8, // more space for mascot
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  doctorImage: {
    height: '100%',
    width: '80%',
  },
  bottomSection: {
    flex: 1, // less space than before
    backgroundColor: 'white',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: s(16),
    paddingTop: vs(20),
    alignItems: 'center',
  },
  titleText: {
    fontSize: 24,
    fontFamily: 'Lato-Bold',
    paddingVertical: vs(10),
  },
  subtitleText: {
    fontSize: 18,
    paddingVertical: vs(10),
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
    color: 'grey',
  },
});
