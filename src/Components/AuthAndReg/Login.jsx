import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../Redux/api/authApi';
import { setCredentials } from '../../Redux/slices/authSlice';
import styles from './AuthForm.module.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [login, { isLoading }] = useLoginMutation();

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {

        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Введите email и пароль');
            return;
        }

        try {
            // Запрос на сервер через RTK Query
            const response = await login({ email, password }).unwrap();
            console.log('login response:', response);

            // Сохраняем в store
            dispatch(setCredentials(response));

            // И в localStorage, чтобы восстановить после перезагрузки
            localStorage.setItem('token', response.token);
            localStorage.setItem('username', JSON.stringify(response.username));

            // alert(`Вы вошли как ${response.user.role}`);
            // navigate(response.user.role === 'teacher' ? '/teacher' : '/mainwindow');

        } catch (err) {
            console.error('Login error:', err);
            setError('Неверный email или пароль');
        }
    };

    return (
        <div className={styles.authContainer}>
            <form className={styles.authForm} onSubmit={handleLogin}>
                <h2>Вход</h2>
                <p>Войдите в свой аккаунт</p>

                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.inputGroup}>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email" id="email" placeholder="your@email.com"
                        value={email} onChange={(e) => setEmail(e.target.value)} required
                    />
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="password">Пароль</label>
                    <input
                        type="password" id="password" placeholder="Введите ваш пароль"
                        value={password} onChange={(e) => setPassword(e.target.value)} required
                    />
                </div>

                <button type="submit" className={styles.submitButton} disabled={isLoading}>
                    {isLoading ? 'Вход...' : 'Войти'}
                </button>
            </form>
        </div>
    );
};

export default Login;
