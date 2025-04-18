import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {useRegisterAdminMutation, useRegisterUserMutation} from '../../Redux/api/authApi';
import styles from './AuthForm.module.css';

const Register = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [registerUser, {isLoading  }] = useRegisterUserMutation();
  const [registerAdmin, {}] = useRegisterAdminMutation(); // Assuming you have a separate mutation for admin registration

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (!username || !email || !password || !confirmPassword || !role) {
      setError('Пожалуйста, заполните все поля и выберите роль.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают.');
      return;
    }

    try {
      if (role === 'user') {
        const newUser = {username, email, password};

        await registerUser(newUser).unwrap();
      }

      else if (role === 'admin') {
        const newAdmin = {username, email, password};

        await registerAdmin(newAdmin).unwrap();
      }

      alert(`Регистрация как ${role === 'teacher' ? 'Учитель' : 'Ученик'} прошла успешно!`);
      navigate('/login');
    } catch (err) {
      console.error('Ошибка регистрации:', err);
      setError('Ошибка регистрации. Возможно, такой email уже зарегистрирован.');
    }
  };

  return (
      <div className={styles.authContainer}>
        <form className={styles.authForm} onSubmit={handleRegister}>
          <h2>Регистрация</h2>
          <p>Создайте аккаунт</p>

          {error && <p className={styles.error}>{error}</p>}

          <div className={styles.inputGroup}>
            <label htmlFor="username">Имя (Username)</label>
            <input
                type="text" id="username" placeholder="Ваше имя пользователя"
                value={username} onChange={(e) => setUsername(e.target.value)} required
            />
          </div>

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
                type="password" id="password" placeholder="Создайте пароль"
                value={password} onChange={(e) => setPassword(e.target.value)} required
            />
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="confirmPassword">Подтвердите пароль</label>
            <input
                type="password" id="confirmPassword" placeholder="Повторите пароль"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required
            />
          </div>

          <div className={styles.inputGroup}>
            <label>Зарегистрироваться как:</label>
            <div className={styles.roleSelection}>
              <label className={styles.radioLabel}>
                <input
                    type="radio" name="role" value="user"
                    checked={role === 'user'}
                    onChange={(e) => setRole(e.target.value)}
                />
                Ученик
              </label>
              <label className={styles.radioLabel}>
                <input
                    type="radio" name="role" value="admin"
                    checked={role === 'admin'}
                    onChange={(e) => setRole(e.target.value)}
                />
                Учитель
              </label>
            </div>
          </div>

          <button type="submit" className={styles.submitButton} disabled={isLoading}>
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>

          <p className={styles.switchForm}>
            Уже есть аккаунт? <Link to="/login">Войти</Link>
          </p>
        </form>
      </div>
  );
};

export default Register;
