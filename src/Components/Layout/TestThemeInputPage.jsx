// src/Components/Layout/TestThemeInputPage.jsx

import React, { useState, useEffect } from 'react';
import styles from './TestThemeInputPage.module.css'; // Создайте соответствующий CSS файл
import QuizComponent from './QuizComponent.jsx'; // Импортируем компонент для отображения теста
import { useLazyGetQuizQuery } from '../../Redux/api/testApi.js'; // Импортируем lazy-хук

const TestThemeInputPage = () => {
    const [theme, setTheme] = useState('');
    // Используем useLazyGetQuizQuery для получения триггер-функции и состояния
    const [triggerGetQuiz, { data: quizData, isLoading, error, isSuccess }] = useLazyGetQuizQuery();

    // Обработчик отправки формы
    const handleSubmit = (e) => {
        e.preventDefault();
        if (theme.trim()) {
            console.log(`Запрашиваем тест по теме: "${theme}"`);
            // Вызываем триггер-функцию с темой в качестве аргумента
            triggerGetQuiz(theme.trim());
        }
    };

    // Эффект для логирования результатов запроса
    useEffect(() => {
        if (isSuccess && quizData) {
            console.log("Тест по теме успешно загружен:", quizData);
        }
        if (error) {
            console.error("Ошибка загрузки теста по теме:", error);
            const errorMsg = error?.data?.message || error?.error || JSON.stringify(error);
            alert(`Не удалось загрузить тест по теме: ${errorMsg}`);
        }
    }, [isSuccess, quizData, error]);


    // Если тест успешно загружен, рендерим QuizComponent
    if (isSuccess && quizData && quizData.length > 0) {
        // Передаем загруженные данные теста в QuizComponent
        return <QuizComponent quizQuestions={quizData} />;
    }

    // Если идет загрузка, показываем индикатор
    if (isLoading) {
        return <div className={styles.loading}>Загрузка теста по теме...</div>;
    }

    // Если произошла ошибка, показываем сообщение об ошибке
    if (error) {
        const errorMsg = error?.data?.message || error?.error || JSON.stringify(error);
        return <div className={styles.error}>Ошибка: {errorMsg}</div>;
    }

    // Изначально или если тест не найден, показываем форму ввода темы
    return (
        <div className={styles.container}>
            <h2>Пройти тест по теме</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="themeInput" className={styles.label}>Введите тему теста:</label>
                    <input
                        type="text"
                        id="themeInput"
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className={styles.input}
                        placeholder="Например: Основы React"
                        required
                    />
                </div>
                <button type="submit" className={styles.submitButton}>
                    Начать тест
                </button>
            </form>
            {/* Сообщение, если тест по введенной теме не найден после загрузки */}
            {isSuccess && (!quizData || quizData.length === 0) && (
                <div className={styles.noContentMessage}>
                    Тест по теме "{theme}" не найден. Попробуйте другую тему.
                </div>
            )}
        </div>
    );
};

export default TestThemeInputPage;
