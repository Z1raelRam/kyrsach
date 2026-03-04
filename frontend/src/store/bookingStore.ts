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

interface BookedRange { from: Date; to: Date; }

interface BookingState {
    isModalOpen: boolean;
    selectedBedId: number | null;
    checkInDate: Date | undefined;
    checkOutDate: Date | undefined;
    bookings: BookingDetails[];
    adminBookings: BookingDetails[]; // НОВОЕ ПОЛЕ ДЛЯ АДМИНА
    bookedDates: BookedRange[];
    openModal: (bedId: number) => void;
    closeModal: () => void;
    setDates: (dates: { checkIn: Date | undefined, checkOut: Date | undefined }) => void;
    createBooking: () => Promise<boolean>;
    fetchMyBookings: () => Promise<void>;
    fetchAllBookings: () => Promise<void>; // НОВАЯ ФУНКЦИЯ ДЛЯ АДМИНА
    cancelBooking: (id: number, isAdmin?: boolean) => Promise<void>; // Обновили сигнатуру
}

export const useBookingStore = create<BookingState>((set, get) => ({
    isModalOpen: false,
    selectedBedId: null,
    checkInDate: undefined,
    checkOutDate: undefined,
    bookings: [],
    adminBookings: [], // Инициализация
    bookedDates:[],

    openModal: async (bedId) => {
        set({ isModalOpen: true, selectedBedId: bedId, checkInDate: undefined, checkOutDate: undefined, bookedDates:[] });
        try {
            const response = await api.get(`/bookings/beds/${bedId}/booked-dates`);
            const dates = response.data.map((r: any) => ({ from: new Date(r.from), to: new Date(r.to) }));
            set({ bookedDates: dates });
        } catch (error) { console.error("Ошибка загрузки дат", error); }
    },

    closeModal: () => set({ isModalOpen: false, selectedBedId: null }),
    setDates: (dates) => set({ checkInDate: dates.checkIn, checkOutDate: dates.checkOut }),

    createBooking: async () => {
        const { selectedBedId, checkInDate, checkOutDate } = get();
        if (!selectedBedId || !checkInDate || !checkOutDate) return false;
        try {
            await api.post('/bookings', { bedId: selectedBedId, checkInDate, checkOutDate });
            toast.success('Место забронировано!');
            set({ isModalOpen: false, selectedBedId: null, checkInDate: undefined, checkOutDate: undefined });
            get().fetchMyBookings();
            return true;
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Ошибка');
            return false;
        }
    },

    fetchMyBookings: async () => {
        try {
            const response = await api.get('/bookings/my-bookings');
            set({ bookings: response.data });
        } catch (error) { console.error("Ошибка", error); }
    },

    // НОВАЯ ФУНКЦИЯ ДЛЯ АДМИНА
    fetchAllBookings: async () => {
        try {
            const response = await api.get('/bookings/all');
            set({ adminBookings: response.data });
        } catch (error) { console.error("Ошибка", error); }
    },

    // Обновленная функция отмены (может обновлять разные списки)
    cancelBooking: async (id: number, isAdmin = false) => {
        try {
            await api.patch(`/bookings/${id}/cancel`);
            toast.success('Бронирование отменено');
            if (isAdmin) {
                get().fetchAllBookings(); // Обновляем админскую таблицу
            } else {
                get().fetchMyBookings(); // Обновляем личный кабинет гостя
            }
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Ошибка');
        }
    }
}));