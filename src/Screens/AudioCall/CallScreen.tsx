import { Button, Image, ImageBackground, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import images from '../../assets/img/images'
import { vs, s } from 'react-native-size-matters'
import { RTCView } from 'react-native-webrtc'

const CallScreen = ({incomingCall,rejectCall, remoteStream,callerId,answerCall, userId, role, endCall, appointmentData,filterUser,callActive,CallStatus, toggleMic,toggleSpeaker}) => {

const [CallerName,SetCallerName]=useState();
const [callerImage,SetCallerImage]=useState()
const [callDuration,setCallDuration]=useState(0);
const timeRef=useRef(null);

  const fetchData= () =>
  {
    console.log(JSON.stringify(filterUser));
    
    SetCallerImage(filterUser?.image)
    SetCallerName(filterUser?.name)
  }

  useEffect(()=>
  {



    fetchData();
    
 
    
  
  },[])


  useEffect(()=>
  {
    if(callActive)
    {
      setCallDuration(0)
      timeRef.current=setInterval(()=>
      {
        setCallDuration(prev=>prev+1)
      },1000)
    }
    else{
      clearInterval(timeRef.current)
    }

    return () =>
    {
      clearInterval(timeRef.current)
    }
  },[callActive])

  const formatTime= (secs) =>
  {
    const mins = Math.floor(secs/60);
    const seconds=secs%60;
    return `${String(mins).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`
  }
  return (
    <SafeAreaView style={styles.mainContainer}>
      <ImageBackground source={images.splash} style={styles.background}>
        {/* Top: Caller Image */}
        <View style={styles.callerContainer}>
          <Image
            source={{uri:callerImage}} // Replace with actual caller image
            style={styles.callerImage}
          />
          <Text style={styles.callerName}>{CallerName}</Text>
          <Text style={styles.callStatus}>{CallStatus}</Text>
          {callDuration>0 && <View>
            <Text style={{color:'white', fontFamily:"Lato-Regular",fontSize:16,marginTop:vs(5)}}>{formatTime(callDuration)}</Text>
          </View>}
        </View>

        
        {(!incomingCall ||callActive) && <View style={styles.actionsContainer}>
          {/* Example Action Button */}
          <TouchableOpacity style={styles.actionButton} onPress={toggleMic}>
            <Image
              source={images.mic_mute} 
              style={styles.actionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={toggleSpeaker}>
            <Image
              source={images.speaker} 
              style={styles.actionIcon}
            />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.endCallButton]} onPress={endCall}>
            <Image
              source={images.end_call} 
              style={styles.actionIcon}
            />
          </TouchableOpacity>
          
        </View>}
        {incomingCall && !callActive && <View style={styles.actionsContainer}>
        
          <TouchableOpacity style={styles.actionButton} onPress={answerCall}>
            <Image source={images.green_call}
             style={styles.actionButton}/>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={rejectCall}>
            <Image source={images.red_call}
             style={styles.actionButton}/>
          </TouchableOpacity>
        </View>}

        {remoteStream && (
  <RTCView
    streamURL={remoteStream.toURL()}
    style={{ width: 1, height: 1 }} // hidden but required for audio
    objectFit="cover"
    mirror={false}
    zOrder={0}
  />
)}
      </ImageBackground>
    </SafeAreaView>
  )
}

export default CallScreen

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  background: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  callerContainer: {
    alignItems: 'center',
    marginTop: vs(60),
  },
  callerImage: {
    width: vs(100),
    height: vs(100),
    borderRadius: vs(50),
    marginBottom: vs(16),
    backgroundColor: '#ccc', // Placeholder background
  },
  callerName: {
    fontSize: vs(20),
    fontWeight: 'bold',
    color: '#fff',
  },
  callStatus: {
    fontSize: vs(16),
    color: '#fff',
    marginTop: vs(4),
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(40),
    gap: s(24), // If using React Native 0.71+, otherwise use marginHorizontal on buttons
  },
  actionButton: {
    width: vs(60),
    height: vs(60),
    borderRadius: vs(30),
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: s(12),
  },
  endCallButton: {
    backgroundColor: '#FF3B30',
  },
  actionIcon: {
    width: vs(32),
    height: vs(32),
    resizeMode: 'contain',
  },
})