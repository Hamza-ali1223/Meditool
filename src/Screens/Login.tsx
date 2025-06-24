import {
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  ScrollView,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { vs, s } from 'react-native-size-matters';
import colors from '../colors';
import MainButton from '../components/MainButton';
import { useNavigation } from '@react-navigation/native';

const Login = () => {
  const Navigation = useNavigation();

  const handlePress = () => {
    Navigation.navigate('OTP');
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
              source={require('../assets/img/facility.png')}
              style={styles.doctorImage}
              resizeMode="contain"
            />
          </View>
          <View style={styles.onboardingView}>
            <View style={styles.onboardingSubView}>
              <Text style={styles.titleText}>Log in or Sign Up</Text>
              <View
                style={{
                  flexDirection: 'row',
                  height: vs(50),
                  borderColor: 'grey',
                  alignItems: 'center',
                  width: s(300),
                  borderWidth: 0.5,
                  borderRadius: s(12),
                  marginTop: vs(10),
                }}
              >
                <Text
                  style={{
                    fontSize: 18,
                    fontFamily: 'Lato-Regular',
                    paddingHorizontal: s(10),
                  }}
                >
                  +92|
                </Text>
                <TextInput
                  placeholder="Phone Number"
                  style={{ flex: 1 }}
                  keyboardType="phone-pad"
                />
              </View>
              {/* Move the button here, not absolutely positioned */}
              <View style={{ marginTop: vs(40), width: '100%' }}>
                <MainButton Label={'Login with Mobile'} onPress={handlePress}/>
              </View>
              <TouchableOpacity>
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
                  <Image
                    source={require('../assets/img/google_icon.png')}
                  ></Image>
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
