import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlatList,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../components/Contexts/AuthContext';
import { useSocket } from '../../Hooks/useSocket';
import {SERVER_URL} from "@env"

interface Props {
  Appointment?: any;
  navigation?: any;
}

export default function AudioCallScreen({ route, navigation }: Props) {
  
  // 🔐 Get role from context
  const { role } = useAuth();
  
  //Getting our Appointment Data
  const {Appointment}= route?.params||{};
  console.log("Appointment from Audio Call 🔉"+Appointment);
  
  // 📱 States
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState<'connecting' | 'registering' | 'updating' | 'ready'>('connecting');
  const [isInCall, setIsInCall] = useState(false);
  const [incomingCall, setIncomingCall] = useState<any>(null);
  
  // 🆔 Get userId from Appointment
  const userId = Appointment?.user?.userId || '';
  const userName = `${Appointment?.user?.firstName} ${Appointment?.user?.lastName}` || 'User';
  const userEmail = Appointment?.user?.email || '';
  
  // 🔌 Use the actual user ID for socket connection
  const { connected, emit, on } = useSocket(userId, SERVER_URL);
  
  console.log('🔍 AudioCall Debug:', {
    role,
    userId,
    userName,
    connected,
    currentStep,
    allUsersCount: allUsers.length,
    filteredUsersCount: filteredUsers.length,
    appointmentsData: Appointment ? 'Available' : 'Missing'
  });

  // ⚠️ Handle missing Appointment data
  if (!Appointment?.user?.userId) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>❌ No user data available</Text>
        <Text style={styles.errorSubtext}>Please ensure you're logged in</Text>
      </View>
    );
  }

  // 👂 Two-Step Registration Process
  useEffect(() => {
    if (!connected) return;

    if (currentStep === 'connecting') {
      console.log('🔗 Step 1: Registering with userId only...');
      setCurrentStep('registering');
      
      // ✅ Step 1: Register with ONLY userId as string
      emit('register', userId);
      
      console.log('✅ Sent register event with userId:', userId);
      
      // Move to updating step after 500ms
      setTimeout(() => {
        setCurrentStep('updating');
      }, 500);
    }
    
    if (currentStep === 'updating') {
      console.log('📋 Step 2: Updating with role and user info...');
      
      // ✅ Step 2: Update with role and other info
      emit('update_user_info', {
        userId: userId,
        role: role,
        name: userName,
        email: userEmail,
        timestamp: new Date().toISOString()
      });
      
      console.log('✅ Sent update_user_info event with:', {
        userId,
        role,
        userName,
        userEmail
      });
      
      // Move to ready and get users after 1 second
      setTimeout(() => {
        console.log('✅ Registration complete, moving to ready state');
        setCurrentStep('ready');
        refreshOnlineUsers();
      }, 1000);
    }
    
  }, [connected, currentStep, emit, userId, role, userName, userEmail]);

  // 🔄 Filter users based on role
  useEffect(() => {
    if (role === 'DOCTOR') {
      // Doctors see all users (patients + other doctors)
      const filtered = allUsers.filter(user => user.userId !== userId);
      setFilteredUsers(filtered);
      console.log('👨‍⚕️ Doctor view: Showing all users except self:', filtered.length);
    } else {
      // Patients see only doctors
      const filtered = allUsers.filter(user => 
        user.userId !== userId && user.role === 'DOCTOR'
      );
      setFilteredUsers(filtered);
      console.log('👤 Patient view: Showing doctors only:', filtered.length);
    }
  }, [allUsers, userId, role]);

  // 👂 Socket event listeners
  useEffect(() => {
    if (!connected) return;

    // Listen for online users with full role info
    const cleanupOnlineUsers = on('online_users', (users: any[]) => {
      console.log('👥 Received online users with roles:', users);
      
      // Log first user structure for debugging
      if (users.length > 0) {
        console.log('🔍 First user structure:', JSON.stringify(users[0], null, 2));
      }
      
      setAllUsers(users || []);
    });

    // Listen for incoming calls
    const cleanupIncomingCall = on('incoming_call', (data: any) => {
      console.log('📞 Incoming call from:', data.from, 'Data:', data);
      setIncomingCall(data);
      setIsInCall(true);
    });

    // Listen for call accepted
    const cleanupCallAccepted = on('call_accepted', (data: any) => {
      console.log('✅ Call accepted by:', data.from);
      setIsInCall(true);
    });

    // Listen for call ended
    const cleanupCallEnded = on('call_ended', (data: any) => {
      console.log('☎️ Call ended by:', data.from);
      resetCallState();
    });

    // Listen for call rejected
    const cleanupCallRejected = on('call_rejected', (data: any) => {
      console.log('❌ Call rejected by:', data.from, 'Reason:', data.reason);
      resetCallState();
    });

    // Listen for call errors
    const cleanupCallError = on('call_error', (error: string) => {
      console.log('⚠️ Call error:', error);
      resetCallState();
    });

    return () => {
      cleanupOnlineUsers();
      cleanupIncomingCall();
      cleanupCallAccepted();
      cleanupCallEnded();
      cleanupCallRejected();
      cleanupCallError();
    };
  }, [connected, on]);

  // 🔄 Reset call state
  const resetCallState = () => {
    setIsInCall(false);
    setIncomingCall(null);
  };

  // 🔄 Refresh online users
  const refreshOnlineUsers = () => {
    if (!connected || !userId) {
      console.log('⚠️ Cannot refresh - not connected or no userId');
      return;
    }
    
    console.log('🔄 Requesting online users for:', userId);
    emit('get_online_users', userId);
  };

  // 📞 Make a call
  const handleMakeCall = (targetUser: any) => {
    console.log('📞 Making call to:', targetUser.userId, 'from:', userId);
    console.log('🎯 Target user info:', targetUser);
    
    emit('make_call', {
      to: targetUser.userId,
      signal: { 
        type: 'call_offer', 
        from: userId,
        fromRole: role,
        fromName: userName,
        fromEmail: userEmail,
        timestamp: new Date().toISOString()
      }
    });
    
    setIsInCall(true);
    
    // Navigate to CallScreen (you'll create this next)
    navigation?.navigate('CallScreen', {
      targetUser,
      isOutgoing: true,
      myUserId: userId,
      myRole: role,
    });
  };

  // ✅ Answer incoming call
  const handleAnswerCall = () => {
    if (!incomingCall) return;
    
    console.log('✅ Answering call from:', incomingCall.from);
    
    emit('answer_call', {
      to: incomingCall.from,
      signal: { 
        type: 'call_answer', 
        from: userId,
        fromName: userName,
        fromRole: role
      }
    });
    
    navigation?.navigate('CallScreen', {
      targetUser: { userId: incomingCall.from },
      isOutgoing: false,
      incomingCall,
      myUserId: userId,
      myRole: role,
    });
  };

  // 🚫 Reject incoming call
  const handleRejectCall = () => {
    if (!incomingCall) return;
    
    console.log('❌ Rejecting call from:', incomingCall.from);
    
    emit('reject_call', {
      to: incomingCall.from,
      reason: 'User declined',
      from: userId
    });
    
    resetCallState();
  };

  // 🎨 Get role-specific configuration
  const getRoleConfig = () => {
    if (role === 'DOCTOR') {
      return {
        headerTitle: '👨‍⚕️ Doctor Call Center',
        headerSubtitle: `Welcome Dr. ${userName}`,
        listTitle: '👥 Online Users',
        emptyMessage: 'No users online',
        refreshText: 'Refresh Online Users',
        colors: ['#1e3c72', '#2a5298'],
        showingText: `Showing all online users`,
      };
    } else {
      return {
        headerTitle: '📞 Patient Call Center', 
        headerSubtitle: `Welcome ${userName}`,
        listTitle: '👨‍⚕️ Available Doctors',
        emptyMessage: 'No doctors available',
        refreshText: 'Refresh Available Doctors',
        colors: ['#2a5298', '#1e3c72'],
        showingText: `Showing doctors only`,
      };
    }
  };

  const config = getRoleConfig();

  // ⏳ Show incoming call overlay
  if (incomingCall) {
    return (
      <View style={styles.incomingCallContainer}>
        <LinearGradient colors={config.colors} style={styles.incomingCallGradient}>
          <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
          
          <View style={styles.incomingCallContent}>
            <Text style={styles.incomingCallText}>📞 Incoming call...</Text>
            <Text style={styles.callerName}>
              {incomingCall.fromName || incomingCall.from}
            </Text>
            <Text style={styles.callerRole}>
              {incomingCall.fromRole || 'User'}
            </Text>
            {incomingCall.fromEmail && (
              <Text style={styles.callerEmail}>
                {incomingCall.fromEmail}
              </Text>
            )}
            
            <View style={styles.incomingCallButtons}>
              <TouchableOpacity style={styles.rejectButton} onPress={handleRejectCall}>
                <Text style={styles.callButtonEmoji}>❌</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.acceptButton} onPress={handleAnswerCall}>
                <Text style={styles.callButtonEmoji}>✅</Text>
              </TouchableOpacity>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient colors={config.colors} style={styles.background}>
        <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
        
        <SafeAreaView style={styles.safeArea}>
          
          {/* 📋 Header with User Info */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>{config.headerTitle}</Text>
            <Text style={styles.headerSubtitle}>{config.headerSubtitle}</Text>
            
            <View style={styles.statusContainer}>
              <View style={styles.statusRow}>
                <Text style={styles.statusText}>
                  Status: {connected ? '🟢 Online' : '🔴 Offline'}
                </Text>
                <Text style={styles.stepText}>
                  Step: {currentStep}
                </Text>
              </View>
              
              <View style={styles.userInfoRow}>
                <Text style={styles.userIdText}>ID: {userId}</Text>
                <Text style={styles.roleText}>Role: {role}</Text>
              </View>
              
              <Text style={styles.filterText}>{config.showingText}</Text>
            </View>
          </View>

          {/* 🔄 Refresh Button */}
          <TouchableOpacity 
            style={[styles.refreshButton, !connected && styles.disabledButton]} 
            onPress={refreshOnlineUsers}
            disabled={!connected}
          >
            <Text style={styles.refreshText}>
              🔄 {config.refreshText}
            </Text>
          </TouchableOpacity>

          {/* 👥 Filtered Users List */}
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>
              {config.listTitle} ({filteredUsers.length})
            </Text>
            
            <FlatList
              data={filteredUsers}
              keyExtractor={(item, index) => item.userId || index.toString()}
              renderItem={({ item }) => (
                <View style={styles.userItem}>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>
                      {item.role === 'DOCTOR' ? '👨‍⚕️' : '👤'} {item.name || item.userId}
                    </Text>
                    <Text style={styles.userRole}>
                      {item.role || 'User'} • {item.email || 'No email'}
                    </Text>
                    <Text style={styles.userMeta}>
                      ID: {item.userId}
                    </Text>
                  </View>
                  
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => handleMakeCall(item)}
                  >
                    <Text style={styles.callButtonText}>📞 Call</Text>
                  </TouchableOpacity>
                </View>
              )}
              ListEmptyComponent={
                <View style={styles.emptyState}>
                  <Text style={styles.emptyText}>{config.emptyMessage}</Text>
                  <Text style={styles.emptySubtext}>
                    {connected ? 'Pull to refresh or try again later' : 'Connecting...'}
                  </Text>
                </View>
              }
              refreshing={false}
              onRefresh={refreshOnlineUsers}
              showsVerticalScrollIndicator={false}
            />
          </View>

          {/* 🔍 Enhanced Debug Info */}
          <View style={styles.debugContainer}>
            <Text style={styles.debugTitle}>Debug Info</Text>
            <Text style={styles.debugText}>User ID: {userId}</Text>
            <Text style={styles.debugText}>User Name: {userName}</Text>
            <Text style={styles.debugText}>Role: {role}</Text>
            <Text style={styles.debugText}>Connected: {connected ? 'Yes' : 'No'}</Text>
            <Text style={styles.debugText}>Step: {currentStep}</Text>
            <Text style={styles.debugText}>All Users: {allUsers.length}</Text>
            <Text style={styles.debugText}>Filtered Users: {filteredUsers.length}</Text>
            <Text style={styles.debugText}>In Call: {isInCall ? 'Yes' : 'No'}</Text>
          </View>

        </SafeAreaView>
      </LinearGradient>
    </View>
  );
}

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
  
  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  
  // Header
  header: {
    marginTop: 20,
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 16,
  },
  statusContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  stepText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  userInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  userIdText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  roleText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  filterText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.6)',
    fontStyle: 'italic',
  },
  
  // Refresh Button
  refreshButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    opacity: 0.5,
  },
  refreshText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  // List
  listContainer: {
    flex: 1,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  
  // User Item
  userItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 2,
  },
  userMeta: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  callButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  callButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.6)',
  },
  
  // Incoming Call Overlay
  incomingCallContainer: {
    flex: 1,
  },
  incomingCallGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  incomingCallContent: {
    alignItems: 'center',
  },
  incomingCallText: {
    fontSize: 20,
    color: '#ffffff',
    marginBottom: 16,
  },
  callerName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  callerRole: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  callerEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: 40,
  },
  incomingCallButtons: {
    flexDirection: 'row',
    gap: 40,
  },
  acceptButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rejectButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#F44336',
    justifyContent: 'center',
    alignItems: 'center',
  },
  callButtonEmoji: {
    fontSize: 24,
  },
  
  // Debug
  debugContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
    padding: 12,
    marginTop: 16,
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
});