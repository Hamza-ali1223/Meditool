import { StyleSheet, Text, View, Image, FlatList } from 'react-native';
import React from 'react';
import SectionHeader from '../SectionHeader/SectionHeader';
import colors from '../../colors';
import { s, vs } from 'react-native-size-matters';
import { useQuery } from '@tanstack/react-query';
import { fetchDoctorsById } from '../api/doctors';
import { fetchSpecialities } from '../api/specialitites';
import images from '../../assets/img/images';
import { useNavigation } from '@react-navigation/native';


const AppointmentCard = ({ appointment }) => {
 
  const { data: doctor } = useQuery({
    queryKey: ['doctorByID', appointment.doctor],
    queryFn: () => fetchDoctorsById(appointment.doctor),
    enabled: !!appointment.doctor, 
  });

  // Get specialities to find doctor's speciality name
  const { data: specialities } = useQuery({
    queryKey: ['Specialities'],
    queryFn: fetchSpecialities,
  });

  
  const doctorSpeciality = specialities?.find(
    (spec) => spec.id === doctor?.speciality
  )?.title || 'Specialist';

  
  const formatDate = (dateString) => {
  if (!dateString) return '';
  const parts = dateString.trim().split(' ');

  if (parts.length < 2) return '';

  const month = parts[0];
  const day = parts[1].replace(',', ''); 

  return `${day} ${month}`;
};
  return (
    <View style={styles.cardContainer}>
      <View style={{flexDirection:'row',alignItems:'center'}}>
        
        <Image 
          source={{uri:doctor?.image}} 
          style={styles.doctorImage}
        />
        
        
        <View style={[{marginLeft:s(10)},styles.infoContainer]}>
          <Text style={styles.doctorName}>
            {doctor?.name || 'Dr. Name'}
          </Text>
          <Text style={styles.speciality}>
            {doctorSpeciality}
          </Text>
        </View>
        
        {/* Date and Time Section */}
        <View style={styles.dateTimeContainer}>
          {/* Date Row */}
          <View style={{flexDirection:'row', alignItems:'center',marginBottom:vs(10)}}>
            <Image source={images.calendar} style={{height:vs(14),width:s(14)}} />
            <Text style={{color:'white', fontFamily:'Lato-Regular',marginLeft:s(5)}}>
              {formatDate(appointment.slot.date)}
            </Text>
          </View>
          
          {/* Time Row */}
          <View style={{flexDirection:'row', alignItems:'center'}}>
            <Image source={images.clock} style={{height:vs(14),width:s(14)}} />
            <Text style={{color:'white',fontFamily:'Lato-Regular',marginLeft:s(5)}}>
              {appointment.slot.time}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const AppointmentsList = ({ Appointments }) => {
    const Navigation=useNavigation()
  return (
    <View>
      <SectionHeader label={'Appointments'} onPress={()=>Navigation.navigate("AppointmentScreen")}/>
      <FlatList
        data={Appointments}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <AppointmentCard appointment={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default AppointmentsList;
const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.primary,
    height: vs(100),
    width: s(280),
    borderRadius: s(15),
    marginRight: s(10),
    paddingHorizontal: s(15),
    paddingVertical: vs(12),
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorImage: {
    width: s(50),
    height: s(50),
    borderRadius: s(25),
    backgroundColor: 'white',
  },
  infoContainer: {
    flex: 1, // This makes the info column take all available space
    marginLeft: s(12),
    justifyContent: 'center',
  },
  doctorName: {
    color: 'white',
    fontSize: s(16),
    fontWeight: '700',
  },
  speciality: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: s(13),
    marginTop: vs(1),
  },
  dateTimeContainer: {
    alignItems: 'flex-end', // Always align to the right
    justifyContent: 'center',
    minWidth: s(70), // Ensures enough space for date/time
    marginLeft: s(10),
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    width: s(16),
    height: vs(16),
    tintColor: 'white',
  },
  dateText: {
    color: 'white',
    fontSize: s(13),
    marginLeft: s(6),
  },
  timeText: {
    color: 'white',
    fontSize: s(13),
    marginLeft: s(6),
  },
  listContainer: {
    paddingHorizontal: s(10),
  }
});