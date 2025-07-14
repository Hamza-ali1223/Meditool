// src/screens/WebRTCTest.js
import React, { memo, useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import SocketStatus from '../components/SocketStatus/SocketStatus';
import {SERVER_URL} from '@env'
import { useSocket } from '../Hooks/useSocket';
import { useWebRTC } from '../Hooks/useWebRTC';
import WebRTCService from '../services/WebRTCService';
import { useIsFetching } from '@tanstack/react-query';
import { useIsFocused } from '@react-navigation/native';
const formatDuration = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

const WebRTCTest = ({ userId = 'test-user-123' }) => {
    const isFocused=useIsFocused();
  const [recipientId, setRecipientId] = useState('');
  const { connected, error } = useSocket(userId,SERVER_URL);
  
  const {
    callState,
    callError,
    remoteUser,
    isMuted,
    incomingCall,
    callDuration,
    
    makeCall,
    answerCall,
    rejectCall,
    endCall,
    toggleMute,
    
    isIdle,
    isCalling,
    isRinging,
    isConnected,
    isEnded
  } = useWebRTC(userId);
  
   useEffect(() => {
    // This function runs when you leave the screen (unmount)
    return () => {
      // If the component is no longer focused, it means we navigated away.
      // We MUST end the call to clean up all WebRTC resources.
      if (WebRTCService.isInCall()) {
        console.log('Screen is no longer focused, ending the call to prevent leaks.');
        endCall();
      }
    };
  }, [isFocused,endCall])
   // Safety net: Don't render anything if the screen is not focused
  if (!isFocused) {
    return null; 
  }

  const handleMakeCall = () => {
    if (!recipientId.trim()) {
      Alert.alert('Error', 'Please enter a recipient ID');
      return;
    }
    
    makeCall(recipientId.trim());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WebRTC Audio Call Test</Text>
      
      <SocketStatus connected={connected} error={error} />
      
      {isIdle && !incomingCall && (
        <View style={styles.idleContainer}>
          <Text style={styles.label}>Your ID: {userId}</Text>
          
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Call recipient:</Text>
            <TextInput
              style={styles.input}
              value={recipientId}
              onChangeText={setRecipientId}
              placeholder="Enter recipient ID"
            />
          </View>
          
          <TouchableOpacity
            style={[styles.button, styles.callButton]}
            onPress={handleMakeCall}
            disabled={!connected}
          >
            <Text style={styles.buttonText}>Make Call</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {incomingCall && (
        <View style={styles.incomingCallContainer}>
          <Text style={styles.callInfoText}>
            Incoming call from {remoteUser}
          </Text>
          
          <View style={styles.callButtonsContainer}>
            <TouchableOpacity
              style={[styles.button, styles.rejectButton]}
              onPress={rejectCall}
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.answerButton]}
              onPress={answerCall}
            >
              <Text style={styles.buttonText}>Answer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {isCalling && (
        <View style={styles.callingContainer}>
          <Text style={styles.callInfoText}>
            Calling {remoteUser}...
          </Text>
          
          <TouchableOpacity
            style={[styles.button, styles.endButton]}
            onPress={endCall}
          >
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {isConnected && (
        <View style={styles.connectedContainer}>
          <Text style={styles.callInfoText}>
            In call with {remoteUser}
          </Text>
          
          <Text style={styles.durationText}>
            {formatDuration(callDuration)}
          </Text>
          
          <View style={styles.callControlsContainer}>
            <TouchableOpacity
              style={[styles.iconButton, isMuted && styles.activeIconButton]}
              onPress={toggleMute}
            >
              <Text style={styles.iconText}>{isMuted ? '🔇' : '🔊'}</Text>
              <Text style={styles.iconLabel}>{isMuted ? 'Unmute' : 'Mute'}</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.endButton]}
              onPress={endCall}
            >
              <Text style={styles.buttonText}>End Call</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      
      {callError && (
        <Text style={styles.errorText}>{callError}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  idleContainer: {
    marginVertical: 20,
  },
  incomingCallContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#f0f8ff',
    borderRadius: 8,
    alignItems: 'center',
  },
  callingContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#f0fff0',
    borderRadius: 8,
    alignItems: 'center',
  },
  connectedContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#f0f0ff',
    borderRadius: 8,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  inputContainer: {
    marginVertical: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
  },
  callInfoText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  durationText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  callButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
  },
  callControlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  callButton: {
    backgroundColor: '#4CAF50',
  },
  answerButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    marginLeft: 8,
  },
  rejectButton: {
    backgroundColor: '#F44336',
    flex: 1,
    marginRight: 8,
  },
  endButton: {
    backgroundColor: '#F44336',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  iconButton: {
    alignItems: 'center',
    padding: 10,
    marginHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
  },
  activeIconButton: {
    backgroundColor: '#e0e0e0',
  },
  iconText: {
    fontSize: 24,
  },
  iconLabel: {
    fontSize: 12,
    marginTop: 4,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 16,
  },
});

export default memo(WebRTCTest);