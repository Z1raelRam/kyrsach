import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// Создаем базовый инстанс Axios
export const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
});

// Добавляем Interceptor (перехватчик)
api.interceptors.request.use((config) => {
    // Достаем токен из нашего Zustand хранилища
    const token = useAuthStore.getState().token;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});