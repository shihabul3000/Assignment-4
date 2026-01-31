import axios, { AxiosHeaders } from 'axios';
import Cookies from 'js-cookie';

// Debug logging for environment variables
console.log('[apiClient] Environment check:');
console.log('[apiClient] NEXT_PUBLIC_API_URL:', process.env.NEXT_PUBLIC_API_URL);
console.log('[apiClient] NODE_ENV:', process.env.NODE_ENV);

// Default to localhost:5000 if not set, matching backend default
// Sanitize the URL to remove any surrounding quotes that might be injected by the environment
// We also trim whitespace which was causing the previous regex to fail on trailing quotes
let rawApiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

console.log('[apiClient] Initial rawApiUrl:', rawApiUrl);
console.log('%c [VERSION CHECK] Build Time: Jan 31 10:45 AM - Force Fix Active', 'background: #222; color: #bada55');

// FORCE PRODUCTION URL
// We are making this unconditional for now to rule out any NODE_ENV issues
const forcedUrl = 'https://backend-weld-theta-88.vercel.app/api';

if (rawApiUrl.includes('backend-86h2isxs1') || rawApiUrl !== forcedUrl) {
    console.warn('[apiClient] Replacing incorrect/stale API URL:', rawApiUrl);
    console.warn('[apiClient] Forcing usage of:', forcedUrl);
    rawApiUrl = forcedUrl;
}

const API_URL = rawApiUrl.trim().replace(/^["']+|["']+$/g, '');

console.log('[apiClient] Using API_URL:', API_URL);

export const apiClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
    (config) => {
        // Debug logging for requests
        console.log(`[apiClient] Making ${config.method?.toUpperCase()} request to: ${config.url}`);
        console.log('[apiClient] Full URL:', `${config.baseURL}${config.url}`);
        console.log('[apiClient] Request headers:', config.headers);

        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token') || Cookies.get('token');
            if (token) {
                // Ensure headers object exists
                if (!config.headers) {
                    config.headers = new AxiosHeaders();
                }

                // Set Authorization header - Using bracket notation for better compatibility
                config.headers['Authorization'] = `Bearer ${token}`;
                console.log('[apiClient] Token attached to request');
            } else {
                console.log('[apiClient] No token found in localStorage or cookies');
            }
        }
        return config;
    },
    (error) => {
        console.error('[apiClient] Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle Errors
apiClient.interceptors.response.use(
    (response) => {
        console.log('[apiClient] Response received:', response.status, response.statusText);
        console.log('[apiClient] Response data:', response.data);
        return response;
    },
    (error) => {
        console.error('[apiClient] Response error:', error);

        if (error.response) {
            // Server responded with error status
            console.error('[apiClient] Error response status:', error.response.status);
            console.error('[apiClient] Error response data:', error.response.data);
            console.error('[apiClient] Error response headers:', error.response.headers);
        } else if (error.request) {
            // Request was made but no response received
            console.error('[apiClient] No response received. Request:', error.request);
            console.error('[apiClient] This might be a CORS issue or network problem');
        } else {
            // Something else happened
            console.error('[apiClient] Error message:', error.message);
        }

        // Handle global errors like 401 Unauthorized
        if (error.response && error.response.status === 401) {
            // Optional: Redirect to login or clear storage
            // localStorage.removeItem('token');
            // window.location.href = '/login'; 
        }
        return Promise.reject(error);
    }
);
