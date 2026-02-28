import { Link, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { useHostelStore } from './store/hostelStore';
import Login from './pages/Login';
import HostelDetail from './pages/HostelDetail'; // Импортируем новую страницу

// Компонент-обертка для защиты приватных страниц
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function Home() {
    const { hostels, loading, fetchHostels } = useHostelStore();
    const logout = useAuthStore((state) => state.logout);

    useEffect(() => {
        fetchHostels();
    }, [fetchHostels]);

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">Доступные хостелы</h1>
                    <button onClick={logout} className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Выйти</button>
                </div>

                {loading ? <p>Загрузка...</p> : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {hostels.map((hostel) => (
                            // ИЗМЕНЕНИЕ: Обернули карточку в <Link>
                            <Link to={`/hostels/${hostel.id}`} key={hostel.id} className="bg-white rounded-lg shadow-md p-6 block hover:shadow-xl transition-shadow cursor-pointer">
                                <h2 className="text-xl font-bold text-blue-600">{hostel.name}</h2>
                                <p className="text-gray-600 mt-2 text-sm">📍 {hostel.address}</p>
                                <p className="text-gray-800 mt-4 text-base">{hostel.description}</p>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

function App() {
    return (
        <Routes>
            <Route path="/login" element={<Login />} />
            {/* ИЗМЕНЕНИЕ: Добавили новый маршрут */}
            <Route path="/hostels/:id" element={<PrivateRoute><HostelDetail /></PrivateRoute>} />
            <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        </Routes>
    );
}

export default App;