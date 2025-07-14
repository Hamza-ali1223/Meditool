import { Image, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Login from '../Login';
import MainButton from '../../components/MainButton';
import Appointment from '../BookAppointment/Appointment';
import BookAppointment from '../BookAppointment/BookAppointment';
import DoctorDetails from '../DoctorDetails/DoctorDetails';
import { ExpandedDoctorList } from '../DoctorList/ExpandedDoctorList';
import HomeScreen from '../HomeScreen/HomeScreen';
import SearchScreen from '../SearchScreen/SearchScreen';
import images from '../../assets/img/images';
import { s, vs } from 'react-native-size-matters';
import AppointmentScreen from '../BookAppointment/AppointmentScreen';
import Settings from '../Settings/Settings';
import Profile from '../Profile/Profile';
import WebRTCTest from '../WebRTCTest';

const Bottomtabnavigator = () => {
  const Tabs = createBottomTabNavigator();

  return (
    <Tabs.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => {
          switch (route.name) {
            case 'HomeScreen':
              return (
                <Image
                  source={focused ? images.homeFilled : images.homeEmpty}
                  style={{ height: vs(24), width: s(24) }}
                />
              );
              case "AppointmentScreen":
                return(
                  <Image 
                  style={{height:vs(24),width:s(24)}}
                  source={focused? images.appointmentFilled:images.appointmentEmpty}/>
                );
                case "Settings":  
          return (
            <Image 
              style={{height: vs(24), width: s(24)}}
              source={focused ? images.settingFilled : images.settings}
            />
          );
        case "Profile":  
          return (
            <Image 
              style={{height: vs(24), width: s(24)}}
              source={focused ? images.profileFilled : images.profileEmpty}
            />
          );
          }
        },
        headerShown:false,
        tabBarLabel:()=>null,
        tabBarStyle:{
          alignItems:'center',
          justifyContent:'center',
        },
        tabBarIconStyle: {
          marginTop:vs(5)
        }
      })
    }
    >
      <Tabs.Screen name="HomeScreen" component={HomeScreen} />
     
      <Tabs.Screen name='AppointmentScreen' component={AppointmentScreen}></Tabs.Screen>
      <Tabs.Screen name='Settings' component={Settings}></Tabs.Screen>
      <Tabs.Screen  name='Profile' component={Profile}></Tabs.Screen>
    </Tabs.Navigator>
  );
};

export default Bottomtabnavigator;
