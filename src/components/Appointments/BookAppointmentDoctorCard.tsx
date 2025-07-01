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
import BookAppointment from '../../Screens/BookAppointment/BookAppointment';
import colors from '../../colors';


const cardWidth = (Dimensions.get('window').width - 16 * 3) / 2;

export const BookAppointmentDoctorCard = ({
  id,
  name,
  image,
  speciality,
  rating,
  fees,
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
      <View style={{flexDirection:'row',alignItems:'flex-start'}}>  
         <Image
        source={{ uri: image }}
        style={[
          {
            width: s(96),
            borderRadius:s(12),
            height:vs(96),
          },
        ]}
      />
      <View style={{marginTop:vs(30),paddingLeft:s(10)}}>
          <Text style={styles.nameText}>{name}</Text>
          <Text
            style={{ fontFamily: 'Lato-Regular', fontSize: 14, color: 'grey' }}
          >
            {isFetched? data[speciality-1]?.title:"Doctor"}
          </Text>
        
        </View>
      </View>
      <View style={styles.cardDetails}>
        
        <View>
          <Text style={{ fontFamily: 'Lato-Regular', fontSize: 11 }}>
            {rating}
          </Text>
        </View>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  mainContainer: {
    borderTopLeftRadius: s(10),
    borderTopRightRadius: s(10),
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    marginTop:vs(20),
    padding:s(15),
    elevation:10,
    backgroundColor:"#FAFAFA",
    borderRadius:s(8),
    
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
