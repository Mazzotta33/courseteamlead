import React, { useState } from 'react';
import styles from './ProfilePage.module.css';
import {useGetProfileQuery} from "../../Redux/api/studentApi.js";

const ProfilePage = () => {
    const {data: userData, isLoading, error} = useGetProfileQuery()

    const handleAvatarChange = (e) => {
        console.log("change avatar");
    };

    return (
        <div className={styles.profileContainer}>
            <h2>Профиль пользователя</h2>

            <div className={styles.avatarSection}>
                <img
                    src={userData?.avatarKey} //todo
                    alt="Аватар"
                    className={styles.avatar}
                />
                <label className={styles.avatarUpload}>
                    Изменить аватар
                    <input type="file" accept="image/*" onChange={handleAvatarChange} />
                </label>
            </div>

            <div className={styles.infoSection}>
                <p><strong>Телефон:</strong> {phone}</p>
                <p><strong>Telegram ID:</strong> {telegramId}</p>
                <p><strong>Завершённые курсы:</strong> {mockCourses.filter(c => c.progress === 100).length}</p>
                <p><strong>Пройденные тесты:</strong> 5</p>
                <p><strong>Средний балл по тестам:</strong> 78%</p>
                <p><strong>Лучший результат:</strong> 95%</p>
            </div>

            <div className={styles.courseProgressSection}>
                <h3>Прогресс по курсам</h3>
                {mockCourses.map((course, index) => (
                    <div key={index} className={styles.courseItem}>
                        <p>{course.title}</p>
                        <div className={styles.progressBar}>
                            <div
                                className={styles.progressFill}
                                style={{ width: `${course.progress}%` }}
                            >
                                {course.progress}%
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProfilePage;
