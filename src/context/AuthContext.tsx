import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    authFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
};

const AuthContext = createContext<AuthContextType>({
    token: null,
    isAuthenticated: false,
    loading: true,
    login: async () => {},
    logout: () => {},
    authFetch: (input, init) => fetch(input, init),
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const saved = localStorage.getItem("accessToken");
        if (saved) setToken(saved);
        setLoading(false); // finito il controllo
    }, []);

    const login = async (email: string, password: string) => {
        const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
        });
        if (!res.ok) throw new Error("Login failed");
        const data = await res.json();
        localStorage.setItem("accessToken", data.accessToken);
        setToken(data.accessToken);
        navigate("/", { replace: true });
    };

    const logout = () => {
        fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
        localStorage.removeItem("accessToken");
        setToken(null);
        navigate("/signin", { replace: true });
    };

    const authFetch: AuthContextType["authFetch"] = async (input, init) => {
        const headers = new Headers(init?.headers || {});
        if (token) headers.set("Authorization", `Bearer ${token}`);
        let res = await fetch(input, { ...init, headers, credentials: "include" });
        if (res.status === 401) {
            const r = await fetch("/api/auth/refresh", { method: "POST", credentials: "include" });
            if (r.ok) {
                const j = await r.json();
                localStorage.setItem("accessToken", j.accessToken);
                setToken(j.accessToken);
                const h2 = new Headers(init?.headers || {});
                h2.set("Authorization", `Bearer ${j.accessToken}`);
                res = await fetch(input, { ...init, headers: h2, credentials: "include" });
            } else {
                logout();
            }
        }
        return res;
    };

    return (
        <AuthContext.Provider
            value={{ token, isAuthenticated: !!token, loading, login, logout, authFetch }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
