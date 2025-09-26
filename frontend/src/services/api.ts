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

export const simulateTCO = (payload: {
  purchasePrice: number;
  annualMileage: number;
  years: 1 | 3 | 5;
}) => {
  return apiClient.post('/tco/simulate', payload);
};
export const getTimingReport = (payload: {
  purchasePrice: number;
  annualMileage: number;
}) => {
  return apiClient.post('/timing/report', payload);
};
export const getLifecycleStage = (payload: {
  vehicleType: 'suv'|'sedan'|'hatchback'|'sports';
  years: number;
  odometer: number;
}) => apiClient.post('/lifecycle/stage', payload);
