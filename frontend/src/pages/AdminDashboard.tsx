import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { api } from '../api/axios';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';

export default function AdminDashboard() {
    const logout = useAuthStore((state) => state.logout);
    const { adminBookings, fetchAllBookings, cancelBooking } = useBookingStore();
    const [stats, setStats] = useState({ totalUsers: 0, totalBookings: 0, totalAreaReservations: 0 });

    const mockChartData =[
        { name: 'Пн', брони: 4 }, { name: 'Вт', брони: 7 }, { name: 'Ср', брони: 2 },
        { name: 'Чт', брони: 5 }, { name: 'Пт', брони: 9 }, { name: 'Сб', брони: 12 }, { name: 'Вс', брони: 10 }
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/analytics');
                setStats(response.data);
            } catch (error) { console.error("Ошибка", error); }
        };
        fetchStats();
        fetchAllBookings(); // Загружаем все бронирования
    }, [fetchAllBookings]);

    // ФУНКЦИЯ ЭКСПОРТА В PDF
    const exportToPDF = () => {
        const input = document.getElementById('dashboard-content');
        if (input) {
            html2canvas(input, { scale: 2 }).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('hostel_analytics_report.pdf');
            });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-800">
                    <h1 className="text-3xl font-bold text-gray-800">Панель Управления</h1>
                    <div className="flex items-center gap-4">
                        <button onClick={exportToPDF} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition font-medium">
                            Скачать PDF отчет
                        </button>
                        <Link to="/" className="text-blue-600 hover:underline">Каталог</Link>
                        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                            Выйти
                        </button>
                    </div>
                </div>

                {/* Обёртка для PDF экспорта */}
                <div id="dashboard-content" className="space-y-8 bg-gray-50 p-4 -m-4">

                    {/* KPI Карточки */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Всего пользователей</h3>
                            <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalUsers}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Бронирования проживания</h3>
                            <p className="text-4xl font-bold text-green-500 mt-2">{stats.totalBookings}</p>
                        </div>
                        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Бронирования общих зон</h3>
                            <p className="text-4xl font-bold text-purple-500 mt-2">{stats.totalAreaReservations}</p>
                        </div>
                    </div>

                    {/* График */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-6">Динамика бронирований за неделю</h3>
                        <div className="h-80">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={mockChartData}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip cursor={{fill: '#f3f4f6'}} />
                                    <Bar dataKey="брони" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Таблица всех бронирований */}
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <h3 className="text-lg font-bold text-gray-800 mb-4">Реестр бронирований</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="bg-gray-100 text-gray-600 text-sm uppercase tracking-wider">
                                    <th className="p-4 border-b">ID</th>
                                    <th className="p-4 border-b">Хостел</th>
                                    <th className="p-4 border-b">Место</th>
                                    <th className="p-4 border-b">Заезд</th>
                                    <th className="p-4 border-b">Выезд</th>
                                    <th className="p-4 border-b">Статус</th>
                                    <th className="p-4 border-b">Действия</th>
                                </tr>
                                </thead>
                                <tbody>
                                {adminBookings.map((b) => (
                                    <tr key={b.bookingId} className="hover:bg-gray-50 border-b">
                                        <td className="p-4 font-mono text-sm text-gray-500">#{b.bookingId}</td>
                                        <td className="p-4 font-semibold">{b.hostelName}</td>
                                        <td className="p-4">К{b.roomNumber} - М{b.bedNumber}</td>
                                        <td className="p-4">{b.checkInDate}</td>
                                        <td className="p-4">{b.checkOutDate}</td>
                                        <td className="p-4">
                                                <span className={`px-2 py-1 text-xs rounded-full font-bold uppercase ${b.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                    {b.status}
                                                </span>
                                        </td>
                                        <td className="p-4">
                                            {b.status === 'CONFIRMED' && (
                                                <button onClick={() => window.confirm('Отменить бронь?') && cancelBooking(b.bookingId, true)} className="text-red-500 text-sm hover:underline font-medium">Отменить</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                {adminBookings.length === 0 && (
                                    <tr><td colSpan={7} className="p-4 text-center text-gray-500">Бронирований пока нет.</td></tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}