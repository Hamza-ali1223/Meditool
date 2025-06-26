import {
  Dimensions,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import colors from '../../colors';
import { s, vs } from 'react-native-size-matters';
import images from '../../assets/img/images';
import SearchBar from '../SearchButton/SearchButton';

const height = Dimensions.get('window').height;
const Header = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.Profile}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image
            source={images.avatar}
            style={{ height: vs(48), width: s(48), borderRadius: s(24) }}
          ></Image>
          <View style={styles.bio}>
            <Text style={styles.bioText1}>Hello, Welcome 🥳</Text>
            <Text
              style={[styles.bioText1, { paddingTop: vs(5), fontSize: 18 }]}
            >
              Username
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
