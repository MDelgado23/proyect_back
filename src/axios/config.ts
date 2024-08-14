import axios, { AxiosInstance } from 'axios';

const baseURL = 'https://api.imgbb.com/1'; 

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

export default axiosInstance;