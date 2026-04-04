import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import HostelDetail from './pages/HostelDetail';
import MyBookings from './pages/MyBookings';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import BookingModal from './components/BookingModal';
import CommonAreaModal from './components/CommonAreaModal';
import Navbar from './components/Navbar'; // ИМПОРТ NAVBAR

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
    const location = useLocation();
    const hideNavbar = location.pathname === '/login' || location.pathname === '/register';

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <BookingModal />
            <CommonAreaModal />

            {!hideNavbar && <Navbar />} {/* РЕНДЕРИМ NAVBAR ЗДЕСЬ УСЛОВНО */}

            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

                <Route path="/hostels/:id" element={<PrivateRoute><HostelDetail /></PrivateRoute>} />
                <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
                <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            </Routes>
        </>
    );
}

export default App;