import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001"

const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL}`, // local
  //baseURL: 'http://3.26.96.188:5001', // live
  headers: { 'Content-Type': 'application/json' },
});

export default axiosInstance;
