export const BASE_URL= "http://localhost:8080";
export const API_PATH ={
    DOCTORS:'/api/doctors',
    SPECIALITY:'/api/specialities',
    APPOINTMENT:'/api/appoinments',
}

export const getHeaders=() => {
    return {
        'Authorization':`Bearer ${getToken()}`
    }
}