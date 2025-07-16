import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  FlatList,
  Alert,
  Modal,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useSocket } from '../../Hooks/useSocket';
import WebRTCService from '../../services/WebRTCService';
import { SERVER_URL } from "@env";
import { useAuth } from '../../components/Contexts/AuthContext';
import socketService from '../../services/socketService';

interface User {
  userId: string;
  name: string;
  role: string;
  email: string;
  status: string;
}

interface IncomingCall {
  from: string;
  fromName?: string;
  fromRole?: string;
  fromEmail?: string;
  signal: any;
}

interface Props {
  route: {
    params: {
      appointmentData: {
        patientId: string;
        doctorId: string;
        patientName: string;
        doctorName: string;
        userId: string;
        userRole: string;
        userName: string;
      };
    };
  };
  navigation: {
    navigate: (screen: string, params?: any) => void;
    goBack: () => void;
  };
}

const AudioCallScreen: React.FC<Props> = ({ route, navigation }) => {
  const { appointmentData } = route.params;
  const { userId, userName } = appointmentData;
  const { role } = useAuth();
  
  // 🔌 Socket connection - using emit and on functions
  const { connected, emit, on } = useSocket(userId, SERVER_URL);

  // 📱 State management
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // 🎯 Track initialization
  const initializationAttempted = useRef(false);
  const socketRef = useRef<any>(null); // Store socket reference for WebRTC

  console.log('🎮 AudioCallScreen Debug:', {
    userId,
    role,
    userName,
    connected,
    onlineUsersCount: onlineUsers.length,
    hasIncomingCall: !!incomingCall,
    isInitialized,
    serverUrl: SERVER_URL,
  });

  // 🎨 Get role-based styling
  const getRoleConfig = () => {
    if (role === 'DOCTOR') {
      return {
        colors: ['#667eea', '#764ba2'],
        headerTitle: '👨‍⚕️ Doctor Call Center',
        userListTitle: 'Available Users',
        accent: '#667eea',
      };
    } else {
      return {
        colors: ['#f093fb', '#f5576c'],
        headerTitle: '👤 Patient Call Center',
        userListTitle: 'Available Doctors',
        accent: '#f093fb',
      };
    }
  };

  const config = getRoleConfig();

  // 🚀 Initialize WebRTC when socket connects
  useEffect(() => {
    if (connected && emit && on && !initializationAttempted.current) {
      initializationAttempted.current = true;
      initializeWebRTC();
    }
  }, [connected, emit, on]);

  // 🎧 Initialize WebRTC Service
  const initializeWebRTC = async () => {
    try {
      console.log('🎧 Initializing WebRTC Service...');
      
      // Create a socket-like object for WebRTC Service
      const socketForWebRTC = {
        emit: emit,
        on: on,
        id: 'socket-id', // You might want to get this from your useSocket hook
      };
      
      socketRef.current = socketForWebRTC;
      
      // Initialize WebRTC with socket functions and userId
      WebRTCService.initialize(socketService, userId);
      
      // Set up callbacks for WebRTC events
      WebRTCService.setCallbacks({
        onIncomingCall: handleIncomingCall,
        onCallConnected: handleCallConnected,
        onCallRejected: handleCallRejected,
        onCallEnded: handleCallEnded,
        onCallError: handleCallError,
        onRemoteStream: handleRemoteStream,
        onConnectionStateChange: handleConnectionStateChange,
      });

      // Update user info on server using emit function
      emit('update_user_info', {
        userId: userId,
        role: role,
        name: userName,
        email: appointmentData.patientId || appointmentData.doctorId,
      });

      // Get online users
      fetchOnlineUsers();
      
      setIsInitialized(true);
      console.log('✅ WebRTC Service initialized successfully');
      
    } catch (error) {
      console.error('❌ Error initializing WebRTC:', error);
      Alert.alert('Initialization Error', 'Failed to setup call service');
    }
  };

  // 👥 Fetch online users from server
  const fetchOnlineUsers = () => {
    if (!emit || !connected) {
      console.log('⚠️ Cannot fetch users - no emit function or not connected');
      return;
    }
    
    console.log('👥 Fetching online users...');
    setLoading(true);
    
    // Use emit function to request online users
    emit('get_online_users', userId);
    
    // Use on function to listen for response
    const cleanupOnlineUsers = on('online_users', (users: User[]) => {
      console.log('📥 Received online users:', users.length);
      
      // Filter users based on role
      let filteredUsers = users;
      if (role === 'PATIENT') {
        // Patients only see doctors
        filteredUsers = users.filter(user => user.role === 'DOCTOR');
      }
      // Doctors see everyone (no filter needed)
      
      setOnlineUsers(filteredUsers);
      setLoading(false);
    });

    // Store cleanup function for later use
    return cleanupOnlineUsers;
  };

  // 📞 WebRTC Event Handlers
  const handleIncomingCall = (callData: any) => {
    console.log('📲 Incoming call received:', callData.from);
    setIncomingCall({
      from: callData.from,
      fromName: callData.fromName || callData.from,
      fromRole: callData.fromRole || 'User',
      fromEmail: callData.fromEmail || '',
      signal: callData.signal,
    });
  };

  const handleCallConnected = () => {
    console.log('✅ Call connected successfully');
    // Navigation to CallScreen will be handled by makeCall/answerCall
  };

  const handleCallRejected = (reason: string) => {
    console.log('❌ Call rejected:', reason);
    Alert.alert('Call Rejected', `The call was rejected: ${reason}`);
  };

  const handleCallEnded = () => {
    console.log('👋 Call ended');
    // CallScreen will handle navigation back
  };

  const handleCallError = (error: string) => {
    console.log('❌ Call error:', error);
    Alert.alert('Call Error', error);
  };

  const handleRemoteStream = (stream: any) => {
    console.log('🎵 Remote stream received');
    // This will be handled by CallScreen
  };

  const handleConnectionStateChange = (state: string) => {
    console.log('🔗 Connection state changed:', state);
    // Optional: Show connection status in UI
  };

  // 📞 Make outgoing call
  const makeCall = async (targetUser: User) => {
    try {
      console.log('📞 Making call to:', targetUser.name);
      
      // Show loading state
      Alert.alert('Calling...', `Connecting to ${targetUser.name}`);
      
      // Use WebRTC Service to make the call
      const success = await WebRTCService.makeCall(targetUser.userId);
      
      if (success) {
        console.log('✅ Call initiated successfully');
        
        // Navigate to CallScreen
        navigation.navigate('CallScreen', {
          targetUser: targetUser,
          isOutgoing: true,
          myUserId: userId,
          myRole: role,
        });
      } else {
        throw new Error('Failed to initialize call');
      }
      
    } catch (error) {
      console.error('❌ Error making call:', error);
      Alert.alert('Call Failed', 'Unable to start the call. Please try again.');
    }
  };

  // ✅ Accept incoming call
  const acceptCall = async () => {
    if (!incomingCall) return;
    
    try {
      console.log('✅ Accepting call from:', incomingCall.from);
      
      // Use WebRTC Service to answer the call
      const success = await WebRTCService.answerCall(incomingCall);
      
      if (success) {
        console.log('✅ Call answered successfully');
        
        // Navigate to CallScreen
        navigation.navigate('CallScreen', {
          targetUser: {
            userId: incomingCall.from,
            name: incomingCall.fromName || incomingCall.from,
            role: incomingCall.fromRole || 'User',
            email: incomingCall.fromEmail || '',
          },
          isOutgoing: false,
          myUserId: userId,
          myRole: role,
          incomingCall: incomingCall,
        });
        
        // Clear incoming call
        setIncomingCall(null);
      } else {
        throw new Error('Failed to answer call');
      }
      
    } catch (error) {
      console.error('❌ Error accepting call:', error);
      Alert.alert('Call Failed', 'Unable to answer the call. Please try again.');
      setIncomingCall(null);
    }
  };

  // ❌ Reject incoming call
  const rejectCall = () => {
    if (!incomingCall) return;
    
    try {
      console.log('❌ Rejecting call from:', incomingCall.from);
      
      // Use WebRTC Service to reject the call
      WebRTCService.rejectCall(incomingCall, 'Call declined by user');
      
      // Clear incoming call
      setIncomingCall(null);
      
    } catch (error) {
      console.error('❌ Error rejecting call:', error);
      setIncomingCall(null);
    }
  };

  // 🔄 Refresh online users
  const refreshUsers = () => {
    fetchOnlineUsers();
  };

  // 👤 Render user item
  const renderUserItem = ({ item }: { item: User }) => (
    <TouchableOpacity
      style={[styles.userItem, { borderLeftColor: config.accent }]}
      onPress={() => makeCall(item)}
      activeOpacity={0.7}
    >
      <View style={styles.userInfo}>
        <View style={styles.userHeader}>
          <Text style={styles.userEmoji}>
            {item.role === 'DOCTOR' ? '👨‍⚕️' : '👤'}
          </Text>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{item.name}</Text>
            <Text style={styles.userRole}>{item.role}</Text>
          </View>
        </View>
        <TouchableOpacity
          style={[styles.callButton, { backgroundColor: config.accent }]}
          onPress={() => makeCall(item)}
        >
          <Text style={styles.callButtonText}>📞 Call</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={config.colors} style={styles.background}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        <SafeAreaView style={styles.safeArea}>
          
          {/* 📋 Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{config.headerTitle}</Text>
            <TouchableOpacity style={styles.refreshButton} onPress={refreshUsers}>
              <Text style={styles.refreshButtonText}>🔄</Text>
            </TouchableOpacity>
          </View>

          {/* 👤 User Info */}
          <View style={styles.userSection}>
            <Text style={styles.welcomeText}>Welcome, {userName}!</Text>
            <Text style={styles.statusText}>
              {connected ? '🟢 Connected' : '🔴 Connecting...'}
              {isInitialized && ' • WebRTC Ready'}
            </Text>
            <Text style={styles.debugText}>Server: {SERVER_URL}</Text>
          </View>

          {/* 👥 Online Users List */}
          <View style={styles.listContainer}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>{config.userListTitle}</Text>
              <Text style={styles.listCount}>({onlineUsers.length} online)</Text>
            </View>

            {loading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#ffffff" />
                <Text style={styles.loadingText}>Loading users...</Text>
              </View>
            ) : onlineUsers.length > 0 ? (
              <FlatList
                data={onlineUsers}
                renderItem={renderUserItem}
                keyExtractor={(item) => item.userId}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
              />
            ) : (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  {role === 'PATIENT' ? '👨‍⚕️ No doctors online' : '👥 No users online'}
                </Text>
                <TouchableOpacity style={styles.retryButton} onPress={refreshUsers}>
                  <Text style={styles.retryButtonText}>🔄 Refresh</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

        </SafeAreaView>

        {/* 📞 Incoming Call Modal */}
        <Modal
          visible={!!incomingCall}
          transparent={true}
          animationType="slide"
          onRequestClose={rejectCall}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.incomingCallModal}>
              <Text style={styles.modalTitle}>📞 Incoming Call</Text>
              
              <View style={styles.callerInfo}>
                <Text style={styles.callerEmoji}>
                  {incomingCall?.fromRole === 'DOCTOR' ? '👨‍⚕️' : '👤'}
                </Text>
                <Text style={styles.callerName}>
                  {incomingCall?.fromName || incomingCall?.from}
                </Text>
                <Text style={styles.callerRole}>
                  {incomingCall?.fromRole || 'User'}
                </Text>
              </View>

              <View style={styles.callActions}>
                <TouchableOpacity
                  style={[styles.actionButton, styles.rejectButton]}
                  onPress={rejectCall}
                >
                  <Text style={styles.actionButtonText}>❌ Reject</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.actionButton, styles.acceptButton]}
                  onPress={acceptCall}
                >
                  <Text style={styles.actionButtonText}>✅ Accept</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    flex: 1,
  },
  refreshButton: {
    padding: 8,
  },
  refreshButtonText: {
    fontSize: 20,
  },

  // User Section
  userSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: 8,
  },
  statusText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 4,
  },
  debugText: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },

  // List Container
  listContainer: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ffffff',
  },
  listCount: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  listContent: {
    paddingBottom: 20,
  },

  // User Item
  userItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
  },
  userInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 2,
  },
  userRole: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  callButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  callButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Loading & Empty States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 16,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Incoming Call Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomingCallModal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    minWidth: 300,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#333333',
    marginBottom: 20,
  },
  callerInfo: {
    alignItems: 'center',
    marginBottom: 30,
  },
  callerEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  callerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 4,
  },
  callerRole: {
    fontSize: 14,
    color: '#666666',
  },
  callActions: {
    flexDirection: 'row',
    gap: 20,
  },
  actionButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    minWidth: 100,
  },
  rejectButton: {
    backgroundColor: '#FF4757',
  },
  acceptButton: {
    backgroundColor: '#2ED573',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default AudioCallScreen;