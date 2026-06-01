import {
    createContext,
    useContext,
    useEffect,
    useState,
    type ReactNode,
} from "react";
import {
    clearStoredToken,
    getStoredToken,
    saveToken,
} from "../utils/authStorage";
import {
    getMeRequest,
    loginRequest,
    logoutRequest,
    registerRequest,
} from "../services/authService";
import type {
    AuthUser,
    LoginRequest,
    RegisterRequest,
} from "../types/auth";

type AuthContextValue = {
    user: AuthUser | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (payload: LoginRequest, rememberMe?: boolean) => Promise<void>;
    register: (payload: RegisterRequest, rememberMe?: boolean) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);
    const [token, setToken] = useState<string | null>(() => getStoredToken());
    const [isLoading, setIsLoading] = useState(Boolean(getStoredToken()));

    useEffect(() => {
        let isMounted = true;

        async function loadCurrentUser() {
            const storedToken = getStoredToken();

            if (!storedToken) {
                setIsLoading(false);
                return;
            }

            try {
                const data = await getMeRequest();

                if (!isMounted) return;

                setUser(data.user);
                setToken(storedToken);
            } catch {
                clearStoredToken();

                if (!isMounted) return;

                setUser(null);
                setToken(null);
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadCurrentUser();

        return () => {
            isMounted = false;
        };
    }, []);

    async function login(payload: LoginRequest, rememberMe = true) {
        const data = await loginRequest(payload);

        saveToken(data.token, rememberMe);
        setToken(data.token);
        setUser(data.user);
    }

    async function register(payload: RegisterRequest, rememberMe = true) {
        const data = await registerRequest(payload);

        saveToken(data.token, rememberMe);
        setToken(data.token);
        setUser(data.user);
    }

    async function logout() {
        try {
            await logoutRequest();
        } catch {
            // Even if the backend logout request fails, clear the frontend session.
        } finally {
            clearStoredToken();
            setToken(null);
            setUser(null);
        }
    }

    const value: AuthContextValue = {
        user,
        token,
        isAuthenticated: Boolean(token && user),
        isLoading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuthContext must be used inside AuthProvider");
    }

    return context;
}