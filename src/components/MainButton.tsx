import {
  Dimensions,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import colors from '../colors';
import { vs, s } from 'react-native-size-matters';

interface MainButtonProps {
  Label: string;
  onPress?: () => void;
}

const width = Dimensions.get('window').width;

const MainButton = ({ Label, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.buttonContainer}>
        <Text
          style={{
            fontFamily: 'Lato-Regular',
            color: 'white',
            fontSize: 18,
            width: width*0.90,
            textAlign:'center',


          }}
        >
          {Label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default MainButton;

const styles = StyleSheet.create({
  buttonContainer: {

    backgroundColor: colors.button,
     justifyContent:"center",
     alignItems:"center",
     paddingVertical:vs(10),
     borderRadius:s(10),
     
     marginHorizontal:s(20)
  },
});
