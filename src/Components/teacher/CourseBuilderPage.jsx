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
        alert('Курс успешно создан! (смотрите финальные данные в консоли)');

        setCurrentStep(1);
        setCourseData({ courseName: '', courseDescription: '', previewImage: null, imageName: '' });
        setLectures([]);
    };

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
            <div className={styles.progressBar}>
                <div className={`${styles.step} ${currentStep >= 1 ? styles.active : ''}`}>1. Детали</div>
                <div className={`${styles.connector} ${currentStep > 1 ? styles.active : ''}`}></div>
                <div className={`${styles.step} ${currentStep >= 2 ? styles.active : ''}`}>2. Лекции</div>
                <div className={`${styles.connector} ${currentStep > 2 ? styles.active : ''}`}></div>
                <div className={`${styles.step} ${currentStep >= 3 ? styles.active : ''}`}>3. Тест</div>
            </div>

            <div className={styles.stepContent}>
                {renderStep()}
            </div>
        </div>
    );
};

export default CourseBuilderPage;