// src/components/Teacher/CourseDetail/CourseDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CourseDetail.module.css';

import {
    useGetCoursesQuery,
    useGetCourseProgressQuery,
    useDeleteCourseMutation,
} from "../../../../Redux/api/coursesApi.js";
import { useGetLessonsQuery } from "../../../../Redux/api/lessonApi.js";

import Step2LessonDetails from "../../Coursebuild/Step2LessonDetails.jsx";
import Step3ContentEditor from "../../Coursebuild/Step3ContentEditor.jsx";
import Step4TestCreator from "../../Coursebuild/Step4TestCreator.jsx";

import CourseDetailsDisplay from './CourseDetailsDisplay.jsx';
import CourseLessonsSection from './CourseLessonsSection.jsx';
import CourseProgressTable from './CourseProgressTable.jsx';
// Убедитесь, что путь к хуку правильный
import useAddLessonWorkflow from "./hooks.jsx";


const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true); // Состояние первоначальной загрузки курса

    const [viewMode, setViewMode] = useState('details');

    const { data: coursesData = [], isLoading: coursesLoading, error: coursesError } = useGetCoursesQuery();
    const { data: lessonsData = [], isLoading: lessonsLoading, error: lessonsError, refetch: refetchLessons } = useGetLessonsQuery(courseId, { skip: !courseId }); // lessonsData и refetchLessons нужны для списка уроков и обновления после добавления/удаления
    const { data: courseProgressData = [], isLoading: courseProgressLoading, error: courseProgressError } = useGetCourseProgressQuery(courseId, { skip: !courseId }); // Прогресс нужен для таблицы

    const [deleteCourse, { isLoading: isDeletingCourse, error: deleteCourseError }] = useDeleteCourseMutation();

    // <-- ИСПРАВЛЕНО: Добавляем функции-сеттеры в деструктуризацию
    const {
        addLessonStep,
        newLessonDetails,
        setNewLessonDetails, // <-- Добавлено
        newContentItemsData,
        setNewContentItemsData, // <-- Добавлено
        newTestQuestionsData,
        setNewTestQuestionsData, // <-- Добавлено
        isSaving: isAddingLessonOrTests,
        saveError: addLessonSaveError,
        handleNextStep: handleNextAddLessonStep,
        handlePrevStep: handlePrevAddLessonStep,
        handleSubmit: handleSubmitLessonWorkflow, // Переименовано из handleSubmit в хуке
        resetWorkflow: resetAddLessonWorkflow,
    } = useAddLessonWorkflow(courseId, refetchLessons, () => setViewMode('details')); // Убедитесь, что в хуке есть resetWorkflow

    useEffect(() => {
        if (coursesData && coursesData.length > 0) {
            const foundCourse = coursesData.find(c => c.id === parseInt(courseId));

            if (foundCourse) {
                setCourse(foundCourse);
                setLoading(false);
            } else {
                console.warn(`Курс с ID ${courseId} не найден. Перенаправление.`);
                navigate('/teacher/mycourses', { replace: true });
            }
        } else if (!coursesLoading && !coursesError) {
            setLoading(false);
            console.warn("Данные курсов не загружены или список пуст. Перенаправление.");
            navigate('/teacher/mycourses', { replace: true });
        } else if (coursesError) {
            setLoading(false);
            console.error("Ошибка загрузки данных курсов:", coursesError);
        }
    }, [courseId, navigate, coursesData, coursesLoading, coursesError]);

    const handleLessonClick = (lessonId) => {
        navigate(`/teacher/courses/${courseId}`);
    };

    const handleDeleteCourse = async () => {
        if (!courseId) {
            console.error("Невозможно удалить: отсутствует ID курса.");
            alert("Невозможно удалить курс: отсутствует идентификатор.");
            return;
        }

        const isConfirmed = window.confirm(`Вы уверены, что хотите удалить курс "${course?.name || 'без названия'}"?`);

        if (!isConfirmed) {
            return;
        }

        try {
            await deleteCourse(courseId).unwrap();
            navigate("/teacher/mycourses");
        } catch (error) {
            console.error("Ошибка при удалении курса:", error);
            const deleteErrorMsg = error?.data?.message || error?.error || 'Неизвестная ошибка при удалении';
            alert(`Не удалось удалить курс: ${deleteErrorMsg}`);
        }
    };

    const handleAddLessonClick = () => {
        // При нажатии "Добавить урок", сбрасываем workflow и переключаем режим
        resetAddLessonWorkflow(); // Сбрасываем состояния в хуке
        setViewMode('add-lesson'); // Переключаем режим отображения
    };

    const handleCancelAddLesson = () => {
        if (isAddingLessonOrTests) {
            // Если идет сохранение, не позволяем отменить
            alert('Дождитесь завершения сохранения.');
            return;
        }

        if (window.confirm('Вы уверены, что хотите отменить добавление урока? Введенные данные будут потеряны.')) {
            resetAddLessonWorkflow(); // Сбрасываем состояния в хуке
            setViewMode('details'); // Возвращаемся к отображению деталей курса
        }
    };

    if (loading || coursesLoading) {
        return <div className={styles.loading}>Загрузка данных курса...</div>;
    }

    if (coursesError && !course) {
        const courseErr = coursesError?.data?.message || coursesError?.error || 'Неизвестная ошибка';
        return <div className={styles.error}>Ошибка загрузки курсов: {courseErr}</div>;
    }

    if (!course) {
        return <div className={styles.noContent}>Курс не найден.</div>;
    }

    if (viewMode === 'add-lesson') {
        const isStepDisabled = isAddingLessonOrTests; // Отключаем элементы во время сохранения

        return (
            <div className={styles.courseDetailAddLesson}>
                <h3>Добавление нового урока к курсу "{course.name}"</h3>

                {/* Индикатор загрузки при сохранении */}
                {isAddingLessonOrTests && (
                    <div className={styles.loadingOverlay}>
                        Сохранение урока и тестов...
                    </div>
                )}

                {/* Сообщение об ошибке сохранения */}
                {addLessonSaveError && !isAddingLessonOrTests && (
                    <div className={styles.errorMessage}>
                        Ошибка сохранения: {addLessonSaveError?.data?.message || addLessonSaveError?.error || 'Неизвестная ошибка API'}
                        {/* Отображение деталей валидационных ошибок, если они есть */}
                        {addLessonSaveError?.data?.errors && (
                            <pre className={styles.validationErrors}>
                                 {JSON.stringify(addLessonSaveError.data.errors, null, 2)}
                             </pre>
                        )}
                    </div>
                )}

                {/* Рендеринг шагов добавления урока */}
                {addLessonStep === 2 && (
                    <Step2LessonDetails
                        initialDetails={newLessonDetails}
                        // <-- Передаем функцию-сеттер из хука
                        onDataChange={setNewLessonDetails}
                        onNext={handleNextAddLessonStep}
                        onPrev={handlePrevAddLessonStep}
                        isSaving={isStepDisabled}
                    />
                )}
                {addLessonStep === 3 && (
                    <Step3ContentEditor
                        initialContentItems={newContentItemsData}
                        // <-- Передаем функцию-сеттер из хука
                        onDataChange={setNewContentItemsData}
                        onNext={handleNextAddLessonStep}
                        onPrev={handlePrevAddLessonStep}
                        isSaving={isStepDisabled}
                    />
                )}
                {addLessonStep === 4 && (
                    <Step4TestCreator
                        initialQuestions={newTestQuestionsData}
                        // <-- Передаем функцию-сеттер из хука (возможно, onDataChange или onQuestionsChange)
                        onDataChange={setNewTestQuestionsData} // Убедитесь, что Step4TestCreator принимает onDataChange
                        onFinish={handleSubmitLessonWorkflow}
                        onPrev={handlePrevAddLessonStep}
                        isSaving={isStepDisabled}
                    />
                )}

                {/* Кнопка отмены добавления урока */}
                <button
                    onClick={handleCancelAddLesson}
                    className={styles.cancelButton}
                    disabled={isAddingLessonOrTests}
                >
                    Отменить добавление урока
                </button>

            </div>
        );
    }

    // Режим отображения деталей курса
    return (
        <div className={styles.courseDetailPage}>
            <div className={styles.courseDetailContainer}>
                {/* Отображение деталей курса */}
                <CourseDetailsDisplay
                    course={course}
                    handleDeleteCourse={handleDeleteCourse}
                    isDeletingCourse={isDeletingCourse}
                />

                {/* Секция уроков курса */}
                <CourseLessonsSection
                    lessonsData={lessonsData}
                    lessonsLoading={lessonsLoading}
                    lessonsError={lessonsError}
                    handleAddLessonClick={handleAddLessonClick}
                    handleLessonClick={handleLessonClick}
                />

                <CourseProgressTable
                    courseProgressData={courseProgressData}
                    courseProgressLoading={courseProgressLoading}
                    courseProgressError={courseProgressError}
                    lessonsData={lessonsData} // lessonsData может быть нужен для сопоставления прогресса с уроками
                />
            </div>
        </div>
    );
};

export default CourseDetail;
