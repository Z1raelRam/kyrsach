import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useHostelStore } from '../store/hostelStore';
import { useBookingStore } from '../store/bookingStore';

export default function HostelDetail() {
    const { id } = useParams<{ id: string }>();
    const { selectedHostel, loading, fetchHostelById } = useHostelStore();
    const openBookingModal = useBookingStore(state => state.openModal);

    useEffect(() => {
        if (id) {
            fetchHostelById(id);
        }
    }, [id, fetchHostelById]);

    if (loading) return <div className="p-8 text-center">Загрузка...</div>;
    if (!selectedHostel) return <div className="p-8 text-center">Хостел не найден.</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Назад к списку</Link>
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h1 className="text-3xl font-bold">{selectedHostel.name}</h1>
                    <p className="text-gray-600 mt-2">📍 {selectedHostel.address}</p>
                    <p className="mt-4">{selectedHostel.description}</p>
                </div>

                <h2 className="text-2xl font-bold mb-4">Комнаты и места</h2>
                <div className="space-y-6">
                    {selectedHostel.rooms.map(room => (
                        <div key={room.id} className="bg-white p-4 rounded-lg shadow-md">
                            <h3 className="font-bold text-lg">Комната №{room.roomNumber} ({room.type}, {room.capacity} чел.)</h3>
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                                {room.beds.map(bed => (
                                    <div key={bed.id} className="border p-3 rounded-lg flex flex-col items-center justify-center">
                                        <span className="font-semibold">Место {bed.bedNumber}</span>
                                        <button onClick={() => openBookingModal(bed.id)} className="mt-2 w-full bg-green-500 text-white px-3 py-1 text-sm rounded hover:bg-green-600">
                                            Бронь
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}