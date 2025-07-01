import { SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { fetchDoctorsById } from '../../components/api/doctors';
import { useQuery } from '@tanstack/react-query';
import { s, vs } from 'react-native-size-matters';
import DoctorCard from '../DoctorList/DoctorCard';
import { BookAppointmentDoctorCard } from '../../components/Appointments/BookAppointmentDoctorCard';

const BookAppointment = () => {
 
    
    const { data: doctor } = useQuery({
    queryKey: ['doctorByID'],
    queryFn: () => fetchDoctorsById(doctorId),
  });
  
    return (
    <SafeAreaView style={styles.mainContainer}>
      <Text style={styles.Label}>Doctor</Text>
      <View style={{marginHorizontal:s(5)}}>
        <BookAppointmentDoctorCard {...doctor}/>
      </View>
    </SafeAreaView>
  )
}

export default BookAppointment

const styles = StyleSheet.create(
    {
        mainContainer:
        {
            flex:1,
            backgroundColor:'white',
        },
        Label:
        {
            marginLeft:s(30),
            marginTop:vs(60),
            fontSize:20,
            fontFamily:'Lato-Bold',
        }
    })