import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register'; // ИМПОРТ
import Home from './pages/Home';
import HostelDetail from './pages/HostelDetail';
import MyBookings from './pages/MyBookings';
import AdminDashboard from './pages/AdminDashboard';
import BookingModal from './components/BookingModal';
import CommonAreaModal from './components/CommonAreaModal';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: JSX.Element }) => {
    const { isAuthenticated, role } = useAuthStore();
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (role !== 'ROLE_ADMIN') return <Navigate to="/" />;
    return children;
};

function App() {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <BookingModal />
            <CommonAreaModal />
            <Routes>
                {/* Публичные маршруты */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Админская зона */}
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

                {/* Зона гостя */}
                <Route path="/hostels/:id" element={<PrivateRoute><HostelDetail /></PrivateRoute>} />
                <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            </Routes>
        </>
    );
}

export default App;