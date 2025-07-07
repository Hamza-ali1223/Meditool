import { StyleSheet } from 'react-native';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar } from 'react-native-calendars';
import colors from '../../colors';

export const AppointmentCalender = ({getDate}) => {
  const today = dayjs().format('YYYY-MM-DD');
  const maxDate = dayjs().add(14, 'day').format('YYYY-MM-DD');

  const [selectedDate, setselectedDate] = useState();

  const setDate=(date) =>
  {
    console.log("From setDate Method")
    setselectedDate(date)
    getDate(date)
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
      <Calendar
        minDate={today}
        maxDate={maxDate}
        onDayPress={day => setDate(day.dateString)}
        firstDay={1}
        markedDates={{
          [selectedDate]: {
            selected: true,
            disableTouchEvent: true,
            selectedColor: colors.primary,
          },
        }}
        theme={{
          calendarBackground: 'white',
          textDisabledColor: '#d9e1e8',
          monthTextColor: 'white',
          arrowColor: 'white',

          'stylesheet.calendar.header': {
            header: {
              backgroundColor: colors.primary,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderRadius: 10,
              paddingVertical: 10,
              paddingHorizontal: 10,
            },
            monthText: {
              fontSize: 20, // Example

              color: 'white',
              fontFamily: 'Lato-Regular',
            },
            arrow: {
              padding: 10,
            },
          },
          textMonthFontWeight: 'bold',
          textDayHeaderFontWeight: 'bold',
          textDayFontWeight: 'normal',
          textMonthFontSize: 18,
          textDayHeaderFontSize: 12,
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: 'white',
  },
});
