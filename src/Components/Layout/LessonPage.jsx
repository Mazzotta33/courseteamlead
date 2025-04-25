import React from 'react';
import CoursePageContent from "./LessonPageContent.jsx";
import {useIsRegisteredQuery} from "../../Redux/api/studentApi.js";
import {useParams} from "react-router-dom";
import CoursePreview from "./CoursePreview.jsx";
import {useIsAdminOfCourseQuery} from "../../Redux/api/coursesApi.js";

const LessonPage = (props) => {
    const {courseId} = useParams();
    const {data: isAdmin, loading, error} = useIsAdminOfCourseQuery(courseId)
    console.log(isAdmin)
    const {
        data: isRegistered, isLoading: isLoadingRegistration,
        error: registrationError
    } = useIsRegisteredQuery(courseId);

    return (
        <div>
            {isRegistered || isAdmin ? <CoursePageContent {...props}/> : <CoursePreview courseId={courseId} idAdmin={isAdmin}/>}
        </div>
    )
}

export default LessonPage;