import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBookingStore } from '../store/bookingStore';

export default function MyBookings() {
    const { bookings, fetchMyBookings, cancelBooking } = useBookingStore();

    useEffect(() => {
        fetchMyBookings();
    },[fetchMyBookings]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Мои бронирования</h1>
                    <Link to="/" className="text-blue-500 hover:underline">На главную</Link>
                </div>

                <div className="space-y-4">
                    {bookings.length > 0 ? (
                        bookings.map(booking => (
                            <div key={booking.bookingId} className={`p-4 rounded-lg shadow-md border-l-4 ${booking.status === 'CONFIRMED' ? 'bg-white border-green-500' : 'bg-gray-50 border-red-500 text-gray-500'}`}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h2 className="font-bold text-lg">{booking.hostelName}</h2>
                                        <p>Комната №{booking.roomNumber}, Место №{booking.bedNumber}</p>
                                        <p className="mt-2">Даты: <strong>{booking.checkInDate}</strong> &mdash; <strong>{booking.checkOutDate}</strong></p>
                                        <p className="mt-1">Статус: <span className={`font-semibold ${booking.status === 'CONFIRMED' ? 'text-green-600' : 'text-red-500'}`}>
                                            {booking.status === 'CONFIRMED' ? 'Активно' : 'Отменено'}
                                        </span></p>
                                    </div>

                                    {/* Показываем кнопку отмены только для активных броней */}
                                    {booking.status === 'CONFIRMED' && (
                                        <button
                                            onClick={() => {
                                                if (window.confirm('Вы уверены, что хотите отменить бронирование?')) {
                                                    cancelBooking(booking.bookingId);
                                                }
                                            }}
                                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
                                        >
                                            Отменить
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-white p-8 rounded-lg shadow text-center">
                            <p className="text-gray-500 mb-4">У вас пока нет бронирований.</p>
                            <Link to="/" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">Перейти к поиску</Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}