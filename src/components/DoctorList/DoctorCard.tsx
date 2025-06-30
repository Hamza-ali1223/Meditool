import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { s, verticalScale, vs } from 'react-native-size-matters';
import specialities from '../DoctorsListData/specialities';

const cardWidth = (Dimensions.get('window').width - 16 * 3) / 2;
const DoctorCard = ({
  id,
  name,
  image,
  speciality,
  rating,
  fees,
  horizontal,
}) => {
  return (
    <TouchableOpacity style={styles.mainContainer}>
      <Image
        source={{ uri: image }}
        style={[
          {
            width: cardWidth,
            borderTopLeftRadius: s(10),
            borderTopRightRadius: s(10),
          },
          horizontal ? { height: vs(120) } : { height: vs(220) },
          horizontal ? null : { borderRadius: s(10),  },
        ]}
      />
      <View style={styles.cardDetails}>
        <View>
          <Text style={styles.nameText}>{name}</Text>
          <Text
            style={{ fontFamily: 'Lato-Regular', fontSize: 14, color: 'grey' }}
          >
            {specialities[speciality - 1].title}
          </Text>
          {
            !horizontal? <Text  style={{ fontFamily: 'Lato-Regular', fontSize: 14, color: 'grey' ,marginTop:vs(2)}} >${fees}</Text>:null
          }
        </View>
        <View>
          <Text style={{ fontFamily: 'Lato-Regular', fontSize: 11 }}>
            {rating}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default DoctorCard;

const styles = StyleSheet.create({
  mainContainer: {
    borderTopLeftRadius: s(10),
    borderTopRightRadius: s(10),
    flex: 1,
  },
  nameText: {
    fontSize: 16,
    fontFamily: 'Lato-Bold',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
