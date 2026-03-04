import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function AdminDashboard() {
    const logout = useAuthStore((state) => state.logout);
    const [stats, setStats] = useState({ totalUsers: 0, totalBookings: 0, totalAreaReservations: 0 });

    // Данные для красивого графика (пока захардкодим пример динамики для красоты)
    const mockChartData =[
        { name: 'Пн', брони: 4 }, { name: 'Вт', брони: 7 }, { name: 'Ср', брони: 2 },
        { name: 'Чт', брони: 5 }, { name: 'Пт', брони: 9 }, { name: 'Сб', брони: 12 }, { name: 'Вс', брони: 10 }
    ];

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/admin/analytics');
                setStats(response.data);
            } catch (error) {
                console.error("Ошибка загрузки аналитики", error);
            }
        };
        fetchStats();
    },[]);

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow-sm border-l-4 border-blue-800">
                    <h1 className="text-3xl font-bold text-gray-800">Панель Управления</h1>
                    <div className="flex items-center gap-4">
                        <Link to="/" className="text-blue-600 hover:underline">Каталог (Витрина)</Link>
                        <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                            Выйти
                        </button>
                    </div>
                </div>

                {/* KPI Карточки */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Всего пользователей</h3>
                        <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalUsers}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Бронирования проживания</h3>
                        <p className="text-4xl font-bold text-green-500 mt-2">{stats.totalBookings}</p>
                    </div>
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h3 className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Бронирования общих зон</h3>
                        <p className="text-4xl font-bold text-purple-500 mt-2">{stats.totalAreaReservations}</p>
                    </div>
                </div>

                {/* График */}
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
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
            </div>
        </div>
    );
}