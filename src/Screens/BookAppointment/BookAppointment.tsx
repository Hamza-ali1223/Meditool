import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { fetchDoctorsById } from '../../components/api/doctors';
import { useQuery } from '@tanstack/react-query';
import { s, vs } from 'react-native-size-matters';
import { BookAppointmentDoctorCard } from '../../components/Appointments/BookAppointmentDoctorCard';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import MainButton from '../../components/MainButton';
import { useNavigation } from '@react-navigation/native';

const BookAppointment = ({ route }) => {
  const doctorId = route?.params.id;
  const Navigation=useNavigation();
  // Local states for each input field
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');

  // State for error messages
  const [error, setError] = useState('');
  // State for controlling patient detail step
  const [isPatientDetail, setIsPatientDetail] = useState(false);
  // State for appointment details (updated only on Next)
  const [appointmentDetails, setAppointmentDetails] = useState(null);

  const { data: doctor } = useQuery({
    queryKey: ['doctorByID'],
    queryFn: () => fetchDoctorsById(doctorId),
  });

  // Validation and state update on Next
  const handlePress = useCallback(() => {
    if (name && phoneNumber && age &&phoneNumber.length==11) {
      const details = {
       name,
       phoneNumber,
       age,
        
      };
      setAppointmentDetails(details);
      setIsPatientDetail(true);

      // Clear fields after successful submission
      setName('');
      setPhoneNumber('');
      setAge('');
      setError('');
      Navigation.navigate("Appointment",{AppointDetails:details,id:doctorId})
    } else {
        if(phoneNumber.length!=11)
        {
          setError("Contact Number should have 11 Digits")
        }
        else
        {
          setError('Please Fill Above Fields.');
    }
        }
  }, [name, phoneNumber, age]);

  // --- FIX: Move Alert to useEffect ---
  useEffect(() => {
    if (error && error !== '') {
      Alert.alert('Error', error);
    }
  }, [error]);
  // Auto-clear error after a short delay
  useEffect(() => {
    if (error !== '') {
      const timer = setTimeout(() => {
        setError('');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [error]);
  console.log("appointmentData: ",appointmentDetails)
  return (
    <SafeAreaView style={styles.mainContainer}>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.Label}>Doctor</Text>
        <View style={{ marginHorizontal: s(5) }}>
          <BookAppointmentDoctorCard {...doctor} />
        </View>

        <View style={{ marginHorizontal: s(5) }}>
          <Text
            style={[styles.Label, { marginTop: vs(20), marginLeft: s(15) }]}
          >
            Appointment For
          </Text>
          <TextInput
            style={styles.inputText}
            placeholder="Patient Name"
            placeholderTextColor={'grey'}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.inputText}
            placeholder="Contact Number"
            placeholderTextColor={'grey'}
            value={phoneNumber}
            maxLength={11}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />
          <TextInput
            style={styles.inputText}
            placeholder="Age"
            placeholderTextColor={'grey'}
            value={age}
            onChangeText={setAge}
            keyboardType="numeric"
          />
        </View>
      </KeyboardAwareScrollView>
      <View style={{ marginBottom: vs(5) }}>
        
        
        <MainButton Label={'Next'} onPress={handlePress} />
      </View>
    </SafeAreaView>
  );
};

export default BookAppointment;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingVertical: vs(20),
  },
  Label: {
    marginLeft: s(30),
    marginTop: vs(60),
    fontSize: 20,
    fontFamily: 'Lato-Bold',
  },
  inputText: {
    borderWidth: 0.5,
    borderRadius: s(8),
    marginTop: vs(20),
    height: vs(50),
    padding: s(20),
    color: 'black',
    fontFamily: 'Lato-Regular',
  },
});
