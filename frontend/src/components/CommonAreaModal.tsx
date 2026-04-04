import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useCommonAreaStore } from '../store/commonAreaStore';
import { toast } from 'react-hot-toast';

export default function CommonAreaModal() {
    const { isAreaModalOpen, closeAreaModal, reserveArea, bookedSlots } = useCommonAreaStore();
    const [selectedDate, setSelectedDate] = useState('');
    const [startHour, setStartHour] = useState('12:00');
    const [endHour, setEndHour] = useState('13:00');
    const [participants, setParticipants] = useState(1);

    const hours = Array.from({ length: 16 }, (_, i) => `${(i + 8).toString().padStart(2, '0')}:00`);

    useEffect(() => {
        if (isAreaModalOpen) {
            setSelectedDate(new Date().toISOString().split('T')[0]);
            setStartHour('12:00');
            setEndHour('13:00');
            setParticipants(1);
        }
    }, [isAreaModalOpen]);

    const handleReserve = async () => {
        const now = new Date();
        const start = new Date(`${selectedDate}T${startHour}:00`);
        if (start < now) {
            toast.error("Нельзя выбрать прошедшее время!");
            return;
        }
        await reserveArea(`${selectedDate}T${startHour}:00`, `${selectedDate}T${endHour}:00`, participants);
        closeAreaModal();
    };

    return (
        <Transition appear show={isAreaModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeAreaModal}>
                <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Dialog.Panel className="w-full max-w-md bg-white p-6 rounded-xl shadow-2xl border-t-4 border-purple-500">
                            <h2 className="text-xl font-bold mb-4">Резерв общей зоны</h2>

                            <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-600 max-h-32 overflow-y-auto">
                                <p className="font-bold mb-1">Уже занято:</p>
                                {bookedSlots.length > 0 ? bookedSlots.map((s, i) => (
                                    <div key={i}>{s.start.slice(11,16)} - {s.end.slice(11,16)} ({s.participants} чел.)</div>
                                )) : "Свободно"}
                            </div>

                            <div className="space-y-4">
                                <input type="date" className="w-full border p-2 rounded" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} />
                                <div className="grid grid-cols-2 gap-2">
                                    <select className="border p-2 rounded" value={startHour} onChange={e => setStartHour(e.target.value)}>{hours.map(h => <option key={h}>{h}</option>)}</select>
                                    <select className="border p-2 rounded" value={endHour} onChange={e => setEndHour(e.target.value)}>{hours.map(h => <option key={h}>{h}</option>)}</select>
                                </div>
                                <input type="number" min="1" placeholder="Кол-во человек" className="w-full border p-2 rounded" value={participants} onChange={e => setParticipants(parseInt(e.target.value))} />
                            </div>

                            <div className="mt-6 flex justify-end gap-2">
                                <button onClick={closeAreaModal} className="px-4 py-2 border rounded">Отмена</button>
                                <button onClick={handleReserve} className="px-4 py-2 bg-purple-600 text-white rounded">Подтвердить</button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}