import axios from 'axios';

const BASE_URL = 'http://localhost:3055/v1/api/';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // Enable sending cookies in cross-origin requests
});

// Add a request interceptor to add the token to all requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            // Send only the token without 'Bearer ' prefix
            config.headers.Authorization = token;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
); 