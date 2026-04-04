import { useEffect } from 'react';
import { useBookingStore } from '../store/bookingStore';
import { useCommonAreaStore } from '../store/commonAreaStore';
import Navbar from '../components/Navbar';

export default function MyBookings() {
    const { bookings, fetchMyBookings, cancelBooking } = useBookingStore();
    const { myAreaReservations, fetchMyAreaReservations, cancelAreaReservation } = useCommonAreaStore();

    useEffect(() => {
        fetchMyBookings();
        fetchMyAreaReservations();
    }, [fetchMyBookings, fetchMyAreaReservations]);

    // Умная функция для статуса ПРОЖИВАНИЯ
    const getBookingStatusInfo = (status: string, checkIn: string, checkOut: string) => {
        if (status === 'CANCELLED') return { text: 'Отменено', badge: 'bg-red-100 text-red-700', canCancel: false };

        const now = new Date();
        const inDate = new Date(checkIn);
        const outDate = new Date(checkOut);

        // Сравниваем только даты, игнорируя время
        inDate.setHours(0,0,0,0);
        outDate.setHours(23,59,59,999);
        now.setHours(0,0,0,0);

        if (now < inDate) {
            return { text: 'Ожидается', badge: 'bg-blue-100 text-blue-700', canCancel: true };
        }
        if (now >= inDate && now <= outDate) return { text: 'Вы проживаете', badge: 'bg-green-100 text-green-700', canCancel: false };
        return { text: 'Завершено', badge: 'bg-gray-100 text-gray-700', canCancel: false };
    };

    // Умная функция для статуса ОБЩЕЙ ЗОНЫ
    const getAreaStatusInfo = (status: string, start: string, end: string) => {
        if (status === 'CANCELLED') return { text: 'Отменено', badge: 'bg-red-100 text-red-700', canCancel: false };

        const now = new Date();
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (now < startDate) {
            const hoursDiff = (startDate.getTime() - now.getTime()) / (1000 * 60 * 60);
            return { text: 'Ожидается', badge: 'bg-purple-100 text-purple-700', canCancel: hoursDiff > 2 };
        }
        if (now >= startDate && now <= endDate) return { text: 'Используется сейчас', badge: 'bg-green-100 text-green-700', canCancel: false };
        return { text: 'Завершено', badge: 'bg-gray-100 text-gray-700', canCancel: false };
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Navbar />
            <div className="max-w-6xl mx-auto px-4 mt-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Мои бронирования</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* КОЛОНКА 1: ПРОЖИВАНИЕ */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">🛏️ Проживание</h2>
                        <div className="space-y-5">
                            {bookings.length > 0 ? (
                                bookings.map(b => {
                                    const info = getBookingStatusInfo(b.status, b.checkInDate, b.checkOutDate);
                                    return (
                                        <div key={b.bookingId} className={`bg-white p-6 rounded-2xl border shadow-sm transition-all ${b.status === 'CANCELLED' ? 'opacity-60 grayscale' : 'hover:shadow-md'}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${info.badge}`}>
                                                    {info.text}
                                                </span>
                                                {info.canCancel && (
                                                    <button onClick={() => window.confirm('Отменить бронирование кровати?') && cancelBooking(b.bookingId)} className="text-red-500 text-sm font-medium hover:text-red-700 hover:underline">
                                                        Отменить бронь
                                                    </button>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-xl text-gray-900">{b.hostelName}</h3>
                                            <p className="text-gray-600 mt-1">Комната {b.roomNumber}, Место {b.bedNumber}</p>
                                            <div className="mt-4 flex gap-6 text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
                                                <div><span className="block text-gray-500 text-xs uppercase mb-1">Заезд</span><span className="font-semibold">{b.checkInDate}</span></div>
                                                <div><span className="block text-gray-500 text-xs uppercase mb-1">Выезд</span><span className="font-semibold">{b.checkOutDate}</span></div>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : <p className="text-gray-500">У вас нет бронирований номеров.</p>}
                        </div>
                    </div>

                    {/* КОЛОНКА 2: ОБЩИЕ ЗОНЫ */}
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">🎯 Общие зоны</h2>
                        <div className="space-y-5">
                            {myAreaReservations.length > 0 ? (
                                myAreaReservations.map(res => {
                                    const info = getAreaStatusInfo(res.status, res.startTime, res.endTime);
                                    return (
                                        <div key={res.id} className={`bg-white p-6 rounded-2xl border shadow-sm transition-all ${res.status === 'CANCELLED' ? 'opacity-60 grayscale' : 'hover:shadow-md'}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${info.badge}`}>
                                                    {info.text}
                                                </span>
                                                {info.canCancel && (
                                                    <button onClick={() => window.confirm('Освободить общую зону?') && cancelAreaReservation(res.id)} className="text-red-500 text-sm font-medium hover:text-red-700 hover:underline">
                                                        Отменить бронь
                                                    </button>
                                                )}
                                            </div>
                                            <h3 className="font-bold text-xl text-gray-900">{res.areaName}</h3>
                                            <p className="text-gray-600 mt-1">{res.hostelName}</p>
                                            <div className="mt-4 text-sm text-gray-700 bg-purple-50/50 border border-purple-100 p-3 rounded-lg">
                                                <p><span className="text-gray-500 mr-2">Дата:</span><span className="font-semibold">{new Date(res.startTime).toLocaleDateString('ru-RU')}</span></p>
                                                <p className="mt-1"><span className="text-gray-500 mr-2">Время:</span><span className="font-semibold">{res.startTime.slice(11, 16)} — {res.endTime.slice(11, 16)}</span></p>
                                                {/* ВЫВОДИМ КОЛИЧЕСТВО ЛЮДЕЙ */}
                                                <p className="mt-1"><span className="text-gray-500 mr-2">Людей:</span><span className="font-semibold">{res.participants}</span></p>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : <p className="text-gray-500">У вас нет забронированных общих зон.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}