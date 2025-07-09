export const BASE_URL= "https://fe36df787298.ngrok-free.app";
export const API_PATH ={
    DOCTORS:'/api/doctors',
    SPECIALITY:'/api/specialities',
    APPOINTMENT:'/api/appoinments',
    AUTH_LOGIN_GOOGLE:"/api/auth/google",
}

export const getHeaders=() => {
    return {
        'Authorization':`Bearer ${getToken()}`
    }
}