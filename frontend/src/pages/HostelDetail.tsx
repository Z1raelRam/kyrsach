import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import { useHostelStore } from '../store/hostelStore';
import { useBookingStore } from '../store/bookingStore';
import { useCommonAreaStore } from '../store/commonAreaStore';

// Фикс для отображения стандартной иконки маркера в Leaflet + Vite
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
const DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function HostelDetail() {
    const { id } = useParams<{ id: string }>();
    const { selectedHostel, commonAreas, loading, fetchHostelById, fetchCommonAreas } = useHostelStore();
    const openBookingModal = useBookingStore(state => state.openModal);
    const openAreaModal = useCommonAreaStore(state => state.openAreaModal);

    // Состояние для хранения координат (по умолчанию центр Минска)
    const [coordinates, setCoordinates] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (id) {
            fetchHostelById(id);
            fetchCommonAreas(id);
        }
    },[id, fetchHostelById, fetchCommonAreas]);

    // Вызов ВНЕШНЕГО REST API (OpenStreetMap Nominatim) для поиска координат по адресу
    useEffect(() => {
        if (selectedHostel?.address) {
            const fetchCoordinates = async () => {
                try {
                    const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(selectedHostel.address)}`);
                    const data = await response.json();
                    if (data && data.length > 0) {
                        setCoordinates([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
                    } else {
                        setCoordinates([53.9006, 27.5590]); // Фолбэк: центр Минска
                    }
                } catch (error) {
                    console.error("Ошибка при получении координат:", error);
                    setCoordinates([53.9006, 27.5590]);
                }
            };
            fetchCoordinates();
        }
    },[selectedHostel?.address]);

    if (loading) return <div className="p-8 text-center text-gray-500">Загрузка данных о хостеле...</div>;
    if (!selectedHostel) return <div className="p-8 text-center text-red-500">Хостел не найден.</div>;

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
                    {/* ЛЕВАЯ КОЛОНКА: КОМНАТЫ */}
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

                    {/* ПРАВАЯ КОЛОНКА: ОБЩИЕ ЗОНЫ */}
                    <div className="space-y-6">
                        <h2 className="text-2xl font-bold text-gray-800">Общие зоны</h2>
                        {commonAreas.length > 0 ? (
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

                {/* НОВЫЙ БЛОК: КАРТА */}
                {coordinates && (
                    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Расположение на карте</h2>
                        <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-300 z-0 relative">
                            <MapContainer center={coordinates} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                />
                                <Marker position={coordinates}>
                                    <Popup>
                                        <strong>{selectedHostel.name}</strong><br/>
                                        {selectedHostel.address}
                                    </Popup>
                                </Marker>
                            </MapContainer>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}