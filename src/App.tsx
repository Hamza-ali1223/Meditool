import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from './Screens/Onboarding';
import bottomtabnavigator from './bottomtabnavigator';
import Login from './Screens/Login';
import OTPVerify from './Screens/OTPVerify';
import HomeScreen from './Screens/HomeScreen/HomeScreen';
import SearchScreen from './Screens/SearchScreen/SearchScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ExpandedDoctorList } from './Screens/DoctorList/ExpandedDoctorList';
import DoctorDetails from './Screens/DoctorDetails/DoctorDetails';
import colors from './colors';
import BookAppointment from './Screens/BookAppointment/BookAppointment';
import Appointment from './Screens/BookAppointment/Appointment';

const App = () => {
  const Stack = createNativeStackNavigator();

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='HomeScreen'
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="OnboardingScreen"
            component={Onboarding}
          ></Stack.Screen>
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
          <Stack.Screen name="OTP" component={OTPVerify}></Stack.Screen>
          <Stack.Screen name="HomeScreen" component={HomeScreen}></Stack.Screen>
          <Stack.Screen
            name="SearchScreen"
            component={SearchScreen}
          ></Stack.Screen>
          <Stack.Screen
            name="ExpandedDoctors"
            component={ExpandedDoctorList}
          ></Stack.Screen>
          <Stack.Screen
            name="DoctorDetails"
            component={DoctorDetails}
            options={{
              headerShown: true,
              headerTintColor: "white",
              headerTitle:"Doctor Detail",
              headerTitleAlign:'center',
              headerBackVisible:true,
              headerBackTitle:"Back",
              headerBackTitleStyle: { fontFamily: 'Lato-Regular' },
              headerStyle:{backgroundColor:colors.primary}
            }}
          ></Stack.Screen>
          <Stack.Screen name='BookAppointment' component={BookAppointment}></Stack.Screen>
          <Stack.Screen name="Appointment" component={Appointment}></Stack.Screen>
          {/* <Stack.Screen name="Main" component={bottomtabnavigator}></Stack.Screen> */}
        </Stack.Navigator>
      </NavigationContainer>
    </QueryClientProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
