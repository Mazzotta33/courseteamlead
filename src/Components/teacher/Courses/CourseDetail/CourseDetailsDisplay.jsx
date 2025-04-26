import React from 'react';
import styles from './CourseDetail.module.css';

const CourseDetailsDisplay = ({ course, handleDeleteCourse, isDeletingCourse }) => {
    if (!course) return null;

    return (
        <div className={styles.detailBody}>
            <div className={styles.previewArea}>
                <div className={styles.previewPlaceholder}>
                    <img src={course.previewPhotoKey} alt={`Превью курса "${course.name}"`} />
                </div>
            </div>

            <div className={styles.infoArea}>
                <div className={styles.nameAndDescription}>
                    <h4>Название курса</h4>
                    <p>{course.title}</p>
                    <h4>Описание курса</h4>
                    <p>{course.description}</p>
                </div>
                <button className={styles.deleteButton} onClick={handleDeleteCourse} disabled={isDeletingCourse}>
                    {isDeletingCourse ? 'Удаление...' : 'Удалить курс'}
                </button>
            </div>
        </div>
    );
};

export default CourseDetailsDisplay;