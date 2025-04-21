import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CourseDetail.module.css';
import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";

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

const StudentList = [
    { id: 1, name: "Иван Иванов", percentageCourse: 75, percentageTests: 45},
    { id: 2, name: "Иван Иванов", percentageCourse: 75, percentageTests: 75},
    { id: 3, name: "Иван Иванов", percentageCourse: 75, percentageTests: 77},
    { id: 4, name: "Иван Иванов", percentageCourse: 75, percentageTests: 64},
    { id: 5, name: "Иван Иванов", percentageCourse: 75, percentageTests: 0},
    { id: 6, name: "Иван Иванов", percentageCourse: 75, percentageTests: 35},
    { id: 7, name: "Иван Иванов", percentageCourse: 75, percentageTests: 28},
    { id: 8, name: "Иван Иванов", percentageCourse: 75, percentageTests: 20}
]

const CourseStat = [
    {name: "Пользователи", value: 124},
    {name: "Курсы", value: 12},
    {name: "Завершено", value: 89}
]

const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const foundCourse = placeholderCoursesData.find(c => c.id === parseInt(courseId));

        if (foundCourse) {
            setCourse(foundCourse);
        } else {
            navigate('/teacher/mycourses', { replace: true });
        }
        setLoading(false);
    }, [courseId, navigate]);

    const handleGoBackToCourses = () => {
        navigate('/teacher/mycourses');
    };

    const handleLessonClick = (lessonId) => { // Принимаем ID урока, если нужно
        console.log(`Клик по уроку ID: ${lessonId}. Перенаправление на /courses`);
        navigate('/teacher/courses');
    };


    if (loading) {
        return <div>Загрузка...</div>;
    }

    if (!course) {
        return null;
    }

    return (
        <div className={styles.courseDetailPage}>
            <div className={styles.courseDetailContainer}>

                <div className={styles.detailHeader}>
                    <h3 className={styles.courseTitle}>{course.name}</h3>
                </div>

                <div className={styles.detailBody}>
                    <div className={styles.previewArea}>
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
                                    key={lesson.id || index}
                                    className={styles.lessonItemInList}
                                    onClick={() => handleLessonClick(lesson.id)}
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
                    <div className={styles.studentGrid}>
                        {StudentList.map((student, index) => (
                            <div key={student.id || index} className={styles.studentCard}>
                                <strong>{index + 1}. {student.name}</strong><br />
                                Прогресс по курсу: {student.percentageCourse}%<br />
                                Прогресс по тестам: {student.percentageTests}%
                            </div>
                        ))}
                    </div>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={CourseStat} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

            </div>
        </div>
    );
};

export default CourseDetail;