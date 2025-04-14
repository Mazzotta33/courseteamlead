import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css'; // Используем те же стили

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Пожалуйста, введите email и пароль.');
      return;
    }

    // --- Симуляция входа ---
    console.log('Вход:', { email, password });
    // Здесь должен быть fetch или axios запрос к вашему API для проверки учетных данных
    // Пример: fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }) })
    //         .then(response => response.json())
    //         .then(data => {
    //            if(data.success) {
    //                // Сохранить токен/сессию, обновить состояние приложения (isLoggedIn = true)
    //                // Например, используя Context API или Redux/Zustand
    //                navigate('/'); // Перенаправить на главную
    //            } else {
    //                setError(data.message);
    //            }
    //         })
    //         .catch(err => setError('Ошибка сети'));

    alert('Вход успешен! (симуляция)'); // Временно
    // В реальном приложении нужно обновить состояние (например, через Context API), что пользователь вошел
    navigate('/'); // Перенаправляем на главную после "успешного" входа
    // --- Конец симуляции ---
  };

  return (
      <div className={styles.authContainer}>
        {/* <TopNavbar /> */}
        <form className={styles.authForm} onSubmit={handleLogin}>
          <h2>Вход</h2>
          <p>Войдите в свой аккаунт</p>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.inputGroup}>
            <label htmlFor="email">Email</label>
            <input
                type="email"
                id="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password">Пароль</label>
            <input
                type="password"
                id="password"
                placeholder="Введите ваш пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
          </div>

          {/* Сюда можно добавить ссылку "Забыли пароль?" */}

          <button type="submit" className={styles.submitButton}>Войти</button>

          <p className={styles.switchForm}>
            Нет аккаунта? <Link to="/register">Зарегистрироваться</Link>
          </p>
        </form>
      </div>
  );
};

export default Login;