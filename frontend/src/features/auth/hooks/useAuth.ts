"use client";

import Cookies from 'js-cookie';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthState } from '../types';
import { authService, LoginCredentials, RegisterCredentials } from '../services/auth.service';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface AuthContextType extends AuthState {
    login: (credentials: LoginCredentials) => Promise<void>;
    register: (data: RegisterCredentials) => Promise<void>;
    logout: () => void;
    checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    });
    const router = useRouter();

    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setState({ user: null, isAuthenticated: false, isLoading: false });
            return;
        }

        try {
            const response = await authService.getMe();
            if (response.success && response.data.user) {
                setState({
                    user: response.data.user,
                    isAuthenticated: true,
                    isLoading: false,
                });
            } else {
                throw new Error("Failed to fetch user");
            }
        } catch (error) {
            console.error(error);
            localStorage.removeItem('token');
            setState({ user: null, isAuthenticated: false, isLoading: false });
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            const response = await authService.login(credentials);
            if (response.success) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                Cookies.set('token', token, { expires: 7 }); // Sync for middleware

                setState({
                    user: response.data.user,
                    isAuthenticated: true,
                    isLoading: false,
                });
                toast.success("Welcome back!");

                // Redirect based on role
                const role = response.data.user.role;
                if (role === 'ADMIN') router.push('/admin');
                else if (role === 'TUTOR') router.push('/tutor/dashboard');
                else router.push('/dashboard');
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Login failed";
            toast.error(msg);
            throw error;
        }
    };

    const register = async (data: RegisterCredentials) => {
        try {
            const response = await authService.register(data);
            if (response.success) {
                const token = response.data.token;
                localStorage.setItem('token', token);
                Cookies.set('token', token, { expires: 7 });

                setState({
                    user: response.data.user,
                    isAuthenticated: true,
                    isLoading: false,
                });
                toast.success("Account created successfully!");

                const role = response.data.user.role;
                if (role === 'TUTOR') router.push('/tutor/dashboard');
                else router.push('/dashboard');
            }
        } catch (error: any) {
            const msg = error.response?.data?.message || "Registration failed";
            toast.error(msg);
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
        <AuthContext.Provider value= {{ ...state, login, register, logout, checkAuth }
}>
    { children }
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
