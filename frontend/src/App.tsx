import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; // Для всплывающих уведомлений

// Импорты страниц и компонентов
import Login from './pages/Login';
import Home from './pages/Home'; // Теперь Home - это отдельный файл в pages
import HostelDetail from './pages/HostelDetail';
import MyBookings from './pages/MyBookings'; // Новая страница "Мои бронирования"
import BookingModal from './components/BookingModal'; // Модальное окно для бронирования

import { useAuthStore } from './store/authStore';

// Компонент-обертка для защиты приватных страниц
const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        // Используем Fragment для объединения нескольких корневых элементов
        <>
            {/* Глобальный контейнер для всплывающих уведомлений */}
            <Toaster position="top-center" reverseOrder={false} />

            {/* Глобальное модальное окно для бронирования, доступное из любой точки приложения */}
            <BookingModal />

            <Routes>
                {/* Маршрут для страницы входа */}
                <Route path="/login" element={<Login />} />

                {/* Защищенные маршруты, требующие аутентификации */}
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/hostels/:id" element={<PrivateRoute><HostelDetail /></PrivateRoute>} />
                <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
            </Routes>
        </>
    );
}

export default App;