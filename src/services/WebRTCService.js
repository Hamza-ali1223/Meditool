import { 
  RTCPeerConnection, 
  RTCSessionDescription, 
  RTCIceCandidate,
  mediaDevices 
} from 'react-native-webrtc';

class WebRTCService {
  constructor() {
    this.peerConnection = null;
    this.localStream = null;
    this.remoteStream = null;
    this.socketService = null;
    this.myUserId = null;
    this.remoteUserId = null;
    this.isInitialized = false;
    
    // Callbacks for UI updates
    this.onIncomingCall = null;
    this.onCallConnected = null;
    this.onCallRejected = null;
    this.onCallEnded = null;
    this.onCallError = null;
    this.onRemoteStream = null;
    this.onConnectionStateChange = null;
    
    console.log('🎧 WebRTCService initialized');
  }

  // ✅ Initialize with SocketService and userId
  initialize(socketService, myUserId) {
    this.socketService = socketService;
    this.myUserId = myUserId;
    this.setupSocketListeners();
    this.isInitialized = true;
    console.log('🔌 WebRTC initialized with SocketService and userId:', myUserId);
  }

  // ✅ Setup Socket.IO event listeners using SocketService
  setupSocketListeners() {
    if (!this.socketService) {
      console.error('❌ Cannot setup listeners - no socketService');
      return;
    }

    console.log('📡 Setting up WebRTC socket listeners...');

    // 📞 Incoming call from another user
    this.socketService.on('incoming_call', (data) => {
      console.log('📲 Incoming call received from:', data.from);
      console.log('📋 Call data:', data);
      
      this.remoteUserId = data.from;
      
      if (this.onIncomingCall) {
        this.onIncomingCall(data);
      } else {
        console.warn('⚠️ No onIncomingCall handler set');
      }
    });

    // ✅ Call accepted by remote user
    this.socketService.on('call_accepted', async (data) => {
      console.log('✅ Call accepted by:', data.from);
      console.log('📋 Accept data:', data);
      
      try {
        if (!this.peerConnection) {
          console.error('❌ No peer connection when handling call accepted');
          return;
        }

        if (data.signal && data.signal.sdp) {
          const answer = new RTCSessionDescription({
            type: 'answer',
            sdp: data.signal.sdp
          });
          
          await this.peerConnection.setRemoteDescription(answer);
          console.log('✅ Remote answer description set successfully');
          
          if (this.onCallConnected) {
            this.onCallConnected();
          }
        } else {
          console.error('❌ Invalid signal data in call accepted');
        }
      } catch (error) {
        console.error('❌ Error handling call accepted:', error);
        if (this.onCallError) {
          this.onCallError('Failed to process call answer');
        }
      }
    });

    // ❌ Call rejected
    this.socketService.on('call_rejected', (data) => {
      console.log('❌ Call rejected:', data.reason, 'from:', data.from);
      this.cleanup();
      
      if (this.onCallRejected) {
        this.onCallRejected(data.reason || 'Call was rejected');
      }
    });

    // 👋 Call ended by remote user
    this.socketService.on('call_ended', (data) => {
      console.log('👋 Call ended by:', data.from);
      this.cleanup();
      
      if (this.onCallEnded) {
        this.onCallEnded();
      }
    });

    // 🧊 ICE candidate from remote peer
    this.socketService.on('ice_candidate', async (data) => {
      console.log('🧊 Received ICE candidate from:', data.from);
      
      try {
        if (!this.peerConnection) {
          console.warn('⚠️ Received ICE candidate but no peer connection');
          return;
        }

        if (data.candidate) {
          const candidate = new RTCIceCandidate(data.candidate);
          await this.peerConnection.addIceCandidate(candidate);
          console.log('✅ ICE candidate added successfully');
        }
      } catch (error) {
        console.error('❌ Error adding ICE candidate:', error);
      }
    });

    // ❌ Call error
    this.socketService.on('call_error', (errorMessage) => {
      console.log('❌ Call error received:', errorMessage);
      this.cleanup();
      
      if (this.onCallError) {
        this.onCallError(errorMessage);
      }
    });

    console.log('✅ All WebRTC socket listeners setup completed');
  }

  // ✅ Initialize peer connection with modern API
  async initializePeerConnection() {
    try {
      if (this.peerConnection) {
        console.log('🔄 Cleaning up existing peer connection...');
        this.peerConnection.close();
        this.peerConnection = null;
      }

      const configuration = {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:stun1.l.google.com:19302' },
          { urls: 'stun:stun2.l.google.com:19302' },
        ],
        iceCandidatePoolSize: 10,
      };

      this.peerConnection = new RTCPeerConnection(configuration);
      console.log('✅ Peer connection created with config:', configuration);

      // ✅ Handle ICE candidates
      this.peerConnection.addEventListener('icecandidate', (event) => {
        if (event.candidate) {
          console.log('🧊 Local ICE candidate found:', event.candidate.candidate);
          
          if (this.socketService && this.remoteUserId) {
            this.socketService.emit('ice_candidate', {
              to: this.remoteUserId,
              candidate: event.candidate
            });
            console.log('📤 ICE candidate sent to:', this.remoteUserId);
          }
        } else {
          console.log('🧊 ICE candidate gathering complete');
        }
      });

      // ✅ Handle remote stream (modern track-based approach)
      this.peerConnection.addEventListener('track', (event) => {
        console.log('🎵 Remote track received:', event.track.kind);
        console.log('🎵 Stream count:', event.streams.length);
        
        if (event.streams && event.streams.length > 0) {
          this.remoteStream = event.streams[0];
          console.log('✅ Remote stream set with tracks:', this.remoteStream.getTracks().length);
          
          if (this.onRemoteStream) {
            this.onRemoteStream(this.remoteStream);
          }
        }
      });

      // ✅ Handle connection state changes
      this.peerConnection.addEventListener('connectionstatechange', () => {
        const state = this.peerConnection.connectionState;
        console.log('🔗 Peer connection state changed to:', state);
        
        if (this.onConnectionStateChange) {
          this.onConnectionStateChange(state);
        }

        // Handle connection failures
        if (state === 'failed' || state === 'disconnected') {
          console.log('💥 Connection failed/disconnected, cleaning up...');
          setTimeout(() => this.cleanup(), 1000);
        }
      });

      // ✅ Handle ICE connection state
      this.peerConnection.addEventListener('iceconnectionstatechange', () => {
        const iceState = this.peerConnection.iceConnectionState;
        console.log('🧊 ICE connection state:', iceState);
        
        if (iceState === 'failed') {
          console.log('🧊❌ ICE connection failed');
          if (this.onCallError) {
            this.onCallError('Connection failed');
          }
        }
      });

      // ✅ Handle signaling state
      this.peerConnection.addEventListener('signalingstatechange', () => {
        console.log('📡 Signaling state:', this.peerConnection.signalingState);
      });

      console.log('✅ Peer connection event listeners setup completed');
      return true;
    } catch (error) {
      console.error('❌ Error initializing peer connection:', error);
      return false;
    }
  }

  // ✅ Get user media (audio only for voice calls)
  async getUserMedia() {
    try {
      console.log('🎤 Requesting user media...');
      
      const constraints = {
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100,
          channelCount: 1,
        },
        video: false
      };

      const stream = await mediaDevices.getUserMedia(constraints);
      
      const audioTracks = stream.getAudioTracks();
      console.log('✅ Got user media:');
      console.log(`  - Audio tracks: ${audioTracks.length}`);
      audioTracks.forEach((track, index) => {
        console.log(`  - Track ${index}: ${track.label} (${track.kind})`);
      });

      return stream;
    } catch (error) {
      console.error('❌ Error getting user media:', error);
      
      // Provide specific error messages
      if (error.name === 'NotAllowedError') {
        throw new Error('Microphone permission denied');
      } else if (error.name === 'NotFoundError') {
        throw new Error('No microphone found');
      } else {
        throw new Error('Failed to access microphone');
      }
    }
  }

  // ✅ Add local tracks to peer connection (modern approach)
  addLocalTracks(stream) {
    if (!this.peerConnection || !stream) {
      console.error('❌ Cannot add tracks - missing peer connection or stream');
      return false;
    }

    try {
      console.log('🎵 Adding local tracks to peer connection...');
      
      const tracks = stream.getTracks();
      tracks.forEach((track, index) => {
        console.log(`📤 Adding track ${index + 1}: ${track.kind} (${track.label})`);
        this.peerConnection.addTrack(track, stream);
      });
      
      console.log(`✅ Added ${tracks.length} local tracks to peer connection`);
      return true;
    } catch (error) {
      console.error('❌ Error adding local tracks:', error);
      return false;
    }
  }

  // ✅ Make outgoing call
  async makeCall(targetUserId) {
    try {
      console.log('📞 Starting call to:', targetUserId);
      
      if (!this.socketService || !this.socketService.isSocketConnected()) {
        throw new Error('Socket not connected');
      }

      this.remoteUserId = targetUserId;

      // Initialize peer connection
      const peerReady = await this.initializePeerConnection();
      if (!peerReady) {
        throw new Error('Failed to initialize peer connection');
      }

      // Get user media
      console.log('🎤 Getting user media for outgoing call...');
      this.localStream = await this.getUserMedia();
      
      // Add local tracks
      const tracksAdded = this.addLocalTracks(this.localStream);
      if (!tracksAdded) {
        throw new Error('Failed to add local tracks');
      }

      // Create offer
      console.log('📝 Creating call offer...');
      const offerOptions = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      };
      
      const offer = await this.peerConnection.createOffer(offerOptions);
      await this.peerConnection.setLocalDescription(offer);
      
      console.log('✅ Offer created and set as local description');
      console.log('📋 Offer SDP length:', offer.sdp.length);

      // Send offer via socket
      const callData = {
        to: targetUserId,
        signal: {
          type: 'offer',
          sdp: offer.sdp
        }
      };
      
      const emitSuccess = this.socketService.emit('make_call', callData);
      if (!emitSuccess) {
        throw new Error('Failed to send call offer');
      }

      console.log('📤 Call offer sent successfully to:', targetUserId);
      return true;
    } catch (error) {
      console.error('❌ Error making call:', error);
      this.cleanup();
      return false;
    }
  }

  // ✅ Answer incoming call
  async answerCall(incomingCallData) {
    try {
      console.log('📱 Answering call from:', incomingCallData.from);
      
      if (!this.socketService || !this.socketService.isSocketConnected()) {
        throw new Error('Socket not connected');
      }

      this.remoteUserId = incomingCallData.from;

      // Initialize peer connection
      const peerReady = await this.initializePeerConnection();
      if (!peerReady) {
        throw new Error('Failed to initialize peer connection');
      }

      // Set remote description from incoming offer
      if (incomingCallData.signal && incomingCallData.signal.sdp) {
        console.log('📥 Setting remote offer description...');
        const offer = new RTCSessionDescription({
          type: 'offer',
          sdp: incomingCallData.signal.sdp
        });
        
        await this.peerConnection.setRemoteDescription(offer);
        console.log('✅ Remote offer description set');
      } else {
        throw new Error('Invalid incoming call signal data');
      }

      // Get user media
      console.log('🎤 Getting user media for incoming call...');
      this.localStream = await this.getUserMedia();
      
      // Add local tracks
      const tracksAdded = this.addLocalTracks(this.localStream);
      if (!tracksAdded) {
        throw new Error('Failed to add local tracks');
      }

      // Create answer
      console.log('📝 Creating call answer...');
      const answerOptions = {
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      };
      
      const answer = await this.peerConnection.createAnswer(answerOptions);
      await this.peerConnection.setLocalDescription(answer);
      
      console.log('✅ Answer created and set as local description');
      console.log('📋 Answer SDP length:', answer.sdp.length);

      // Send answer via socket
      const answerData = {
        to: incomingCallData.from,
        signal: {
          type: 'answer',
          sdp: answer.sdp
        }
      };
      
      const emitSuccess = this.socketService.emit('answer_call', answerData);
      if (!emitSuccess) {
        throw new Error('Failed to send call answer');
      }

      console.log('📤 Call answer sent successfully to:', incomingCallData.from);
      return true;
    } catch (error) {
      console.error('❌ Error answering call:', error);
      this.cleanup();
      return false;
    }
  }

  // ✅ Reject incoming call
  rejectCall(incomingCallData, reason = 'Call declined by user') {
    try {
      console.log('❌ Rejecting call from:', incomingCallData.from, 'Reason:', reason);
      
      if (this.socketService && this.socketService.isSocketConnected()) {
        const rejectData = {
          to: incomingCallData.from,
          reason: reason
        };
        
        this.socketService.emit('reject_call', rejectData);
        console.log('📤 Call rejection sent');
      }

      this.cleanup();
      return true;
    } catch (error) {
      console.error('❌ Error rejecting call:', error);
      this.cleanup();
      return false;
    }
  }

  // ✅ End active call
  endCall() {
    try {
      console.log('☎️ Ending call with:', this.remoteUserId);
      
      if (this.socketService && this.socketService.isSocketConnected() && this.remoteUserId) {
        const endData = {
          to: this.remoteUserId
        };
        
        this.socketService.emit('end_call', endData);
        console.log('📤 Call end signal sent');
      }

      this.cleanup();
      return true;
    } catch (error) {
      console.error('❌ Error ending call:', error);
      this.cleanup();
      return false;
    }
  }

  // ✅ Toggle mute/unmute
  toggleMute() {
    try {
      if (!this.localStream) {
        console.warn('⚠️ Cannot toggle mute - no local stream');
        return false;
      }

      const audioTracks = this.localStream.getAudioTracks();
      if (audioTracks.length === 0) {
        console.warn('⚠️ Cannot toggle mute - no audio tracks');
        return false;
      }

      const audioTrack = audioTracks[0];
      const currentEnabled = audioTrack.enabled;
      audioTrack.enabled = !currentEnabled;
      
      const isMuted = !audioTrack.enabled;
      console.log(isMuted ? '🔇 Audio muted' : '🔊 Audio unmuted');
      
      return isMuted; // Return muted state
    } catch (error) {
      console.error('❌ Error toggling mute:', error);
      return false;
    }
  }

  // ✅ Get current mute state
  isMuted() {
    if (!this.localStream) return false;
    
    const audioTracks = this.localStream.getAudioTracks();
    if (audioTracks.length === 0) return false;
    
    return !audioTracks[0].enabled;
  }

  // ✅ Enhanced cleanup
  cleanup() {
    try {
      console.log('🧹 Cleaning up WebRTC resources...');

      // Stop local stream tracks
      if (this.localStream) {
        const tracks = this.localStream.getTracks();
        tracks.forEach((track, index) => {
          console.log(`🛑 Stopping local track ${index + 1}: ${track.kind}`);
          track.stop();
        });
        this.localStream = null;
      }

      // Close peer connection
      if (this.peerConnection) {
        this.peerConnection.close();
        this.peerConnection = null;
        console.log('🔌 Peer connection closed');
      }

      // Clear references
      this.remoteStream = null;
      this.remoteUserId = null;

      console.log('✅ WebRTC cleanup completed');
    } catch (error) {
      console.error('❌ Error during cleanup:', error);
    }
  }

  // ✅ Set callback functions for UI updates
  setCallbacks({
    onIncomingCall,
    onCallConnected,
    onCallRejected,
    onCallEnded,
    onCallError,
    onRemoteStream,
    onConnectionStateChange
  }) {
    this.onIncomingCall = onIncomingCall;
    this.onCallConnected = onCallConnected;
    this.onCallRejected = onCallRejected;
    this.onCallEnded = onCallEnded;
    this.onCallError = onCallError;
    this.onRemoteStream = onRemoteStream;
    this.onConnectionStateChange = onConnectionStateChange;
    
    console.log('✅ WebRTC callbacks set:', {
      hasIncomingCall: !!onIncomingCall,
      hasCallConnected: !!onCallConnected,
      hasCallRejected: !!onCallRejected,
      hasCallEnded: !!onCallEnded,
      hasCallError: !!onCallError,
      hasRemoteStream: !!onRemoteStream,
      hasConnectionStateChange: !!onConnectionStateChange,
    });
  }

  // ✅ Get current state information
  getState() {
    const connectionState = this.peerConnection?.connectionState || 'closed';
    const iceConnectionState = this.peerConnection?.iceConnectionState || 'closed';
    const signalingState = this.peerConnection?.signalingState || 'closed';
    
    return {
      isInitialized: this.isInitialized,
      connectionState,
      iceConnectionState,
      signalingState,
      hasLocalStream: !!this.localStream,
      hasRemoteStream: !!this.remoteStream,
      hasPeerConnection: !!this.peerConnection,
      remoteUserId: this.remoteUserId,
      myUserId: this.myUserId,
      isMuted: this.isMuted(),
      socketConnected: this.socketService?.isSocketConnected() || false,
    };
  }

  // ✅ Check if call is active
  isCallActive() {
    const state = this.peerConnection?.connectionState;
    return state === 'connected' || state === 'connecting';
  }

  // ✅ Get detailed connection info for debugging
  getConnectionInfo() {
    if (!this.peerConnection) {
      return { error: 'No peer connection' };
    }

    return {
      connectionState: this.peerConnection.connectionState,
      iceConnectionState: this.peerConnection.iceConnectionState,
      iceGatheringState: this.peerConnection.iceGatheringState,
      signalingState: this.peerConnection.signalingState,
      localDescription: this.peerConnection.localDescription?.type,
      remoteDescription: this.peerConnection.remoteDescription?.type,
      hasLocalStream: !!this.localStream,
      hasRemoteStream: !!this.remoteStream,
      socketConnected: this.socketService?.isSocketConnected(),
    };
  }
}

// Export singleton instance
export default new WebRTCService();