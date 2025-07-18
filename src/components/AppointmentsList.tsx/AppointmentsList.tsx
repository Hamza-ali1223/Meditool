  import { StyleSheet, Text, View, Image, FlatList, TouchableOpacity } from 'react-native';
  import React from 'react';
  import SectionHeader from '../SectionHeader/SectionHeader';
  import colors from '../../colors';
  import { s, vs } from 'react-native-size-matters';
  import { useQuery } from '@tanstack/react-query';
  import { fetchDoctorsById } from '../api/doctors';
  import { fetchSpecialities } from '../api/specialitites';
  import images from '../../assets/img/images';
  import { useNavigation } from '@react-navigation/native';


  const AppointmentCard = ({ appointment , horizontal}) => {

    const Navigation=useNavigation();
    
    console.log("Appointment we receiving in our AppointmentCard: "+JSON.stringify(appointment))
    console.log("Appointment Doctor from Appointment Card: "+appointment?.doctor?.doctorId)
    const { data: doctor } = useQuery({
      queryKey: ['doctorByID', appointment.doctor?.doctorId],
      queryFn: () => fetchDoctorsById(appointment.doctor?.doctorId),
      enabled: !!appointment.doctor?.doctorId, 
    });

    // Get specialities to find doctor's speciality name
    const { data: specialities } = useQuery({
      queryKey: ['Specialities'],
      queryFn: fetchSpecialities,
    });

    
    const doctorSpeciality = specialities?.find(
      (spec) => spec.id.toString() === doctor?.speciality
    )?.title || 'Specialist';

    const handlePress= () =>
    {
      Navigation.navigate("AppointmentDetails",{Appointment:appointment})
    }


  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    console.log('🔍 FORMATTING DATE:', dateString);
    
    // ✅ Method 1: Handle "Jul 16, 2025" format
    const textDateMatch = dateString.match(/^(\w{3})\s+(\d{1,2}),?\s+(\d{4})$/);
    if (textDateMatch) {
      const [, month, day] = textDateMatch;
      return `${parseInt(day)} ${month}`;
    }
    
    // ✅ Method 2: Handle ISO formats "2025-07-16" or "2025-07-16T..."
    const isoDateMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;
      const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      const options = { day: 'numeric', month: 'short' };
      return date.toLocaleDateString('en-US', options);
    }
    
    // ✅ Method 3: Handle day names (fallback)
    if (['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'].includes(dateString)) {
      return dateString.toLowerCase();
    }
    
    // ✅ Method 4: Try generic Date parsing
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        const options = { day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
      }
    } catch (e) {
      console.log('🔍 Generic parsing failed:', e);
    }
    
    // ✅ Fallback: return as-is
    return dateString;
  };
    return (
      <TouchableOpacity style={[styles.cardContainer, !horizontal && {marginVertical:vs(5), minWidth:s(300),marginLeft:s(15)}]} 
      onPress={()=>handlePress()}>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          
          <Image 
            source={{uri:doctor?.image}} 
            style={styles.doctorImage}
          />
          
          
          <View style={[{marginLeft:s(10)},styles.infoContainer]}>
            <Text style={styles.doctorName}>
              {doctor?.doctorName || 'Dr. Name'}
            </Text>
            <Text style={styles.speciality}>
              {doctorSpeciality}
            </Text>
            <Text style={{fontFamily:"Lato-Regular", color:'white',marginTop:vs(10)}}>Patient Name: {appointment?.patient?.patientName||appointment?.patient?.name}</Text>
          </View>
          
          {/* Date and Time Section */}
          <View style={styles.dateTimeContainer}>
            {/* Date Row */}
            <View style={{flexDirection:'row', alignItems:'center',marginBottom:vs(10)}}>
              <Image source={images.calendar} style={{height:vs(14),width:s(14)}} />
              <Text style={{color:'white', fontFamily:'Lato-Regular',marginLeft:s(5)}}>
                {formatDate(appointment.date)}
              </Text>
            </View>
            
            {/* Time Row */}
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Image source={images.clock} style={{height:vs(14),width:s(14)}} />
              <Text style={{color:'white',fontFamily:'Lato-Regular',marginLeft:s(5)}}>
                {appointment.time}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const AppointmentsList = ({ Appointments, horizontal }) => {
      console.log('🔍 APPOINTMENT OBJECT:', JSON.stringify(Appointments), null, 2);
    console.log('🔍 DOCTOR FROM APPOINTMENT:', Appointments?.doctor);
    console.log('🔍 DOCTOR ID:', Appointments?.doctor?.doctorId);
    console.log('🔍 DATE:', Appointments?.date);
    console.log('🔍 TIME:', Appointments?.time);
      const Navigation=useNavigation()
    return (
      <View>
      {horizontal &&  <SectionHeader label={'Appointments'} onPress={()=>Navigation.navigate("AppointmentScreen")}/>}
        <FlatList
          data={Appointments}
          horizontal={horizontal}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => <AppointmentCard appointment={item} horizontal={horizontal}/>}
          contentContainerStyle={[styles.listContainer, !horizontal && {paddingBottom:vs(50), marginTop:vs(10)}]}
          ListEmptyComponent={
    !horizontal ? (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No appointments found</Text>
      </View>
    ) : null
      }
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
    },
    emptyContainer: {
  flex: 1,
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: vs(20),
},

emptyText: {
  color: 'gray',
  fontSize: s(14),
  fontFamily: 'Lato-Regular',
  textAlign: 'center',
},

  });