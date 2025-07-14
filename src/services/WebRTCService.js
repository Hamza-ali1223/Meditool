// src/services/webrtcService.js
import { mediaDevices, RTCPeerConnection, RTCSessionDescription, RTCIceCandidate } from 'react-native-webrtc';
import socketService from './socketService';
import {SERVER_URL,ICE_SERVERS} from '@env'
console.log('🚀 mediaDevices defined?', mediaDevices != null);
console.log('🚀 RTCPeerConnection defined?', RTCPeerConnection != null);
const iceServers=JSON.parse(ICE_SERVERS)
console.log("Ice Servers: "+iceServers)


class WebRTCService {
  // Class properties
  peerConnection = null;
  localStream = null;
  remoteStream = null;
  isCaller = false;
  currentCallId = null;
  currentCallTo = null;
  listeners = {};
  isCallInProgress = false;
  
  // Call event callbacks
  onCallStateChange = null;
  onRemoteStream = null;
  onError = null;
  
  /**
   * Initialize WebRTC peer connection
   * @returns {Promise<boolean>} Success status
   */
  async initializePeerConnection() {
    try {
      // Create new RTCPeerConnection with ICE servers
      this.peerConnection = new RTCPeerConnection({
        iceServers: iceServers,
        iceTransportPolicy: 'all',
        bundlePolicy: 'max-bundle',
        rtcpMuxPolicy: 'require',
        // Use Plan B SDP semantics for compatibility
        sdpSemantics: 'unified-plan'
      });
      
      // Set up event handlers for peer connection
      this.setupPeerConnectionListeners();
      
      console.log('RTCPeerConnection created');
      return true;
    } catch (error) {
      console.error('Failed to create PeerConnection:', error);
      this.onError?.('Failed to initialize call');
      return false;
    }
  }
  
  /**
   * Set up event handlers for the peer connection
   */
  setupPeerConnectionListeners() {
    if (!this.peerConnection) return;
    
    // Handle ICE candidate events
    this.peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('Generated ICE candidate for', this.currentCallTo);
        
        // Send ICE candidate to remote peer via signaling
        socketService.emit('ice_candidate', {
          to: this.currentCallTo,
          candidate: event.candidate
        });
      }
    };
    
    // Monitor connection state
    this.peerConnection.onconnectionstatechange = () => {
      console.log('Connection state changed:', this.peerConnection.connectionState);
      this.onCallStateChange?.(this.peerConnection.connectionState);
      
      // Handle failed/disconnected states
      if (this.peerConnection.connectionState === 'failed' ||
          this.peerConnection.connectionState === 'disconnected') {
            console.log("oh no shit was true")
        this.endCall();
      }
    };
    
    // Monitor ICE connection state
    this.peerConnection.oniceconnectionstatechange = () => {
      console.log('ICE connection state:', this.peerConnection.iceConnectionState);
    };
    
    // Handle incoming tracks (audio)
    this.peerConnection.ontrack = (event) => {
      console.log('Received remote track');
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        this.onRemoteStream?.(this.remoteStream);
      }
    };
  }
  
  /**
   * Get local audio stream from microphone
   * @returns {Promise<MediaStream|null>} Local audio stream
   */
  async getLocalStream() {
    try {
      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: false
      });
      
      console.log('Got local audio stream');
      this.localStream = stream;
      return stream;
    } catch (error) {
      console.error('Error getting local stream:', error);
      this.onError?.('Unable to access microphone');
      return null;
    }
  }
  
  /**
   * Add local stream tracks to peer connection
   * @returns {boolean} Success status
   */
  addLocalStreamTracks() {
    if (!this.peerConnection || !this.localStream) {
      console.error('PeerConnection or localStream not initialized');
      return false;
    }
    
    try {
      // Add all tracks from local stream to peer connection
      this.localStream.getTracks().forEach(track => {
        console.log('Adding track to peer connection:', track.kind);
        this.peerConnection.addTrack(track, this.localStream);
      });
      
      return true;
    } catch (error) {
      console.error('Error adding tracks to peer connection:', error);
      return false;
    }
  }
  
  /**
   * Create and send call offer to remote peer
   * @param {string} to - User ID to call
   * @returns {Promise<boolean>} Success status
   */
  async makeCall(to) {
    try {
      if (this.isCallInProgress) {
        console.warn('Call already in progress');
        return false;
      }
      
      this.currentCallTo = to;
      this.isCaller = true;
      this.isCallInProgress = true;
      
      console.log(`Making call to ${to}`);
      
      // Initialize peer connection and get local media
      await this.initializePeerConnection();
      const stream = await this.getLocalStream();
      if (!stream) return false;
      
      // Add local stream tracks to peer connection
      this.addLocalStreamTracks();
      
      // Create offer
      const offer = await this.peerConnection.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false
      });
      
      // Set local description
      await this.peerConnection.setLocalDescription(offer);
      console.log('Created offer and set local description');
      
      // Send offer via signaling server
      socketService.emit('make_call', {
        to,
        signal: {
          type: offer.type,
          sdp: offer.sdp
        }
      });
      
      console.log('Call offer sent');
      return true;
    } catch (error) {
      console.error('Error making call:', error);
      this.onError?.('Failed to make call');
      this.resetCall();
      return false;
    }
  }
  
  /**
   * Handle incoming call and generate answer
   * @param {string} from - Caller's user ID
   * @param {Object} signal - SDP offer data
   * @returns {Promise<boolean>} Success status
   */
  async handleIncomingCall(from, signal) {
    try {
      if (this.isCallInProgress) {
        console.warn('Already in a call, rejecting');
        this.rejectCall(from, 'busy');
        return false;
      }
      
      console.log(`Handling incoming call from ${from}`);
      
      this.currentCallTo = from;
      this.isCaller = false;
      this.isCallInProgress = true;
      
      // Initialize peer connection and get local media
      await this.initializePeerConnection();
      const stream = await this.getLocalStream();
      if (!stream) {
        this.rejectCall(from, 'mediaFailed');
        return false;
      }
      
      // Add local stream tracks to peer connection
      this.addLocalStreamTracks();
      
      // Apply the remote offer
      const remoteDesc = new RTCSessionDescription({
        type: signal.type,
        sdp: signal.sdp
      });
      
      await this.peerConnection.setRemoteDescription(remoteDesc);
      console.log('Set remote description from offer');
      
      // Create answer
      const answer = await this.peerConnection.createAnswer();
      
      // Set local description
      await this.peerConnection.setLocalDescription(answer);
      console.log('Created answer and set local description');
      
      // Send answer via signaling server
      socketService.emit('answer_call', {
        to: from,
        signal: {
          type: answer.type,
          sdp: answer.sdp
        }
      });
      
      console.log('Call answer sent');
      return true;
    } catch (error) {
      console.error('Error handling incoming call:', error);
      this.onError?.('Failed to answer call');
      this.rejectCall(from, 'error');
      this.resetCall();
      return false;
    }
  }
  
  /**
   * Handle call answer from remote peer
   * @param {Object} signal - SDP answer data
   * @returns {Promise<boolean>} Success status
   */
  async handleCallAccepted(signal) {
    try {
      if (!this.peerConnection || !this.isCaller) {
        console.error('No active outgoing call to handle acceptance');
        return false;
      }
      
      console.log('Call accepted, processing answer');
      
      // Apply the remote answer
      const remoteDesc = new RTCSessionDescription({
        type: signal.type,
        sdp: signal.sdp
      });
      
      await this.peerConnection.setRemoteDescription(remoteDesc);
      console.log('Set remote description from answer');
      
      return true;
    } catch (error) {
      console.error('Error handling call acceptance:', error);
      this.onError?.('Error establishing call connection');
      this.resetCall();
      return false;
    }
  }
  
  /**
   * Handle incoming ICE candidate
   * @param {Object} candidate - ICE candidate data
   * @returns {Promise<boolean>} Success status
   */
  async handleIceCandidate(candidate) {
    try {
      if (!this.peerConnection || !this.isCallInProgress) {
        console.warn('No active call to handle ICE candidate');
        return false;
      }
      
      console.log('Adding received ICE candidate');
      
      await this.peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
      console.log('Successfully added ICE candidate');
      
      return true;
    } catch (error) {
      console.error('Error handling ICE candidate:', error);
      return false;
    }
  }
  
  /**
   * Reject an incoming call
   * @param {string} from - Caller's user ID
   * @param {string} reason - Rejection reason
   */
  rejectCall(from, reason = 'rejected') {
    console.log(`Rejecting call from ${from}: ${reason}`);
    
    socketService.emit('reject_call', {
      to: from,
      reason
    });
    
    this.resetCall();
  }
  
  /**
   * End active call
   */
  endCall() {
    if (!this.isCallInProgress) {
      console.warn('No active call to end');
      return;
    }
    
    console.log('Ending call with', this.currentCallTo);
    
    // Notify the other peer
    if (this.currentCallTo) {
      socketService.emit('end_call', {
        to: this.currentCallTo
      });
    }
    
    this.resetCall();
  }
  
  /**
   * Handle call ended by remote peer
   */
  handleCallEnded() {
    console.log('Call ended by remote peer');
    this.onCallStateChange?.('ended');
    this.resetCall();
  }
  
  /**
   * Clean up WebRTC resources
   */
  resetCall() {
    console.log('Resetting call state');
    this.cleanupMedia();
    // Stop all local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        track.stop();
      });
      this.localStream = null;
    }
    
    // Close and nullify peer connection
    if (this.peerConnection) {
      this.peerConnection.close();
      this.peerConnection = null;
    }
    
    // Reset state variables
    this.remoteStream = null;
    this.currentCallTo = null;
    this.isCaller = false;
    this.isCallInProgress = false;
    
    console.log('Call reset complete');
  }
  
  /**
   * Toggle microphone mute state
   * @returns {boolean} New mute state (true = muted)
   */
  toggleMute() {
    if (!this.localStream) return false;
    
    const audioTrack = this.localStream.getAudioTracks()[0];
    if (!audioTrack) return false;
    
    const newMuteState = !audioTrack.enabled;
    audioTrack.enabled = !newMuteState;
    
    console.log(`Microphone ${newMuteState ? 'muted' : 'unmuted'}`);
    return newMuteState;
  }
  
  /**
   * Check if user is currently in a call
   * @returns {boolean} Call status
   */
  isInCall() {
    return this.isCallInProgress;
  }
  
  /**
   * Set call event handlers
   * @param {Object} handlers - Event handler functions
   */
  setEventHandlers(handlers) {
    const { onCallStateChange, onRemoteStream, onError } = handlers;
    
    this.onCallStateChange = onCallStateChange;
    this.onRemoteStream = onRemoteStream;
    this.onError = onError;
  }

  cleanupMedia() {
  console.log('[WebRTCService] Cleaning up media');

  // Stop all local tracks
  if (this.localStream) {
    this.localStream.getTracks().forEach(track => {
      track.stop();
    });
    this.localStream.release?.(); // iOS-specific
    this.localStream = null;
  }

  // Remove all tracks from peer connection
  if (this.peerConnection) {
    const senders = this.peerConnection.getSenders?.();
    senders?.forEach(sender => {
      this.peerConnection.removeTrack?.(sender);
    });
  }

  // Remove remote stream reference
  this.remoteStream = null;
}
}

// Export as singleton
export default new WebRTCService();