import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { useBookingStore } from '../store/bookingStore';

export default function BookingModal() {
    const { isModalOpen, closeModal, checkInDate, checkOutDate, setDates, createBooking } = useBookingStore();

    const handleDayClick = (day: Date) => {
        if (!checkInDate || checkOutDate) {
            setDates({ checkIn: day, checkOut: undefined });
        } else {
            setDates({ checkIn: checkInDate, checkOut: day });
        }
    };

    return (
        <Transition appear show={isModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={closeModal}>
                {/* ... (здесь много кода для стилизации, просто скопируй) ... */}
                <div className="fixed inset-0 bg-black bg-opacity-25" />
                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-900">
                                Выбор дат бронирования
                            </Dialog.Title>
                            <div className="mt-4 flex justify-center">
                                <DayPicker
                                    mode="range"
                                    selected={{ from: checkInDate, to: checkOutDate }}
                                    onSelect={(range) => setDates({ checkIn: range?.from, checkOut: range?.to })}
                                    numberOfMonths={1}
                                />
                            </div>
                            <div className="mt-4 flex justify-end gap-2">
                                <button type="button" onClick={closeModal} className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Отмена</button>
                                <button type="button" onClick={createBooking} className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Подтвердить</button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}