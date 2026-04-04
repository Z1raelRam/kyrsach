import { create } from 'zustand';
import { api } from '../api/axios';
import { toast } from 'react-hot-toast';

export interface AreaReservation {
    id: number;
    hostelName: string;
    areaName: string;
    startTime: string;
    endTime: string;
    status: string;
    participants: number;
}
export interface BookedSlot { start: string; end: string; participants: number; }

interface CommonAreaState {
    isAreaModalOpen: boolean;
    selectedAreaId: number | null;
    myAreaReservations: AreaReservation[];
    bookedSlots: BookedSlot[];
    openAreaModal: (areaId: number) => void;
    closeAreaModal: () => void;
    reserveArea: (startTime: string, endTime: string, participants: number) => Promise<boolean>;
    fetchMyAreaReservations: () => Promise<void>;
    cancelAreaReservation: (id: number) => Promise<void>; // <-- ДОБАВИЛИ ЭТУ СТРОЧКУ
}

export const useCommonAreaStore = create<CommonAreaState>((set, get) => ({
    isAreaModalOpen: false,
    selectedAreaId: null,
    myAreaReservations: [],
    bookedSlots: [],

    openAreaModal: async (areaId) => {
        set({ isAreaModalOpen: true, selectedAreaId: areaId, bookedSlots: [] });
        try {
            const response = await api.get(`/common-areas/${areaId}/booked-slots`);
            set({ bookedSlots: response.data });
        } catch (e) { console.error(e); }
    },

    closeAreaModal: () => set({ isAreaModalOpen: false, selectedAreaId: null }),

    reserveArea: async (startTime, endTime, participants) => {
        const { selectedAreaId } = get();
        if (!selectedAreaId || !startTime || !endTime) return false;
        try {
            await api.post(`/common-areas/${selectedAreaId}/reserve`, { startTime, endTime, participants });
            toast.success('Общая зона успешно забронирована!');
            set({ isAreaModalOpen: false, selectedAreaId: null });
            get().fetchMyAreaReservations();
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Не удалось забронировать зону.');
            return false;
        }
    },

    fetchMyAreaReservations: async () => {
        try {
            const response = await api.get('/common-areas/my-reservations');
            set({ myAreaReservations: response.data });
        } catch (error) { console.error(error); }
    },

    // РЕАЛИЗАЦИЯ ОТМЕНЫ
    cancelAreaReservation: async (id: number) => {
        try {
            await api.patch(`/common-areas/reservations/${id}/cancel`);
            toast.success('Бронь зоны отменена');
            get().fetchMyAreaReservations(); // Обновляем список
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || 'Ошибка при отмене.';
            toast.error(errorMsg);
        }
    }
}));