import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vs, s } from 'react-native-size-matters';
import colors from '../colors';
import MainButton from '../components/MainButton';
import { useNavigation } from '@react-navigation/native';
import images from '../assets/img/images';
import GoogleSignInButton from '../components/GoogleSignInButton/GoogleSignInButton';

const Login = () => {
  const Navigation = useNavigation();
  const [mobileNumber, SetmobileNumber] = useState<string>('');
  const handlePress = useCallback(() => {
    if (isValidPakistaniMobileNumber(mobileNumber)) {
      Navigation.navigate('OTP', { mobileNumber: mobileNumber });
    } else {
      Alert.alert('Incorrect Number');
    }
  }, [mobileNumber]);

  const isValidPakistaniMobileNumber = mobileNumber => {
    // This regex is designed to match all common formats for Pakistani mobile numbers[1][3].
    const pkMobileRegex = /^((\+92)?(0092)?(92)?(0)?)(3)([0-9]{9})$/;

    // .test() returns true if the string matches the regex, and false if it doesn't.
    if (pkMobileRegex.test(mobileNumber)) {
      console.log(`✅ Validation Passed: "${mobileNumber}" is a valid format.`);
      return true;
    } else {
      console.log(
        `❌ Validation Failed: "${mobileNumber}" is not a valid format.`,
      );
      return false;
    }
  };
  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: colors.primary }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 50}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View>
            <Image
              source={images.facility}
              style={styles.doctorImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.onboardingView}>
            <View style={styles.onboardingSubView}>
              <Text style={styles.titleText}>Log in or Sign Up</Text>
              
              
            <GoogleSignInButton/>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  doctorImage: {
    height: vs(500),
    width: s(300),
    alignSelf: 'center',
  },
  onboardingView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 12,
    flex:1,
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
    color:'black',
  },
});
