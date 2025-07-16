import {
  FlatList,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { SERVER_URL } from '@env';
import { io } from 'socket.io-client';
import {
  mediaDevices,
  RTCIceCandidate,
  RTCPeerConnection,
  RTCSessionDescription,
} from 'react-native-webrtc';
import { useAuth } from '../../components/Contexts/AuthContext';
import { s, vs } from 'react-native-size-matters';
import CallScreen from './CallScreen';
import inCallManager from 'react-native-incall-manager';
const AudioCallScreen = ({ route }) => {
  const { appointmentData } = route?.params;
  const [CallStatus, setCallStatus] = useState();
  const [CallActive, setCallActive] = useState(false);
  const [IncomingCall, setIncomingCall] = useState();
  const [Registered, SetRegisterd] = useState(false);
  const [filterUser, SetfilterUser] = useState();
  const { role } = useAuth();
  const peerConnection = useRef(null);
  const [remoteUserId, setRemoteUserId] = useState();
  const [LocalStream, setLocalStream] = useState();
  const remoteStream = useRef(null);
  const [filteredUsers, SetfilteredUsers] = useState();
  const [Calling, setCalling] = useState(false);
  const [callerId, setCallerId] = useState();
  const [speakerOn, SetSpeakerOn] = useState(true);
  const [micOn, SetmicOn] = useState(true);

  const socket = useRef(null);

  
  

  useEffect(() => {
    socket.current = io(SERVER_URL, {
      transports: ['websocket'],
    });

    socket.current.on('connect', () => {
      console.log('✅ Connected');
      registerUser(); // Your custom emit
      fetchOnlineUsers();
    });

    socket.current.on('incoming_call', data => {
      console.log('Incoming Call: ', data);
      setIncomingCall(data);
      setCalling(true);
      setCallStatus('Incoming Call...');
    });

    socket.current.on('call_accepted', signal => {
      console.log('Call Accepted, Signal: ' ,signal);
      setCallActive(true);
      setCallStatus('Call Connected');

      //Going to set Remote Description when call is accepted
      const Description = new RTCSessionDescription(signal?.signal);
      peerConnection.current
        .setRemoteDescription(Description)
        .catch(err =>
          console.log(
            'error setting remote description, Description: ',
            Description,
          ),
        );
    });

    socket.current.on('call_rejected', data => {
      setCallStatus(`Call Rejected: ${data.reason}`);
      cleanupCall();
    });

    socket.current.on('call_ended', data => {
      setCallStatus(`Call Ended`);
      setCalling(false)
      cleanupCall();
    });

    socket.current.on('ice_candidate', candidate => {
      //Add received ice candidate
      if (peerConnection.current) {
        peerConnection.current
          .addIceCandidate(new RTCIceCandidate(candidate))
          .catch(err =>
            console.log('Error adding received Ice Candidate: ', err),
          );
      }
    });

    socket.current.on('online_users', users => {
      console.log('🌐 Received online users:', users);

      let filtered = [];

      if (role === 'DOCTOR') {
        filtered = users; // Show all
      } else if (role === 'PATIENT') {
        filtered = users.filter(user => user.role === 'DOCTOR');
      } else {
        filtered = []; // Optional: handle unknown role
      }

      console.log(`👥 Filtered users for role ${role}:`, filtered);
      SetfilteredUsers(filtered);
    });

    return () => {
      if (socket.current) {
        socket.current.disconnect();
      }
      cleanupCall();
    };
  }, []);

  const registerUser = () => {
    if (!socket.current || !socket.current.connected) {
      console.log('⚠️ Socket not connected, cannot register user');
      return;
    }
    const userId = appointmentData?.user?.userId;
    const name = appointmentData?.patient?.patientName;
    const email = appointmentData?.user?.email;
    let image;
    switch (role) {
      case 'DOCTOR':
        image = appointmentData?.doctor?.image;
        break;
      case 'PATIENT':
        image = appointmentData?.user?.image;
        break;
    }
    console.log('###### userID: ' + userId + ' #######');

    // Step 1: Emit register event with userId
    console.log('📤 Emitting register event with userId:', userId);
    socket.current.emit('register', userId);
    SetRegisterd(true);
    // Step 2: After 100ms, emit update_user_info
    setTimeout(() => {
      const userInfo = {
        userId,
        role,
        name,
        image,
        email,
      };

      console.log('📤 Emitting update_user_info with data:', userInfo);
      socket.current.emit('update_user_info', userInfo);
    }, 100);
  };

    const answerCall= async () =>
    {
      try {
          setCallStatus("Connecting...")
          setRemoteUserId(IncomingCall?.from)
          //Initialize peer and media Conneciton
          const stream= await initializeMedia();
          if(!stream)
            return;

          peerConnection.current=initializePeerConnection(stream);

          const Description= new RTCSessionDescription(IncomingCall?.signal);
          await peerConnection.current.setRemoteDescription(Description);

          console.log("Set our remote description");
          const answer= await peerConnection.current.createAnswer();

          await peerConnection.current.setLocalDescription(answer);
          socket.current.emit('answer_call',{
            to:IncomingCall?.from,
            signal:peerConnection.current.localDescription,
          })

          setCallActive(true)
          setIncomingCall(null);
          setCallStatus('Call Connected');
          
    if (Platform.OS === 'ios') {
      inCallManager.start({ media: 'audio', ringback: false });
    } else {
      inCallManager.start({ media: 'audio', ringback: false });
      inCallManager.setSpeakerphoneOn(true);
    }
          
      } catch (error) {
          console.error("Issue in our answer call method: "+error);
          
      }
    }


  const cleanupCall = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    if (LocalStream) {
      LocalStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setCallActive(false);
    setIncomingCall(null);
    setCallStatus("");
    setCalling(false);
    inCallManager.stop();
  };
  //fetchOnlineUsers Method
  const fetchOnlineUsers = () => {
    if (!socket.current?.connected) {
      console.log('⚠️ Socket not connected, cannot fetch users');
      return;
    }

    const userId = appointmentData?.user?.userId;
    console.log('📤 Fetching online users...');
    socket.current.emit('get_online_users', userId);
  };

  //Initalize Media Method
  const initializeMedia = async () => {
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        setCallStatus('Permission Denied');
        return null;
      }

      const stream = await mediaDevices.getUserMedia({
        audio: true,
        video: false,
      });

      // --- DEBUGGING LOGS START ---
      console.log('DEBUG: initializeMedia - Stream obtained:', stream);
      console.log('DEBUG: initializeMedia - Type of stream:', typeof stream);
      if (stream) {
        console.log('DEBUG: initializeMedia - Stream has getTracks method:', typeof stream.getTracks);
        const tracks = stream.getTracks();
        console.log('DEBUG: initializeMedia - Result of stream.getTracks():', tracks);
        console.log('DEBUG: initializeMedia - Type of stream.getTracks():', typeof tracks);
        if (Array.isArray(tracks)) {
          console.log('DEBUG: initializeMedia - stream.getTracks() is an array. Length:', tracks.length);
        } else if (tracks && typeof tracks.forEach === 'function') {
          console.log('DEBUG: initializeMedia - stream.getTracks() is an iterable with forEach.');
        } else {
          console.log('DEBUG: initializeMedia - stream.getTracks() is NOT an array and does NOT have forEach.');
        }
      }
      // --- DEBUGGING LOGS END ---
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media Devices: ', error);
      setCallStatus('Failed to accesss Microphone');
      return null;
    }
  };

  //permission method
  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        ]);
        return (
          granted['android.permission.RECORD_AUDIO'] ===
          PermissionsAndroid.RESULTS.GRANTED
        );
      } catch (error) {
        console.error('Failed to request Permssions: ', error);
      }
    } else {
      return true;
    }
  };
  //OUr InitialziePeerConnection Method
  const initializePeerConnection = stream => {
    const configurationServer = {
  iceServers: [
    { urls: ['stun:stun.l.google.com:19302'] },
  ],
};


    const pc =  new RTCPeerConnection(configurationServer);
     console.log("Peer connection created successfully");
    // --- DEBUGGING LOGS START ---
    console.log('DEBUG: initializePeerConnection - Stream received:', stream);
    console.log('DEBUG: initializePeerConnection - Type of stream:', typeof stream);
    if (stream) {
      console.log('DEBUG: initializePeerConnection - Stream has getTracks method:', typeof stream.getTracks);
      const tracks = stream.getTracks();
      console.log('DEBUG: initializePeerConnection - Result of stream.getTracks():', tracks);
      console.log('DEBUG: initializePeerConnection - Type of stream.getTracks():', typeof tracks);
      if (Array.isArray(tracks)) {
        console.log('DEBUG: initializePeerConnection - stream.getTracks() is an array. Length:', tracks.length);
      } else if (tracks && typeof tracks.forEach === 'function') {
        console.log('DEBUG: initializePeerConnection - stream.getTracks() is an iterable with forEach.');
      } else {
        console.log('DEBUG: initializePeerConnection - stream.getTracks() is NOT an array and does NOT have forEach.');
      }
    }
    // --- DEBUGGING LOGS END ---
   // More robust track handling
     const tracks = stream.getTracks();
        if (Array.isArray(tracks)) {
          tracks.forEach(track => {
            pc.addTrack(track, stream);
          });
        } else {
          console.warn('⚠️ stream.getTracks() is not an array');
        }

    
    
        console.log("Our remoteUserId: "+remoteUserId);
        
    pc.onicecandidate = event => {
      if (event.candidate) {
        socket.current.emit('ice_candidate', {
          to: remoteUserId,
          candidate: event.candidate,
        });
      }
    };

    pc.onconnectionstatechange = event => {
      switch (pc.connectionState) {
        case 'connected':
          setCallStatus('Connected');
          break;
        case 'disconnected':
        case 'failed':
          setCallStatus('Call Failed or Disconnected');
          cleanupCall();
          break;
        case 'closed':
          setCallStatus('Call Closed');
          cleanupCall();
          break;
      }
    };

   pc.ontrack = event => {
  console.log('🎧 Got remote track:', event.streams);
      if (event.streams && event.streams[0]) {
        remoteStream.current = event.streams[0]; // store it
        console.log("📡 Remote tracks: ", event.streams[0].getAudioTracks());
    console.log("🎙️ Remote track enabled: ", event.streams[0].getAudioTracks()?.[0]?.enabled);

        // Optional: update state to notify CallScreen or log
        setCallStatus('Receiving audio stream...');
      }
    };

    return pc;
  };
  //make call method
  const makeCall = async (userId) => {
    try {
      setCalling(true);
      setCallStatus("Calling");
      setRemoteUserId(userId);

      //Initialize media and peer Connection
      const stream = await initializeMedia();
      if (!stream) return;

      peerConnection.current = initializePeerConnection(stream);

      const offer = await peerConnection.current.createOffer({
        offerToReceiveAudio: true,
        offerToReceiveVideo: false,
      });

      await peerConnection.current.setLocalDescription(offer);
      socket.current.emit('make_call', {
        to: userId,
        signal: peerConnection.current.localDescription,
      });
      setCallStatus('Calling...');
      console.log('📤 Emitted make_call to:', userId);
    } catch (error) {
      console.error('Unable to make Call: ', error);
    }
  };
  const endCall = () => {
    setCalling(false);
    if (remoteUserId) {
      socket.current.emit('end_call', { to: remoteUserId });
    }
    cleanupCall();
  };

  const rejectCall = () =>
  {
      setCalling(false)
    socket.current.emit('reject_call',{
      from: appointmentData?.user?.userId,
   to: IncomingCall?.from, // whoever initiated the call
    reason: 'user Busy',

    });
    setIncomingCall(null);
    setCallStatus('')
  }

  const toggleMic =() =>
  {
    if(LocalStream) 
    {
      const audioTrack=LocalStream.getAudioTracks?.()[0];
      if(audioTrack)
      {
        console.log("We got our audioTrack from toggleMic");
        const newMicState=!micOn;
        audioTrack.enabled=newMicState;
        SetmicOn(newMicState);
        const callstatus=newMicState ? 'Mic Unmuted' : 'Mic Muted'
        setCallStatus(callstatus);
        
      }
    }
  }

  const toggleSpeaker= () =>
  {
    const newSpeakerState=!speakerOn;
    inCallManager.setSpeakerphoneOn(newSpeakerState);
    SetSpeakerOn(newSpeakerState);
    const callstatus=newSpeakerState? "Speaker On":"Speaker off";
    setCallStatus(callstatus)
  }
  return (
    <SafeAreaView style={styles.container}>
      {!Calling && (
        <View style={{ paddingHorizontal: s(10) }}>
          <View style={styles.header}>
            <Text style={styles.headerText}>🟢 Available Users to Call</Text>
            <TouchableOpacity
              onPress={fetchOnlineUsers}
              style={styles.refreshButton}
            >
              <Text style={styles.refreshButtonText}>🔄 Refresh</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={filteredUsers || []}
            keyExtractor={item => item.userId}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.userCard}
                onPress={() => {
                  SetfilterUser(item);
                 makeCall(item?.userId);
                }}
              >
                <Text style={styles.userName}>{item.name || item.userId}</Text>
                <Text style={styles.userRole}>{item.role}</Text>
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            ListEmptyComponent={() => (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No users online</Text>
              </View>
            )}
          />
        </View>
      )}
      {Calling && (
        <CallScreen
          callerId={callerId}
          userId={appointmentData?.user?.userId}
          role={role}
          endCall={endCall}
          appointmentData={appointmentData}
          filterUser={filterUser}
          callActive={CallActive}
          incomingCall={IncomingCall}
          rejectCall={rejectCall} answerCall={answerCall} remoteStream={remoteStream.current} CallStatus={CallStatus} toggleMic={toggleMic} toggleSpeaker={toggleSpeaker}      />
      )}
    </SafeAreaView>
  );
};

export default AudioCallScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1F44', // dark blue background
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
    marginTop: vs(50),
  },
  headerText: {
    color: '#FFF',
    fontSize: vs(14),
    fontWeight: '600',
  },
  refreshButton: {
    backgroundColor: '#1E3A8A',
    paddingVertical: vs(6),
    paddingHorizontal: vs(12),
    borderRadius: vs(4),
  },
  refreshButtonText: {
    color: '#FFF',
    fontSize: vs(14),
    fontFamily: 'Lato-Regular',
  },
  listContent: {
    paddingBottom: vs(20),
  },
  userCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#12325E',
    padding: vs(12),
    borderRadius: vs(6),
  },
  userName: {
    color: '#E0E7FF',
    fontSize: vs(16),
    fontWeight: '500',
  },
  userRole: {
    color: '#A5B4FC',
    fontSize: vs(14),
    fontStyle: 'italic',
  },
  separator: {
    height: vs(8),
  },
  emptyContainer: {
    marginTop: vs(40),
    alignItems: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: vs(16),
  },
});
