import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Header from '../../components/Header/Header';
import Categories from '../../components/Categories/Categories';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import DoctorList from '../DoctorList/DoctorList';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const Navigation = useNavigation();
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header Username={'Hamza Ali'} />
      <Categories />
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
