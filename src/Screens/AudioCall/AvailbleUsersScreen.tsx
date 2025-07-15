import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { useSocket } from '../../Hooks/useSocket';
import { fetchDoctors } from '../../components/api/doctors';
import {SERVER_URL} from "@env"
/**
 * 📞 Screen showing all available doctors/users you can call
 * Based on Image 3 - displays list of online users with "Call" buttons
 */
export default function AvailableUsersScreen() {
  const navigation = useNavigation();
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]); // Array of online userIds
  const { connected, on } = useSocket("test123" ,SERVER_URL);
  
  // 🔍 Fetch all doctors from your backend
  const { data: doctors, isLoading } = useQuery({
    queryKey: ['doctors'],
    queryFn: fetchDoctors,
  });

  // 🟢 Listen for online users from socket
  useEffect(() => {
    if (!connected) return;

    // Listen for online users list from server
    const cleanupOnlineUsers = on('online_users', (users: string[]) => {
      console.log('📱 Online users received:', users);
      setOnlineUsers(users);
    });

    // Request current online users when screen loads
    // You might need to emit this event to get current online users
    // emit('get_online_users');

    return cleanupOnlineUsers;
  }, [connected, on]);

  /**
   * 📞 Handle calling a specific doctor
   */
  const handleCallDoctor = (doctor: any) => {
    // Check if doctor is online
    const isOnline = onlineUsers.includes(doctor.id || doctor._id);
    
    if (!isOnline) {
      Alert.alert('Unavailable', `Dr. ${doctor.firstName} ${doctor.lastName} is currently offline`);
      return;
    }

    // Navigate to AudioCall screen for outgoing call
    navigation.navigate('AudioCall', {
      doctorId: doctor.id || doctor._id,
      userId: 'user1223', // Replace with actual current user ID
      doctorName: `Dr. ${doctor.firstName} ${doctor.lastName}`,
      outgoing: true,
    });
  };

  /**
   * 🎨 Render each doctor item
   */
  const renderDoctorItem = ({ item: doctor }) => {
    const isOnline = onlineUsers.includes(doctor.id || doctor._id);
    const doctorName = `Dr. ${doctor.firstName} ${doctor.lastName}`;
    
    return (
      <View style={styles.doctorItem}>
        {/* 👨‍⚕️ Doctor Info */}
        <View style={styles.doctorInfo}>
          <Text style={styles.doctorName}>{doctorName}</Text>
          <Text style={styles.doctorStatus}>
            {isOnline ? '🟢 Online' : '⚫ Offline'}
          </Text>
        </View>
        
        {/* 📞 Call Button */}
        <TouchableOpacity
          style={[styles.callButton, !isOnline && styles.callButtonDisabled]}
          onPress={() => handleCallDoctor(doctor)}
          disabled={!isOnline}
        >
          <Text style={styles.callButtonText}>Call</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 📱 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Available Users</Text>
      </View>

      {/* 📋 Doctors List */}
      <FlatList
        data={doctors || []}
        keyExtractor={(item) => item.id || item._id}
        renderItem={renderDoctorItem}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  backButton: {
    fontSize: 16,
    color: '#007AFF',
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  listContainer: {
    padding: 16,
  },
  doctorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  doctorStatus: {
    fontSize: 14,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  callButtonDisabled: {
    backgroundColor: '#ccc',
  },
  callButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});