import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { fetchDoctorsById } from '../../components/api/doctors';
import { s, vs } from 'react-native-size-matters';
import { fetchSpecialities } from '../../components/api/specialitites';
import { useNavigation } from '@react-navigation/native';
import MainButton from '../../components/MainButton';
import DoctorDetailCard from '../DoctorDetails/DoctorDetailCard';
import { MetricData } from '../DoctorDetails/MetricData';

const AppointmentDetails = ({ route }) => {
  const {navigate}=useNavigation();
  const { Appointment } = route?.params;
    console.log(Appointment);
    
  const { data: doctor } = useQuery({
    queryKey: ['doctorByID'],
    queryFn: () => fetchDoctorsById(Appointment?.doctor?.doctorId),
  });
  const { data: specialities } = useQuery({
    queryKey: ['Specialities'],
    queryFn: fetchSpecialities,
  });
  console.log(doctor?.name);
  console.log('Speciality: ', specialities);


 const handlePress = () => {


        console.log("Navigating to Audio Call");
        navigate("AudioCall", {appointmentData: Appointment });
        
}
    
  
  return (
    <SafeAreaView style={styles.mainContainer}>
      <DoctorDetailCard {...doctor} />

      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap-reverse',
          justifyContent: 'space-between',
          paddingHorizontal: s(15),
          marginStart: s(5),
        }}
      >
        {MetricData.map((item, index) => (
          <View key={index} style={styles.metricView}>
            <Image source={item.icon} style={styles.metricImage} />
            <Text style={styles.metricLabel}>{item.label}</Text>
            <Text style={styles.metricTitle}>{item.title}</Text>
          </View>
        ))}
      </View>
      <View>
        <Text
          style={{
            marginTop: vs(60),
            fontSize: 18,
            fontFamily: 'Lato-Bold',
            marginStart: s(25),
          }}
        >
          About Me
        </Text>
        <Text style={{ paddingHorizontal: s(20), paddingTop: vs(5) }}>
          {doctor?.doctorName} is the top most{' '}
          {(doctor?.speciality &&
            specialities?.[doctor.speciality - 1]?.title) ||
            'specialist'}{' '}
          in Crist Hospital in London, UK. Read More...
        </Text>
      </View>
      <View style={{ position: 'absolute', bottom: 20 }}>
        <MainButton Label={`Voice Call   ${Appointment?.time} `} onPress={handlePress} />
      </View>
    </SafeAreaView>
  );

}
export default AppointmentDetails;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: vs(10),
  },
  metricView: {
    alignItems: 'center',
  },
  metricImage: {
    width: s(24),
    height: s(24),
    backgroundColor: '#EDEDFC',
    borderRadius: s(16),
    padding: s(10),
  },
  metricLabel: {
    marginTop: vs(5),
    fontSize: 16,
    fontFamily: 'Lato-Bold',
  },
  metricTitle: {
    marginTop: vs(2),
    fontFamily: 'Lato-Regular',
    color: 'grey',
    fontSize: 14,
  },
});
