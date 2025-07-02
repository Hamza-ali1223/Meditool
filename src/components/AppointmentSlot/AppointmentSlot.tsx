import { StyleSheet, Text, View } from 'react-native';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';

const AppointmentSlot = () => {
  const today = dayjs().format('YYYY-MM-DD');
  const maxDate = dayjs().add(14, 'day').format('YYYY-MM-DD');
  const timeSlots = Array.from({ length: 8 }, (_, i) => ({
    time: `${10 + i}:00 ${10 + i >= 12 ? 'PM' : 'Am'}`,
    value: `${10 + i}:00`,
  }));
  const reminderSlot = ['10', '15', '30'];
  const [selectedDate, setselectedDate] = useState(today);
  const [selectedSlot, setSelectedSlot] = useState(null);
  console.log(today, maxDate,selectedDate);

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Calendar minDate={today} maxDate={maxDate} 
      onDayPress={day=>setselectedDate(day?.dateString)}
      />
    </SafeAreaView>
  );
};

export default AppointmentSlot;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
  },
});
