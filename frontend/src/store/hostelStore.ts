import { create } from 'zustand';
import { api } from '../api/axios';

interface Hostel {
    id: number;
    name: string;
    address: string;
    description: string;
}

interface Bed { id: number; bedNumber: string; }
interface Room { id: number; roomNumber: string; type: string; capacity: number; beds: Bed[]; }

// НОВЫЙ ИНТЕРФЕЙС
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
    commonAreas: CommonArea[]; // НОВОЕ ПОЛЕ
    fetchHostels: () => Promise<void>;
    fetchHostelById: (id: string) => Promise<void>;
    fetchCommonAreas: (hostelId: string) => Promise<void>; // НОВАЯ ФУНКЦИЯ
}

export const useHostelStore = create<HostelStore>((set) => ({
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
    }
}));