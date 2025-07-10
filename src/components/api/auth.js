import axios from 'axios';
import { API_PATH, BASE_URL, getHeaders } from './constants';

export const authenticate = async data => {
  const url = BASE_URL + API_PATH.AUTH_LOGIN_GOOGLE;
  console.log(url + ' "' + JSON.stringify(data));

  console.log(JSON.stringify(data));

  const response = await axios(url, {
    method: 'POST',
    data: data,
  });
  console.log('Backend Response:', response.data);
  console.log('JWT Token:', response.data.token);
  return response?.data;
};
