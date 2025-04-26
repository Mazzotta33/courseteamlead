import React, { useState } from 'react';
import styles from './TopNavbar.module.css';
import { Link, useNavigate } from "react-router-dom";
import logo from './logo.jpg';

const TopNavbar = () => {
    const [visibleTooltip, setVisibleTooltip] = useState(null);
    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const navigate = useNavigate();

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
                    <Link
                        to="/take-test"
                        onMouseEnter={() => !isFeedbackModalOpen && setVisibleTooltip('test')}
                        className={styles.navLinkItem}
                    >
                        Пройти тест
                    </Link>

                    <Link

                        to="/chat"
                        onMouseEnter={() => !isFeedbackModalOpen && setVisibleTooltip('courses')}
                        className={styles.navLinkItem}
                    >
                        Обратная связь
                    </Link>
                </div>

                <div className={styles.lastpart}>
                    <div>
                        <div onClick={() => navigate('/profile')}>
                            <img src={"./user-svgrepo-com.svg"} className={styles.profileIcon} alt="User Icon" />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default TopNavbar;