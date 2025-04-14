import React, { useState } from 'react';
import styles from './CoursesPage.module.css';
// Assuming you have these components or placeholders
// import TooltipForCourse from "./TooltipForCourse.jsx"; // Not used in the snippet provided, but kept import
import TopNavbar from "./TopNavbar.jsx"; // Assuming this exists
import TestComponent from "./TestComponent.jsx"; // Placeholder for your test component

const lessons = [
    {
        id: 'intro-prog', // Added unique IDs for better key management
        title: 'Введение в программирование',
        description: 'Базовые концепции и принципы программирования для начинающих',
        duration: '45 мин',
        videoId: 'dQw4w9WgXcQ' // Example video ID
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

const CoursesPage = () => {
    // State to manage which lesson is selected (null if none or viewing test)
    const [selectedLesson, setSelectedLesson] = useState(null);
    // State to manage what the sidebar shows: 'menu' or 'lessons'
    const [sidebarView, setSidebarView] = useState('menu');
    // State to manage what the main content shows: 'lesson', 'test', or 'welcome'/'none'
    const [mainContentView, setMainContentView] = useState('welcome'); // Start with a welcome/empty state

    const handleShowLessons = () => {
        setSidebarView('lessons');
        // Optionally select the first lesson automatically when showing the list
        if (lessons.length > 0) {
            setSelectedLesson(lessons[0]);
            setMainContentView('lesson');
        } else {
            setSelectedLesson(null);
            setMainContentView('welcome'); // Or some 'no lessons' state
        }
    };

    const handleShowTest = () => {
        setMainContentView('test');
        setSelectedLesson(null); // No lesson selected when viewing test
        // Keep sidebar view as 'menu' or change if needed
        // setSidebarView('menu'); // Or another state like 'test_mode'
    };

    const handleSelectLesson = (lesson) => {
        setSelectedLesson(lesson);
        setMainContentView('lesson');
    };

    const handleBackToMenu = () => {
        setSidebarView('menu');
        setMainContentView('welcome'); // Go back to initial state for main content
        setSelectedLesson(null);
    };

    return (
        <div>
            <div className={styles.navbar}>
                <TopNavbar />
            </div>
            <div className={styles.courses}>
                <aside className={styles.sidebar}>
                    {sidebarView === 'menu' && (
                        <>
                            <h2>Меню курса</h2>
                            <ul className={styles.menuList}>
                                <li className={styles.menuItem} onClick={handleShowLessons}>
                                    Доступные уроки
                                </li>
                                <li className={styles.menuItem} onClick={handleShowTest}>
                                    Пройти тест
                                </li>
                            </ul>
                        </>
                    )}

                    {sidebarView === 'lessons' && (
                        <>
                            {/* Add a way to go back */}
                            <button onClick={handleBackToMenu} className={styles.backButton}>
                                ← Назад к меню
                            </button>
                            <h2>Доступные уроки</h2>
                            {lessons.length > 0 ? (
                                <ul className={styles.lessonList}>
                                    {lessons.map((lesson) => (
                                        <li
                                            key={lesson.id} // Use unique ID for key
                                            className={`${styles.lessonItem} ${selectedLesson?.id === lesson.id ? styles.active : ''}`}
                                            onClick={() => handleSelectLesson(lesson)}
                                        >
                                            <h3>{lesson.title}</h3>
                                            <p>{lesson.description}</p>
                                            <span className={styles.duration}>{lesson.duration}</span>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Нет доступных уроков.</p>
                            )}
                        </>
                    )}
                </aside>

                <main className={styles.content}>
                    {mainContentView === 'welcome' && (
                        <div className={styles.welcomeMessage}>
                            <h2>Добро пожаловать!</h2>
                            <p>Выберите урок или пройдите тест из меню слева.</p>
                        </div>
                    )}

                    {mainContentView === 'lesson' && selectedLesson && (
                        <>
                            {selectedLesson.videoId ? (
                                <div className={styles.videoWrapper}>
                                    <iframe
                                        width="100%"
                                        height="400px"
                                        // IMPORTANT: Use the correct YouTube embed URL format
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

                            <button onClick={handleShowTest} className={styles.takeTestButton}>
                                Пройти тест по этому уроку
                            </button>
                        </>
                    )}

                    {mainContentView === "test" && (
                        <TestComponent />
                    )}
                </main>
            </div>
        </div>
    );
};

export default CoursesPage;