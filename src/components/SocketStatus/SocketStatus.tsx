// src/components/SocketStatus.js
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

/**
 * Component to display Socket.IO connection status
 * @param {boolean} connected - Connection state
 * @param {string} error - Connection error if any
 * @param {boolean} showDetails - Whether to show detailed status
 */
const SocketStatus = ({ connected, error, showDetails = false }) => {
  const [retryCount, setRetryCount] = useState(0);
  
  // Simulate reconnection attempt count (in real app this would come from socket service)
  useEffect(() => {
    if (!connected && !error) {
      const interval = setInterval(() => {
        setRetryCount(prev => (prev < 5 ? prev + 1 : 0));
      }, 2000);
      return () => clearInterval(interval);
    }
    return () => {};
  }, [connected, error]);

  const statusText = connected 
    ? 'Connected to voice server' 
    : error 
      ? `Connection error: ${error}` 
      : `Connecting to voice server${retryCount > 0 ? ` (attempt ${retryCount}/5)` : '...'}`;

  return (
    <View style={styles.container}>
      {!connected && !error && (
        <ActivityIndicator size="small" color="#0066CC" style={styles.spinner} />
      )}
      {(connected || error) && (
        <View style={[
          styles.indicator,
          { backgroundColor: connected ? '#4CAF50' : '#F44336' }
        ]} />
      )}
      <Text style={[
        styles.text,
        error && styles.errorText
      ]}>
        {statusText}
      </Text>
      
      {showDetails && connected && (
        <Text style={styles.details}>Secured voice connection ready</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  spinner: {
    marginRight: 10,
  },
  indicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  text: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  errorText: {
    color: '#F44336',
  },
  details: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontStyle: 'italic',
  },
});

export default SocketStatus;