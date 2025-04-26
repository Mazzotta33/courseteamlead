import React, { useState } from 'react';
import styles from './TopNavbar.module.css';
import { Link, useNavigate } from "react-router-dom";
import logo from './logo.jpg';
// Возможно, вам понадобится библиотека иконок, например react-icons
// import { FaBars, FaTimes } from 'react-icons/fa'; // Пример использования иконок бургера

const TopNavbar = () => {
    const [visibleTooltip, setVisibleTooltip] = useState(null);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false); // Пока не используется в этом коде
    const [isMenuOpen, setIsMenuOpen] = useState(false); // Состояние мобильного меню

    const navigate = useNavigate();

    // Функция для переключения состояния меню
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        // Добавляем класс menuOpen к навбару, если меню открыто
        <div className={`${styles.navbar} ${isMenuOpen ? styles.menuOpen : ''}`}>
            <div className={styles.logoSection}>
                {/* Ваша ссылка с логотипом */}
                <Link to="/mainwindow" className={styles.brand}>Барс Групп</Link>
                <img src={logo} alt="Логотип" className={styles.logo} />
            </div>

            {/* Бургер кнопка - видна только на мобильных */}
            <button className={styles.hamburgerButton} onClick={toggleMenu}>
                {/* Здесь будет ваша иконка бургера. Можно использовать символ Unicode или компонент иконки */}
                {isMenuOpen ? '✕' : '☰'} {/* Пример: крестик при открытом меню, три линии при закрытом */}
                {/* Пример с react-icons: {isMenuOpen ? <FaTimes /> : <FaBars />} */}
            </button>


            {/* Мобильное меню - оборачиваем навигацию и последнюю часть */}
            {/* Этот контейнер будет скрыт/показан через CSS */}
            <div className={styles.mobileMenuContent}>
                <div className={styles.navLinks} onMouseLeave={() => !isFeedbackModalOpen && setVisibleTooltip(null)}>
                    {/* Ваши навигационные ссылки */}
                    <Link
                        to="/courses"
                        onMouseEnter={() => !isFeedbackModalOpen && setVisibleTooltip('courses')}
                        className={styles.navLinkItem}
                        onClick={toggleMenu} // Закрываем меню при клике на ссылку
                    >
                        Курсы
                    </Link>
                    <Link
                        to="/take-test"
                        onMouseEnter={() => !isFeedbackModalOpen && setVisibleTooltip('test')}
                        className={styles.navLinkItem}
                        onClick={toggleMenu} // Закрываем меню при клике на ссылку
                    >
                        Пройти тест
                    </Link>
                    <Link
                        to="/chat"
                        onMouseEnter={() => !isFeedbackModalOpen && setVisibleTooltip('courses')} // Возможно, тут должна быть другая логика тултипа
                        className={styles.navLinkItem}
                        onClick={toggleMenu} // Закрываем меню при клике на ссылку
                    >
                        Обратная связь
                    </Link>
                    {/* ... добавьте другие навигационные ссылки при необходимости */}
                </div>

                {/* Последняя часть: иконка профиля, кнопки авторизации (если есть) */}
                <div className={styles.lastpart}>
                    {/* Иконка профиля */}
                    <div className={styles.profileIconContainer} onClick={() => { navigate('/profile'); toggleMenu(); }}> {/* Закрываем меню при клике */}
                        <img src={"./user-svgrepo-com.svg"} className={styles.profileIcon} alt="User Icon" />
                    </div>

                    {/* Здесь могут быть кнопки Вход/Регистрация/Выход */}
                    {/* Я не добавляю сюда authButtons напрямую, т.к. их нет в предоставленном JSX */}
                    {/* Если у вас есть эти кнопки, их нужно будет добавить здесь внутри .lastpart */}

                    {/* Пример:
                     <div className={styles.authButtons}>
                          <button className={styles.login}>Вход</button>
                          <button className={styles.register}>Регистрация</button>
                          // Или кнопка Выход, если пользователь авторизован
                          // <button className={styles.logoutButton}>Выход</button>
                     </div>
                     */}
                </div>
            </div>

            {/* Тултип находится вне mobileMenuContent, но его видимость можно контролировать */}
            {/* Я оставил логику тултипа как есть, но в мобильном меню он может вести себя иначе */}
            {/*
             <ul className={`${styles.tool} ${visibleTooltip === 'courses' ? styles.visible : ''}`}>
                 <li><Link to="/course1">Курс 1</Link></li>
                 <li><Link to="/course2">Курс 2</Link></li>
             </ul>
             */}

        </div>
    );
};

export default TopNavbar;