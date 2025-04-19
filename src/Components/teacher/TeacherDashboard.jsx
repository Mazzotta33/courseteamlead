import React from 'react';
// Импортируем стили как объект 'styles'
import styles from './TeacherDashboard.module.css';

const TeacherDashboard = () => {
    // Placeholder data (замените на реальные данные позже)
    const assignedCourses = [
        { id: 1, name: 'Введение в React', students: 25 },
        { id: 2, name: 'Основы JavaScript', students: 30 },
        { id: 3, name: 'Продвинутый CSS', students: 18 },
    ];

    const recentMessages = [
        { id: 1, sender: 'Иван Петров', preview: 'Здравствуйте, не могу сдать ДЗ...' },
        { id: 2, sender: 'Администрация', preview: 'Важное обновление платформы...' },
        { id: 3, sender: 'Елена Сидорова', preview: 'Вопрос по лекции №5' },
    ];

    const stats = {
        activeStudents: 73,
        coursesTaught: 3,
        pendingSubmissions: 5,
        overallProgress: 78, // в %
    };

    return (
        // Внешний div может остаться с inline-стилем или тоже использовать модуль
        // Например, можно добавить .container в CSS и использовать className={styles.container}
        <div style={{ padding: '20px' }}>
            <h2>Панель управления учителя</h2>
            <p style={{ marginBottom: '30px', color: '#555' }}>
                Обзор актуальной информации: назначенные курсы, последние сообщения от студентов или администрации, уведомления, быстрая статистика.
            </p>

            {/* Контейнер для виджетов */}
            {/* Используем класс из модуля CSS */}
            <div className={styles.dashboardGrid}>

                {/* Виджет: Назначенные курсы */}
                <div className={styles.widgetCard}>
                    <h3 className={styles.widgetTitle}>Мои курсы</h3>
                    {assignedCourses.length > 0 ? (
                        <ul className={styles.widgetList}>
                            {assignedCourses.map(course => (
                                <li key={course.id} className={styles.widgetListItem}>
                                    <span>{course.name} ({course.students} студ.)</span>
                                    <button onClick={() => alert(`Переход к курсу ${course.name}`)}>Перейти</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.noData}>У вас нет назначенных курсов.</p>
                    )}
                </div>

                {/* Виджет: Последние сообщения */}
                <div className={styles.widgetCard}>
                    <h3 className={styles.widgetTitle}>Последние сообщения</h3>
                    {recentMessages.length > 0 ? (
                        <ul className={styles.widgetList}>
                            {recentMessages.map(msg => (
                                <li key={msg.id} className={styles.widgetListItem}>
                                    <span><strong>{msg.sender}:</strong> {msg.preview}</span>
                                    <button onClick={() => alert(`Открыть сообщение от ${msg.sender}`)}>Читать</button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className={styles.noData}>Нет новых сообщений.</p>
                    )}
                </div>

                {/* Виджет: Быстрая статистика */}
                <div className={styles.widgetCard}>
                    <h3 className={styles.widgetTitle}>Быстрая статистика</h3>
                    {/* Используем widgetList для общих отступов, но можно и без него */}
                    <div className={styles.widgetList}>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Активных студентов:</span>
                            <span className={styles.statValue}>{stats.activeStudents}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Ведется курсов:</span>
                            <span className={styles.statValue}>{stats.coursesTaught}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Ожидают проверки:</span>
                            <span className={styles.statValue}>{stats.pendingSubmissions}</span>
                        </div>
                        <div className={styles.statItem}>
                            <span className={styles.statLabel}>Общий прогресс (усредн.):</span>
                            <span className={styles.statValue}>{stats.overallProgress}%</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TeacherDashboard;