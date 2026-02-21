import { createContext, useState, useEffect } from 'react';

// 1️⃣ Create the Context
export const AuthContext = createContext();

// 2️⃣ Create the Provider Component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔄 On initial load, check if we already have a user saved
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    // 🟢 Login Function (Called by the Login.jsx page after a successful API call)
    const login = (userData, tokens) => {
        // Save to LocalStorage so it survives page refreshes
        localStorage.setItem('access_token', tokens.access);
        localStorage.setItem('refresh_token', tokens.refresh);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update React State
        setUser(userData);
    };

    // 🔴 Logout Function (Called by the Navbar or interceptor when tokens die)
    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        
        setUser(null);
        window.location.href = '/login'; // Redirect to login page
    };

    return (
        // Broadcast the state and functions to the rest of the app
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {/* We only render the app once we finish checking LocalStorage */}
            {!loading && children} 
        </AuthContext.Provider>
    );
};