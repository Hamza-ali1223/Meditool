import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import { s, vs } from 'react-native-size-matters';
import { Query, QueryClientContext, useQuery } from '@tanstack/react-query';
import { fetchSpecialities } from '../../components/api/specialitites';


const cardWidth = (Dimensions.get('window').width - 16 * 3) / 2;

const DoctorDetailCard = ({
  doctorId,
  doctorName,
  image,
  speciality,
  rating,
  consulationFee,
}) => {



    const {data,isFetched}= useQuery(
        {
            queryKey:['Specialities'],
            queryFn:fetchSpecialities,
        }
    )
    console.log("Data: ",data)
  return (
    <View style={styles.mainContainer}>
      <Image
        source={{ uri: image }}
        style={[
          {
            width: "100%",
            borderRadius:s(12),
            height:vs(220),
          },
        ]}
      />
      <View style={styles.cardDetails}>
        <View>
          <Text style={styles.nameText}>{doctorName}</Text>
          <Text
            style={{ fontFamily: 'Lato-Regular', fontSize: 14, color: 'grey' }}
          >
            {isFetched? data[speciality-1]?.title:"Doctor"}
          </Text>
        
        </View>
        <View>
          <Text style={{ fontFamily: 'Lato-Regular', fontSize: 11 }}>
            ⭐ {rating}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default DoctorDetailCard;

const styles = StyleSheet.create({
  mainContainer: {
    borderTopLeftRadius: s(10),
    borderTopRightRadius: s(10),
    
    marginTop:vs(1),
    padding:vs(50),
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
