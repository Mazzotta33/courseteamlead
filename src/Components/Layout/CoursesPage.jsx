import React, { useState, useEffect } from 'react'; // Import useEffect
import styles from './CoursesPage.module.css';
// Assuming you have these components or placeholders
// import TooltipForCourse from "./TooltipForCourse.jsx";
import TopNavbar from "./TopNavbar.jsx";
import TestComponent from "./TestComponent.jsx";

// Assuming lesson structure includes id, title, description, videoId
const lessons = [
    {
        id: 'intro-prog',
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

const CoursesPage = (props) => {
    const { role } = props; // Destructure role from props

    // State to manage which lesson is selected (null if none or viewing test)
    // Initialize with null, will be set in useEffect for Admin
    const [selectedLesson, setSelectedLesson] = useState(null);

    // State to manage what the sidebar shows: 'menu' or 'lessons'
    // Initialize based on role or default to 'menu'
    const [sidebarView, setSidebarView] = useState(role === 'Admin' ? 'lessons' : 'menu');

    // State to manage what the main content shows: 'lesson', 'test', or 'welcome'/'none'
    // Initialize based on role or default to 'welcome'
    const [mainContentView, setMainContentView] = useState(role === 'Admin' ? 'lesson' : 'welcome'); // Start with lesson for Admin

    useEffect(() => {
        // This effect runs after the initial render and whenever `role` or `lessons` change
        if (role === 'Admin') {
            setSidebarView('lessons');
            // Select the first lesson if lessons exist
            if (lessons.length > 0) {
                setSelectedLesson(lessons[0]);
                setMainContentView('lesson');
            } else {
                // Handle case with no lessons for Admin
                setSelectedLesson(null);
                setMainContentView('welcome'); // Or a specific 'no lessons' view
            }
        } else {
            // Reset for User role if somehow state was changed before effect
            setSidebarView('menu');
            setMainContentView('welcome');
            setSelectedLesson(null);
        }
        // Add lessons to dependency array if the lesson list can change during component's life
    }, [role]); // Effect depends on the 'role' prop

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
            {/* Render TopNavbar only for User role */}
            {role === 'User' && (
                <div className={styles.navbar}>
                    <TopNavbar/>
                </div>
            )}

            <div className={styles.courses}>
                <aside className={styles.sidebar}>
                    {/* Conditionally render sidebar content based on sidebarView state */}
                    {/* If Admin, sidebarView is initially 'lessons', skipping this block */}
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

                    {/* This block is rendered initially for Admin because sidebarView is 'lessons' */}
                    {sidebarView === 'lessons' && (
                        <>
                            {/* Add a way to go back to the menu, visible only if sidebarView can change back */}
                            {/* For Admin, maybe this button goes back to the Course Detail page or Admin dashboard? */}
                            {/* Assuming Admin might want to go back to the menu view sometimes: */}
                            {role !== 'Admin' && ( // Only show "Назад к меню" button for User or if needed for Admin too
                                <button onClick={handleBackToMenu} className={styles.backButton}>
                                    ← Назад к меню
                                </button>
                            )}
                            {/* If Admin always starts here and cannot go back to the menu, remove the button */}

                            <h2>Доступные уроки</h2>
                            {lessons.length > 0 ? (
                                <ul className={styles.lessonList}>
                                    {lessons.map((lesson) => (
                                        <li
                                            key={lesson.id}
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
                    {/* Conditionally render main content based on mainContentView state */}
                    {/* If Admin, mainContentView is initially 'lesson', skipping this block */}
                    {mainContentView === 'welcome' && (
                        <div className={styles.welcomeMessage}>
                            <h2>Добро пожаловать!</h2>
                            <p>Выберите урок или пройдите тест из меню слева.</p>
                        </div>
                    )}

                    {/* This block is rendered initially for Admin because mainContentView is 'lesson' */}
                    {mainContentView === 'lesson' && selectedLesson && (
                        <>
                            {selectedLesson.videoId ? (
                                <div className={styles.videoWrapper}>
                                    <iframe
                                        width="100%"
                                        height="400px"
                                        // Use the correct YouTube embed URL format
                                        src={`http://www.youtube.com/embed/${selectedLesson.videoId}`} // Corrected embed URL format
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

                            {/* Buttons container, potentially adapting styles */}
                            <div className={styles.lessonButtons || ''}> {/* Use a class if defined in CSS */}
                                <button onClick={handleShowTest} className={styles.takeTestButton}>
                                    Пройти тест по этому уроку
                                </button>
                                {/* Новая кнопка "Редактировать урок" для Admin */}
                                {role === 'Admin' && (
                                    <button onClick={() => console.log("Редактировать урок")} className={styles.editLessonButton}> {/* Add actual handler */}
                                        Редактировать урок
                                    </button>
                                )}
                            </div>
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