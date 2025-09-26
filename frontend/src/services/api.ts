import axios from 'axios';

// The backend server will run on port 3001
const API_BASE_URL = 'http://localhost:3001/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getHealth = () => {
  return apiClient.get('/health');
};
