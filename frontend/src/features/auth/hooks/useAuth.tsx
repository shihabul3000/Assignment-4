"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";
import { AuthState } from "../types";
import { LoginCredentials, RegisterCredentials } from "../services/auth.service";
import toast from "react-hot-toast";

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (credentials: RegisterCredentials) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });

    const checkAuth = async () => {
        try {
            const token = Cookies.get('token') || localStorage.getItem('token');
            if (!token) {
                setState({ user: null, isAuthenticated: false, isLoading: false });
                return;
            }

            // Sync tokens
            if (!Cookies.get('token') && localStorage.getItem('token')) {
                Cookies.set('token', localStorage.getItem('token')!);
            }

            const response = await authService.getMe();
            setState({ user: response.data.user, isAuthenticated: true, isLoading: false });
        } catch {
            setState({ user: null, isAuthenticated: false, isLoading: false });
            Cookies.remove('token');
            localStorage.removeItem('token');
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authService.login(credentials);
            const { user, token } = response.data;
            Cookies.set('token', token);
            localStorage.setItem('token', token);
            setState({ user, isAuthenticated: true, isLoading: false });
            toast.success(`Welcome back, ${user.name}!`);

            // Redirect based on role
            if (user.role === 'ADMIN') router.push('/admin');
            else if (user.role === 'TUTOR') router.push('/tutor/dashboard');
            else router.push('/dashboard');

        } catch (error: unknown) {
            const msg = error instanceof Error && 'response' in error
                ? ((error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message)
                : "Login failed";
            toast.error(msg || "Login failed");
            throw error;
        }
    };

    const register = async (credentials: RegisterCredentials) => {
        try {
            const response = await authService.register(credentials);
            const { user, token } = response.data;

            Cookies.set('token', token);
            localStorage.setItem('token', token);
            setState({ user, isAuthenticated: true, isLoading: false });
            toast.success("Account created successfully!");

            if (user.role === 'TUTOR') {
                // Maybe redirect to some onboarding or profile setup?
                // For now, dashboard
                router.push('/tutor/dashboard');
            } else {
                // Student
                if (user.role === 'ADMIN') router.push('/admin'); // unlikely via register form usually
                else router.push('/dashboard');
            }
        } catch (error: unknown) {
            const msg = error instanceof Error && 'response' in error
                ? ((error as { response?: { data?: { error?: { message?: string } } } }).response?.data?.error?.message)
                : "Registration failed";
            toast.error(msg || "Registration failed");
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        Cookies.remove('token'); // Clear cookie
        // State clear handled in authService.logout() if needed or just here
        setState({ user: null, isAuthenticated: false, isLoading: false });
        toast.success("Logged out");
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ ...state, login, register, logout, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
