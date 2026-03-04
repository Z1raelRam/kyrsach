import { create } from 'zustand';
import { api } from '../api/axios';
import { toast } from 'react-hot-toast';

export interface AreaReservation {
    id: number;
    hostelName: string;
    areaName: string;
    startTime: string;
    endTime: string;
}

interface CommonAreaState {
    isAreaModalOpen: boolean;
    selectedAreaId: number | null;
    myAreaReservations: AreaReservation[];
    openAreaModal: (areaId: number) => void;
    closeAreaModal: () => void;
    reserveArea: (startTime: string, endTime: string) => Promise<boolean>;
    fetchMyAreaReservations: () => Promise<void>;
}

export const useCommonAreaStore = create<CommonAreaState>((set, get) => ({
    isAreaModalOpen: false,
    selectedAreaId: null,
    myAreaReservations:[],

    openAreaModal: (areaId) => set({ isAreaModalOpen: true, selectedAreaId: areaId }),
    closeAreaModal: () => set({ isAreaModalOpen: false, selectedAreaId: null }),

    reserveArea: async (startTime: string, endTime: string) => {
        const { selectedAreaId } = get();
        if (!selectedAreaId || !startTime || !endTime) {
            toast.error("Заполните время начала и окончания.");
            return false;
        }

        try {
            await api.post(`/common-areas/${selectedAreaId}/reserve`, { startTime, endTime });
            toast.success('Общая зона успешно забронирована!');
            set({ isAreaModalOpen: false, selectedAreaId: null });
            get().fetchMyAreaReservations(); // Обновляем список броней
            return true;
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || 'Не удалось забронировать зону.';
            toast.error(errorMsg);
            return false;
        }
    },

    fetchMyAreaReservations: async () => {
        try {
            const response = await api.get('/common-areas/my-reservations');
            set({ myAreaReservations: response.data });
        } catch (error) {
            console.error("Ошибка загрузки броней общих зон:", error);
        }
    }
}));