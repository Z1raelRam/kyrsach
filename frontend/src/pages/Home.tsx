import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useHostelStore } from '../store/hostelStore';

export default function Home() {
    const { hostels, loading, fetchHostels } = useHostelStore();
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        fetchHostels();
    }, [fetchHostels]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                {/* Шапка главной страницы */}
                <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
                    <h1 className="text-3xl font-bold text-gray-800">Доступные хостелы</h1>
                    <div className="flex items-center gap-6">
                        <Link to="/my-bookings" className="text-blue-600 hover:underline font-medium">
                            Мои бронирования
                        </Link>
                        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors">
                            Выйти
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p className="text-center text-gray-500">Загрузка данных...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {hostels.map((hostel) => (
                            <Link to={`/hostels/${hostel.id}`} key={hostel.id} className="bg-white rounded-lg shadow-md p-6 block hover:shadow-xl transition-shadow cursor-pointer border border-transparent hover:border-blue-200">
                                <h2 className="text-xl font-bold text-blue-600">{hostel.name}</h2>
                                <p className="text-gray-600 mt-2 text-sm">📍 {hostel.address}</p>
                                <p className="text-gray-800 mt-4 text-base line-clamp-3">{hostel.description}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}