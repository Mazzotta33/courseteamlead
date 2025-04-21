import React, { useState } from 'react';
import styles from './StatisticsPage.module.css';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import {useNavigate} from "react-router-dom";

const StatisticsPage = () => {
    const navigate = useNavigate();

    const [stats] = useState({
        totalUsers: 124,
        totalCourses: 12,
        completedCourses: 89,
        topStudents: [
            { name: "Иванов И.", completed: 8 },
            { name: "Петров П.", completed: 7 },
            { name: "Сидоров С.", completed: 6 },
        ],
        courseProgressData: [
            { course: 'React', progress: 80 },
            { course: 'JavaScript', progress: 65 },
            { course: 'CSS', progress: 45 },
        ],
        courses: [
            {name: "Основы React", id: 1},
            {name: "Основы JavaScript", id: 2},
            {name: "Основы CSS", id: 3}
        ]
    });

    const handleCourseClick = (courseId) => {
        navigate(`/teacher/mycourses/detail/${courseId}`);
    };

    return (
        <div className={styles.statisticsContainer}>
            <h2 className={styles.title}>📊 Статистика платформы</h2>

            <div className={styles.cardsContainer}>
                <div className={styles.statCard}>
                    <h3>👤 Всего пользователей</h3>
                    <p className={styles.statNumber}>{stats.totalUsers}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>📚 Всего курсов</h3>
                    <p className={styles.statNumber}>{stats.totalCourses}</p>
                </div>
                <div className={styles.statCard}>
                    <h3>✅ Завершено курсов</h3>
                    <p className={styles.statNumber}>{stats.completedCourses}</p>
                </div>
            </div>

            <div className={styles.chartSection}>
                <h3 className={styles.sectionTitle}>📈 Процент прохождения курсов</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={stats.courseProgressData}>
                        <XAxis dataKey="course" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="progress" fill="#4f46e5" />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            <div className={styles.topStudentsSection}>
                <h3 className={styles.sectionTitle}>🏆 Топ студентов по завершённым курсам</h3>
                <ul className={styles.studentsList}>
                    {stats.topStudents.map((student, index) => (
                        <li key={index} className={styles.studentItem}>
                            {index + 1}. {student.name} — <strong>{student.completed}</strong> курсов
                        </li>
                    ))}
                </ul>
            </div>

            <div>
                <h3>Список курсов</h3>
                <ul className={styles.studentsList}>
                    {stats.courses.map((course, index) => (
                        <li key={index} className={styles.studentItem} onClick={() => {handleCourseClick(course.id)}}>
                            {index + 1}. {course.name}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default StatisticsPage;
