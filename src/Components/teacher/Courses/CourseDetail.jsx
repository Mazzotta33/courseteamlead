import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CourseDetail.module.css';
import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useGetCoursesQuery, useGetLessonsQuery, useGetUsersQuery} from "../../../Redux/api/coursesApi.js";

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

    const {data: coursesData = [], isLoading: coursesLoading, error: coursesError} = useGetCoursesQuery()
    const {data: usersData = [], isLoading, error} = useGetUsersQuery(courseId)
    const {data: lessonsData = [], isLoading: lessonsLoading, error: lessonsError} = useGetLessonsQuery(courseId)

    useEffect(() => {
        const foundCourse = coursesData.find(c => c.id === parseInt(courseId));

        if (foundCourse) {
            setCourse(foundCourse);
        } else {
            navigate('/teacher/mycourses', { replace: true });
        }
        setLoading(false);
    }, [courseId, navigate]);

    const handleLessonClick = (lessonId) => {
        console.log(`Клик по уроку ID: ${lessonId}. Перенаправление на /courses`);
        navigate(`/teacher/courses/${courseId}`);
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
                            <img src={course.previewPhotoKey}/>
                        </div>
                    </div>

                    <div className={styles.infoArea}>
                        <div className={styles.nameAndDescription}>
                            <h4>Название курса</h4>
                            <p>{course.title}</p>
                            <h4>Описание курса</h4>
                            <p>{course.description}</p>
                        </div>
                        <button className={styles.editButton}>Редактировать курс</button>
                    </div>
                </div>

                <div className={styles.lessonsArea}>
                    <h4>Уроки:</h4>
                    {lessonsData && lessonsData.length ? (
                        <ul>
                            {lessonsData.map((lesson, index) => (
                                <li
                                    key={lesson.id || index}
                                    className={styles.lessonItemInList}
                                    onClick={() => handleLessonClick(lesson.id)}
                                >
                                    {`Урок ${index + 1}: "${lesson.name}"`}
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
                        {usersData.map((student, index) => (
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