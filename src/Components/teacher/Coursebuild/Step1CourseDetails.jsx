// src/components/Teacher/CourseBuilder/Step1CourseDetails.js
import React from 'react';
import styles from '../CoursesBuilderPage.module.css'; // Используем те же стили

const Step1CourseDetails = ({ courseData, setCourseData, onNext }) => {
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCourseData(prev => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = (e) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setCourseData(prev => ({ ...prev, previewImage: imageUrl, imageName: file.name }));
            console.log("Изображение 'загружено':", file.name);
            // Важно: Отозвать URL после использования, чтобы избежать утечек памяти
            // Например, в useEffect при размонтировании или когда картинка меняется
            // return () => URL.revokeObjectURL(imageUrl); <<-- сделать так в основном компоненте при необходимости
        }
    };

    const handleNextClick = () => {
        if (!courseData.courseName || !courseData.courseDescription) {
            alert('Пожалуйста, заполните название и описание курса.');
            return;
        }
        onNext();
    }

    return (
        <div>
            <h3>Этап 1: Создание нового курса</h3>
            <div className={styles.formGroup}>
                <label htmlFor="courseName">Название курса</label>
                <input
                    type="text"
                    id="courseName"
                    name="courseName"
                    value={courseData.courseName}
                    onChange={handleInputChange}
                    placeholder="Введите название курса"
                    required // Добавим required для базовой валидации браузером
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="courseDescription">Описание курса</label>
                <textarea
                    id="courseDescription"
                    name="courseDescription"
                    value={courseData.courseDescription}
                    onChange={handleInputChange}
                    placeholder="Опишите ваш курс"
                    rows="4"
                    required
                />
            </div>
            <div className={styles.formGroup}>
                <label htmlFor="coursePreview">Превью курса</label>
                <div className={styles.imageUpload}>
                    {courseData.previewImage ? (
                        <img src={courseData.previewImage} alt="Превью курса" className={styles.previewImage} />
                    ) : (
                        <div className={styles.imagePlaceholder}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
                                <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.773a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1z"/>
                            </svg>
                            <span>Загрузите изображение для превью курса</span>
                        </div>
                    )}
                    <label className={styles.uploadButton}>
                        <input type="file" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }}/>
                        {courseData.imageName ? `Изменить (${courseData.imageName})` : 'Загрузить изображение'}
                    </label>
                </div>
            </div>
            {/* Кнопка Продолжить теперь внутри компонента шага */}
            <div className={styles.navigationButtons} style={{ justifyContent: 'flex-end' }}> {/* Выравнивание кнопки вправо */}
                <button onClick={handleNextClick} className={styles.navButton}>Продолжить</button>
            </div>
        </div>
    );
};

export default Step1CourseDetails;