// src/components/Teacher/TestComponent.js
import React, { useState, useEffect } from 'react';
import styles from './TestComponent.module.css';
// Импортируем хуки для получения и отправки тестов
import { useGetLessonTestQuery, useSubmitTestResultMutation } from '../../Redux/api/testApi.js'; // Импортируем useSubmitTestResultMutation

// Компонент теперь принимает lessonId и courseId
const TestComponent = ({ lessonId, courseId }) => { // <-- Принимаем lessonId и courseId
    // Удаляем хардкодный массив questions
    // const questions = [...];

    // Используем хук для загрузки тестов по lessonId
    const {
        data: lessonTests,
        isLoading: isLoadingTests,
        error: testsError
    } = useGetLessonTestQuery(lessonId, {
        skip: !lessonId,
    });

    // <-- ИСПОЛЬЗУЕМ ХУК ДЛЯ ОТПРАВКИ РЕЗУЛЬТАТОВ ТЕСТА
    const [submitTestResult, {
        isLoading: isSubmittingResult,
        isSuccess: isResultSubmittedSuccess,
        isError: isSubmitResultError,
        error: submitResultError
    }] = useSubmitTestResultMutation();


    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);

    // Сбрасываем состояние ответов, если загружаются новые тесты (при смене урока)
    useEffect(() => {
        setAnswers({});
        setSubmitted(false);
        setScore(null);
    }, [lessonTests]); // Срабатывает при изменении данных тестов

    // Логи для отладки результата отправки
    useEffect(() => {
        if (isResultSubmittedSuccess) {
            console.log("Результаты теста успешно отправлены!");
            // Здесь можно показать сообщение об успехе или перенаправить пользователя
            // alert("Результаты теста успешно отправлены!"); // Пример
        }
        if (isSubmitResultError) {
            console.error("Ошибка отправки результатов теста:", submitResultError);
            const submitErrorMsg = submitResultError?.data?.message || submitResultError?.error || JSON.stringify(submitResultError);
            alert(`Ошибка отправки результатов теста: ${submitErrorMsg}`);
        }
    }, [isResultSubmittedSuccess, isSubmitResultError, submitResultError]);


    const handleAnswerSelect = (questionId, selectedOption) => {
        if (!submitted && lessonTests) {
            setAnswers(prevAnswers => ({
                ...prevAnswers,
                [questionId]: selectedOption
            }));
        }
    };

    const handleSubmit = () => {
        if (submitted || !lessonTests || !courseId || !lessonId) return; // Добавляем проверки courseId и lessonId

        let correctAnswersCount = 0;
        lessonTests.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                correctAnswersCount++;
            }
        });

        const finalScore = correctAnswersCount; // Сохраняем финальный счет
        setScore(finalScore); // Обновляем состояние счета для отображения

        setSubmitted(true); // Отмечаем тест как завершенный

        // <-- ОТПРАВКА РЕЗУЛЬТАТОВ ТЕСТА НА БЭКЕНД
        const resultData = {
            courseId: parseInt(courseId, 10), // Преобразуем courseId в число, если он строка
            score: finalScore // Отправляем рассчитанный счет
        };

        console.log(`Отправка результатов теста для урока ${lessonId}:`, resultData);

        // Вызываем мутацию для отправки результатов
        submitTestResult({
            lessonId: lessonId, // ID урока для URL
            body: resultData    // Тело запроса с courseId и score
        });
    };

    const getOptionClassName = (question, option) => {
        if (!submitted) return styles.optionLabel;

        const originalQuestion = lessonTests?.find(q => q.id === question.id);
        if (!originalQuestion) return styles.optionLabel;

        const isCorrect = option === originalQuestion.correctAnswer;
        const isSelected = answers[question.id] === option;

        if (isCorrect) {
            return `${styles.optionLabel} ${styles.correct}`;
        }
        if (isSelected && !isCorrect) {
            return `${styles.optionLabel} ${styles.incorrect}`;
        }
        return styles.optionLabel;
    };

    if (isLoadingTests) {
        return <div className={styles.loading}>Загрузка тестов...</div>;
    }

    if (testsError) {
        const testsErrorMsg = testsError?.data?.message || testsError?.error || JSON.stringify(testsError);
        return <div className={styles.error}>Ошибка загрузки тестов: {testsErrorMsg}</div>;
    }

    if (!lessonTests || lessonTests.length === 0) {
        return <div className={styles.noContent}>Тесты для этого урока отсутствуют.</div>;
    }

    return (
        <div className={styles.testContainer}>
            <h2>Тестирование по уроку</h2>

            {!submitted ? (
                lessonTests && lessonTests.length > 0 ? (
                    <p>Выберите один ответ для каждого вопроса.</p>
                ) : null
            ) : (
                <div className={styles.results}>
                    <h3>Результаты теста</h3>
                    <p>Вы ответили правильно на {score} из {lessonTests.length} вопросов.</p>
                    {lessonTests.length > 0 && (
                        <p>Ваш результат: {((score / lessonTests.length) * 100).toFixed(0)}%</p>
                    )}
                </div>
            )}

            {lessonTests && lessonTests.length > 0 && (
                <form onSubmit={(e) => e.preventDefault()}>
                    {lessonTests.map((q) => (
                        <div key={q.id} className={styles.questionBlock}>
                            <p className={styles.questionText}>{q.question}</p>
                            <div className={styles.optionsList}>
                                {q.answers.map((option, index) => (
                                    <label key={index} className={getOptionClassName(q, option)}>
                                        <input
                                            type="radio"
                                            name={q.id}
                                            value={option}
                                            checked={answers[q.id] === option}
                                            onChange={() => handleAnswerSelect(q.id, option)}
                                            disabled={submitted} // Отключаем ввод после отправки
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
                            // Делаем кнопку неактивной:
                            // - если тесты еще не загружены
                            // - если количество ответов не соответствует количеству вопросов
                            // - если идет отправка результата
                            className={styles.submitButton}
                            disabled={!lessonTests || Object.keys(answers).length !== lessonTests.length || isSubmittingResult} // <-- Добавлена проверка isSubmittingResult
                        >
                            {isSubmittingResult ? 'Отправка...' : 'Завершить тест'} {/* <-- Изменяем текст кнопки при отправке */}
                        </button>
                    )}
                    {/* Отображаем сообщения о состоянии отправки результата */}
                    {isSubmittingResult && <p className={styles.submittingMessage}>Отправка результатов...</p>}
                    {isResultSubmittedSuccess && <p className={styles.successMessage}>Результаты успешно отправлены!</p>}
                    {isSubmitResultError && <p className={styles.errorMessage}>Ошибка при отправке результатов.</p>}


                    {submitted && (
                        // Сообщение о завершении теста, отображается после отправки ИЛИ если тест был отправлен (submitted)
                        <p className={styles.submittedMessage}>Тест завершен. Вы можете просмотреть свои ответы.</p>
                    )}
                </form>
            )}
        </div>
    );
};

export default TestComponent;