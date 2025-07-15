import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  Dimensions,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useAuth } from '../../components/Contexts/AuthContext';
import images from '../../assets/img/images';


const { width, height } = Dimensions.get('window');

export default function RoleSelectionScreen({ navigation }: any) {
  const { setRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'PATIENT' | 'DOCTOR' | null>(null);

  const handleRoleSelection = (role: 'PATIENT' | 'DOCTOR') => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      setRole(selectedRole);
      // Navigate to main screen - adjust route name as needed
      navigation.navigate('Main');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Background with same gradient as call screens */}
      <LinearGradient
        colors={['#1e3c72', '#2a5298', '#1e3c72']}
        style={styles.background}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        
        {/* Optional: Add your splash image as background */}
        <ImageBackground
          source={images.splash} // Adjust path to your splash image
          style={styles.backgroundImage}
          resizeMode="cover"
          imageStyle={{ opacity: 0.3 }}
        >
          
          <SafeAreaView style={styles.safeArea}>
            
            {/* Header Section */}
            <View style={styles.headerSection}>
              <Text style={styles.welcomeText}>Welcome to</Text>
              <Text style={styles.appName}>Docspot</Text>
              <Text style={styles.subtitle}>Choose your role to continue</Text>
            </View>

            {/* Role Selection Cards */}
            <View style={styles.roleContainer}>
              
              {/* Patient Card */}
              <TouchableOpacity
                style={[
                  styles.roleCard,
                  selectedRole === 'PATIENT' && styles.selectedCard
                ]}
                onPress={() => handleRoleSelection('PATIENT')}
                activeOpacity={0.8}
              >
                <View style={styles.roleIconContainer}>
                  <View style={[styles.roleIcon, selectedRole === 'PATIENT' && styles.selectedIcon]}>
                    <Text style={styles.roleEmoji}>👤</Text>
                  </View>
                </View>
                <Text style={styles.roleTitle}>I'm a Patient</Text>
                <Text style={styles.roleDescription}>
                  Book appointments and consult with doctors
                </Text>
                {selectedRole === 'PATIENT' && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>

              {/* Doctor Card */}
              <TouchableOpacity
                style={[
                  styles.roleCard,
                  selectedRole === 'DOCTOR' && styles.selectedCard
                ]}
                onPress={() => handleRoleSelection('DOCTOR')}
                activeOpacity={0.8}
              >
                <View style={styles.roleIconContainer}>
                  <View style={[styles.roleIcon, selectedRole === 'DOCTOR' && styles.selectedIcon]}>
                    <Text style={styles.roleEmoji}>👨‍⚕️</Text>
                  </View>
                </View>
                <Text style={styles.roleTitle}>I'm a Doctor</Text>
                <Text style={styles.roleDescription}>
                  Manage patients and provide medical care
                </Text>
                {selectedRole === 'DOCTOR' && (
                  <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>

            </View>

            {/* Continue Button */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[
                  styles.continueButton,
                  !selectedRole && styles.disabledButton
                ]}
                onPress={handleContinue}
                disabled={!selectedRole}
                activeOpacity={0.8}
              >
                <Text style={styles.continueButtonText}>
                  {selectedRole ? `Continue as ${selectedRole}` : 'Select a role'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>
                You can change this later in settings
              </Text>
            </View>

          </SafeAreaView>
          
        </ImageBackground>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  backgroundImage: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Header Section
  headerSection: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 50,
  },
  welcomeText: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
    fontWeight: '300',
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 12,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
  },
  
  // Role Container
  roleContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
  },
  
  // Role Cards
  roleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
  },
  selectedCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderColor: 'rgba(255, 255, 255, 0.5)',
    transform: [{ scale: 1.02 }],
  },
  
  // Role Icon
  roleIconContainer: {
    marginBottom: 16,
  },
  roleIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  selectedIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderColor: 'rgba(255, 255, 255, 0.6)',
  },
  roleEmoji: {
    fontSize: 32,
  },
  
  // Text Styles
  roleTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  roleDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  
  // Checkmark
  checkmark: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  
  // Button Container
  buttonContainer: {
    marginTop: 40,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 25,
    paddingVertical: 16,
    paddingHorizontal: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  disabledButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e3c72',
  },
  
  // Footer
  footer: {
    alignItems: 'center',
    paddingBottom: 30,
  },
  footerText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.6)',
    textAlign: 'center',
  },
});