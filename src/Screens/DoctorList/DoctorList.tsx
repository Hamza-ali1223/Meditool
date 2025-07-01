import { FlatList, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDoctors } from '../../components/api/doctors';
import DoctorCard from './DoctorCard';
import { s } from 'react-native-size-matters';

const DoctorList = ({}) => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors,
  });

  console.log(`Data: ${data}`);
  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={data}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        renderItem={({ item }) => (
          <DoctorCard horizontal={true} key={item.id} {...item} />
        )}
        style={{ padding: s(10) }}
        contentContainerStyle={{ gap: 16, paddingEnd: s(20) }}
      />
    </View>
  );
};

export default DoctorList;

const styles = StyleSheet.create({
  mainContainer: {},
});
