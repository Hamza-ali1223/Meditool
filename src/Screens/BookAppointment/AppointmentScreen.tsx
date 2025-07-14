import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import SocketTest from '../../components/SocketTest/SocketTest'
import { useSelector } from 'react-redux'
import AppointmentsList from '../../components/AppointmentsList.tsx/AppointmentsList'

const AppointmentScreen = () => {
  const appointment=useSelector((state)=>state.appointment.appointments)
  return (
    <View style={{flex:1}}>
      <AppointmentsList Appointments={appointment} horizontal={false}/>
      
    </View>
  )
}

export default AppointmentScreen

const styles = StyleSheet.create({})