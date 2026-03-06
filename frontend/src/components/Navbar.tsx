import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
    const { logout, role } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
            <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-black text-blue-600 tracking-tight flex items-center gap-2">
                    <span className="text-3xl">🛏️</span> HostelApp
                </Link>

                <div className="flex items-center gap-6">
                    {role === 'ROLE_ADMIN' && (
                        <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-semibold transition">
                            Панель Админа
                        </Link>
                    )}
                    <Link to="/my-bookings" className="text-gray-600 hover:text-blue-600 font-semibold transition">
                        Мои бронирования
                    </Link>
                    <Link to="/profile" className="text-gray-600 hover:text-blue-600 font-semibold transition">
                        Мой профиль
                    </Link>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-5 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors shadow-sm"
                    >
                        Выйти
                    </button>
                </div>
            </div>
        </nav>
    );
}