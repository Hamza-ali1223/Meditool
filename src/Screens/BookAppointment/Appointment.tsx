import { SafeAreaView, StyleSheet, View } from 'react-native';
import React, { useState } from 'react';
import { AppointmentCalender } from '../../components/AppointmentSlot/AppointmentCalender';
import { vs } from 'react-native-size-matters';
import SectionHeader from '../../components/SectionHeader/SectionHeader';
import AppointmentSlotList from '../../components/AppointmentSlot/AppointmentSlotList';
import MainButton from '../../components/MainButton';
import ConfirmationModal from '../../components/ConfirmationModel/ConfirmationModal';
import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchDoctorsById } from '../../components/api/doctors';
import { createAppointment } from '../../components/api/appointment';
import { useDispatch } from 'react-redux';
import { setAppointment } from '../../store/features/appointment';

const Appointment = ({ route }) => {
  const { AppointDetails, id } = route.params;
  console.log(`Doctor Id : ${id}`);
  const [isVisible, setIsvisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState();

  // New states for selected slots - like choosing your favorite toys!
  const [selectedSlot, setSelectedSlot] = useState();
  const [selectedRemindSlot, setSelectedRemindSlot] = useState();

  // New state for final appointment details - like packing everything in a special box!
  const [finalAppointmentDetails, setFinalAppointmentDetails] = useState(null);

  const { data: doctor } = useQuery({
    queryKey: ['doctorByID'],
    queryFn: () => fetchDoctorsById(id),
  });

  const timeSlots = Array.from({ length: 8 }, (_, i) => ({
    time: `${10 + i}:00 ${10 + i >= 12 ? 'PM' : 'Am'}`,
    value: `${10 + i}:00`,
  }));
  const reminderSlot = [
    { time: '10 min', value: '10' },
    { time: '15 min', value: '15' },
    { time: '30 min', value: '30' },
  ];

  const combineTimeAndReminder = () => {
    if (selectedSlot && selectedRemindSlot) {
      // Step 1: Break apart the time string "10:00" into hours and minutes
      const [hours, minutes] = selectedSlot.split(':').map(Number);

      // Step 2: Convert everything to total minutes (easier to do math!)
      const totalMinutes = hours * 60 + minutes;

      // Step 3: Subtract the reminder minutes
      const reminderMinutes = parseInt(selectedRemindSlot);
      const reminderTime = totalMinutes - reminderMinutes;

      // Step 4: Convert back to hours and minutes
      const reminderHours = Math.floor(reminderTime / 60);
      const reminderMins = reminderTime % 60;

      // Step 5: Format it nicely with leading zeros if needed
      const formattedTime = `${reminderHours
        .toString()
        .padStart(2, '0')}:${reminderMins.toString().padStart(2, '0')}`;

      return formattedTime;
    }
    return selectedSlot || 'No time selected';
  };
  console.log(timeSlots);

  const dispatch = useDispatch();
  const mutation = useMutation({
    mutationFn: createAppointment,
    onSuccess: data => {
         console.log('🔍 RAW API RESPONSE:', JSON.stringify(data, null, 2));
    
    // ✅ Transform the data to match AppointmentCard expectations
    const transformedAppointment = {
      ...data,
      // Transform doctor from string ID to object with doctorId
      doctor: {
        doctorId: data.doctor  // Convert "686f9aa7d47063215e66b08e" to { doctorId: "686f9aa7d47063215e66b08e" }
      },
      // Flatten slot properties to top level
      date: data.slot.date,    // Move from slot.date to date
      time: data.slot.time,    // Move from slot.time to time
      // Keep the original slot for any other uses
      slot: data.slot
    };
    
    console.log('🔍 TRANSFORMED FOR REDUX:', JSON.stringify(transformedAppointment, null, 2));
    dispatch(setAppointment(transformedAppointment));
      if (!isVisible) {
        console.log('Handle press activated');
        setIsvisible(!isVisible);
      } else {
        console.log('Else handle Press');
      }
    },
    onError: error => {
      console.error(error);
    },
  });
  const handlePress = () => {
    console.log('In Handle Press');
    //console.log(combineTimeAndReminder())
    // Create the final appointment details - like putting all puzzle pieces together!
    console.log(AppointDetails);
    const details = {
      patient: {
        name: AppointDetails.name,
        phoneNumber: AppointDetails.phoneNumber,
        age: AppointDetails.age,
      },
      slot: {
        time: combineTimeAndReminder(),
        date: selectedDate,
      },
      doctor: id
    };
    mutation.mutate(details);
    setFinalAppointmentDetails(details);
    console.log('Final Appointment Details:', JSON.stringify(details));
  };

  const closeModal = () => {
    console.log('In Close Modal');
    if (isVisible) {
      setIsvisible(!isVisible);
      console.log('Successfully closed the modal');
    } else console.log('Error in Close Modal');
  };

  const formatDate = isoDateString => {
    const date = new Date(isoDateString);
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const getSelectedDate = date => {
    console.log('From GetSelectedDate Method ', date);
    const value = formatDate(date);
    console.log(value);
    setSelectedDate(value);
  };

  // Method to get selected time slot - like catching a ball!
  const getSelectedSlot = slot => {
    console.log('Selected Time Slot:', slot);
    setSelectedSlot(slot);
  };

  // Method to get selected reminder slot - like setting an alarm clock!
  const getSelectedRemindSlot = remindSlot => {
    console.log('Selected Reminder Slot:', remindSlot);
    setSelectedRemindSlot(remindSlot);
  };

  return (
    <SafeAreaView style={styles.mainContainer}>
      <View style={{ marginTop: vs(20) }}>
        <AppointmentCalender getDate={getSelectedDate} />
        <SectionHeader label={'Available Time Slot'} />
        <AppointmentSlotList
          timeSlot={timeSlots}
          onSlotSelect={getSelectedSlot}
        />
        <View style={{ marginTop: vs(20) }} />
        <SectionHeader label="Remind Me Before" />
        <AppointmentSlotList
          timeSlot={reminderSlot}
          onSlotSelect={getSelectedRemindSlot}
        />
      </View>
      <View style={{ marginBottom: vs(10) }}>
        <MainButton Label={'Set Appointment'} onPress={handlePress} />
      </View>
      <View>
        {isVisible && (
          <ConfirmationModal
            Visible={isVisible}
            onClose={closeModal}
            ModelText={`${doctor?.doctorName} on ${selectedDate} at ${finalAppointmentDetails.slot.time}`}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Appointment;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
});
