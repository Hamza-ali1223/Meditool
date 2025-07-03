import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import images from '../../assets/img/images'
import { s, vs } from 'react-native-size-matters'

const ConfirmationModal = ({Visible,onClose,ModelText}) => {
  return (
    <View>
        <Modal
        isVisible={Visible}
        
        style={{height:vs(80),width:s(300),backgroundColor:'black'}}
       
        
        >
            <View>
                <Image source={images.doctor} style={{height:200,width:100,justifyContent:'center',alignSelf:'center'}}/>
            </View>
        </Modal>
    </View>
  )
}

export default ConfirmationModal

const styles = StyleSheet.create({})