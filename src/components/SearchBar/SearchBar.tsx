import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { s, vs } from 'react-native-size-matters'
import images from '../../assets/img/images'

const SearchBar = ({onTextChange}) => {
  return (
    <View style={styles.searchContainer}>
      <Image source={images.search2} style={{height:vs(24),width:s(24), marginLeft:s(10)}} />
      <TextInput style={styles.textInput}
      placeholderTextColor={"grey"}
      submitBehavior='blurAndSubmit'
      autoFocus={true}
      selectionColor={"#2084c7"}
     selectionHandleColor={"lightblue"}
      placeholder='Search Doctor'
      clearButtonMode='always'
      onChangeText={onTextChange}
      scrollEnabled={true} 
       />
    </View>
  )
}

export default SearchBar

const styles = StyleSheet.create(
  {
    searchContainer:
    {
      backgroundColor:"white",
      flexDirection:'row',
      borderRadius:s(10),
      margin:10,
      height:vs(48),
      width:"95%",
      alignItems:'center',
    },
    textInput:
    {
      fontSize:16,
      fontFamily:'Lato-Regular',
      marginLeft:s(10),
      color:'black',
    }
  })