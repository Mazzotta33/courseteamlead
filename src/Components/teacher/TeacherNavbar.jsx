import React, { useState } from 'react'; // Импортируем useState
import styles from './TeacherNavbar.module.css'; // Убедись, что путь правильный к TeacherNavbar.module.css
import { Link } from "react-router-dom";
import logo from '../Layout/logo.jpg'; // Убедись, что путь к логотипу правильный

const TeacherNavbar = ({ handleLogout }) => {
    // Создаем состояние для отслеживания, открыто мобильное меню или нет
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Функция для переключения состояния меню
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const onLogoutClick = () => {
        console.log('Teacher logging out via prop function...');
        handleLogout();
    };

    const teacherLinks = [
        { path: '/teacher/mycourses', text: 'Мои курсы' },
        { path: '/teacher/chat', text: 'Чат' },
        { path: '/teacher/stats', text: 'Статистика' },
    ];

    return (
        <div className={styles.navbar}>

            {/* Блок с логотипом и названием */}
            <div className={styles.logoSection}>
                <Link to="/teacher" className={styles.brand}>Барс Групп</Link>
                {/* Проверь размер лого, возможно его нужно ограничить */}
                {/* Убедись, что логотип отображается как block для лучшего контроля отступов */}
                <img src={logo} alt="Логотип" className={styles.logo} />
            </div>

            {/* Кнопка для открытия/закрытия мобильного меню (Гамбургер/Крестик) */}
            {/* Эта кнопка будет видна только на маленьких экранах благодаря CSS */}
            {/* Класс mobileMenuToggle_YOURHASH__ из CSS Modules будет применен */}
            <button
                className={styles.mobileMenuToggle}
                onClick={toggleMenu}
                aria-label={isMenuOpen ? 'Закрыть меню' : 'Открыть меню'} // Для доступности
            >
                {/* Здесь можно использовать иконку из библиотеки (например, React Icons) */}
                {/* Для простоты пока используем текстовые символы */}
                {isMenuOpen ? '✕' : '☰'} {/* Показываем крестик при открытом меню, гамбургер при закрытом */}
            </button>

            {/* Блок с основными навигационными ссылками */}
            {/* Добавляем класс 'open' из CSS Modules если isMenuOpen истинно */}
            {/* Этот блок скрыт по умолчанию на мобильных, но класс 'open' делает его видимым и стилизует как открытое меню */}
            <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`}>
                {teacherLinks.map(link => (
                    <Link key={link.path} to={link.path} className={styles.navLinkItem} onClick={() => setIsMenuOpen(false)}>
                        {/* Закрываем меню при клике на ссылку (опционально) */}
                        {link.text}
                    </Link>
                ))}
            </div>

            {/* Блок с кнопкой "Выйти" */}
            {/* Этот блок будет виден всегда */}
            <div className={styles.authButtons}>
                <button onClick={onLogoutClick} className={styles.logoutButton}>Выйти</button>
            </div>

            {/* Этот блок теперь не нужен, так как кнопку перенесли */}
            {/* <div className={styles.authButtons}></div> */}

        </div>
    );
};

export default TeacherNavbar;