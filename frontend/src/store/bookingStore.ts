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

// Новый интерфейс для занятых дат
interface BookedRange {
    from: Date;
    to: Date;
}

interface BookingState {
    isModalOpen: boolean;
    selectedBedId: number | null;
    checkInDate: Date | undefined;
    checkOutDate: Date | undefined;
    bookings: BookingDetails[];
    bookedDates: BookedRange[]; // Состояние для занятых дат
    openModal: (bedId: number) => void;
    closeModal: () => void;
    setDates: (dates: { checkIn: Date | undefined, checkOut: Date | undefined }) => void;
    createBooking: () => Promise<boolean>;
    fetchMyBookings: () => Promise<void>;
    cancelBooking: (id: number) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
    isModalOpen: false,
    selectedBedId: null,
    checkInDate: undefined,
    checkOutDate: undefined,
    bookings: [],
    bookedDates:[],

    // Обновленный openModal - теперь он грузит занятые даты
    openModal: async (bedId) => {
        set({ isModalOpen: true, selectedBedId: bedId, checkInDate: undefined, checkOutDate: undefined, bookedDates:[] });
        try {
            const response = await api.get(`/bookings/beds/${bedId}/booked-dates`);
            const dates = response.data.map((r: any) => ({
                from: new Date(r.from),
                to: new Date(r.to)
            }));
            set({ bookedDates: dates });
        } catch (error) {
            console.error("Не удалось загрузить занятые даты", error);
        }
    },

    closeModal: () => set({ isModalOpen: false, selectedBedId: null }),
    setDates: (dates) => set({ checkInDate: dates.checkIn, checkOutDate: dates.checkOut }),

    createBooking: async () => {
        const { selectedBedId, checkInDate, checkOutDate } = get();
        if (!selectedBedId || !checkInDate || !checkOutDate) {
            toast.error("Пожалуйста, выберите койко-место и корректные даты.");
            return false;
        }

        try {
            await api.post('/bookings', { bedId: selectedBedId, checkInDate, checkOutDate });
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

    cancelBooking: async (id: number) => {
        try {
            await api.patch(`/bookings/${id}/cancel`); // Теперь PATCH разрешен в CORS!
            toast.success('Бронирование отменено');
            get().fetchMyBookings();
        } catch (error: any) {
            const errorMsg = error.response?.data?.error || 'Не удалось отменить бронирование.';
            toast.error(errorMsg);
        }
    }
}));