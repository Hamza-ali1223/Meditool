import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { FC } from 'react';
import { s, vs } from 'react-native-size-matters';
import colors from '../../colors';

interface props {
  onPress?: () => void;
  label: string;
}
const SectionHeader: FC<props> = ({ label, onPress }) => {
  return (
    <View
      style={{ justifyContent: 'center', padding: s(15), borderRadius: s(12) }}
    >
      <View style={styles.container}>
        <Text style={{ fontSize: 16, fontFamily: 'Lato-Regular' }}>
          {label}
        </Text>
        <TouchableOpacity onPress={onPress}>
          <Text style={{ color: colors.primary }}>See all</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SectionHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
