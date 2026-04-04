import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { DayPicker } from 'react-day-picker';
import { ru } from 'date-fns/locale'; // Импорт русской локали
import 'react-day-picker/dist/style.css';
import { useBookingStore } from '../store/bookingStore';

export default function BookingModal() {
    const { isModalOpen, closeModal, checkInDate, checkOutDate, setDates, createBooking, bookedDates } = useBookingStore();

    // Сегодняшняя дата для блокировки прошлого
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const handleSelect = (range: any) => {
        if (range?.from) {
            // Устанавливаем время на полдень, чтобы избежать сдвига часовых поясов
            const from = new Date(range.from);
            from.setHours(12, 0, 0, 0);

            let to = range.to ? new Date(range.to) : undefined;
            if (to) to.setHours(12, 0, 0, 0);

            setDates({ checkIn: from, checkOut: to });
        } else {
            setDates({ checkIn: undefined, checkOut: undefined });
        }
    };

    return (
        <Transition appear show={isModalOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={closeModal}>
                <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                <div className="fixed inset-0 overflow-y-auto flex items-center justify-center p-4">
                    <Dialog.Panel className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl">
                        <Dialog.Title className="text-xl font-bold mb-6 text-gray-800">Выберите даты</Dialog.Title>

                        <div className="flex justify-center border rounded-xl p-2 bg-gray-50">
                            <DayPicker
                                locale={ru}
                                mode="range"
                                selected={{ from: checkInDate, to: checkOutDate }}
                                onSelect={handleSelect}
                                disabled={[{ before: today }, ...bookedDates]}
                                modifiers={{ booked: bookedDates }}
                                modifiersClassNames={{ booked: 'my-booked-day' }}
                                numberOfMonths={1}
                                fromMonth={today}
                                showOutsideDays={false}
                            />
                        </div>

                        <div className="mt-6 flex gap-3">
                            <button onClick={closeModal} className="flex-1 px-4 py-2.5 border rounded-xl font-medium hover:bg-gray-100 transition">
                                Отмена
                            </button>
                            <button onClick={createBooking} className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition shadow-lg">
                                Забронировать
                            </button>
                        </div>
                    </Dialog.Panel>
                </div>
            </Dialog>
        </Transition>
    );
}