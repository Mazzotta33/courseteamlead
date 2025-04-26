// src/components/Teacher/CourseDetail/components/CourseProgressTable.js
import React from 'react';
import styles from './CourseDetail.module.css';

const CourseProgressTable = ({
                                 courseProgressData,
                                 courseProgressLoading,
                                 courseProgressError,
                                 lessonsData
                             }) => {

    if (courseProgressLoading) {
        return <p>Загрузка прогресса учеников...</p>;
    }

    if (courseProgressError) {
        const progressErr = courseProgressError?.data?.message || courseProgressError?.error || 'Неизвестная ошибка';
        return <p className={styles.error}>Ошибка загрузки прогресса учеников: {progressErr}</p>;
    }

    if (!courseProgressData || courseProgressData.length === 0) {
        return <p>Нет данных о прогрессе учеников для этого курса.</p>;
    }

    if (!lessonsData || lessonsData.length === 0) {
        console.warn("Данные прогресса загружены, но нет данных уроков для формирования таблицы.");
        return <p>Нет данных уроков для отображения прогресса.</p>;
    }


    return (
        <div className={styles.studentsArea}>
            <h4>Прогресс учеников по курсу</h4>
            <div className={styles.progressTableContainer}>
                <table className={styles.progressTable}>
                    <thead>
                    <tr>
                        <th>Ученик</th>
                        <th>Прогресс по курсу</th>
                        {lessonsData.map(lesson => (
                            <th key={lesson.id}>{lesson.name}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {courseProgressData.map((userProgress, index) => (
                        <tr key={userProgress.username || index}>
                            <td>{userProgress.username}</td>
                            <td>{userProgress.completionPercentage}%</td>
                            {lessonsData.map(lesson => {
                                const lessonProgress = userProgress.lessonProgresses?.find(lp => lp.lessonId === lesson.id);
                                return (
                                    <td key={lesson.id}>
                                        {lessonProgress ?
                                            lessonProgress.isCompleted ?
                                                `Завершено (${lessonProgress.testScore != null ? lessonProgress.testScore : 'нет теста'})` // Проверяем на null/undefined
                                                : `Не завершено (${lessonProgress.testScore != null ? lessonProgress.testScore : 'нет теста'})`
                                            : '-'
                                        }
                                    </td>
                                );
                            })}
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CourseProgressTable;