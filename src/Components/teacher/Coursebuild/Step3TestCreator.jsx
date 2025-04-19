import React, { useState } from 'react';
import styles from '../CoursesBuilderPage.module.css'; // Используем те же стили

const Step3TestCreator = ({ onPrev, onFinish }) => {
    // Состояние для хранения списка всех вопросов теста
    const [questions, setQuestions] = useState([]);
    // Состояние для текста текущего добавляемого вопроса
    const [currentQuestionText, setCurrentQuestionText] = useState('');
    // Состояние для вариантов ответов текущего добавляемого вопроса
    const [currentAnswers, setCurrentAnswers] = useState([{ id: Date.now(), text: '', isCorrect: false }]);

    // --- Обработчики для формы добавления вопроса ---

    // Обновление текста текущего вопроса
    const handleQuestionTextChange = (e) => {
        setCurrentQuestionText(e.target.value);
    };

    // Добавление нового пустого варианта ответа
    const handleAddAnswerOption = () => {
        // Добавляем не больше, например, 6 вариантов ответа
        if (currentAnswers.length < 6) {
            setCurrentAnswers([...currentAnswers, { id: Date.now(), text: '', isCorrect: false }]);
        } else {
            alert("Можно добавить не более 6 вариантов ответа.");
        }
    };

    // Удаление варианта ответа по id
    const handleRemoveAnswerOption = (answerIdToRemove) => {
        // Не позволяем удалять последний вариант ответа
        if (currentAnswers.length > 1) {
            setCurrentAnswers(currentAnswers.filter(answer => answer.id !== answerIdToRemove));
        } else {
            alert("Должен быть хотя бы один вариант ответа.");
        }
    };

    // Обновление текста конкретного варианта ответа
    const handleAnswerTextChange = (answerId, newText) => {
        setCurrentAnswers(currentAnswers.map(answer =>
            answer.id === answerId ? { ...answer, text: newText } : answer
        ));
    };

    // Переключение флага "правильный ответ" для конкретного варианта
    const handleCorrectAnswerToggle = (answerId) => {
        setCurrentAnswers(currentAnswers.map(answer =>
            answer.id === answerId ? { ...answer, isCorrect: !answer.isCorrect } : answer
        ));
    };

    // --- Обработчики для основного компонента ---

    // Добавление собранного вопроса в общий список
    const handleAddQuestion = () => {
        // Валидация: Проверяем, что текст вопроса не пуст
        if (!currentQuestionText.trim()) {
            alert('Пожалуйста, введите текст вопроса.');
            return;
        }
        // Валидация: Проверяем, что все варианты ответов заполнены
        if (currentAnswers.some(answer => !answer.text.trim())) {
            alert('Пожалуйста, заполните тексты всех вариантов ответа.');
            return;
        }
        // Валидация: Проверяем, что отмечен хотя бы один правильный ответ
        if (!currentAnswers.some(answer => answer.isCorrect)) {
            alert('Пожалуйста, отметьте хотя бы один правильный вариант ответа.');
            return;
        }

        // Создаем новый объект вопроса
        const newQuestion = {
            id: Date.now(), // Уникальный ID для вопроса
            text: currentQuestionText.trim(),
            answers: currentAnswers.map(a => ({ ...a, text: a.text.trim() })) // Копируем ответы, убираем лишние пробелы
        };

        // Добавляем вопрос в список
        setQuestions([...questions, newQuestion]);

        // Сбрасываем форму добавления вопроса
        setCurrentQuestionText('');
        setCurrentAnswers([{ id: Date.now(), text: '', isCorrect: false }]);
    };

    // Удаление вопроса из списка по id
    const handleDeleteQuestion = (questionIdToRemove) => {
        setQuestions(questions.filter(q => q.id !== questionIdToRemove));
    };


    // Передача данных теста родительскому компоненту при завершении
    const handleFinishClick = () => {
        // Можно добавить проверку, что хотя бы один вопрос создан
        if (questions.length === 0) {
            if (!window.confirm("Вы не добавили ни одного вопроса. Завершить создание курса без теста?")) {
                return; // Отменяем завершение, если пользователь передумал
            }
        }
        // Вызываем колбэк onFinish, передавая ему массив вопросов
        onFinish(questions);
    };

    return (
        <div>
            <h3>Этап 3: Создание теста</h3>
            <p>Добавьте вопросы и варианты ответов для теста вашего курса.</p>

            {/* Отображение списка уже добавленных вопросов */}
            <div className={styles.questionList}>
                <h4>Добавленные вопросы ({questions.length}):</h4>
                {questions.length === 0 ? (
                    <p>Пока нет добавленных вопросов.</p>
                ) : (
                    <ul>
                        {questions.map((q, index) => (
                            <li key={q.id} className={styles.questionListItem}>
                                <span>{index + 1}. {q.text} ({q.answers.filter(a=>a.isCorrect).length} прав.)</span>
                                <button
                                    onClick={() => handleDeleteQuestion(q.id)}
                                    className={styles.deleteButton}
                                    title="Удалить вопрос"
                                >
                                    &times; {/* Крестик */}
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <hr className={styles.separator} />

            {/* Форма для добавления нового вопроса */}
            <div className={styles.addQuestionForm}>
                <h4>Добавить новый вопрос:</h4>
                <div className={styles.formGroup}>
                    <label htmlFor="questionText">Текст вопроса:</label>
                    <input
                        type="text"
                        id="questionText"
                        value={currentQuestionText}
                        onChange={handleQuestionTextChange}
                        placeholder="Введите текст вопроса..."
                        className={styles.inputField}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Варианты ответа:</label>
                    {currentAnswers.map((answer, index) => (
                        <div key={answer.id} className={styles.answerOption}>
                            <input
                                type="checkbox"
                                id={`correct_${answer.id}`}
                                checked={answer.isCorrect}
                                onChange={() => handleCorrectAnswerToggle(answer.id)}
                                title="Отметить как правильный"
                                className={styles.checkbox}
                            />
                            <input
                                type="text"
                                value={answer.text}
                                onChange={(e) => handleAnswerTextChange(answer.id, e.target.value)}
                                placeholder={`Вариант ответа ${index + 1}`}
                                className={styles.inputField}
                                style={{ flexGrow: 1, marginRight: '10px' }} // Растягиваем поле ввода
                            />
                            <button
                                onClick={() => handleRemoveAnswerOption(answer.id)}
                                disabled={currentAnswers.length <= 1} // Не даем удалить последний
                                className={styles.deleteButton}
                                title="Удалить вариант ответа"
                            >
                                &times;
                            </button>
                        </div>
                    ))}
                    <button
                        onClick={handleAddAnswerOption}
                        disabled={currentAnswers.length >= 6} // Ограничение на кол-во вариантов
                        className={styles.addButton}
                        style={{marginTop: '10px'}} // Небольшой отступ сверху
                    >
                        Добавить вариант ответа
                    </button>
                </div>

                <button onClick={handleAddQuestion} className={styles.addButton}>
                    Добавить вопрос в тест
                </button>
            </div>

            <hr className={styles.separator} />

            {/* Навигационные кнопки */}
            <div className={styles.navigationButtons}>
                <button onClick={onPrev} className={styles.navButton}>Назад</button>
                <button onClick={handleFinishClick} className={styles.navButton}>Завершить создание курса</button>
            </div>
        </div>
    );
};

export default Step3TestCreator;