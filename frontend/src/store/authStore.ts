import { create } from 'zustand';

interface AuthState {
    token: string | null;
    role: string | null; // НОВОЕ ПОЛЕ
    isAuthenticated: boolean;
    login: (token: string, role: string) => void; // Обновили сигнатуру
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    token: localStorage.getItem('jwt_token'),
    role: localStorage.getItem('user_role'), // Читаем роль из памяти
    isAuthenticated: !!localStorage.getItem('jwt_token'),

    login: (token: string, role: string) => {
        localStorage.setItem('jwt_token', token);
        localStorage.setItem('user_role', role); // Сохраняем роль
        set({ token, role, isAuthenticated: true });
    },

    logout: () => {
        localStorage.removeItem('jwt_token');
        localStorage.removeItem('user_role');
        set({ token: null, role: null, isAuthenticated: false });
    },
}));