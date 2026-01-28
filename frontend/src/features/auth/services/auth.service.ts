import { apiClient } from '@/lib/apiClient';
import { LoginInput, RegisterInput } from '@/features/auth/validators'; // We will define Zod schemas later, or just use types for now
import { LoginResponse, RegisterResponse, User } from './types';

// Loose typing for inputs for now to avoid circular deps before validators exist
// Ideally we import from a shared types file or define inputs here
export interface LoginCredentials {
    email: string;
    password: string;
}

export interface RegisterCredentials {
    name: string;
    email: string;
    password: string;
    role?: 'STUDENT' | 'TUTOR';
}

export const authService = {
    async login(credentials: LoginCredentials): Promise<LoginResponse> {
        const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    async register(data: RegisterCredentials): Promise<RegisterResponse> {
        const response = await apiClient.post<RegisterResponse>('/auth/register', data);
        return response.data;
    },

    async getMe(): Promise<{ success: boolean; data: { user: User } }> {
        const response = await apiClient.get<{ success: boolean; data: { user: User } }>('/auth/me');
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        // Optional: Call backend logout if it invalidates tokens
    }
};
