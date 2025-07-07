import {
  Button,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { OtpInput } from 'react-native-otp-entry';
import { s, vs } from 'react-native-size-matters';
import colors from '../colors';
import MainButton from '../components/MainButton';
import { useNavigation } from '@react-navigation/native';

const OTPVerify = ({ route }) => {
  const [counter, Setcounter] = useState(5);
  const Navigation = useNavigation();
  useEffect(() => {
    if (counter == 0) {
      return;
    }
    const timer = setInterval(() => {
      if (counter > 0) Setcounter(counter - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [counter]);
  const onChangeText = useCallback(() => {}, []);
  const onOTPFilled = useCallback(text => {
    `Received ${text}`;

    Navigation.navigate('Main');
  }, []);
  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={{ paddingTop: vs(50) }}>
        <Text style={{ fontSize: 18, fontFamily: 'Lato-Regular' }}>
          We've sent a verifcation code to
        </Text>
        <Text
          style={{
            marginTop: vs(5),
            marginBottom: vs(30),
            fontSize: 18,
            alignSelf: 'center',
            fontFamily: 'Lato-Regular',
          }}
        >
          {route.params.mobileNumber}
        </Text>
      </View>
      <View style={styles.otpview}>
        <OtpInput
          focusColor={colors.primary}
          blurOnFilled={true}
          numberOfDigits={5}
          onTextChange={onChangeText}
          onFilled={onOTPFilled}
        />
      </View>
      {counter > 0 && (
        <Pressable style={{ marginTop: vs(50) }}>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              fontSize: 16,
              alignSelf: 'center',
              color: colors.primary,
            }}
          >
            Resend OTP in {counter} seconds
          </Text>
        </Pressable>
      )}
      {counter == 0 && (
        <View style={{ marginTop: vs(50) }}>
          <MainButton Label={'Resend'} />
        </View>
      )}
    </SafeAreaView>
  );
};

export default OTPVerify;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.accent,
  },
  otpview: {
    paddingHorizontal: s(20),
  },
});
