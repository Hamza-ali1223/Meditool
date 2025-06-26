import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Header from '../../components/Header/Header';
import Categories from '../../components/Categories/Categories';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header />
      <Categories />
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
