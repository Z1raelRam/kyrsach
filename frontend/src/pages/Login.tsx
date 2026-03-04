import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/axios';
import { useAuthStore } from '../store/authStore';

export default function Login() {
    const [email, setEmail] = useState('admin@hostel.com');
    const[password, setPassword] = useState('admin123');
    const [error, setError] = useState('');
    const login = useAuthStore((state) => state.login);
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', { email, password });
            login(response.data.token, response.data.role);
            if (response.data.role === 'ROLE_ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка при входе');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 border-t-4 border-blue-600">
                <h2 className="text-2xl font-bold text-center mb-6">Вход в систему</h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded">{error}</p>}

                <form onSubmit={handleLogin}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                               value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Пароль</label>
                        <input type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                               value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 px-4 rounded hover:bg-blue-700 transition">
                        Войти
                    </button>
                </form>

                {/* НОВЫЙ БЛОК СО ССЫЛКОЙ */}
                <div className="mt-4 text-center text-sm text-gray-600">
                    Нет аккаунта? <Link to="/register" className="text-blue-600 hover:underline">Зарегистрироваться</Link>
                </div>
            </div>
        </div>
    );
}