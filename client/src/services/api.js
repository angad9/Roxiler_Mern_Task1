import axios from 'axios';

// Base URL for API
const API_URL = 'http://localhost:5000/api';

// Fetch transactions with pagination and search
export const fetchTransactions = async (month, search = '', page = 1) => {
  return await axios.get(`${API_URL}/transactions`, {
    params: { month, search, page }
  });
};

// Fetch transaction statistics
export const fetchStatistics = async (month) => {
  return await axios.get(`${API_URL}/statistics`, {
    params: { month }
  });
};

// Fetch data for the bar chart
export const fetchBarChartData = async (month) => {
  return await axios.get(`${API_URL}/bar-chart`, {
    params: { month }
  });
};

// Fetch combined data from all three APIs
export const fetchCombinedData = async (month) => {
  return await axios.get(`${API_URL}/combined`, {
    params: { month }
  });
};
