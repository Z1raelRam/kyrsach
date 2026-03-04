import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

import { useHostelStore } from '../store/hostelStore';
import { useBookingStore } from '../store/bookingStore';
import { useCommonAreaStore } from '../store/commonAreaStore';

export default function HostelDetail() {
    const { id } = useParams<{ id: string }>();
    const { selectedHostel, commonAreas, loading, fetchHostelById, fetchCommonAreas } = useHostelStore();
    const openBookingModal = useBookingStore(state => state.openModal);
    const openAreaModal = useCommonAreaStore(state => state.openAreaModal);

    useEffect(() => {
        if (id) {
            fetchHostelById(id);
            fetchCommonAreas(id);
        }
    },[id, fetchHostelById, fetchCommonAreas]);

    if (loading) return <div className="p-8 text-center text-gray-500">Загрузка данных о хостеле...</div>;
    if (!selectedHostel) return <div className="p-8 text-center text-red-500">Хостел не найден.</div>;

    // Формируем безопасную строку запроса для Google Карт (Название + Адрес)
    const mapQuery = encodeURIComponent(`${selectedHostel.name} ${selectedHostel.address}`);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-5xl mx-auto">
                <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block font-medium">&larr; Назад к списку</Link>

                <div className="bg-white p-6 rounded-lg shadow-md mb-8 border-t-4 border-blue-600">
                    <h1 className="text-3xl font-bold text-gray-800">{selectedHostel.name}</h1>
                    <p className="text-gray-600 mt-2">📍 {selectedHostel.address}</p>
                    <p className="text-gray-800 mt-4 leading-relaxed">{selectedHostel.description}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    {/* КОМНАТЫ */}
                    <div className="lg:col-span-2 space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Комнаты и спальные места</h2>
                        {selectedHostel.rooms && selectedHostel.rooms.length > 0 ? (
                            selectedHostel.rooms.map(room => (
                                <div key={room.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200">
                                    <h3 className="font-bold text-lg text-gray-800">Комната №{room.roomNumber} ({room.type})</h3>
                                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4">
                                        {room.beds.map(bed => (
                                            <div key={bed.id} className="border p-4 rounded-lg flex flex-col items-center bg-gray-50 hover:border-blue-300 transition-colors">
                                                <span className="font-semibold text-gray-700">Место {bed.bedNumber}</span>
                                                <button onClick={() => openBookingModal(bed.id)} className="mt-3 w-full bg-green-500 text-white px-3 py-2 text-sm font-medium rounded hover:bg-green-600 transition">
                                                    Бронь
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">В этом хостеле пока нет комнат.</p>
                        )}
                    </div>

                    {/* ОБЩИЕ ЗОНЫ */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Общие зоны</h2>
                        {commonAreas && commonAreas.length > 0 ? (
                            commonAreas.map(area => (
                                <div key={area.id} className="bg-white p-5 rounded-lg shadow-sm border border-gray-200 border-l-4 border-purple-500">
                                    <h3 className="font-bold text-lg text-gray-800">{area.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Вместимость: до {area.capacity} чел.</p>
                                    <button onClick={() => openAreaModal(area.id)} className="mt-4 w-full bg-purple-600 text-white px-4 py-2 text-sm font-medium rounded hover:bg-purple-700 transition">
                                        Забронировать время
                                    </button>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 bg-white p-4 rounded-lg">Общие зоны не найдены.</p>
                        )}
                    </div>
                </div>

                {/* ИНТЕГРАЦИЯ GOOGLE MAPS (Через безопасный iframe) */}
                <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Расположение на карте</h2>
                    <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-300">
                        <iframe
                            width="100%"
                            height="100%"
                            frameBorder="0"
                            style={{ border: 0 }}
                            src={`https://maps.google.com/maps?q=${mapQuery}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                            allowFullScreen
                        ></iframe>
                    </div>
                </div>

            </div>
        </div>
    );
}