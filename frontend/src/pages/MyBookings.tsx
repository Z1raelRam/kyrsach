import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useBookingStore } from '../store/bookingStore';
import { useCommonAreaStore } from '../store/commonAreaStore';

export default function MyBookings() {
    const { bookings, fetchMyBookings, cancelBooking } = useBookingStore();
    const { myAreaReservations, fetchMyAreaReservations } = useCommonAreaStore();

    useEffect(() => {
        fetchMyBookings();
        fetchMyAreaReservations();
    }, [fetchMyBookings, fetchMyAreaReservations]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-800">Мои бронирования</h1>
                    <Link to="/" className="text-blue-600 hover:underline font-medium">На главную</Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* КОЛОНКА 1: ПРОЖИВАНИЕ */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Проживание (Койко-места)</h2>
                        <div className="space-y-4">
                            {bookings.length > 0 ? (
                                bookings.map(booking => (
                                    <div key={booking.bookingId} className={`p-4 rounded-lg shadow-sm border-l-4 bg-white ${booking.status === 'CONFIRMED' ? 'border-green-500' : 'border-gray-400 opacity-70'}`}>
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-bold text-lg">{booking.hostelName}</h3>
                                                <p className="text-gray-600">Комната {booking.roomNumber}, Место {booking.bedNumber}</p>
                                                <p className="text-sm mt-2">Заезд: <span className="font-medium">{booking.checkInDate}</span></p>
                                                <p className="text-sm">Выезд: <span className="font-medium">{booking.checkOutDate}</span></p>
                                            </div>
                                            {booking.status === 'CONFIRMED' ? (
                                                <button onClick={() => window.confirm('Отменить бронь?') && cancelBooking(booking.bookingId)} className="text-red-500 text-sm hover:underline">Отменить</button>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-500 uppercase">Отменено</span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : <p className="text-gray-500">Нет бронирований проживания.</p>}
                        </div>
                    </div>

                    {/* КОЛОНКА 2: ОБЩИЕ ЗОНЫ */}
                    <div>
                        <h2 className="text-xl font-bold text-gray-700 mb-4 border-b pb-2">Общие зоны</h2>
                        <div className="space-y-4">
                            {myAreaReservations.length > 0 ? (
                                myAreaReservations.map(res => (
                                    <div key={res.id} className="p-4 rounded-lg shadow-sm border-l-4 bg-white border-purple-500">
                                        <h3 className="font-bold text-lg text-purple-700">{res.areaName}</h3>
                                        <p className="text-gray-600 text-sm mb-2">{res.hostelName}</p>
                                        <p className="text-sm">С: <span className="font-medium">{new Date(res.startTime).toLocaleString('ru-RU')}</span></p>
                                        <p className="text-sm">По: <span className="font-medium">{new Date(res.endTime).toLocaleString('ru-RU')}</span></p>
                                    </div>
                                ))
                            ) : <p className="text-gray-500">Нет забронированных общих зон.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}