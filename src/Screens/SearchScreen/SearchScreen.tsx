import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import React, { useCallback } from 'react';
import colors from '../../colors';
import SearchBar from '../../components/SearchBar/SearchBar';
import { s, vs } from 'react-native-size-matters';

const SearchScreen = () => {
  const onChangeText = useCallback((text: any) => {
    console.log('Search ', text);
  });
  return (
    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
    >
      <View style={styles.searchContainer}>
        <SearchBar onTextChange={onChangeText} />
      </View>
      <View style={styles.recentSearchView}>
        <Text style={styles.recentTexts}>Recent Searches</Text>
        <TouchableHighlight>
          <Text style={[styles.recentTexts,{color:colors.primary}]}>Clear</Text>
        </TouchableHighlight>
      </View>
      
    </KeyboardAvoidingView>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  searchContainer: {
    height: vs(70),
    backgroundColor: colors.primary,
    zIndex: 10,
  },
  recentSearchView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingTop: vs(10),
  },
  recentTexts: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
  },
});
