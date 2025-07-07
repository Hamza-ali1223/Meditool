import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Modal from 'react-native-modal';
import images from '../../assets/img/images';
import { s, vs } from 'react-native-size-matters';
import MainButton from '../MainButton';
import { useNavigation } from '@react-navigation/native';

const ConfirmationModal = ({ Visible, onClose, ModelText }) => {
  const Navigation=useNavigation()
  const Done= () =>
  {
    onClose()
    Navigation.navigate("Main",{screen:'HomeScreen'});
  }
  
  return (
    <Modal
      isVisible={Visible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
      useNativeDriver={true}
      useNativeDriverForBackdrop={true}
      backdropOpacity={0.7}
      animationIn="slideInUp"
      animationOut="fadeOut"
      animationInTiming={400}
      animationOutTiming={400}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <View style={styles.modalView}>
          <View
            style={{
              height: vs(128),
              width: s(128),
              borderRadius: s(64),
              backgroundColor: '#EDEDFC',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <Image source={images.like} />
          </View>
          <Text
            style={{
              fontSize: s(20),
              fontFamily: 'Lato-Bold',
              marginTop: vs(10),
            }}
          >
            Thank You !
          </Text>
          <Text
            style={{
              fontFamily: 'Lato-Regular',
              fontSize: s(16),
              marginTop: vs(10),
            }}
          >
            Your Appointment was Successful
          </Text>
          <View style={{paddingTop:vs(10)}}>
            <Text style={styles.appointmentText}>
              You Booked an Appointment with{' '}
            </Text>
            <Text style={styles.appointmentText}>
              {ModelText}
            </Text>
          </View>
          <View style={{paddingTop:vs(34)}}>
            <MainButton Label={"Done"} onPress={Done} />
          </View>
          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'center',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: s(20),
    padding: s(20),
    minHeight: vs(150),
  },
  modalView: {
    alignItems: 'center',
  },
  appointmentText: {
    textAlign: 'center',
    fontSize: s(14),
    fontWeight:'100',
  },
});

export default ConfirmationModal;
