import specialities from "../DoctorsListData/specialities"
import { API_PATH, BASE_URL } from "./constants"

export const fetchSpecialities = async () =>
{

    const ur=BASE_URL+API_PATH.SPECIALITY
    //Logic to fetch Specialities
    // const {data} =  await axios.get(url)
    //  return data;
    return specialities; 
}