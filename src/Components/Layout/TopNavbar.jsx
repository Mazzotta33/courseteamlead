import React, { useState } from 'react';
import styles from './TopNavbar.module.css'; // Убедитесь, что этот файл существует и стили определены
import { Link, useNavigate } from "react-router-dom";
import TooltipForCourse from "./TooltipForCourse.jsx"; // Assuming this exists
import logo from './logo.jpg';


const TooltipForTests = ({ text, isVisible }) => (
    <div className={`${styles.tool} ${isVisible ? styles.visible : ''}`}>{text}</div>
);

const TopNavbar = () => {
    const [visibleTooltip, setVisibleTooltip] = useState(null);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const navigate = useNavigate();

    const isLoggedIn = false;

    const handleLogout = () => {
        console.log('User logged out');
        alert('Logout successful (simulation)');
        navigate('/');
    };

    return (
        <>
            <div className={styles.navbar}>
                <div className={styles.logoSection}>
                    <Link to="/mainwindow" className={styles.brand}>Барс Групп</Link>
                    <img src={logo} alt="Логотип" className={styles.logo} />
                </div>

                <div className={styles.navLinks} onMouseLeave={() => !isFeedbackModalOpen && setVisibleTooltip(null)}>
                    <Link
                        to="/courses"
                        onMouseEnter={() => !isFeedbackModalOpen && setVisibleTooltip('courses')}
                        className={styles.navLinkItem}
                    >
                        Курсы
                    </Link>
                    <a
                        href="#" // Or link to a specific test page
                        onMouseEnter={() => !isFeedbackModalOpen && setVisibleTooltip('test')}
                        className={styles.navLinkItem}
                    >
                        Пройти тест
                    </a>

                    <Link

                        to="/chat"
                        onMouseEnter={() => !isFeedbackModalOpen && setVisibleTooltip('courses')}
                        className={styles.navLinkItem}
                    >
                        Обратная связь
                    </Link>

                    {!isFeedbackModalOpen && visibleTooltip === 'courses' && (
                        <TooltipForCourse text="Подробнее о наших курсах и обучении" isVisible />
                    )}
                    {!isFeedbackModalOpen && visibleTooltip === 'test' && (
                        <TooltipForTests text="Пройдите наш тест для оценки знаний" isVisible />
                    )}
                </div>

                <div className={styles.authButtons}>
                    <>
                        <button onClick={handleLogout} className={styles.logout}>Выйти</button>
                    </>
                </div>
            </div>
        </>
    );
};

export default TopNavbar;