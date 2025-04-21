import React, { useState, useEffect } from 'react';
import styles from './CoursesPage.module.css';
import TestComponent from "./TestComponent.jsx";

const lessons = [
    {
        id: 'intro-prog',
        title: 'Введение в программирование',
        description: 'Базовые концепции и принципы программирования для начинающих',
        duration: '45 мин',
        videoId: 'dQw4w9WgXcQ'
    },
    {
        id: 'js-basics',
        title: 'Основы JavaScript',
        description: 'Изучение основных конструкций и возможностей JavaScript',
        duration: '60 мин',
        videoId: null
    },
    {
        id: 'react-dev',
        title: 'Разработка веб-приложений',
        description: 'Построение современных веб-приложений с использованием React',
        duration: '75 мин',
        videoId: null
    }
];

const CoursesPage = ({ role }) => {
    const [selectedLesson, setSelectedLesson] = useState(lessons[0]); // Первый урок по умолчанию
    const [mainContentView, setMainContentView] = useState('lesson');

    const handleSelectLesson = (lesson) => {
        setSelectedLesson(lesson);
        setMainContentView('lesson');
    };

    const handleShowTest = () => {
        setMainContentView('test');
    };

    return (
        <div className={styles.courses}>
            <aside className={styles.sidebar}>
                <h2>Доступные уроки</h2>
                {lessons.map((lesson) => (
                    <div
                        key={lesson.id}
                        className={`${selectedLesson?.id === lesson.id ? styles.active : ''}`}
                        onClick={() => handleSelectLesson(lesson)}
                    >
                        <h3>{lesson.title}</h3>
                        <p>{lesson.description}</p>
                        <span className={styles.duration}>{lesson.duration}</span>
                    </div>
                ))}
            </aside>

            <main className={styles.content}>
                {mainContentView === 'lesson' && selectedLesson && (
                    <div>
                        {selectedLesson.videoId ? (
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
                        ) : (
                            <div className={styles.noVideoMessage}>
                                <p>Видео для этого урока недоступно.</p>
                            </div>
                        )}
                        <h2>{selectedLesson.title}</h2>
                        <p>{selectedLesson.description}</p>

                        <div className={styles.lessonButtons}>
                            <button onClick={handleShowTest} className={styles.takeTestButton}>
                                Пройти тест по этому уроку
                            </button>
                            {role === 'Admin' && (
                                <button
                                    onClick={() => console.log("Редактировать урок")}
                                    className={styles.editLessonButton}
                                >
                                    Редактировать урок
                                </button>
                            )}
                        </div>
                    </div>
                )}

                {mainContentView === 'test' && (
                    <TestComponent />
                )}
            </main>
        </div>
    );
};

export default CoursesPage;
