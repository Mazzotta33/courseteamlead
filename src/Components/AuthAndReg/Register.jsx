import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './AuthForm.module.css'; // Стили для формы

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault(); // Предотвращаем стандартную отправку формы
    setError(''); // Сбрасываем предыдущие ошибки

    // Простая валидация
    if (!username || !email || !password || !confirmPassword) {
      setError('Пожалуйста, заполните все поля.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }

    // --- Симуляция отправки данных на бэкенд ---
    console.log('Регистрация:', { username, email, password });
    // Здесь должен быть fetch или axios запрос к вашему API
    // Пример: fetch('/api/register', { method: 'POST', body: JSON.stringify({ username, email, password }) })
    //         .then(response => response.json())
    //         .then(data => { if(data.success) navigate('/login'); else setError(data.message); })
    //         .catch(err => setError('Ошибка сети'));

    alert('Регистрация прошла успешно! (симуляция)'); // Временно
    navigate('/login'); // Перенаправляем на страницу входа после "успешной" регистрации
    // --- Конец симуляции ---
  };

  return (
      <div className={styles.authContainer}>
        {/* Можно добавить TopNavbar сюда, если он нужен на этой странице */}
        {/* <TopNavbar /> */}
        <form className={styles.authForm} onSubmit={handleRegister}>
          <h2>Регистрация</h2>
          <p>Создайте аккаунт для доступа к курсам</p>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.inputGroup}>
            <label htmlFor="username">Имя (Username)</label>
            <input
                type="text"
                id="username"
                placeholder="Ваше имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
            />
          </div>

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
                placeholder="Создайте пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
            />
            {/* Иконка для показа/скрытия пароля может быть добавлена здесь */}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
                type="password"
                id="confirmPassword"
                placeholder="Повторите пароль"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
            />
          </div>

          <button type="submit" className={styles.submitButton}>Зарегистрироваться</button>

          <p className={styles.switchForm}>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </form>
      </div>
  );
};

export default Register;