import axios from "axios";
import { API_PATH, BASE_URL, getHeaders } from "./constants"

export const createAppointment = async (data) => {
  const url = BASE_URL + API_PATH.APPOINTMENT;

  
    // Uncomment this block to make an actual API call
    // const response = await axios(url, {
    //   data: data,
    //   method: 'POST',
    //   headers: getHeaders(),
    // });

    // Log the data for debugging
    console.log("Data from createappointment: ", data);
    
    // Return a mock response with better structure
    return {
       id: new Date().getTime().toString(),
       ...data  
    };
  
};