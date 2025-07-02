import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppointmentSlot from '../../components/AppointmentSlot/AppointmentSlot'
import { vs } from 'react-native-size-matters'

const Appointment = () => {
  return (
    <SafeAreaView style={styles.mainContainer}>
     <View style={{marginTop:vs(20)}}>
      <AppointmentSlot />
     </View>
    </SafeAreaView>
  )
}

export default Appointment

const styles = StyleSheet.create(
  {
    mainContainer:
    {
      flex:1,
      backgroundColor:"white",
    }
  })