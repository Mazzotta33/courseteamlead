import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from './CourseDetail.module.css';
import {Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {useGetCoursesQuery, useGetLessonsQuery, useGetUsersQuery, useCreateLessonMutation} from "../../../Redux/api/coursesApi.js";
import {useCreateTestsMutation} from "../../../Redux/api/testApi.js";

// Импортируем компоненты шагов из конструктора
import Step2LessonDetails from "../Coursebuild/Step2LessonDetails.jsx";
import Step3ContentEditor from "../Coursebuild/Step3ContentEditor.jsx";
import Step4TestCreator from "../Coursebuild/Step4TestCreator.jsx";


const CourseStat = [
    {name: "Пользователи", value: 124},
    {name: "Курсы", value: 12},
    {name: "Завершено", value: 89}
]


const CourseDetail = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);

    const [viewMode, setViewMode] = useState('details');
    const [addLessonStep, setAddLessonStep] = useState(2);

    const [newLessonDetails, setNewLessonDetails] = useState({ title: '', description: '' });
    const [newContentItemsData, setNewContentItemsData] = useState([]);
    const [newTestQuestionsData, setNewTestQuestionsData] = useState([]);

    const handleLessonClick = (lessonId) => {
        console.log(`Клик по уроку ID: ${lessonId}. Перенаправление на /courses`);
        navigate(`/teacher/courses/${courseId}`);
    };


    const {data: coursesData = [], isLoading: coursesLoading, error: coursesError} = useGetCoursesQuery();
    const {data: lessonsData = [], isLoading: lessonsLoading, error: lessonsError, refetch: refetchLessons} = useGetLessonsQuery(courseId);
    const {data: usersData = [], isLoading: usersLoading, error: usersError} = useGetUsersQuery(courseId);

    const [createLesson, {
        isLoading: isCreatingLesson,
        isSuccess: isLessonCreatedSuccess,
        isError: isCreateLessonError,
        error: createLessonError,
        data: lessonCreationResult,
        reset: resetCreateLesson
    }] = useCreateLessonMutation();

    const [createTests, {
        isLoading: isCreatingTests,
        isSuccess: isTestsCreatedSuccess,
        isError: isCreateTestsError,
        error: createTestsError,
        reset: resetCreateTests
    }] = useCreateTestsMutation();

    const isAnyMutationLoading = isCreatingLesson || isCreatingTests;
    const isAnyMutationError = isCreateLessonError || isCreateTestsError;
    const mutationError = isCreateTestsError ? createTestsError : createLessonError;

    useEffect(() => {
        if (coursesData && coursesData.length > 0) {
            const foundCourse = coursesData.find(c => c.id === parseInt(courseId));

            if (foundCourse) {
                setCourse(foundCourse);
            } else {
                console.warn(`Курс с ID ${courseId} не найден. Перенаправление.`);
                navigate('/teacher/mycourses', { replace: true });
            }
            setLoading(false);
        } else if (!coursesLoading && !coursesError) {
            setLoading(false);
            console.warn("Данные курсов не загружены или пусты. Перенаправление.");
            navigate('/teacher/mycourses', { replace: true });
        } else if (coursesError) {
            setLoading(false);
            console.error("Ошибка загрузки данных курсов:", coursesError);
        }
    }, [courseId, navigate, coursesData, coursesLoading, coursesError]); // Depend on coursesData, loading, error

    const handleNextAddLessonStep = (data) => {
        if (addLessonStep === 2) {
            if (!data.title.trim()) {
                alert('Пожалуйста, введите название урока.');
                return;
            }
            setNewLessonDetails(data);
            setAddLessonStep(3);
        } else if (addLessonStep === 3) {
            setNewContentItemsData(data);
            setAddLessonStep(4);
        }
    };

    const handlePrevAddLessonStep = () => {
        if (isAnyMutationLoading) return;
        setAddLessonStep(prev => Math.max(2, prev - 1));
    };

    const handleSubmitLesson = async (questions) => {
        console.log("handleSubmitLesson: Данные тестов получены из Step 4:", questions);

        setNewTestQuestionsData(questions); // Сохраняем данные тестов в state

        if (!newLessonDetails.title.trim()) {
            alert('Ошибка: Отсутствует название урока (Шаг 2).');
            setAddLessonStep(2);
            return;
        }

        console.log("handleSubmitLesson: Подготовка к созданию урока и тестов...");

        if (typeof resetCreateLesson === 'function') resetCreateLesson();
        if (typeof resetCreateTests === 'function') resetCreateTests();

        const lessonFormData = new FormData();
        const lessonQueryParams = {
            Name: newLessonDetails.title,
            ...(newLessonDetails.description && { Description: newLessonDetails.description })
        };

        let hasContent = false;
        newContentItemsData.forEach(item => {
            // ... логика добавления контента в FormData ...
            if (!item.content) { console.warn(`Элемент контента типа '${item.type}' не содержит содержимого.`); return; }
            if (item.type === 'text' && (!item.content || item.content.trim() === '')) { console.warn("Пропускаем пустой текстовый элемент."); return; }
            switch (item.type) {
                case 'text': if (typeof item.content === 'string' && item.content.trim()) { lessonFormData.append('TextLectures', item.content.trim()); hasContent = true; } break;
                case 'photo': if (item.content instanceof File) { lessonFormData.append('Photos', item.content, item.content.name); hasContent = true; } else { console.warn(`Тип photo ожидает File, получен:`, item.content); } break;
                case 'book': if (item.content instanceof File) { const fileName = item.content.name; const fileExtension = fileName.split('.').pop().toLowerCase(); if (['pdf', 'doc', 'docx', 'ppt', 'pptx', 'odt', 'ods', 'odp'].includes(fileExtension)) { lessonFormData.append('Lectures', item.content, item.content.name); hasContent = true; } else { console.warn(`Тип book имеет неподдерживаемое расширение: ${fileExtension}`); } } else { console.warn(`Тип book ожидает File, получен:`, item.content); } break;
                case 'video': if (item.content instanceof File) { lessonFormData.append('Videos', item.content, item.content.name); hasContent = true; } else { console.warn(`Тип video ожидает File, получен:`, item.content); } break;
                case 'audio': if (item.content instanceof File) { lessonFormData.append('Audios', item.content, item.content.name); hasContent = true; } else { console.warn(`Тип audio ожидает File, получен:`, item.content); } break;
                default: console.warn(`Неизвестный или необработанный тип контента для FormData: ${item.type}`); break;
            }
        });


        console.log("handleSubmitLesson: FormData entries:");
        if (hasContent) {
            for (let [key, value] of lessonFormData.entries()) {
                const displayValue = value instanceof File
                    ? `File: ${value.name} (${value.size} bytes, type: ${value.type})`
                    : (value instanceof Blob ? `Blob: (${value.size} bytes, type: ${value.type})` : value);
                console.log(`  ${key}:`, displayValue);
            }
        } else {
            console.log("handleSubmitLesson: FormData: (empty)");
        }


        console.log("handleSubmitLesson: Отправка POST /lessons для курса ID:", courseId);
        console.log("handleSubmitLesson: Query Params:", lessonQueryParams);

        try {
            const lessonResult = await createLesson({
                courseId: courseId,
                params: lessonQueryParams,
                lessonData: lessonFormData
            }).unwrap();

            console.log("handleSubmitLesson: Урок успешно создан. ID:", lessonResult.id);

            // <-- ДОБАВЛЯЕМ ЛОГ НЕПОСРЕДСТВЕННО ПЕРЕД IF
            console.log("handleSubmitLesson: Проверка условий для создания тестов после урока. Значения:", {
                lessonResultId: lessonResult?.id,
                questionsVariable: questions, // Логируем саму переменную questions
                questionsLength: questions?.length,
                conditionResult: lessonResult?.id && questions && questions.length > 0 // Логируем результат всего условия
            });


            if (lessonResult?.id && questions && questions.length > 0) {
                console.log("handleSubmitLesson: Условия для создания тестов ВЫПОЛНЕНЫ. Переход к созданию тестов."); // <-- ЭТОТ ЛОГ ДОЛЖЕН ПОЯВИТЬСЯ, ЕСЛИ ВСЁ ОК

                console.log("handleSubmitLesson: Подготовка к созданию тестов..."); // Этот лог можно убрать, он дублирует верхний


                const formattedTestsData = questions.map(q => {
                    const correctAnswer = q.answers.find(a => a.isCorrect);
                    if (!correctAnswer || !correctAnswer.text.trim()) {
                        console.error("handleSubmitLesson: Вопрос без правильного ответа или с пустым текстом ответа:", q);
                        return null;
                    }
                    return {
                        question: q.text.trim(),
                        answers: q.answers.map(a => a.text.trim()),
                        correctAnswer: correctAnswer.text.trim()
                    };
                }).filter(q => q !== null);

                console.log("handleSubmitLesson: Форматированные данные теста для отправки:", formattedTestsData);

                if (formattedTestsData.length > 0) {
                    console.log("handleSubmitLesson: Отправка POST /tests/lesson/...", lessonResult.id);
                    console.log("handleSubmitLesson: Отправляемое тело запроса для тестов:", formattedTestsData);

                    await createTests({
                        lessonId: lessonResult.id,
                        testsData: formattedTestsData
                    }).unwrap();

                    console.log("handleSubmitLesson: Тесты успешно созданы!");
                    alert('Новый урок и тесты успешно добавлены в курс!');

                } else {
                    console.warn("handleSubmitLesson: Все вопросы теста оказались некорректными или пустыми после форматирования. Тесты не будут созданы.");
                    alert('Новый урок добавлен в курс. Тесты не были созданы из-за некорректных вопросов.');
                }
            } else {
                // <-- ЭТОТ ЛОГ ДОЛЖЕН ПОЯВИТЬСЯ, ЕСЛИ УСЛОВИЕ IF ЛОЖНО
                console.log("handleSubmitLesson: Условия для создания тестов НЕ выполнены. Нет данных тестов для создания.");
                alert('Новый урок успешно добавлен в курс!');
            }

            // <-- Эти действия выполняются в любом случае, если нет ошибки в try
            refetchLessons();
            setViewMode('details');
            setNewLessonDetails({ title: '', description: '' });
            setNewContentItemsData([]);
            setNewTestQuestionsData([]);


        } catch (err) {
            console.error("handleSubmitLesson: Ошибка при создании урока или тестов:", err); // <-- Этот лог появится, если createLesson или createTests выбросит ошибку
            const apiError = err;
            alert(`Ошибка при добавлении урока или тестов: ${apiError?.data?.message || apiError?.error || 'Неизвестная ошибка'}`);
        }
    };

    const handleEditCourseClick = () => {
        console.log("Нажата кнопка 'Добавить урок'. Переход к добавлению урока.");
        setNewLessonDetails({ title: '', description: '' });
        setNewContentItemsData([]);
        setNewTestQuestionsData([]);
        if (typeof resetCreateLesson === 'function') resetCreateLesson();
        if (typeof resetCreateTests === 'function') resetCreateTests();

        setViewMode('add-lesson');
        setAddLessonStep(2);
    };

    // Handler for cancelling the "add lesson" flow
    const handleCancelAddLesson = () => {
        // Prevent cancelling if any mutation is currently running
        if (isAnyMutationLoading) return;

        // Ask for confirmation before discarding entered data
        if (window.confirm('Вы уверены, что хотите отменить добавление урока? Введенные данные будут потеряны.')) {
            setViewMode('details');
            setNewLessonDetails({ title: '', description: '' });
            setNewContentItemsData([]);
            setNewTestQuestionsData([]);
            if (typeof resetCreateLesson === 'function') resetCreateLesson();
            if (typeof resetCreateTests === 'function') resetCreateTests();
        }
    };

    if (loading || coursesLoading) {
        return <div className={styles.loading}>Загрузка данных курса...</div>;
    }

    if (coursesError) {
        const courseErr = coursesError?.data?.message || coursesError?.error || JSON.stringify(coursesError);
        return <div className={styles.error}>Ошибка загрузки курсов: {courseErr}</div>;
    }

    if (!course) {
        return <div className={styles.noContent}>Курс не найден.</div>;
    }

    if (viewMode === 'add-lesson') {
        const isStepDisabled = isAnyMutationLoading;

        return (
            <div className={styles.courseDetailAddLesson}>
                <h3>Добавление нового урока к курсу "{course.name}"</h3>

                {isAnyMutationLoading && (
                    <div className={styles.loadingOverlay}>
                        {isCreatingLesson ? 'Создание урока...' : isCreatingTests ? 'Создание тестов...' : 'Сохранение...'}
                    </div>
                )}

                {isAnyMutationError && !isAnyMutationLoading && (
                    <div className={styles.errorMessage}>
                        Ошибка сохранения: {mutationError?.data?.message || mutationError?.error || 'Неизвестная ошибка API'}
                        {mutationError?.data?.errors && (
                            <pre className={styles.validationErrors}>
                                 {JSON.stringify(mutationError.data.errors, null, 2)}
                             </pre>
                        )}
                    </div>
                )}

                {addLessonStep === 2 && (
                    <Step2LessonDetails
                        initialDetails={newLessonDetails}
                        onDataChange={setNewLessonDetails}
                        onNext={handleNextAddLessonStep}
                        onPrev={handlePrevAddLessonStep}
                        isSaving={isStepDisabled}
                    />
                )}
                {addLessonStep === 3 && (
                    <Step3ContentEditor
                        initialContentItems={newContentItemsData}
                        onDataChange={setNewContentItemsData} // Pass data change handler
                        onNext={handleNextAddLessonStep}
                        onPrev={handlePrevAddLessonStep}
                        isSaving={isStepDisabled}
                    />
                )}
                {addLessonStep === 4 && (
                    <Step4TestCreator
                        initialQuestions={newTestQuestionsData}
                        onDataChange={setNewTestQuestionsData}
                        onFinish={handleSubmitLesson}
                        onPrev={handlePrevAddLessonStep}
                        isSaving={isStepDisabled}
                    />
                )}

                {!isAnyMutationLoading && (
                    <button onClick={handleCancelAddLesson} className={styles.cancelButton}>
                        Отменить добавление урока
                    </button>
                )}
            </div>
        );
    }

    return (
        <div className={styles.courseDetailPage}>
            <div className={styles.courseDetailContainer}>

                <div className={styles.detailHeader}>
                    <h3 className={styles.courseTitle}>{course.name}</h3>
                </div>

                <div className={styles.detailBody}>
                    <div className={styles.previewArea}>
                        <div className={styles.previewPlaceholder}>
                            <img src={course.previewPhotoKey} alt={`Превью курса "${course.name}"`} />
                        </div>
                    </div>

                    <div className={styles.infoArea}>
                        <div className={styles.nameAndDescription}>
                            <h4>Название курса</h4>
                            <p>{course.name}</p>
                            <h4>Описание курса</h4>
                            <p>{course.description}</p>
                        </div>
                        <button className={styles.editButton} onClick={handleEditCourseClick}>
                            Добавить урок
                        </button>
                    </div>
                </div>

                <div className={styles.lessonsArea}>
                    <h4>Уроки:</h4>
                    {lessonsLoading ? (
                        <p>Загрузка уроков...</p>
                    ) : lessonsError ? (
                        <p className={styles.error}>Ошибка загрузки уроков: {lessonsError?.data?.message || lessonsError?.error || JSON.stringify(lessonsError)}</p>
                    ) : lessonsData && lessonsData.length ? (
                        <ul>
                            {lessonsData.map((lesson, index) => (
                                <li
                                    key={lesson.id || index}
                                    className={styles.lessonItemInList}
                                    onClick={() => handleLessonClick(lesson.id)}
                                >
                                    {`Урок ${index + 1}: "${lesson.name}"`} {/* Используем lesson.name */}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Уроки для этого курса пока не добавлены.</p>
                    )}
                    {lessonsData && lessonsData.length > 0 && (
                        <button className={styles.exportButton}>Выгрузка в эксель</button>
                    )}
                </div>

                <div className={styles.studentsArea}>
                    <h4>Список учеников</h4>
                    {usersLoading ? (
                        <p>Загрузка списка учеников...</p>
                    ) : usersError ? (
                        <p className={styles.error}>Ошибка загрузки учеников: {usersError?.data?.message || usersError?.error || JSON.stringify(usersError)}</p>
                    ) : usersData && usersData.length ? (
                        <div className={styles.studentGrid}>
                            {usersData.map((student, index) => (
                                <div key={student.id || index} className={styles.studentCard}>
                                    <strong>{index + 1}. {student.name}</strong><br />
                                    Прогресс по курсу: {student.percentageCourse || 0}%<br />
                                    Прогресс по тестам: {student.percentageTests || 0}%
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p>Ученики на курс пока не записаны.</p>
                    )}

                    <div className={styles.chartArea}>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={CourseStat} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="value" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CourseDetail;