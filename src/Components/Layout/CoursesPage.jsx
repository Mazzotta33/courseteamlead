import React, { useState } from 'react';
import styles from './CoursesPage.module.css';
import TooltipForCourse from "./TooltipForCourse.jsx";
import TopNavbar from "./TopNavbar.jsx";

const lessons = [
    {
        title: 'Введение в программирование',
        description: 'Базовые концепции и принципы программирования для начинающих',
        duration: '45 мин',
        videoId: 'dQw4w9WgXcQ'
    },
    {
        title: 'Основы JavaScript',
        description: 'Изучение основных конструкций и возможностей JavaScript',
        duration: '60 мин',
        videoId: null
    },
    {
        title: 'Разработка веб-приложений',
        description: 'Построение современных веб-приложений с использованием React',
        duration: '75 мин',
        videoId: null
    }
];

const CoursesPage = () => {
    const [selectedLesson, setSelectedLesson] = useState(lessons[0]);

    return (

        <div>
            <div className={styles.navbar}>
                <TopNavbar/>
            </div>
            <div className={styles.courses}>
                <aside className={styles.sidebar}>
                    <h2>Доступные уроки</h2>
                    <ul className={styles.lessonList}>
                        {lessons.map((lesson, index) => (
                            <li
                                key={index}
                                className={`${styles.lessonItem} ${selectedLesson.title === lesson.title ? styles.active : ''}`}
                                onClick={() => setSelectedLesson(lesson)}
                            >
                                <h3>{lesson.title}</h3>
                                <p>{lesson.description}</p>
                                <span className={styles.duration}>{lesson.duration}</span>
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className={styles.content}>
                    {selectedLesson.videoId && (
                        <div className={styles.videoWrapper}>
                            <iframe
                                width="100%"
                                height="400px"
                                src={`https://www.youtube.com/embed/${selectedLesson.videoId}`}
                                title={selectedLesson.title}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
                    )}
                    <h2>{selectedLesson.title}</h2>
                    <p>{selectedLesson.description}</p>
                </main>
            </div>
        </div>
    );
};

export default CoursesPage;
