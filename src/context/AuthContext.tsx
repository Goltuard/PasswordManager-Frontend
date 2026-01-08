import React, { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
    isAuthenticated: boolean;
    login: (password: string) => boolean;
    logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MASTER_PASSWORD_KEY = "pm_master_password";
const AUTH_FLAG_KEY = "pm_is_authenticated";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const flag = localStorage.getItem(AUTH_FLAG_KEY);
        if (flag === "true") setIsAuthenticated(true);
    }, []);

    const login = (password: string) => {
        const stored = localStorage.getItem(MASTER_PASSWORD_KEY);
        if (!stored) {
            localStorage.setItem(MASTER_PASSWORD_KEY, password);
            localStorage.setItem(AUTH_FLAG_KEY, "true");
            setIsAuthenticated(true);
            return true;
        }
        if (stored === password) {
            localStorage.setItem(AUTH_FLAG_KEY, "true");
            setIsAuthenticated(true);
            return true;
        }
        return false;
    };

    const logout = () => {
        localStorage.setItem(AUTH_FLAG_KEY, "false");
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
};
