import keychain from 'react-native-keychain'

export const BASE_URL= "https://ad9cf1031a54.ngrok-free.app";
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