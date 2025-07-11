import axios from "axios";
import { API_PATH, BASE_URL, getHeaders } from "./constants"

export const createAppointment = async (data) => {
  const url = BASE_URL + API_PATH.APPOINTMENT;

    const authroizationHeader=await getHeaders();
    console.log('AuthorizationHeader: '+authroizationHeader)
    console.log('URL: '+url)
     const response = await axios(url, {
      data: data,
      method: 'POST',
      headers: 
      {
        'Authorization':authroizationHeader
      }
    });

    // Log the data for debugging
    console.log("Data from createappointment: ", response);
    
    // Return a mock response with better structure
    return {
       id: new Date().getTime().toString(),
       ...data  
    };
  
};

export const getAppointments= async () =>
{
  const AuthorizationHeader=await getHeaders()
  const url=BASE_URL+API_PATH.APPOINTMENT;
  const response=await axios(url,
    {
      method:'GET',
      headers:
      {
        'Authorization':AuthorizationHeader
      }
    }
  )
  console.log(response)
  return response;
}

export const getMyAppointments = async (token) => {
  const authorizationHeader = await getHeaders();
  
  const url = BASE_URL + API_PATH.APPOINTMENT + '/my-appointments'; 

  console.log('Fetching user-specific appointments from:', url);
  console.log("Token i received: "+token)
  const response = await axios.get(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  
  console.log("Received user appointments: ", response.data);

  
  return response.data;
};