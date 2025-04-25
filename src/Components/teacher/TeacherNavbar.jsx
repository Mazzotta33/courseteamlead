import React from 'react';
import styles from '../Layout/TopNavbar.module.css';
import {Link} from "react-router-dom";
import logo from '../Layout/logo.jpg';

const TeacherNavbar = ({ handleLogout }) => {
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
            <div className={styles.logoSection}>
                <Link to="/teacher" className={styles.brand}>Барс Групп</Link>
                <img src={logo} alt="Логотип" className={styles.logo} />
            </div>

            <div className={styles.navLinks}>
                {teacherLinks.map(link => (
                    <Link key={link.path} to={link.path} className={styles.navLinkItem}>
                        {link.text}
                    </Link>
                ))}
            </div>

            <div className={styles.authButtons}>
                <button onClick={onLogoutClick} className={styles.logoutButton}>Выйти</button>
            </div>
        </div>
    );
};

export default TeacherNavbar;