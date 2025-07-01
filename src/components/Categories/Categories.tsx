import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { FC, useCallback, useState } from 'react';
import categories from './symptomslist';
import { s, vs } from 'react-native-size-matters';

interface props {
  onChangeCategory?: () => void;
}
const Categories: FC<props> = ({ onChangeCategory }) => {
  const [selected, Setselected] = useState(1);
  const onPress = useCallback(index => {
    Setselected(index);
    onChangeCategory && onChangeCategory(index);
  });
  const renderCategory = (id, name) => {
    return (
      <TouchableOpacity
        style={[
          styles.containerstyle,
          id === selected && { backgroundColor: '#E6F0FF' },
        ]}
        onPress={() => onPress(id)}
      >
        <Text>{name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View>
      <FlatList
        data={categories}
        horizontal={true}
        renderItem={({ item, index }) => renderCategory(item.id, item.name)}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default Categories;

const styles = StyleSheet.create({
  containerstyle: {
    marginHorizontal: s(5),
    borderRadius: s(10),
    backgroundColor: '#F5F5F5',
    padding: s(10),
    marginTop: vs(10),
  },
});
