
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://expense-tracker-4q64.onrender.com/api', 
  headers: {
    'Content-Type': 'application/json'
  }
});

export default axiosInstance;
