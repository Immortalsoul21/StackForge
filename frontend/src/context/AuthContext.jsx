import { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const checkUser = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    const data = await authService.getMe();
                    setUser(data.user);
                } catch (err) {
                    localStorage.removeItem('token');
                    setUser(null);
                }
            }
            setLoading(false);
        };

        checkUser();
    }, []);

    const loginUser = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            setUser(data.user);
            return data;
        } catch (err) {
            throw err.response?.data?.message || 'Login failed';
        }
    };

    const registerUser = async (userData) => {
        try {
            const data = await authService.register(userData);
            setUser(data.user);
            return data;
        } catch (err) {
            throw err.response?.data?.message || 'Registration failed';
        }
    };

    const logoutUser = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                error,
                loginUser,
                registerUser,
                logoutUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
