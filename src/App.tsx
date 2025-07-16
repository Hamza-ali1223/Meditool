import { StyleSheet } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from './Screens/Onboarding';
import Login from './Screens/Login';
import SearchScreen from './Screens/SearchScreen/SearchScreen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ExpandedDoctorList } from './Screens/DoctorList/ExpandedDoctorList';
import DoctorDetails from './Screens/DoctorDetails/DoctorDetails';
import colors from './colors';
import BookAppointment from './Screens/BookAppointment/BookAppointment';
import Appointment from './Screens/BookAppointment/Appointment';
import { Provider } from 'react-redux';
import store from './store/store';
import Bottomtabnavigator from './Screens/BottomTabNavigator.tsx/bottomtabnavigator';
import AppointmentDetails from './Screens/AppointmentDetails/AppointmentDetails';
import AvailableUsersScreen from './Screens/AudioCall/AvailbleUsersScreen';
import AudioCallScreen from './Screens/AudioCall/AudioCallScreen';
import { AuthProvider } from './components/Contexts/AuthContext';
import RoleSelectionScreen from './Screens/RoleSelection/RoleSelectionScreen';
import CallScreen from './Screens/AudioCall/CallScreen';

const App = () => {
  const Stack = createNativeStackNavigator();

  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store} >
        <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName='OnboardingScreen'
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen
            name="OnboardingScreen"
            component={Onboarding}
          ></Stack.Screen>
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
          
         <Stack.Screen name="Main" component={Bottomtabnavigator}></Stack.Screen> 
        
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
          <Stack.Screen name='RoleSelection' component={RoleSelectionScreen}></Stack.Screen>
          <Stack.Screen name='BookAppointment' component={BookAppointment}></Stack.Screen>
          <Stack.Screen name="Appointment" component={Appointment}></Stack.Screen>
          <Stack.Screen name='AppointmentDetails' component={AppointmentDetails}></Stack.Screen>
          <Stack.Screen 
  name="AvailableUsers" 
  component={AvailableUsersScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen 
  name="AudioCall" 
  component={AudioCallScreen}
  options={{ headerShown: false }}
/>
<Stack.Screen name='CallScreen' component={CallScreen}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
      </AuthProvider>
      </Provider>
    </QueryClientProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
