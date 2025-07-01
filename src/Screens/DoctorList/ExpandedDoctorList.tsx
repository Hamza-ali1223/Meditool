import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchDoctors } from '../../components/api/doctors';
import DoctorCard from './DoctorCard';
import { s, vs } from 'react-native-size-matters';
import images from '../../assets/img/images';
import { useNavigation } from '@react-navigation/native';
import colors from '../../colors';

export const ExpandedDoctorList = () => {
  const Navigation = useNavigation();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors,
  });

  if (isLoading) return <Text>Loading...</Text>;
  if (isError) return <Text>Error: {error.message}</Text>;
  console.log('Data:', data, Array.isArray(data), data?.length);
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.header}>
        <TouchableNativeFeedback onPress={() => Navigation.goBack()}>
          <Image style={styles.imageStyle} source={images.back_white} />
        </TouchableNativeFeedback>
      </View>
      <FlatList
        data={data}
        numColumns={2}
        keyExtractor={item => item.id.toString()}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          flex: 1,
          gap: 30,
          paddingBottom: s(30),
        }}
        renderItem={({ item }) => <DoctorCard {...item} horizontal={false} />}
        style={{ padding: s(10), flex: 1 }}
        contentContainerStyle={{ paddingEnd: s(20) }}
        ListEmptyComponent={<Text>No doctors found.</Text>}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    height: vs(50),

    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  imageStyle: {
    marginLeft: s(15),
    marginTop: vs(5),
  },
});
