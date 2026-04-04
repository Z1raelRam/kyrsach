import { useEffect, useState } from 'react';
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

    const mapQuery = selectedHostel?.address ? encodeURIComponent(selectedHostel.address) : '';

    // ВОЗВРАЩЕН СТАРЫЙ СТИЛЬ БЕЙДЖЕЙ (Цветные, скругленные, без капса)
    const getRoomBadge = (type: string) => {
        switch(type) {
            case 'MALE': return <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-md">Мужская</span>;
            case 'FEMALE': return <span className="bg-pink-100 text-pink-800 text-xs font-bold px-2 py-1 rounded-md">Женская</span>;
            default: return <span className="bg-purple-100 text-purple-800 text-xs font-bold px-2 py-1 rounded-md">Общая</span>;
        }
    }

    if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-medium">Загрузка информации...</div>;
    if (!selectedHostel) return <div className="p-8 text-center text-red-500">Хостел не найден.</div>;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <div className="bg-white border-b border-gray-200 pt-8 pb-10">
                <div className="max-w-6xl mx-auto px-4">
                    {/* ВОЗВРАЩЕНА СТАРАЯ КНОПКА "НАЗАД" */}
                    <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block font-medium">
                        &larr; Назад к списку
                    </Link>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{selectedHostel.name}</h1>
                    <p className="text-gray-500 text-base mb-6">{selectedHostel.address}</p>
                    <div className="text-gray-700 text-base leading-relaxed max-w-3xl">
                        {selectedHostel.description}
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 mt-8 grid grid-cols-1 xl:grid-cols-3 gap-8">

                {/* ЛЕВАЯ КОЛОНКА (Номера и места) */}
                <div className="xl:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Доступные номера</h2>

                    {selectedHostel.rooms && selectedHostel.rooms.length > 0 ? (
                        selectedHostel.rooms.map(room => (
                            <div key={room.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
                                <div className="bg-gray-50/50 border-b border-gray-100 p-5 flex justify-between items-center">
                                    <h3 className="font-semibold text-gray-800">Комната №{room.roomNumber}</h3>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm font-medium text-gray-500">Вместимость: {room.capacity} чел.</span>
                                        {getRoomBadge(room.type)}
                                    </div>
                                </div>
                                <div className="p-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {room.beds?.map(bed => (
                                        <div key={bed.id} className="border border-gray-200 p-4 rounded-xl flex flex-col items-center justify-center hover:border-blue-500 hover:shadow-sm transition-all bg-white group">
                                            <span className="font-medium text-gray-800 mb-4">{bed.bedNumber}</span>
                                            <button onClick={() => openBookingModal(bed.id)} className="w-full bg-blue-600 text-white px-3 py-2 text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors">
                                                Выбрать
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500 p-6 bg-white rounded-xl border border-gray-200">В этом хостеле пока нет добавленных номеров.</p>
                    )}
                </div>

                {/* ПРАВАЯ КОЛОНКА (Общие зоны и Карта) */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Общие зоны</h2>

                    {commonAreas && commonAreas.length > 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            {commonAreas.map((area, index) => (
                                <div key={area.id} className={`p-5 flex justify-between items-center ${index !== commonAreas.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                                    <div>
                                        {/* Регулярное выражение автоматически вырезает любые смайлики из базы данных */}
                                        <h3 className="font-medium text-gray-800">
                                            {area.name.replace(/[^\p{L}\p{N}\s\(\)\-]/gu, '').trim()}
                                        </h3>
                                        <p className="text-xs text-gray-500 mt-1">До {area.capacity} человек</p>
                                    </div>
                                    <button onClick={() => openAreaModal(area.id)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-100 hover:text-gray-900 px-4 py-2 text-sm font-medium rounded-lg transition-colors">
                                        Резерв
                                    </button>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 p-6 bg-white rounded-xl border border-gray-200">Общие зоны не найдены.</p>
                    )}

                    {/* КАРТА */}
                    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-6">
                        <div className="bg-gray-50/50 p-4 border-b border-gray-100">
                            <h3 className="font-semibold text-gray-800">Расположение</h3>
                        </div>
                        <div className="h-64 w-full">
                            {mapQuery && (
                                <iframe
                                    width="100%" height="100%" frameBorder="0" style={{ border: 0 }}
                                    src={`https://maps.google.com/maps?q=${mapQuery}&z=16&output=embed`}
                                    allowFullScreen title="Google Map"
                                ></iframe>
                            )}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}