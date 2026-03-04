import { create } from 'zustand';
import { api } from '../api/axios';
import { toast } from 'react-hot-toast';

interface BookingDetails {
    bookingId: number;
    checkInDate: string;
    checkOutDate: string;
    status: string;
    hostelName: string;
    roomNumber: string;
    bedNumber: string;
}

interface BookingState {
    isModalOpen: boolean;
    selectedBedId: number | null;
    checkInDate: Date | undefined;
    checkOutDate: Date | undefined;
    bookings: BookingDetails[];
    openModal: (bedId: number) => void;
    closeModal: () => void;
    setDates: (dates: { checkIn: Date | undefined, checkOut: Date | undefined }) => void;
    createBooking: () => Promise<boolean>;
    fetchMyBookings: () => Promise<void>;
    cancelBooking: (id: number) => Promise<void>; // Новая функция
}

export const useBookingStore = create<BookingState>((set, get) => ({
    isModalOpen: false,
    selectedBedId: null,
    checkInDate: undefined,
    checkOutDate: undefined,
    bookings:[],

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
            set({ isModalOpen: false, selectedBedId: null, checkInDate: undefined, checkOutDate: undefined });
            get().fetchMyBookings();
            return true;
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || 'Не удалось забронировать место.';
            toast.error(errorMsg);
            return false;
        }
    },

    fetchMyBookings: async () => {
        try {
            const response = await api.get('/bookings/my-bookings');
            set({ bookings: response.data });
        } catch (error) {
            console.error("Ошибка при загрузке моих бронирований:", error);
        }
    },

    // НОВАЯ ФУНКЦИЯ
    cancelBooking: async (id: number) => {
        try {
            await api.patch(`/bookings/${id}/cancel`);
            toast.success('Бронирование отменено');
            get().fetchMyBookings(); // Обновляем список, чтобы статус изменился
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || 'Не удалось отменить бронирование.';
            toast.error(errorMsg);
        }
    }
}));