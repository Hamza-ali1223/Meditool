// src/hooks/useSocket.js
import { useEffect, useState, useCallback } from 'react';
import socketService from '../services/socketService';

/**
 * React hook to use Socket.IO connection in components
 * @param {string} userId - User identifier for registration
 * @param {string} serverUrl - Socket.IO server URL (optional)
 * @returns {Object} - Socket state and methods
 */
export function useSocket(userId, serverUrl) {
  // Track connection state
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  
  // Initialize socket connection on mount
  useEffect(() => {
    if (!userId) {
      setError('User ID is required');
      return;
    }
    
    console.log(`useSocket: Initializing socket for ${userId}`);
    
    // Initialize socket connection
    socketService.init(userId, serverUrl);
    
    // Add connection state listeners
    const handleConnect = () => {
      console.log('useSocket: Connected');
      setConnected(true);
      setError(null);
    };
    
    const handleDisconnect = (reason) => {
      console.log(`useSocket: Disconnected - ${reason}`);
      setConnected(false);
    };
    
    const handleError = (err) => {
      const errorMsg = err.message || 'Connection error';
      console.log(`useSocket: Error - ${errorMsg}`);
      setError(errorMsg);
    };
    
    // Register event listeners
    socketService.on('connect', handleConnect);
    socketService.on('disconnect', handleDisconnect);
    socketService.on('connect_error', handleError);
    
    // Set initial state (in case already connected)
    setConnected(socketService.isSocketConnected());
    
    // Cleanup on unmount
    return () => {
      console.log('useSocket: Cleaning up listeners');
      socketService.off('connect');
      socketService.off('disconnect');
      socketService.off('connect_error');
    };
  }, [userId, serverUrl]);
  
  // Function to emit events with proper error handling
  const emitEvent = useCallback((event, data, callback) => {
    if (!connected) {
      console.warn(`Cannot emit ${event} - socket not connected`);
      return false;
    }
    return socketService.emit(event, data, callback);
  }, [connected]);
  
  // Function to add event listeners
  const addEventListener = useCallback((event, handler) => {
    socketService.on(event, handler);
    
    // Return cleanup function
    return () => socketService.off(event);
  }, []);
  
  return {
    connected,
    error,
    emit: emitEvent,
    on: addEventListener,
    socket: socketService,
  };
}