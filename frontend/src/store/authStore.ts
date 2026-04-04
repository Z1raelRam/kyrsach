import { create } from 'zustand';

interface AuthState {
    token: string | null;
    role: string | null;
    isAuthenticated: boolean;
    login: (token: string, role: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    // Используем localStorage, чтобы сессия жила при закрытии вкладки
    token: localStorage.getItem('jwt_token'),
    role: localStorage.getItem('user_role'),
    isAuthenticated: !!localStorage.getItem('jwt_token'),

    login: (token: string, role: string) => {
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user_role', role);
        set({ token, role, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_role');
        set({ token: null, role: null, isAuthenticated: false });
    },
}));