import styles from './CoursesPage.module.css';
import React from 'react';
import CoursePageContent from "./CoursePageContent.jsx";
import {useIsRegisteredQuery} from "../../Redux/api/studentApi.js";
import {useParams} from "react-router-dom";
import CoursePreview from "./CoursePreview.jsx";

const CoursesPage = (props) => {
    const {courseId} = useParams();
    const {
        data: isRegistered, isLoading: isLoadingRegistration,
        error: registrationError
    } = useIsRegisteredQuery(courseId);

    return (
        <div className={styles.coursesPage}>
            {isRegistered ? <CoursePageContent {...props}/> : <CoursePreview courseId={courseId}/>}
        </div>
    )
}

export default CoursesPage;