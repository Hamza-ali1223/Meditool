// CallScreen.js
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import WebRTCService from '../../services/WebRTCService';

export default function CallScreen({ route, navigation }) {
  const { targetUser, isOutgoing, myUserId } = route.params || {};

  useEffect(() => {
    // Listen for call end
    const onCallEnded = () => {
      WebRTCService.cleanup();
      navigation.goBack();
    };
    // You can add a socket listener for 'call_ended' here if needed
    return () => WebRTCService.cleanup();
  }, [navigation]);

  const handleHangup = () => {
    WebRTCService.endCall();
    navigation.goBack();
  };

  return (
    <View style={styles.center}>
      <Text style={styles.title}>In Call with {targetUser?.name || targetUser?.userId}</Text>
      <TouchableOpacity style={styles.btn} onPress={handleHangup}>
        <Text>Hang Up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', margin: 20 },
  btn: { backgroundColor: '#F44336', padding: 16, borderRadius: 8, marginTop: 30 },
});