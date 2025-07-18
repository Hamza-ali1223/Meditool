import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  StatusBar
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import keychain from 'react-native-keychain';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { vs, s, ms } from 'react-native-size-matters';
import { useAuth } from '../../components/Contexts/AuthContext';

const Profile = () => {
  const [userName, setUserName] = useState('');
  const [photo, setPhoto] = useState('');
  const navigation = useNavigation();
  const appointments = useSelector(state => state.appointment.appointments);
  const {role}=useAuth();
  useEffect(() => {
    const fetchProfileData = async () => {
      const storedName = await AsyncStorage.getItem('userName');
      const storedPhoto = await AsyncStorage.getItem('photo');
      if (storedName) setUserName(storedName);
      if (storedPhoto) setPhoto(storedPhoto);
    };
    fetchProfileData();
  }, []);

  const logout = async () => {
    Alert.alert('Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.clear();
          await keychain.resetGenericPassword();
          navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
        },
      },
    ]);
  };

  const getInitials = name =>
    name?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1F3C88" />
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.profileImage} />
            ) : (
              <View style={styles.defaultProfileImage}>
                <Text style={styles.initialsText}>{getInitials(userName)}</Text>
              </View>
            )}
          </View>

          <Text style={styles.nameText}>{userName || 'Unknown User'}</Text>
          <Text style={styles.roleText}>{role}</Text>

          <Text style={styles.appointmentText}>
            You have {appointments?.length || 0} appointment{appointments?.length === 1 ? '' : 's'}
          </Text>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F4FF',
  },
  scrollView: {
    alignItems: 'center',
    paddingVertical: vs(40),
    paddingHorizontal: s(20),
  },
  profileCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: s(20),
    alignItems: 'center',
    paddingVertical: vs(30),
    paddingHorizontal: s(20),
    elevation: 3,
  },
  profileImageContainer: {
    marginBottom: vs(15),
  },
  profileImage: {
    width: s(120),
    height: s(120),
    borderRadius: s(60),
    borderWidth: 3,
    borderColor: '#1F3C88',
  },
  defaultProfileImage: {
    width: s(120),
    height: s(120),
    borderRadius: s(60),
    backgroundColor: '#1F3C88',
    justifyContent: 'center',
    alignItems: 'center',
  },
  initialsText: {
    fontSize: s(40),
    color: '#FFF',
    fontWeight: 'bold',
  },
  nameText: {
    fontSize: s(22),
    fontWeight: '600',
    color: '#1F3C88',
    marginTop: vs(10),
  },
  roleText: {
    fontSize: s(14),
    color: '#6C757D',
    marginBottom: vs(10),
  },
  appointmentText: {
    fontSize: s(14),
    color: '#4B4B4B',
    marginTop: vs(5),
  },
  logoutButton: {
    backgroundColor: '#DC3545',
    marginTop: vs(30),
    paddingVertical: vs(14),
    paddingHorizontal: s(40),
    borderRadius: s(15),
  },
  logoutText: {
    color: '#FFFFFF',
    fontSize: s(16),
    fontWeight: '600',
  },
});
