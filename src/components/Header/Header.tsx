import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import colors from '../../colors';
import { s, vs } from 'react-native-size-matters';
import images from '../../assets/img/images';
import SearchBar from '../SearchButton/SearchButton';
import AsyncStorage from '@react-native-async-storage/async-storage';

const height = Dimensions.get('window').height;

const Header = ({ Username }) => {
  const [imageURI,SetimageURI]=useState("https://unsplash.com/photos/silhouette-photography-of-man-standing-near-trees-OBufvGMaBaQ")
const fetchImage = async () => {
    try {
      const storedImageURI = await AsyncStorage.getItem('photo');  // Waits for the real data
      if (storedImageURI) {
        SetimageURI(storedImageURI);  // Updates the state with the string
        console.log('Fetched image URI (as a string):', storedImageURI);  // Logs just the string now
      } else {
        console.log('No image found in storage! Using default.');
      }
    } catch (error) {
      console.error('Error fetching image:', error);  // Shows if something goes wrong
    }
  };
  useEffect(()=>
  {
    const imageuri=fetchImage()
    SetimageURI(imageURI)
    console.log(imageuri)
    
  },[])
  return (
    <View style={styles.mainContainer}>
      <View style={styles.Profile}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={{uri:imageURI}}
            style={{ height: vs(48), width: s(48), borderRadius: s(28) }}
          ></Image>
          <View style={styles.bio}>
            <Text style={styles.bioText1}>Hello, Welcome 🥳</Text>
            <Text
              style={[styles.bioText1, { paddingTop: vs(5), fontSize: 18 }]}
            >
              {Username}
            </Text>
          </View>
        </View>
        <View style={{ alignSelf: 'center' }}>
          <Pressable>
            <Image source={images.icon}></Image>
          </Pressable>
        </View>
      </View>
      <SearchBar />
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  mainContainer: {
    height: height * 0.27,
    backgroundColor: colors.primary,
    paddingTop: vs(50),
    paddingHorizontal: s(34),
  },
  Profile: {
    flexDirection: 'row',

    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bio: {
    flexDirection: 'column',
    paddingLeft: s(10),
  },
  bioText1: {
    fontSize: 15,
    fontFamily: 'Lato-Regular',
    color: 'white',
  },
});
