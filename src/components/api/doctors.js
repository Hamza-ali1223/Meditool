import axios, { Axios } from "axios";
import { API_PATH, BASE_URL, getHeaders } from "./constants"
import doctors from "../DoctorsListData/doctorslist";



export const fetchDoctors= async () =>
{
    const url=BASE_URL+API_PATH.DOCTORS;
    console.log("Fetch Doctors Request: " +url)
    const authroizationHeader= await getHeaders()
    const {data} = await axios.get(url,
        {
            headers:
            {
                'Authorization': authroizationHeader
            }
        }
    )
    return data;
    
}

export const fetchDoctorsById= async(id) =>
{
    const url=BASE_URL+API_PATH.DOCTORS+`/${id}`;
    console.log("Fetch by Doctor ID: "+url)
    const authroizationHeader= await getHeaders()
    const {data} = await axios.get(url,
        {
            headers:
            {
                'Authorization': authroizationHeader
            }
        }
    )
    return data;
}