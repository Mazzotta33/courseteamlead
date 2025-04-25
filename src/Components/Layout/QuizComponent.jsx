// src/Components/Layout/QuizComponent.jsx

import React, { useState, useEffect } from 'react';
import styles from './QuizComponent.module.css'; // Создайте соответствующий CSS файл
// В этом компоненте мы не отправляем результаты теста по теме на бэкенд,
// поэтому не используем useSubmitTestResultMutation.
// Если нужно отправлять результаты тестов по теме, добавьте соответствующую мутацию в testApi.js
// и используйте ее здесь.

// Принимаем quizQuestions как пропс
const QuizComponent = ({ quizQuestions }) => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);

    // Сбрасываем состояние компонента при изменении входных данных (новых вопросов)
    useEffect(() => {
        setAnswers({});
        setSubmitted(false);
        setScore(null);
    }, [quizQuestions]);


    const handleAnswerSelect = (questionId, selectedOption) => {
        if (!submitted && quizQuestions) {
            setAnswers(prevAnswers => ({
                ...prevAnswers,
                [questionId]: selectedOption
            }));
        }
    };

    const handleSubmit = () => {
        if (submitted || !quizQuestions || quizQuestions.length === 0) return;

        let correctAnswersCount = 0;
        quizQuestions.forEach(q => {
            // Сравниваем выбранный ответ с правильным ответом из данных
            if (answers[q.id] === q.correctAnswer) {
                correctAnswersCount++;
            }
        });

        const finalScore = correctAnswersCount;
        setScore(finalScore);

        setSubmitted(true);

        // <-- Здесь можно добавить логику отправки результатов теста по теме на бэкенд,
        // если такой эндпоинт существует.
        console.log(`Тест по теме завершен. Результат: ${finalScore} из ${quizQuestions.length}`);
        // Пример вызова мутации, если бы она была:
        // submitQuizResult({ theme: quizQuestions[0].theme, score: finalScore, answers: answers });
    };

    // Функция для определения класса CSS для вариантов ответа после завершения теста
    const getOptionClassName = (question, option) => {
        if (!submitted) return styles.optionLabel; // Если тест не завершен, используем базовый стиль

        // Находим оригинальный вопрос в данных, чтобы получить правильный ответ
        const originalQuestion = quizQuestions?.find(q => q.id === question.id);
        if (!originalQuestion) return styles.optionLabel; // Если вопрос не найден (чего быть не должно), базовый стиль

        const isCorrect = option === originalQuestion.correctAnswer; // Проверяем, является ли вариант правильным
        const isSelected = answers[question.id] === option;       // Проверяем, выбрал ли пользователь этот вариант

        if (isCorrect) {
            return `${styles.optionLabel} ${styles.correct}`; // Правильный ответ подсвечиваем зеленым
        }
        if (isSelected && !isCorrect) {
            return `${styles.optionLabel} ${styles.incorrect}`; // Неправильный выбранный ответ подсвечиваем красным
        }
        return styles.optionLabel; // Остальные варианты имеют базовый стиль
    };

    // Если нет вопросов для отображения (хотя TestThemeInputPage должен это обрабатывать, добавим проверку)
    if (!quizQuestions || quizQuestions.length === 0) {
        return <div className={styles.noContent}>Нет вопросов для отображения.</div>;
    }

    return (
        <div className={styles.testContainer}>
            <h2>Тест по теме</h2> {/* Можно добавить тему, если она есть в данных */}

            {!submitted ? (
                quizQuestions.length > 0 ? (
                    <p>Выберите один ответ для каждого вопроса.</p>
                ) : null
            ) : (
                <div className={styles.results}>
                    <h3>Результаты теста</h3>
                    <p>Вы ответили правильно на {score} из {quizQuestions.length} вопросов.</p>
                    {quizQuestions.length > 0 && (
                        <p>Ваш результат: {((score / quizQuestions.length) * 100).toFixed(0)}%</p>
                    )}
                </div>
            )}

            {quizQuestions.length > 0 && (
                <form onSubmit={(e) => e.preventDefault()}>
                    {/* <-- ВНИМАНИЕ: Ошибка "Encountered two children with the same key"
                         происходит потому, что бэкенд возвращает вопросы с одинаковым 'id' (например, id: 0 для всех).
                         React ожидает уникальные ключи для каждого элемента в списке.
                         Идеальное решение: Исправить бэкенд, чтобы он возвращал уникальные ID для каждого вопроса.
                         Временное решение (менее предпочтительное): Использовать index из map как ключ,
                         но это может вызвать проблемы, если порядок вопросов меняется.
                         Сейчас используется q.id, что правильно, ЕСЛИ ID уникальны.
                    */}
                    {quizQuestions.map((q /*, index*/) => ( // Можно добавить index, если использовать его как ключ
                        // Используем q.id как ключ. Убедитесь, что бэкенд возвращает УНИКАЛЬНЫЕ ID вопросов.
                        // Если бэкенд не может вернуть уникальные ID, временно используйте index:
                        // <div key={index} className={styles.questionBlock}>
                        <div key={q.id} className={styles.questionBlock}>
                            <p className={styles.questionText}>{q.question}</p>
                            <div className={styles.optionsList}>
                                {/* Для вариантов ответа использование index как ключа обычно допустимо,
                                    если порядок вариантов внутри вопроса не меняется. */}
                                {q.answers.map((option, index) => (
                                    <label key={index} className={getOptionClassName(q, option)}>
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value={option}
                                            checked={answers[q.id] === option}
                                            onChange={() => handleAnswerSelect(q.id, option)}
                                            disabled={submitted} // Отключаем ввод после завершения теста
                                            className={styles.radioInput}
                                        />
                                        {option}
                                    </label>
                                ))}
                            </div>
                        </div>
                    ))}

                    {!submitted && (
                        <button
                            type="button"
                            onClick={handleSubmit}
                            className={styles.submitButton}
                            disabled={Object.keys(answers).length !== quizQuestions.length} // Кнопка активна, когда на все вопросы есть ответы
                        >
                            Завершить тест
                        </button>
                    )}

                    {submitted && (
                        <p className={styles.submittedMessage}>Тест завершен. Вы можете просмотреть свои ответы.</p>
                    )}
                </form>
            )}
        </div>
    );
};

export default QuizComponent;
