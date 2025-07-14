// src/utils/PermissionsHandler.js
import { Platform } from 'react-native';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

/**
 * Request microphone permissions for audio calls
 * @returns {Promise<boolean>} - Whether permission was granted
 */
export const requestMicrophonePermission = async () => {
  try {
    const permission = Platform.OS === 'ios' 
      ? PERMISSIONS.IOS.MICROPHONE 
      : PERMISSIONS.ANDROID.RECORD_AUDIO;
    
    const result = await request(permission);
    
    if (result === RESULTS.GRANTED) {
      console.log('Microphone permission granted');
      return true;
    } else {
      console.warn('Microphone permission denied:', result);
      return false;
    }
  } catch (error) {
    console.error('Error requesting microphone permission:', error);
    return false;
  }
};