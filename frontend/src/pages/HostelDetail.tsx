import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHostelStore } from '../store/hostelStore';

export default function HostelDetail() {
    const { id } = useParams<{ id: string }>();
    const { selectedHostel, loading, fetchHostelById } = useHostelStore();

    useEffect(() => {
        if (id) {
            fetchHostelById(id);
        }
    }, [id, fetchHostelById]);

    if (loading) return <div className="p-8">Загрузка данных о хостеле...</div>;
    if (!selectedHostel) return <div className="p-8">Хостел не найден.</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Назад к списку хостелов</Link>
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h1 className="text-3xl font-bold">{selectedHostel.name}</h1>
                    <p className="text-gray-600 mt-2">📍 {selectedHostel.address}</p>
                    <p className="mt-4">{selectedHostel.description}</p>
                </div>

                <h2 className="text-2xl font-bold mt-8 mb-4">Комнаты</h2>
                <div className="space-y-4">
                    {selectedHostel.rooms.length > 0 ? (
                        selectedHostel.rooms.map(room => (
                            <div key={room.id} className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center">
                                <div>
                                    <p className="font-bold">Комната №{room.roomNumber} ({room.type})</p>
                                    <p className="text-sm text-gray-600">Вместимость: {room.capacity} чел.</p>
                                </div>
                                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                                    Забронировать
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>В этом хостеле пока нет доступных комнат.</p>
                    )}
                </div>
            </div>
        </div>
    );
}