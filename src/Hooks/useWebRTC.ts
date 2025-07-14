import { useState, useEffect, useCallback } from 'react';
import InCallManager from 'react-native-incall-manager'; // ✅ Corrected import
import { useSocket } from './useSocket';
import WebRTCService from '../services/WebRTCService';
import { requestMicrophonePermission } from '../utils/permissionhandler';

/**
 * 🎧 The Master Hook for handling all WebRTC audio call logic.
 * @param {string} userId - The ID of the current user.
 * @returns {Object} All the state and functions needed to power a call UI.
 */
export function useWebRTC(userId) {
  // --- 📞 Call State ---
  const [callState, setCallState] = useState('idle'); // idle, calling, ringing, connected, ended
  const [callError, setCallError] = useState(null);
  const [remoteUser, setRemoteUser] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [incomingCall, setIncomingCall] = useState(null);
  const [callDuration, setCallDuration] = useState(0);
  const [callStartTime, setCallStartTime] = useState(null);

  // --- 🔌 Socket.IO Connection ---
  const { connected, emit, on } = useSocket(userId);

  // --- 🔊 Audio Session Management ---
  const startAudioSession = useCallback(() => {
    console.log('🔊 Starting audio session...');
    InCallManager.start({ media: 'audio' });
    InCallManager.setForceSpeakerphoneOn(true); // Forcing speaker for testing is easiest!
  }, []);

  const stopAudioSession = useCallback(() => {
    console.log('🔇 Stopping audio session...');
    InCallManager.stop();
  }, []);

  // --- 📲 WebRTC & Socket Event Listeners ---
  useEffect(() => {
    if (!connected) return; // Don't set up listeners until we have a socket

    // 📩 Handle incoming call offer from another user
    const handleIncomingCall = (data) => {
      console.log('📲 Incoming call from:', data.from);
      setIncomingCall({ from: data.from, signal: data.signal });
      setRemoteUser(data.from);
      setCallState('ringing');
    };

    // ✅ Handle when the person you called accepts
    const handleCallAccepted = async (data) => {
      console.log('✅ Call accepted by:', data.from);
      await WebRTCService.handleCallAccepted(data.signal);
      setCallState('connected');
      startAudioSession(); // Start audio for the CALLER
    };

    // ❌ Handle when the call is rejected
    const handleCallRejected = (data) => {
      console.log('❌ Call rejected:', data.reason);
      setCallError(`Call rejected: ${data.reason}`);
      setCallState('ended');
      WebRTCService.resetCall();
    };

    // 👋 Handle when the other user ends the call
    const handleCallEnded = () => {
      console.log('👋 Call ended by remote peer');
      WebRTCService.handleCallEnded();
      setCallState('ended');
      stopAudioSession(); // Stop audio when they hang up
    };

    // 🧊 Handle network info (ICE candidates)
    const handleIceCandidate = (data) => {
      WebRTCService.handleIceCandidate(data.candidate);
    };

    // Register all event listeners
    const cleanupIncoming = on('incoming_call', handleIncomingCall);
    const cleanupAccepted = on('call_accepted', handleCallAccepted);
    const cleanupRejected = on('call_rejected', handleCallRejected);
    const cleanupEnded = on('call_ended', handleCallEnded);
    const cleanupIce = on('ice_candidate', handleIceCandidate);

    // 🧹 Clean up all listeners when the component unmounts
    return () => {
      cleanupIncoming();
      cleanupAccepted();
      cleanupRejected();
      cleanupEnded();
      cleanupIce();
    };
  }, [connected, on, startAudioSession, stopAudioSession]);

  // --- ⏱️ Call Duration Timer ---
  useEffect(() => {
    let interval;
    if (callState === 'connected') {
      setCallStartTime(Date.now());
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
      setCallStartTime(null);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callState]);

  // --- 🚀 Outgoing Call ---
  const makeCall = useCallback(async (to) => {
    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setCallError('Microphone permission denied');
      return false;
    }
    setCallState('calling');
    setRemoteUser(to);
    setCallError(null);
    return WebRTCService.makeCall(to);
  }, []);

  // --- 🙌 Answer Incoming Call ---
  const answerCall = useCallback(async () => {
    if (!incomingCall) return false;

    const hasPermission = await requestMicrophonePermission();
    if (!hasPermission) {
      setCallError('Microphone permission denied');
      WebRTCService.rejectCall(incomingCall.from, 'permissionDenied');
      setIncomingCall(null);
      setCallState('idle');
      return false;
    }

    const success = await WebRTCService.handleIncomingCall(
      incomingCall.from,
      incomingCall.signal
    );

    if (success) {
      setCallState('connected');
      startAudioSession(); // Start audio for the RECEIVER
    } else {
      setCallState('idle');
    }
    setIncomingCall(null);
    return success;
  }, [incomingCall, startAudioSession]);

  // --- 🚫 Reject Incoming Call ---
  const rejectCall = useCallback(() => {
    if (incomingCall) {
      WebRTCService.rejectCall(incomingCall.from, 'rejected');
      setIncomingCall(null);
      setCallState('idle');
    }
  }, [incomingCall]);

  // --- ☎️ End Active Call ---
  const endCall = useCallback(() => {
    WebRTCService.endCall();
    setCallState('ended');
    stopAudioSession();
    setTimeout(() => setCallState('idle'), 1500); // Reset after a short delay
  }, [stopAudioSession]);

  // --- 🤫 Toggle Mute ---
  const toggleMute = useCallback(() => {
    const newMuteState = WebRTCService.toggleMute();
    setIsMuted(newMuteState);
  }, []);

  // --- ✨ Return Everything the UI Needs ---
  return {
    callState,
    callError,
    remoteUser,
    isMuted,
    callDuration,
    makeCall,
    answerCall,
    rejectCall,
    endCall,
    toggleMute,
    incomingCall: !!incomingCall,
    isIdle: callState === 'idle',
    isCalling: callState === 'calling',
    isRinging: callState === 'ringing',
    isConnected: callState === 'connected',
  };
}