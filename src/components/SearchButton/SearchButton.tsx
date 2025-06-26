import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React from 'react';
import images from '../../assets/img/images';
import { s, vs } from 'react-native-size-matters';
import { useNavigation } from '@react-navigation/native';

const SearchButton = () => {
    const Navigation=useNavigation();
    const onPress= () =>
    {
        Navigation.navigate('SearchScreen');
    }
    return (
    <TouchableOpacity onPress={onPress} style={styles.mainContainer}>
      <Image style={{ marginLeft: s(10) }} source={images.search} />
      <Text style={styles.textInput}>Search Doctor</Text>
    </TouchableOpacity>
  );
};

export default SearchButton;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(25),
    borderWidth: 0.75,
    padding: s(10),
    borderColor: 'grey',
    borderRadius: s(12),
  },
  textInput: {
    marginLeft: s(15),
    fontSize: 18,
    color:'grey',
    fontFamily:'Lato-Regular',
  },
});
