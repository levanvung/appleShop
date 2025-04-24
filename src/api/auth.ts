import { apiClient } from './config';
import axios from 'axios';

interface SignupData {
    name: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

interface AuthResponse {
    message: string;
    code: number;
    metadata: {
        shop?: {
            _id: string;
            name: string;
            email: string;
        };
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    };
}

export const authService = {
    signup: async (data: SignupData): Promise<AuthResponse> => {
        try {
            console.log('Sending signup request with data:', data);
            const response = await apiClient.post('/signup', data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('Signup response:', response);
            
            if (response.data.metadata?.tokens) {
                localStorage.setItem('accessToken', response.data.metadata.tokens.accessToken);
                localStorage.setItem('refreshToken', response.data.metadata.tokens.refreshToken);
            }
            return response.data;
        } catch (error) {
            console.error('Signup error:', error);
            if (axios.isAxiosError(error)) {
                throw error;
            }
            throw new Error('An unexpected error occurred during signup');
        }
    },

    login: async (data: LoginData): Promise<AuthResponse> => {
        try {
            console.log('Sending login request with data:', data);
            const response = await apiClient.post('/login', data, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            console.log('Login response:', response);
            
            if (response.data.metadata?.tokens) {
                localStorage.setItem('accessToken', response.data.metadata.tokens.accessToken);
                localStorage.setItem('refreshToken', response.data.metadata.tokens.refreshToken);
            }
            return response.data;
        } catch (error) {
            console.error('Login error:', error);
            if (axios.isAxiosError(error)) {
                throw error;
            }
            throw new Error('An unexpected error occurred during login');
        }
    },

    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }
}; 