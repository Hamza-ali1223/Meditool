import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Login from './Screens/Login';
import MainButton from './components/MainButton';

const bottomtabnavigator = () => {
  
    const Tabs=createBottomTabNavigator();
  
    return (
    <Tabs.Navigator screenOptions={{headerShown:false}}>
        <Tabs.Screen name='Login' component={MainButton}></Tabs.Screen>
    </Tabs.Navigator>
  )
}

export default bottomtabnavigator

