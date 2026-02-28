import { create } from 'zustand';
import { api } from '../api/axios';
import { toast } from 'react-hot-toast'; // Мы установим это позже

interface BookingState {
    isModalOpen: boolean;
    selectedBedId: number | null;
    checkInDate: Date | undefined;
    checkOutDate: Date | undefined;
    openModal: (bedId: number) => void;
    closeModal: () => void;
    setDates: (dates: { checkIn: Date | undefined, checkOut: Date | undefined }) => void;
    createBooking: () => Promise<boolean>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
    isModalOpen: false,
    selectedBedId: null,
    checkInDate: undefined,
    checkOutDate: undefined,

    openModal: (bedId) => set({ isModalOpen: true, selectedBedId: bedId, checkInDate: new Date(), checkOutDate: undefined }),
    closeModal: () => set({ isModalOpen: false, selectedBedId: null }),
    setDates: (dates) => set({ checkInDate: dates.checkIn, checkOutDate: dates.checkOut }),

    createBooking: async () => {
        const { selectedBedId, checkInDate, checkOutDate } = get();
        if (!selectedBedId || !checkInDate || !checkOutDate) {
            toast.error("Пожалуйста, выберите койко-место и даты.");
            return false;
        }

        try {
            await api.post('/bookings', {
                bedId: selectedBedId,
                checkInDate,
                checkOutDate,
            });
            toast.success('Место успешно забронировано!');
            set({ isModalOpen: false, selectedBedId: null });
            return true;
        } catch (error) {
            console.error("Ошибка бронирования:", error);
            toast.error('Не удалось забронировать место.');
            return false;
        }
    },
}));