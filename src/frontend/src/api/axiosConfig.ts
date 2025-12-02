import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  // ...
});

export default axiosInstance;