import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useHostelStore } from '../store/hostelStore';
import Navbar from '../components/Navbar';

export default function Home() {
    const { hostels, loading, fetchHostels } = useHostelStore();

    useEffect(() => {
        fetchHostels();
    },[fetchHostels]);

    // Картинки-заглушки для красоты
    const getMockImage = (id: number) => `https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=600&q=80&sig=${id}`;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Navbar />

            {/* HERO БАННЕР */}
            <div className="bg-blue-600 text-white py-20 px-4 text-center shadow-inner">
                <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Найди свой идеальный хостел</h1>
                <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto font-light">
                    Комфортное и доступное жилье в любой точке города. Бронируй онлайн за 2 минуты!
                </p>
            </div>

            <div className="max-w-6xl mx-auto px-4 mt-12">
                <h2 className="text-3xl font-bold text-gray-800 mb-8 border-l-4 border-blue-600 pl-4">Популярные направления</h2>

                {loading ? (
                    <p className="text-center text-gray-500 text-xl py-10">Загрузка каталога...</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {hostels.map((hostel) => (
                            <Link
                                to={`/hostels/${hostel.id}`}
                                key={hostel.id}
                                className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group"
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={getMockImage(hostel.id)}
                                        alt={hostel.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                        <h2 className="text-xl font-bold text-white">{hostel.name}</h2>
                                    </div>
                                </div>
                                <div className="p-6">
                                    <p className="text-gray-500 text-sm flex items-center gap-1">
                                        📍 {hostel.address}
                                    </p>
                                    <p className="text-gray-700 mt-4 text-base line-clamp-3 leading-relaxed">
                                        {hostel.description}
                                    </p>
                                    <div className="mt-6 text-blue-600 font-bold text-sm uppercase tracking-wide group-hover:text-blue-800">
                                        Посмотреть номера &rarr;
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}