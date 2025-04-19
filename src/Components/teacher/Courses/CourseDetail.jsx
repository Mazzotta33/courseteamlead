import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CourseDetail.module.css';

// В реальном приложении эти данные должны быть загружены из API
// Перенесем их за пределы компонента CourseDetail или загрузим в useEffect
const placeholderCoursesData = [
    {
        id: 1,
        link: "https://avatars.mds.yandex.net/i?id=80c92e08b6f3e2b7d7b0c50265a9c907_l-5875850-images-thumbs&n=13",
        name: "Основы React",
        description: "Изучите базовые концепции React от нуля до первого приложения.",
        preview: "placeholder_preview_link_1", // Placeholder for preview image/video
        lessons: [
            { id: 101, title: "Введение в React" }, // Добавлены ID уроков для примера, хотя они не используются в этой версии навигации
            { id: 102, title: "Компоненты и Пропсы" },
            { id: 103, title: "Состояние и Жизненный цикл" },
        ]
    },
    {
        id: 2,
        link: "https://avatars.mds.yandex.net/i?id=80c92e08b6f3e2b7d7b0c50265a9c907_l-5875850-images-thumbs&n=13",
        name: "Продвинутый JavaScript",
        description: "Глубокое погружение в современные возможности JavaScript.",
        preview: "placeholder_preview_link_2",
        lessons: [
            { id: 201, title: "Async/Await" },
            { id: 202, title: "Модули ES6" },
            { id: 203, title: "Работа с API" },
        ]
    },
    {
        id: 3,
        link: "https://avatars.mds.yandex.net/i?id=80c92e08b6f3e2b7d7b0c50265a9c907_l-5875850-images-thumbs&n=13",
        name: "CSS-модули",
        description: "Эффективное управление стилями в больших проектах.",
        preview: "placeholder_preview_link_3",
        lessons: [
            { id: 301, title: "Что такое CSS-модули" },
            { id: 302, title: "Настройка и использование" },
            { id: 303, title: "Преимущества и недостатки" },
        ]
    },
];


const CourseDetail = () => {
    const { courseId } = useParams(); // Получаем courseId из URL
    const navigate = useNavigate(); // Инициализируем useNavigate

    const [course, setCourse] = useState(null); // Состояние для хранения данных текущего курса
    const [loading, setLoading] = useState(true); // Состояние загрузки данных

    useEffect(() => {
        // Здесь должна быть логика загрузки данных курса по courseId из API
        const foundCourse = placeholderCoursesData.find(c => c.id === parseInt(courseId)); // Парсим ID в число

        if (foundCourse) {
            setCourse(foundCourse);
        } else {
            // Обработка случая, когда курс не найден (например, редирект на 404 или страницу курсов)
            navigate('/teacher/mycourses', { replace: true }); // Перенаправляем назад, если курс не найден
        }
        setLoading(false); // Убираем состояние загрузки
    }, [courseId, navigate]); // Перезапускаем эффект при изменении courseId

    const handleGoBackToCourses = () => {
        // Навигация назад к списку курсов AdminCourses
        navigate('/teacher/mycourses');
    };

    // НОВАЯ ФУНКЦИЯ: Обработка клика по уроку для перехода на CoursesPage
    const handleLessonClick = (lessonId) => { // Принимаем ID урока, если нужно
        console.log(`Клик по уроку ID: ${lessonId}. Перенаправление на /courses`);
        // Перенаправление на страницу CoursesPage
        // Если CoursesPage должна показать конкретный урок/курс, вам нужно передать ID:
        // navigate(`/courses?courseId=${course.id}&lessonId=${lessonId}`);
        // Или просто перейти на CoursesPage:
        navigate('/teacher/courses');
    };


    if (loading) {
        return <div>Загрузка...</div>; // Или любой другой индикатор загрузки
    }

    // Если курс не найден после загрузки (хотя useEffect уже редиректит), можно вернуть null или сообщение
    if (!course) {
        return null;
    }

    return (
        // Используем класс для страницы, а не оверлея
        <div className={styles.courseDetailPage}>
            <div className={styles.courseDetailContainer}> {/* Переименовали .modalContent */}

                {/* Кнопка "Назад" для возврата к списку AdminCourses */}
                <button className={styles.closeButton} onClick={handleGoBackToCourses}>
                    × {/* Или используйте стрелку назад: ← */}
                </button>


                <div className={styles.detailHeader}>
                    <h3 className={styles.courseTitle}>{course.name}</h3>
                </div>

                <div className={styles.detailBody}>
                    <div className={styles.previewArea}>
                        {/* This is where the course preview would go */}
                        {/* For now, using a placeholder */}
                        <div className={styles.previewPlaceholder}>
                            Тут должна быть превью курса
                        </div>
                    </div>

                    <div className={styles.infoArea}>
                        <div className={styles.nameAndDescription}>
                            <h4>Название курса</h4>
                            <p>{course.name}</p>
                            <h4>Описание курса</h4>
                            <p>{course.description}</p>
                        </div>
                        <button className={styles.editButton}>Редактировать курс</button>
                    </div>
                </div>

                <div className={styles.lessonsArea}>
                    <h4>Уроки:</h4>
                    {course.lessons && course.lessons.length > 0 ? (
                        <ul>
                            {course.lessons.map((lesson, index) => (
                                <li
                                    key={lesson.id || index} // Используем ID, если есть, иначе index
                                    className={styles.lessonItemInList} // Добавим стиль для элемента списка урока
                                    onClick={() => handleLessonClick(lesson.id)} // ДОБАВЛЕН ОБРАБОТЧИК КЛИКА
                                >
                                    {`Урок ${index + 1}: "${lesson.title}"`}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Уроки для этого курса пока не добавлены.</p>
                    )}
                    <button className={styles.exportButton}>Выгрузка в эксель</button>
                </div>

                <div className={styles.studentsArea}>
                    <h4>Список учеников</h4>
                    <p>Список учеников будет здесь...</p>
                </div>

            </div>
        </div>
    );
};

export default CourseDetail;