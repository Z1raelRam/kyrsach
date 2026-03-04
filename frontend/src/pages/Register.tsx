import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../api/axios';
import { toast } from 'react-hot-toast';

export default function Register() {
    const [firstName, setFirstName] = useState('');
    const[lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await api.post('/auth/register', { email, password, firstName, lastName });
            toast.success('Регистрация успешна! Теперь вы можете войти.');
            navigate('/login'); // После регистрации отправляем на логин
        } catch (err: any) {
            setError(err.response?.data?.error || 'Ошибка при регистрации');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96 border-t-4 border-green-600">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Регистрация гостя</h2>
                {error && <p className="text-red-500 text-sm mb-4 text-center bg-red-50 p-2 rounded">{error}</p>}

                <form onSubmit={handleRegister}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Имя</label>
                        <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                               value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Фамилия</label>
                        <input type="text" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                               value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input type="email" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                               value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Пароль</label>
                        <input type="password" required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                               value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition">
                        Зарегистрироваться
                    </button>
                </form>

                <div className="mt-4 text-center text-sm text-gray-600">
                    Уже есть аккаунт? <Link to="/login" className="text-blue-600 hover:underline">Войти</Link>
                </div>
            </div>
        </div>
    );
}