import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import HostelDetail from './pages/HostelDetail';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile'; // ИМПОРТ НОВОЙ СТРАНИЦЫ
import AdminDashboard from './pages/AdminDashboard';
import BookingModal from './components/BookingModal';
import CommonAreaModal from './components/CommonAreaModal';
import Navbar from './components/Navbar'; // ИМПОРТ НАВБАРА

// Защищенные маршруты для всех авторизованных
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

// Защищенные маршруты только для Админа
const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, role } = useAuthStore();
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (role !== 'ROLE_ADMIN') return <Navigate to="/" />; // Если не админ - на главную
    return children;
};

function App() {
    // Определяем, должен ли Navbar быть показан (скрываем его на страницах логина/регистрации)
    const location = window.location.pathname;
    const hideNavbar = location === '/login' || location === '/register';

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <BookingModal />
            <CommonAreaModal />

            {!hideNavbar && <Navbar />} {/* РЕНДЕРИМ NAVBAR ЗДЕСЬ УСЛОВНО */}

            <Routes>
                {/* Публичные маршруты (без навигационной панели) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Админская зона (с навигационной панелью, которую мы добавили выше) */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

                {/* Зона гостя (с навигационной панелью, которую мы добавили выше) */}
                <Route path="/hostels/:id" element={<PrivateRoute><HostelDetail /></PrivateRoute>} />
                <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} /> {/* НОВЫЙ МАРШРУТ */}
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            </Routes>
        </>
    );
}

export default App;