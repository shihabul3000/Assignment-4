export type UserRole = 'STUDENT' | 'TUTOR' | 'ADMIN';

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    image?: string;
}

export interface LoginResponse {
    success: boolean;
    data: {
        user: User;
        token: string;
    };
    message?: string;
}

export interface RegisterResponse {
    success: boolean;
    data: {
        user: User;
        token: string;
    };
    message?: string;
}

export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
}
