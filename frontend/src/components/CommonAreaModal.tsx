import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { useCommonAreaStore } from '../store/commonAreaStore';

export default function CommonAreaModal() {
    const { isAreaModalOpen, closeAreaModal, reserveArea } = useCommonAreaStore();
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    // Очищаем форму при каждом открытии
    useEffect(() => {
        if (isAreaModalOpen) {
            setStartTime('');
            setEndTime('');
        }
    }, [isAreaModalOpen]);

    const handleReserve = () => {
        reserveArea(startTime, endTime);
    };

    return (
        <Transition appear show={isAreaModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeAreaModal}>
                <div className="fixed inset-0 bg-black bg-opacity-25" />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title as="h3" className="text-lg font-bold leading-6 text-gray-900 mb-4">
                                Бронирование общей зоны
                            </Dialog.Title>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Время начала</label>
                                    <input
                                        type="datetime-local"
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                                        value={startTime}
                                        onChange={(e) => setStartTime(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Время окончания</label>
                                    <input
                                        type="datetime-local"
                                        className="mt-1 w-full border border-gray-300 rounded-md p-2"
                                        value={endTime}
                                        onChange={(e) => setEndTime(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={closeAreaModal} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    Отмена
                                </button>
                                <button type="button" onClick={handleReserve} className="rounded-md bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700">
                                    Забронировать
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}