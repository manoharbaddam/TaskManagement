import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children })=>{
    const [user, setUser]  = useState(null);
    const [loading, setLoading] = useState(true);

    // 🔄 On initial load, check if we already have a user saved
    useEffect(()=>{
        const storedUser = localStorage.getItem('user');
        if(storedUser){
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);       
    }, []);

    // 🟢 Login Function (Called by the Login.jsx page after a successful API call)
    const login = (userData, tokens) =>{
        // Save to LocalStorage so it survives page refreshes
        localStorage.setItem('accesstoken', tokens.access);
        localStorage.setItem('refreshtoken', tokens.refresh);
        localStorage.setItem('user',JSON.stringify(userData));

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
        <AuthContext.Provider value={{ user, loading, login, logout }}>  
            {/* We only render the app once we finish checking LocalStorage */}
            {!loading && children}
        </AuthContext.Provider> 
    );
   
};