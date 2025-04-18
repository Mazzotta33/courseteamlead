// src/components/Teacher/CourseBuilderPage.js
import React, { useState, useEffect } from 'react';
import styles from './CoursesBuilderPage.module.css';
import Step1CourseDetails from "./Coursebuild/Step1CourseDetails.jsx";
import Step2LectureEditor from "./Coursebuild/Step2LectureEditor.jsx";
import Step3TestCreator from "./Coursebuild/Step3TestCreator.jsx"; // Импорт стилей

const CourseBuilderPage = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [courseData, setCourseData] = useState({
        courseName: '',
        courseDescription: '',
        previewImage: null, // URL превью (временный)
        imageName: '',      // Имя файла
        // Можно добавить id курса, если он генерируется в начале
    });
    const [lectures, setLectures] = useState([]);
    // const [testData, setTestData] = useState({}); // Для будущего

    // Очистка временного URL изображения при размонтировании компонента или смене картинки
    useEffect(() => {
        const imageUrl = courseData.previewImage;
        return () => {
            if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imageUrl);
                console.log("Отозван URL:", imageUrl)
            }
        };
    }, [courseData.previewImage]);


    const handleNext = () => {
        if (currentStep < 3) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 1) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleFinish = () => {
        console.log("--- Финальные данные курса ---");
        console.log("Детали:", courseData);
        console.log("Лекции:", lectures);
        // console.log("Тест:", testData); // Когда будет реализовано
        alert('Курс успешно создан! (смотрите финальные данные в консоли)');

        // Опционально: сброс состояния для создания нового курса
        setCurrentStep(1);
        setCourseData({ courseName: '', courseDescription: '', previewImage: null, imageName: '' });
        setLectures([]);
        // setTestData({});
        // TODO: Перенаправление на страницу списка курсов или дашборд
    };

    // Функция для рендеринга текущего шага
    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return <Step1CourseDetails
                    courseData={courseData}
                    setCourseData={setCourseData}
                    onNext={handleNext}
                />;
            case 2:
                return <Step2LectureEditor
                    lectures={lectures}
                    setLectures={setLectures}
                    onNext={handleNext}
                    onPrev={handlePrev}
                />;
            case 3:
                return <Step3TestCreator
                    // testData={testData} // Передать, если нужно
                    // setTestData={setTestData} // Передать, если нужно
                    onPrev={handlePrev}
                    onFinish={handleFinish}
                />;
            default:
                return <div>Неизвестный шаг</div>;
        }
    };

    return (
        <div className={styles.courseBuilderContainer}>
            <h2>Конструктор курсов</h2>
            {/* Индикатор прогресса */}
            <div className={styles.progressBar}>
                <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>1. Детали</div>
                <div className={`${styles.connector} ${currentStep > 1 ? styles.active : ''}`}></div>
                <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>2. Лекции</div>
                <div className={`${styles.connector} ${currentStep > 2 ? styles.active : ''}`}></div>
                <div className={`${styles.step} ${currentStep >= 3 ? styles.active : ''}`}>3. Тест</div>
            </div>

            {/* Содержимое текущего шага */}
            <div className={styles.stepContent}>
                {renderStep()}
            </div>
        </div>
    );
};

export default CourseBuilderPage;