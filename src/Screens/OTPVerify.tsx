import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useCallback } from 'react'
import { OtpInput } from 'react-native-otp-entry'

const OTPVerify = ({mobileNumber}) => {
 
 
    const onChangeText= useCallback((text)=>
    {

    },[])

    const onOTPFilled =useCallback (() => {},[])
    return (
    <Safe AreaView>
        <View>
            <Text>We've sent a verifcation code to: {mobileNumber}</Text>
        </View>
        <View>
            <OtpInput  numberOfDigits={5} onTextChange={onChangeText}/>
        </View>
    </Safe>
  )
}

export default OTPVerify

const styles = StyleSheet.create({})