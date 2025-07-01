import axios, { Axios } from "axios";
import { API_PATH, BASE_URL } from "./constants"
import doctors from "../DoctorsListData/doctorslist";



export const fetchDoctors= async () =>
{
    const url=BASE_URL+API_PATH.DOCTORS;

    // const {data} = await axios.get(url)
    // return data;
    return doctors;
}

export const fetchDoctorsById= async(id) =>
{

    //Logic to put api data here
    return doctors?.find((item)=>item.id===id)
}