import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import categories from './symptomslist'

const Categories = () => {
 
    const renderCategory= (id,name,description) => 
    {
        return (
            <TouchableOpacity>
                <Text>{name}</Text>
            </TouchableOpacity>
        )
    }
 
    return (
    <View>
     <FlatList 
     data={categories}
     horizontal={true}
     renderItem={({item,index})=>renderCategory(item.id,item.name,item.description)}
     showsHorizontalScrollIndicator={false}
     />
    </View>
  )
}

export default Categories

const styles = StyleSheet.create({})