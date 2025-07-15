import keychain from 'react-native-keychain'

export const BASE_URL= "https://53a6f166570e.ngrok-free.app";
export const API_PATH ={
    DOCTORS:'/api/doctors',
    SPECIALITY:'/api/specialities',
    APPOINTMENT:'/api/appointments',
    AUTH_LOGIN_GOOGLE:"/api/auth/google",
}

export const getHeaders=async () => {
    const credentials= await keychain.getGenericPassword()
    console.log("Get Headers Credential Password",credentials.password);
    
    return `Bearer ${credentials.password}`
}