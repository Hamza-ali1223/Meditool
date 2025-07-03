import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useCallback, useState } from 'react';
import { s, vs } from 'react-native-size-matters';
import colors from '../../colors';

const AppointmentSlotList = ({ timeSlot }) => {
  const [selected, Setselected] = useState(timeSlot[0].value);

  console.log('from FlatList: ', timeSlot);

  const handlePress = useCallback((value)=>
{
    Setselected(value)
    
},[timeSlot])
  
  const CategoryComponent = ({ item }) => {
    return (
      <TouchableOpacity
        style={[
          styles.containerstyle,
          item.value === selected && { backgroundColor: colors.primary },
        ]}
        onPress={() => handlePress(item.value)}
      >
        <Text
          style={[
            item.value === selected && {
              fontFamily: 'Lato-Regular',
              color: 'white',
            },
            { fontFamily: 'Lato-Regular' },
          ]}
        >
          {item.time}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={timeSlot}
      keyExtractor={(_, i) => i.toString()}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingHorizontal:s(10)}}
      renderItem={({ item, index }) => <CategoryComponent item={item} />
      
        }
    />
  );
};

export default AppointmentSlotList;

const styles = StyleSheet.create({
  containerstyle: {
    backgroundColor: '#e9e9FE',
    padding: s(20),
    borderRadius: 50,
    alignSelf: 'center',
    marginHorizontal:s(5)
  },
});
