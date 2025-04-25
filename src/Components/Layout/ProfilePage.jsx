import React, { useState } from 'react';
import styles from './ProfilePage.module.css';
import {useGetUserInfoQuery} from "../../Redux/api/authApi.js";

const ProfilePage = () => {
    const [avatar, setAvatar] = useState(null);
    const [phone, setPhone] = useState('+7 (999) 123-45-67');

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const {data: userInfo = [], isLoading, error} = useGetUserInfoQuery();

    const bestCourse = userInfo.bestCourse;
    const courseProgresses = userInfo.courseProgresses || [];

    return (
        <div className={styles.profileContainer}>
            <h2>Профиль пользователя</h2>

            <div className={styles.avatarSection}>
                <img
                    src={avatar || 'https://via.placeholder.com/150'}
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
                <p><strong>Telegram ID:</strong> {userInfo.telegramusername}</p>
                <p><strong>Завершённые курсы:</strong> {userInfo.endedCourses}</p>
                <p>
                    <strong>Лучший результат:</strong>
                    {bestCourse && bestCourse.courseName
                        ? `${bestCourse.courseName} (${bestCourse.completionPercentage || 0}%)`
                        : 'Нет данных о лучшем результате'
                    }
                </p>
            </div>

            <div className={styles.courseProgressSection}>
                <h3>Прогресс по курсам</h3>
                {courseProgresses.length > 0 ? (
                    courseProgresses.map((course, index) => (
                        <div key={course.courseName || index} className={styles.courseItem}>
                            <p>{course.courseName}</p>
                            <div className={styles.progressBar}>
                                <div
                                    className={styles.progressFill}
                                    style={{ width: `${course.completionPercentage || 0}%` }}
                                >
                                    {course.completionPercentage || 0}%
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Нет данных о прогрессе по курсам.</p>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
