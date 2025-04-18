import React from 'react';
import styles from '../Layout/TopNavbar.module.css'; // Можно переиспользовать стили или создать новые
import { Link, useNavigate } from "react-router-dom";
import logo from '../Layout/logo.jpg'; // Используем тот же логотип

const TeacherNavbar = () => {
    const navigate = useNavigate();

    // Здесь должна быть реальная логика выхода учителя
    const handleLogout = () => {
        console.log('Teacher logged out');
        alert('Выход учителя (симуляция)');
        // Очистить данные аутентификации, перенаправить на страницу входа
        navigate('/login'); // или '/'
    };

    // Ссылки для учителя
    const teacherLinks = [
        { path: '/teacher/builder', text: 'Конструктор курсов' },
        { path: '/teacher/chat', text: 'Чат' },
        { path: '/teacher/stats', text: 'Статистика' },
        // Можно добавить ссылку на панель управления/главную страницу учителя
        // { path: '/teacher/dashboard', text: 'Панель управления' },
    ];

    return (
        <div className={styles.navbar}>
            {/* Логотип и Бренд */}
            <div className={styles.logoSection}>
                <Link to="/teacher" className={styles.brand}>Барс Групп</Link> {/* Ссылка на главную учителя */}
                <img src={logo} alt="Логотип" className={styles.logo} />
            </div>

            {/* Навигационные ссылки Учителя */}
            <div className={styles.navLinks}>
                {teacherLinks.map(link => (
                    <Link key={link.path} to={link.path} className={styles.navLinkItem}>
                        {link.text}
                    </Link>
                ))}
            </div>

            {/* Кнопки Аутентификации/Профиля Учителя */}
            <div className={styles.authButtons}>
                {/* Здесь можно добавить имя учителя или ссылку на профиль */}
                {/* <span className={styles.userName}>Имя Учителя</span> */}
                <button onClick={handleLogout} className={styles.logout}>Выйти</button>
            </div>
        </div>
    );
};

export default TeacherNavbar;