// src/components/Teacher/Coursebuild/Step2LessonDetails.jsx
import React, { useState, useEffect } from 'react';
import styles from '../CoursesBuilderPage.module.css'; // Используем те же стили

// Принимаем initialDetails для инициализации, onDataChange для обновления состояния родителя, onNext, onPrev, isSaving
const Step2LessonDetails = ({ initialDetails, onDataChange, onNext, onPrev, isSaving }) => {
    // Внутреннее состояние компонента для формы
    const [lessonDetails, setLessonDetails] = useState(initialDetails);

    // Синхронизация внутреннего состояния с внешним при изменении initialDetails (например, при переходе "Назад")
    useEffect(() => {
        setLessonDetails(initialDetails);
    }, [initialDetails]);


    // Обработчик изменения полей
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const updatedDetails = { ...lessonDetails, [name]: value };
        setLessonDetails(updatedDetails); // Обновляем внутреннее состояние
        onDataChange(updatedDetails);    // Обновляем состояние в родительском компоненте
    };

    // Обработчик кнопки "Продолжить"
    const handleNextClick = () => {
        // Валидация перед переходом
        if (!lessonDetails.title.trim()) {
            alert('Пожалуйста, введите название урока.');
            return;
        }
        // Описание может быть необязательным, в зависимости от требований
        // if (!lessonDetails.description.trim()) {
        //     alert('Пожалуйста, введите описание урока.');
        //     return;
        // }

        // Вызываем обработчик перехода в родительском компоненте, передавая данные
        onNext(lessonDetails);
    };

    return (
        <div>
            <h3>Этап 2: Детали первого урока</h3>
            <p>Заполните название и описание вашего первого урока.</p>

            {/* Поле ввода названия урока */}
            <div className={styles.formGroup}>
                <label htmlFor="lessonTitle">Название урока</label>
                <input
                    type="text"
                    id="lessonTitle"
                    name="title" // name должен соответствовать ключу в состоянии lessonDetails
                    value={lessonDetails.title}
                    onChange={handleInputChange}
                    placeholder="Название урока"
                    required
                    disabled={isSaving} // Отключаем поля во время сохранения
                />
            </div>

            {/* Поле ввода описания урока */}
            <div className={styles.formGroup}>
                <label htmlFor="lessonDescription">Описание урока (опционально)</label>
                <textarea
                    id="lessonDescription"
                    name="description" // name должен соответствовать ключу в состоянии lessonDetails
                    value={lessonDetails.description}
                    onChange={handleInputChange}
                    placeholder="Краткое описание урока"
                    rows="3"
                    disabled={isSaving} // Отключаем поля во время сохранения
                />
            </div>

            <div className={styles.navigationButtons}>
                <button onClick={onPrev} className={styles.navButton} disabled={isSaving}>Назад</button>
                {/* Кнопка "Продолжить" вызывает handleNextClick, который передает lessonDetails в родителя */}
                <button onClick={handleNextClick} className={styles.navButton} disabled={isSaving}>
                    {isSaving ? 'Создание курса...' : 'Продолжить'}
                </button>
            </div>
        </div>
    );
};

export default Step2LessonDetails;