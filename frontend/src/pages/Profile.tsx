import { useEffect, useState } from 'react';
import { api } from '../api/axios';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';

export default function Profile() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState(''); // Для изменения пароля
    const [roleName, setRoleName] = useState('');
    const [isEditing, setIsEditing] = useState(false); // Состояние для режима редактирования

    // Загружаем текущие данные при открытии страницы
    useEffect(() => {
        const fetchMyData = async () => {
            try {
                const response = await api.get('/users/me');
                setFirstName(response.data.firstName);
                setLastName(response.data.lastName);
                setEmail(response.data.email);
                setRoleName(response.data.roleName);
            } catch (error) {
                toast.error('Не удалось загрузить профиль');
            }
        };
        fetchMyData();
    }, []);

    // Обработчик сохранения изменений
    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.put('/users/me', { firstName, lastName, password });
            toast.success('Профиль успешно обновлен!');
            setPassword(''); // Очищаем поле пароля после сохранения
            setIsEditing(false); // Выходим из режима редактирования
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Ошибка при обновлении профиля');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            <Navbar /> {/* Навигационная панель */}

            <div className="max-w-xl mx-auto px-4 mt-12">
                <div className="bg-white p-8 rounded-2xl shadow-md border-t-4 border-blue-600">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Мой профиль</h1>

                    <form onSubmit={handleSave} className="space-y-5">
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Имя</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                disabled={!isEditing} // Отключаем поле, если не в режиме редактирования
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Фамилия</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                disabled={!isEditing}
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                value={email}
                                disabled // Email не редактируем
                                readOnly
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Роль</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                                value={roleName === 'ROLE_ADMIN' ? 'Администратор' : 'Гость'}
                                disabled // Роль не редактируем
                                readOnly
                            />
                        </div>
                        {isEditing && ( // Поле для пароля показываем только в режиме редактирования
                            <div>
                                <label className="block text-gray-700 text-sm font-semibold mb-2">Новый пароль (оставьте пустым, если не хотите менять)</label>
                                <input
                                    type="password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Введите новый пароль"
                                />
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6">
                            {!isEditing ? (
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(true)}
                                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition shadow-md"
                                >
                                    Редактировать
                                </button>
                            ) : (
                                <>
                                    <button
                                        type="button"
                                        onClick={() => { setIsEditing(false); setPassword(''); }} // Отмена редактирования
                                        className="bg-gray-400 text-white px-6 py-2 rounded-lg font-bold hover:bg-gray-500 transition shadow-md"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-green-700 transition shadow-md"
                                    >
                                        Сохранить
                                    </button>
                                </>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}