import React, { useState } from 'react';
import styles from './TopNavbar.module.css';
import TooltipForCourse from "./TooltipForCourse.jsx";
import {Link, useNavigate} from "react-router-dom";

const TooltipForTests = ({text, isVisible }) => {
    return (
        <div className={`${styles.tool} ${isVisible ? styles.visible : ''}`}>
            {text}
        </div>
    );
};

const TooltipForFeedback = ({ text, isVisible }) => {
    return (
        <div className={`${styles.tool} ${isVisible ? styles.visible : ''}`}>
            {text}
        </div>
    );
};

const TopNavbar = () => {
    const [visibleTooltip, setVisibleTooltip] = useState(null);
    const navigate = useNavigate();

    return (
        <div className={styles.navbar}>
            <div className={styles.logoSection}>
                <span className={styles.brand} onClick={() => navigate('/')}>Барс Групп</span>
                <img src="/src/Components/Layout/logo.jpg" alt="Логотип" className={styles.logo} />
            </div>

            <div
                className={styles.navLinks}
                onMouseLeave={() => setVisibleTooltip(null)}
            >
            <a href="#" onMouseEnter={() => setVisibleTooltip('courses')}>
                    Курсы
                </a>
                <a href="#" onMouseEnter={() => setVisibleTooltip('test')}>
                    Пройти тест
                </a>
                <a href="#" onMouseEnter={() => setVisibleTooltip('feedback')}>
                    Обратная связь
                </a>

                {visibleTooltip === 'courses' && (
                    <TooltipForCourse text="Подробнее о наших курсах и обучении" isVisible />
                )}
                {visibleTooltip === 'test' && (
                    <TooltipForTests text="Пройдите наш тест для оценки знаний" isVisible />
                )}
                {visibleTooltip === 'feedback' && (
                    <TooltipForFeedback text="Свяжитесь с нами для получения помощи или вопросов" isVisible />
                )}
            </div>

            <div className={styles.authButtons}>
                <button className={styles.register}>Регистрация</button>
                <button className={styles.login}>Войти</button>
            </div>
        </div>
    );
};

export default TopNavbar;
