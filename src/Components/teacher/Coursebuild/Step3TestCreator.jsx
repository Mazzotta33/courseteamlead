import React from 'react';
import styles from '../CoursesBuilderPage.module.css'; // Используем те же стили

const Step3TestCreator = ({ onPrev, onFinish }) => {

    const handleFinishClick = () => {
        onFinish(); // Вызываем функцию завершения из родительского компонента
    }

    return (
        <div>
            <h3>Этап 3: Создание теста</h3>
            <p>Здесь будет интерфейс для создания вопросов и ответов теста.</p>

            <div className={styles.testPlaceholder}>
                <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 16 16" >
                    <path d="M11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.5 2.5 0 1 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.603 1.628zM5.5 7a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3m-1.5 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3m6.5-1.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
                </svg>
                <span>Раздел создания теста (в разработке)</span>
                {/* Сюда можно будет добавить компонент для добавления вопросов */}
            </div>

            <div className={styles.navigationButtons}>
                <button onClick={onPrev} className={styles.navButton}>Назад</button>
                <button onClick={handleFinishClick} className={styles.navButton}>Завершить создание курса</button>
            </div>
        </div>
    );
};

export default Step3TestCreator;