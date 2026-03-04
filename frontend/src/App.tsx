import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import Login from './pages/Login';
import Home from './pages/Home';
import HostelDetail from './pages/HostelDetail';
import MyBookings from './pages/MyBookings';
import BookingModal from './components/BookingModal';
import CommonAreaModal from './components/CommonAreaModal';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />
            <BookingModal />
            <CommonAreaModal />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/hostels/:id" element={<PrivateRoute><HostelDetail /></PrivateRoute>} />
                <Route path="/my-bookings" element={<PrivateRoute><MyBookings /></PrivateRoute>} />
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            </Routes>
        </>
    );
}

export default App;