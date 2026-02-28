import { create } from 'zustand';
import { api } from '../api/axios';

// Базовый интерфейс хостела
interface Hostel {
    id: number;
    name: string;
    address: string;
    description: string;
}

// НОВЫЕ ИНТЕРФЕЙСЫ для детальной страницы
interface Room {
    id: number;
    roomNumber: string;
    type: string;
    capacity: number;
}
interface HostelDetails extends Hostel {
    rooms: Room[];
}

// Обновленный интерфейс всего хранилища
interface HostelStore {
    hostels: Hostel[];
    loading: boolean;
    selectedHostel: HostelDetails | null;
    fetchHostels: () => Promise<void>;
    fetchHostelById: (id: string) => Promise<void>;
}

export const useHostelStore = create<HostelStore>((set) => ({
    hostels: [],
    loading: false,
    selectedHostel: null, // Новое состояние

    fetchHostels: async () => {
        set({ loading: true });
        try {
            const response = await api.get('/hostels');
            set({ hostels: response.data.content, loading: false });
        } catch (error) {
            console.error("Ошибка при загрузке хостелов", error);
            set({ loading: false });
        }
    },

    // Новая функция
    fetchHostelById: async (id: string) => {
        set({ loading: true, selectedHostel: null }); // Сбрасываем старые данные перед загрузкой
        try {
            const response = await api.get(`/hostels/${id}`);
            set({ selectedHostel: response.data, loading: false });
        } catch (error) {
            console.error(`Ошибка при загрузке хостела ${id}`, error);
            set({ loading: false });
        }
    },
}));