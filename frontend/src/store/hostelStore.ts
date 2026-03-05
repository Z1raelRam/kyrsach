import { create } from 'zustand';
import { api } from '../api/axios';
import { toast } from 'react-hot-toast';

interface Hostel {
    id: number;
    name: string;
    address: string;
    description: string;
}

interface Bed { id: number; bedNumber: string; }
interface Room { id: number; roomNumber: string; type: string; capacity: number; beds: Bed[]; }

export interface CommonArea {
    id: number;
    name: string;
    capacity: number;
}

interface HostelDetails extends Hostel {
    rooms: Room[];
}

interface HostelStore {
    hostels: Hostel[];
    loading: boolean;
    selectedHostel: HostelDetails | null;
    commonAreas: CommonArea[];
    fetchHostels: () => Promise<void>;
    fetchHostelById: (id: string) => Promise<void>;
    fetchCommonAreas: (hostelId: string) => Promise<void>;
    createHostel: (data: { name: string; address: string; description: string }) => Promise<boolean>; // НОВАЯ ФУНКЦИЯ
}

export const useHostelStore = create<HostelStore>((set, get) => ({
    hostels:[],
    loading: false,
    selectedHostel: null,
    commonAreas:[],

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

    fetchHostelById: async (id: string) => {
        set({ loading: true, selectedHostel: null, commonAreas:[] });
        try {
            const response = await api.get(`/hostels/${id}`);
            set({ selectedHostel: response.data, loading: false });
        } catch (error) {
            console.error(`Ошибка при загрузке хостела ${id}`, error);
            set({ loading: false });
        }
    },

    fetchCommonAreas: async (hostelId: string) => {
        try {
            const response = await api.get(`/hostels/${hostelId}/common-areas`);
            set({ commonAreas: response.data });
        } catch (error) {
            console.error("Ошибка при загрузке общих зон:", error);
        }
    },

    // РЕАЛИЗАЦИЯ СОЗДАНИЯ ХОСТЕЛА
    createHostel: async (data) => {
        try {
            await api.post('/hostels', data);
            toast.success('Хостел успешно добавлен!');
            get().fetchHostels(); // Обновляем список, чтобы новый хостел сразу появился
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Ошибка при создании хостела');
            return false;
        }
    }
}));