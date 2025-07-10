import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React, { useEffect } from 'react';
import Header from '../../components/Header/Header';
import Categories from '../../components/Categories/Categories';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import DoctorList from '../DoctorList/DoctorList';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import AppointmentsList from '../../components/AppointmentsList.tsx/AppointmentsList';
import AsyncStorage from '@react-native-async-storage/async-storage';
const HomeScreen = () => {
  const Navigation = useNavigation();
  const appointment=useSelector((state)=>state.appointment.appointments)
  console.log("From homescreen ",JSON.stringify(appointment))
  let userName;
  const fetchUserName= async () =>
  {
      userName=await AsyncStorage.getItem("userName");
  }
  
  useEffect(()=>{
    fetchUserName()
  },[])
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header Username={userName} />
      <Categories />
      {appointment.length >0 && <AppointmentsList Appointments={appointment}/>}
      <SectionHeader
        label={'Best Doctors'}
        onPress={() => Navigation.navigate('ExpandedDoctors')}
      />
      <DoctorList />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
});
