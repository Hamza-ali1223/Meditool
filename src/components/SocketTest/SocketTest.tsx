// src/screens/SocketTest.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ScrollView, Platform } from 'react-native';
import {SERVER_URL} from '@env'
import { useSocket } from '../../Hooks/useSocket';
import SocketStatus from '../SocketStatus/SocketStatus';
const SocketTest = ({ userId = 'test-user-123' }) => {
  const { connected, error, emit, on } = useSocket(userId, SERVER_URL);
  const [logs, setLogs] = useState([]);
  
  // Add log entry with timestamp
  const addLog = (message) => {
    const timestamp = new Date().toTimeString().split(' ')[0];
    setLogs(prev => [`[${timestamp}] ${message}`, ...prev].slice(0, 50));
  };
  
  // Listen for incoming events
  useEffect(() => {
    if (!connected) return;
    
    addLog('Setting up event listeners');
    
    // Example listener for incoming calls
    const cleanupIncomingCall = on('incoming_call', (data) => {
      addLog(`Incoming call from: ${data.from}`);
    });
    
    // Cleanup function
    return () => {
      cleanupIncomingCall();
    };
  }, [connected, on]);
  
  // Test emitting 'register' event
  const handleRegister = () => {
    addLog(`Sending register event with ID: ${userId}`);
    emit('register', userId, (response) => {
      addLog(`Register response: ${JSON.stringify(response)}`);
    });
  };
  
  // Test emitting a fake call
  const handleTestCall = () => {
    const testData = {
      to: 'test-doctor-456',
      signal: { type: 'test-offer' }
    };
    addLog(`Sending test call to: ${testData.to}`);
    emit('make_call', testData, (response) => {
      addLog(`Call response: ${JSON.stringify(response)}`);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Socket.IO Connection Test</Text>
      
      <SocketStatus 
        connected={connected} 
        error={error} 
        showDetails={true}
      />
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Register User" 
          onPress={handleRegister} 
          disabled={!connected}
        />
        <Button 
          title="Test Call Event" 
          onPress={handleTestCall} 
          disabled={!connected} 
        />
      </View>
      
      <Text style={styles.logsTitle}>Event Logs:</Text>
      <ScrollView style={styles.logs}>
        {logs.map((log, i) => (
          <Text key={i} style={styles.logEntry}>{log}</Text>
        ))}
        {logs.length === 0 && (
          <Text style={styles.emptyLogs}>No events logged yet</Text>
        )}
      </ScrollView>
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
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  logsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
  },
  logs: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 10,
  },
  logEntry: {
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    marginBottom: 4,
    color: '#333',
  },
  emptyLogs: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#999',
    marginTop: 20,
  },
});

export default SocketTest;