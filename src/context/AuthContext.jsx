import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for existing session
        const savedUser = localStorage.getItem('dti_admin_user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        // Simple mock authentication
        if (email === 'admin@digitaltoinfinity.com' && password === 'admin123') {
            const userData = { email, role: 'admin', name: 'DTI Admin' };
            setUser(userData);
            localStorage.setItem('dti_admin_user', JSON.stringify(userData));
            return userData;
        } else {
            throw new Error('Invalid email or password');
        }
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('dti_admin_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

