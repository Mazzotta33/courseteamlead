import React, { useState } from 'react'; // useState больше не нужен для модала, но может использоваться внутри компонента
import { useNavigate } from 'react-router-dom';
import styles from './AdminCourses.module.css'; // Import the CSS Module
// import CourseDetail from './CourseDetail'; // CourseDetail теперь рендерится через роут

const AdminCourses = () => {
    const navigate = useNavigate(); // Initialize useNavigate

    const handleCreateCourseClick = () => {
        navigate('/teacher/builder');
    };

    let coursesData = [
        {
            id: 1,
            link: "https://avatars.mds.yandex.net/i?id=80c92e08b6f3e2b7d7b0c50265a9c907_l-5875850-images-thumbs&n=13",
            name: "Основы React",
            description: "Изучите базовые концепции React от нуля до первого приложения.",
            preview: "placeholder_preview_link_1", // Placeholder for preview image/video
            lessons: [
                { title: "Введение в React" },
                { title: "Компоненты и Пропсы" },
                { title: "Состояние и Жизненный цикл" },
            ]
        },
        {
            id: 2,
            link: "https://avatars.mds.yandex.net/i?id=80c92e08b6f3e2b7d7b0c50265a9c907_l-5875850-images-thumbs&n=13",
            name: "Продвинутый JavaScript",
            description: "Глубокое погружение в современные возможности JavaScript.",
            preview: "placeholder_preview_link_2",
            lessons: [
                { title: "Async/Await" },
                { title: "Модули ES6" },
                { title: "Работа с API" },
            ]
        },
        {
            id: 3,
            link: "https://avatars.mds.yandex.net/i?id=80c92e08b6f3e2b7d7b0c50265a9c907_l-5875850-images-thumbs&n=13",
            name: "CSS-модули",
            description: "Эффективное управление стилями в больших проектах.",
            preview: "placeholder_preview_link_3",
            lessons: [
                { title: "Что такое CSS-модули" },
                { title: "Настройка и использование" },
                { title: "Преимущества и недостатки" },
            ]
        },
    ];

    const handleCourseClick = (courseId) => {
        navigate(`/teacher/mycourses/detail/${courseId}`);
    };


    return (
        <div className={styles.dashboardContainer}>
            <div className={styles.dashboardHeader}>
                <h2 className={styles.dashboardTitle}>Мои курсы</h2>
                <button
                    className={styles.createCourseButton}
                    onClick={handleCreateCourseClick}
                >
                    Создать курс
                </button>
            </div>

            <div className={styles.coursesGrid}>
                {/* Map over the coursesData to render course items */}
                {coursesData.map((course) => ( // Use course.id as key and pass it to handler
                    <figure
                        key={course.id}
                        className={styles.card}
                        onClick={() => handleCourseClick(course.id)} // Pass course ID to handler
                    >
                        <img src={course.link} alt={`Курс ${course.name}`} className={styles.image}/>
                        <figcaption>{course.name}</figcaption>
                    </figure>
                ))}
            </div>

        </div>
    );
};

export default AdminCourses;