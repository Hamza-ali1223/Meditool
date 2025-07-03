import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import AppointmentSlot, { AppointmentCalender } from '../../components/AppointmentSlot/AppointmentSlot'
import { vs } from 'react-native-size-matters'
import SectionHeader from '../../components/SectionHeader/SectionHeader'
import AppointmentSlotList from '../../components/AppointmentSlot/AppointmentSlotList'
import MainButton from '../../components/MainButton'
import ConfirmationModal from '../../components/ConfirmationModel/ConfirmationModal'

const Appointment = ({route}) => {
  const {AppointDetails}= route.params
  console.log(`Appointment Details from 2nd Screen: ${JSON.stringify(AppointDetails)}`)
  const [isVisible,setIsvisible]=useState(false)
  const timeSlots = Array.from({ length: 8 }, (_, i) => ({
      time: `${10 + i}:00 ${10 + i >= 12 ? 'PM' : 'Am'}`,
      value: `${10 + i}:00`,
    }));
    const reminderSlot = [
  { time: '10 min', value: '10' },
  { time: '15 min', value: '15' },
  { time: '30 min', value: '30' },
];
    console.log(timeSlots)
    const handlePress=() =>
    {

      if(!isVisible)
      {
        console.log("Handle press activated")
        setIsvisible(!isVisible)
      }
    }
  return (
    <SafeAreaView style={styles.mainContainer}>
     <View style={{marginTop:vs(20)}}>
      <AppointmentCalender />
      <SectionHeader label={'Available Time Slot'} />
      <AppointmentSlotList timeSlot={timeSlots} />
      <View style={{marginTop:vs(20)}} />
      <SectionHeader label='Remind Me Before'/>
      <AppointmentSlotList timeSlot={reminderSlot}/>
      
     </View>
     <View style={{marginBottom:vs(10)}}>
      <MainButton Label={"Set Appointment"} onPress={handlePress} />
     </View>
     <View>
     <ConfirmationModal Visible={isVisible} onClose={()=>setIsvisible(false)}  />
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
      justifyContent:'space-between',
    }
  })