import React from 'react';
import styles from './CoursePreview.module.css';
import {useGetCourseQuery} from "../../Redux/api/studentApi.js";

const CoursePreview = ({courseId}) => {
    const {data: courseData = {}, isLoading, error} = useGetCourseQuery(courseId);

    const handleEnrollClick = () => {
        console.log(courseId);
    };
    console.log(courseData);

    return (
        <div className={styles.coursePreviewContainer}>
            <div className={styles.courseInfo}>
                <h2 className={styles.courseName}>{courseData.title}</h2>
                <p className={styles.courseDescription}>{courseData.description}</p>
                <button className={styles.enrollButton} onClick={() => handleEnrollClick()}>Записаться на курс</button>
            </div>
            <div className={styles.courseImageContainer}>
                <img src={courseData.previewPhotoKey} alt={courseData.name} className={styles.courseImage} />
            </div>
        </div>
    );
};

export default CoursePreview;