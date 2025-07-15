import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import images from '../../assets/img/images';

const { width, height } = Dimensions.get('window');

interface CallScreenProps {
  doctor: { 
    name?: string; 
    firstName?: string; 
    lastName?: string; 
    photoUrl?: string; 
    image?: string; 
  };
  isCalling: boolean;
  isRinging: boolean;
  isConnected: boolean;
  incomingCall: boolean;
  callDuration: number;
  isMuted: boolean;
  onAnswer: () => void;
  onReject: () => void;
  onEnd: () => void;
  onToggleMute: () => void;
  error?: string;
}

/**
 * 📞 Call Screen UI - Matches your design from Images 2 & 4
 * Image 2: Active call with duration timer and end call button
 * Image 4: Incoming call with accept/reject buttons
 */
export default function CallScreen(props: CallScreenProps) {
  const {
    doctor,
    isCalling,
    isRinging,
    isConnected,
    incomingCall,
    callDuration,
    isMuted,
    onAnswer,
    onReject,
    onEnd,
    onToggleMute,
    error,
  } = props;

  // 📝 Format call duration as MM:SS
  const formatDuration = (seconds: number) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // 👨‍⚕️ Get doctor name (handle different data structures)
  const getDoctorName = () => {
    if (doctor.name) return doctor.name;
    if (doctor.firstName && doctor.lastName) {
      return `Dr. ${doctor.firstName} ${doctor.lastName}`;
    }
    return 'Unknown Doctor';
  };

  // 🖼️ Get doctor image
  const getDoctorImage = () => {
    return doctor.photoUrl || doctor.image || 'https://via.placeholder.com/150';
  };

  // 📱 Get status text based on call state
  const getStatusText = () => {
    if (incomingCall && !isConnected) return 'Incoming call...';
    if (isCalling) return 'Calling...';
    if (isRinging) return 'Ringing...';
    if (isConnected) return 'Audio Recording is Active';
    return 'Connecting...';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1e3a8a" />
      
      {/* 🕐 Duration Timer (only show when connected - like Image 2) */}
      {isConnected && (
        <View style={styles.durationContainer}>
          <View style={styles.durationBadge}>
            <View style={styles.recordingDot} />
            <Text style={styles.durationText}>{formatDuration(callDuration)}</Text>
          </View>
        </View>
      )}

      {/* 👨‍⚕️ Doctor Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: getDoctorImage() }}
            style={styles.profileImage}
            defaultSource={images.doctor} // Add placeholder
          />
        </View>
        
        <Text style={styles.doctorName}>{getDoctorName()}</Text>
        <Text style={styles.statusText}>{getStatusText()}</Text>
        
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>

      {/* 🎛️ Call Controls */}
      <View style={styles.controlsContainer}>
        {/* 📞 Incoming Call Buttons (Image 4 design) */}
        {incomingCall && !isConnected ? (
          <View style={styles.incomingCallButtons}>
            {/* 📞 Answer Button (Green) */}
            <TouchableOpacity
              style={[styles.callButton, styles.answerButton]}
              onPress={onAnswer}
            >
              {/* You can replace this View with an Image component for your phone icon */}
              <View style={styles.buttonIconPlaceholder} />
            </TouchableOpacity>

            {/* ❌ Reject Button (Red) */}
            <TouchableOpacity
              style={[styles.callButton, styles.rejectButton]}
              onPress={onReject}
            >
              {/* You can replace this View with an Image component for your reject icon */}
              <View style={styles.buttonIconPlaceholder} />
            </TouchableOpacity>
          </View>
        ) : isConnected ? (
          /* 🎛️ Active Call Controls (Image 2 design) */
          <View style={styles.activeCallButtons}>
            {/* 🔇 Mute Button */}
            <TouchableOpacity
              style={[styles.controlButton, isMuted && styles.mutedButton]}
              onPress={onToggleMute}
            >
              {/* Replace with mute/unmute icon */}
              <View style={styles.controlIconPlaceholder} />
            </TouchableOpacity>

            {/* ❌ End Call Button (Red) */}
            <TouchableOpacity
              style={[styles.callButton, styles.endCallButton]}
              onPress={onEnd}
            >
              {/* Replace with end call icon */}
              <View style={styles.buttonIconPlaceholder} />
            </TouchableOpacity>

            {/* 🔊 Speaker Button */}
            <TouchableOpacity
              style={styles.controlButton}
              onPress={() => {/* Handle speaker toggle */}}
            >
              {/* Replace with speaker icon */}
              <View style={styles.controlIconPlaceholder} />
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e3a8a', // Blue background like in images
    justifyContent: 'space-between',
    paddingVertical: 60,
  },
  
  // 🕐 Duration Timer Styles
  durationContainer: {
    alignItems: 'center',
    paddingTop: 20,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.9)', // Red badge like Image 2
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  recordingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#fff',
    marginRight: 6,
  },
  durationText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },

  // 👨‍⚕️ Profile Section Styles
  profileSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  profileImageContainer: {
    marginBottom: 24,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  doctorName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  statusText: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#ef4444',
    marginTop: 12,
    textAlign: 'center',
  },

  // 🎛️ Controls Section Styles
  controlsContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  
  // 📞 Incoming Call Buttons
  incomingCallButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  
  // 🎛️ Active Call Buttons
  activeCallButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  // 📞 Main Call Buttons (Answer/Reject/End)
  callButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  answerButton: {
    backgroundColor: '#22c55e', // Green for answer
  },
  rejectButton: {
    backgroundColor: '#ef4444', // Red for reject
  },
  endCallButton: {
    backgroundColor: '#ef4444', // Red for end call
  },

  // 🎛️ Smaller Control Buttons (Mute/Speaker)
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mutedButton: {
    backgroundColor: '#ef4444',
  },

  // 🎨 Icon Placeholders (Replace these with actual Image components)
  buttonIconPlaceholder: {
    width: 30,
    height: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 4,
  },
  controlIconPlaceholder: {
    width: 20,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 2,
  },
});