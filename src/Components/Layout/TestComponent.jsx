import React, { useState } from 'react';
import styles from './TestComponent.module.css';

const questions = [
    {
        id: 'q1',
        questionText: 'Что такое JavaScript?',
        options: [
            'Язык разметки для веб-страниц',
            'Язык программирования для веб-разработки',
            'Система управления базами данных',
            'Графический редактор'
        ],
        correctAnswer: 'Язык программирования для веб-разработки'
    },
    {
        id: 'q2',
        questionText: 'Какой хук используется для управления состоянием в функциональных компонентах React?',
        options: [
            'useEffect',
            'useContext',
            'useState',
            'useReducer'
        ],
        correctAnswer: 'useState'
    },
    {
        id: 'q3',
        questionText: 'Как объявить переменную, значение которой не должно меняться?',
        options: [
            'let',
            'var',
            'const',
            'state'
        ],
        correctAnswer: 'const'
    }
];

const TestComponent = () => {
    const [answers, setAnswers] = useState({});
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(null);

    const handleAnswerSelect = (questionId, selectedOption) => {
        if (!submitted) {
            setAnswers(prevAnswers => ({
                ...prevAnswers,
                [questionId]: selectedOption
            }));
        }
    };

    // Handler for submitting the test
    const handleSubmit = () => {
        if (submitted) return; // Prevent re-submission

        let correctAnswersCount = 0;
        questions.forEach(q => {
            if (answers[q.id] === q.correctAnswer) {
                correctAnswersCount++;
            }
        });

        setScore(correctAnswersCount);
        setSubmitted(true);
    };

    const getOptionClassName = (question, option) => {
        if (!submitted) return styles.optionLabel; // Default style before submission

        const isCorrect = option === question.correctAnswer;
        const isSelected = answers[question.id] === option;

        if (isCorrect) {
            return `${styles.optionLabel} ${styles.correct}`;
        }
        if (isSelected && !isCorrect) {
            return `${styles.optionLabel} ${styles.incorrect}`;
        }
        return styles.optionLabel;
    };


    return (
        <div className={styles.testContainer}>
            <h2>Тестирование по курсу</h2>

            {!submitted ? (
                <p>Выберите один ответ для каждого вопроса.</p>
            ) : (
                <div className={styles.results}>
                    <h3>Результаты теста</h3>
                    <p>Вы ответили правильно на {score} из {questions.length} вопросов.</p>
                    <p>Ваш результат: {((score / questions.length) * 100).toFixed(0)}%</p>
                </div>
            )}

            <form onSubmit={(e) => e.preventDefault()}> {}
                {questions.map((q) => (
                    <div key={q.id} className={styles.questionBlock}>
                        <p className={styles.questionText}>{q.questionText}</p>
                        <div className={styles.optionsList}>
                            {q.options.map((option, index) => (
                                <label key={index} className={getOptionClassName(q, option)}>
                                    <input
                                        type="radio"
                                        name={q.id}
                                        value={option}
                                        checked={answers[q.id] === option}
                                        onChange={() => handleAnswerSelect(q.id, option)}
                                        disabled={submitted}
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
                        disabled={Object.keys(answers).length !== questions.length}
                    >
                        Завершить тест
                    </button>
                )}
                {submitted && (
                    <p className={styles.submittedMessage}>Тест завершен. Вы можете просмотреть свои ответы.</p>
                )}
            </form>
        </div>
    );
};

export default TestComponent;