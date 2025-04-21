// src/components/Teacher/CourseBuilderPage.js
import React, { useState, useEffect } from 'react';
import styles from './CoursesBuilderPage.module.css';
import Step1CourseDetails from "./Coursebuild/Step1CourseDetails.jsx";
import Step2LessonDetails from "./Coursebuild/Step2LessonDetails.jsx";
import Step3ContentEditor from "./Coursebuild/Step3ContentEditor.jsx";
import Step4TestCreator from "./Coursebuild/Step4TestCreator.jsx";

// Импортируем нужные хуки мутаций
import { useCreateCourseMutation, useCreateLessonMutation } from '../../Redux/api/coursesApi';

const CourseBuilderPage = () => {
    const [currentStep, setCurrentStep] = useState(1);

    // Состояния для сбора данных по шагам
    const [courseData, setCourseData] = useState({
        courseName: '',
        courseDescription: '',
        previewImage: null,      // URL превью (временный blob)
        previewImageFile: null,  // Сам объект File для отправки
        imageName: '',           // Имя файла
    });

    const [firstLessonDetails, setFirstLessonDetails] = useState({
        title: '',
        description: ''
    });

    const [contentItemsData, setContentItemsData] = useState([]); // Элементы контента для курса
    const [testQuestionsData, setTestQuestionsData] = useState([]); // Вопросы теста (собираем, но пока не отправляем по API)

    // RTK Query hooks
    const [createCourse, { isLoading: isCreatingCourse, isSuccess: isCourseCreated, isError: isCreateCourseError, error: createCourseError, data: courseCreationResult }] = useCreateCourseMutation();
    const [createLesson, { isLoading: isCreatingLesson, isSuccess: isLessonCreated, isError: isCreateLessonError, error: createLessonError, data: lessonCreationResult }] = useCreateLessonMutation();

    // Общее состояние загрузки, если любой из запросов активен
    const isAnySaving = isCreatingCourse || isCreatingLesson;
    // Общее состояние ошибки
    const isAnyError = isCreateCourseError || isCreateLessonError;
    const anyError = createCourseError || createLessonError;


    // Эффект для отзыва временного blob URL при изменении изображения или размонтировании
    useEffect(() => {
        const imageUrl = courseData.previewImage;
        return () => {
            if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imageUrl);
                console.log("Отозван URL:", imageUrl);
            }
        };
    }, [courseData.previewImage]);

    // Эффект для обработки УСПЕХА создания КУРСА
    useEffect(() => {
        // Если курс успешно создан, СРАЗУ же пытаемся создать урок, если нет других ошибок и мы еще не создаем урок
        // Убеждаемся, что курс создан, есть ID, нет ошибок и мы не находимся в процессе создания урока
        if (isCourseCreated && courseCreationResult?.id && !isCreatingLesson && !isAnyError) {
            console.log("Курс успешно создан. ID:", courseCreationResult.id, " - Приступаем к созданию урока...");
            // Валидация на наличие деталей урока (должны быть с шага 2)
            if (!firstLessonDetails.title) {
                console.error("Ошибка: Отсутствуют детали первого урока для создания.");
                alert('Ошибка: Не удалось получить данные урока после создания курса.');
                return;
            }

            // Подготовка FormData для создания урока
            const lessonFormData = new FormData();
            // Имена полей ('Name', 'Description', Videos, Lectures, Photos, etc.)
            // должны соответствовать API /api/courses/{courseId}/lessons
            lessonFormData.append('Name', firstLessonDetails.title);
            // Описание урока может быть опциональным в Step2, проверяем наличие
            if (firstLessonDetails.description) {
                lessonFormData.append('Description', firstLessonDetails.description);
            }


            // Добавляем элементы контента (из Step3) в FormData
            contentItemsData.forEach(item => {
                if (item.type === 'text') {
                    // Предполагаем, что API принимает текст для лекций под ключом 'Lectures'
                    // Проверьте документацию API, возможно, текст нужно отправлять иначе.
                    lessonFormData.append('Lectures', item.content); // Отправляем текст как строку
                } else if (item.type === 'video') {
                    // Предполагаем, что API принимает видеофайлы под ключом 'Videos'
                    if (item.content instanceof File) {
                        lessonFormData.append('Videos', item.content, item.content.name); // Отправляем File объект
                    } else {
                        console.warn("Skipping non-File video content:", item);
                    }
                } else if (item.type === 'file') {
                    // Предполагаем, что API принимает прочие файлы под ключом 'Photos' или 'Lectures' или 'Books' и т.д.
                    // Используем Photos как предположение, нужно уточнить API
                    if (item.content instanceof File) {
                        // Можно добавить логику для определения типа файла и отправки в соответствующий ключ (Photos, Books, Audios)
                        // Например, по расширению: if (item.content.name.endsWith('.pdf')) { lessonFormData.append('Books', item.content, item.content.name); } else { ... }
                        lessonFormData.append('Photos', item.content, item.content.name); // Отправляем File объект
                    } else {
                        console.warn("Skipping non-File file content:", item);
                    }
                }
                // Если есть другие типы (audio, book), нужно добавить их обработку
            });

            console.log("Отправка POST запроса на создание урока для курса ID:", courseCreationResult.id);
            // Отправляем запрос на создание урока с полученным ID курса
            // Результат обрабатывается в следующем useEffect isLessonCreated / isCreateLessonError
            createLesson({ courseId: courseCreationResult.id, lessonData: lessonFormData });

        }

        // Если создание курса завершилось ошибкой
        if (isCreateCourseError) {
            console.error('Ошибка создания курса (API error):', createCourseError);
            // Ошибка уже показана пользователю в общем блоке ошибок
            // Возможно, стоит сбросить форму после ошибки курса
            // resetBuilder();
        }

    }, [isCourseCreated, isCreateCourseError, courseCreationResult, firstLessonDetails, contentItemsData, createLesson, isCreatingLesson, isAnyError]); // Зависимости: isCourseCreated, его результат, функция createLesson и данные для нее


    // Эффект для обработки УСПЕХА или ОШИБКИ создания УРОКА (после попытки создать урок)
    useEffect(() => {
        // Если урок успешно создан
        if (isLessonCreated) {
            console.log("Урок успешно создан (API response):", lessonCreationResult);
            alert('Урок успешно создан!'); // Показываем сообщение об успехе урока
            alert('Курс и первый урок успешно созданы!'); // Общее сообщение о завершении

            // Весь процесс успешно завершен
            resetBuilder(); // Сбрасываем форму

            // Здесь можно добавить логику перенаправления, используя lessonCreationResult?.id или courseCreationResult?.id
            // history.push(`/teacher/courses/${courseCreationResult?.id}`);
        }

        // Если создание урока завершилось ошибкой
        if (isCreateLessonError) {
            console.error('Ошибка создания урока (API error):', createLessonError);
            // Ошибка уже показана пользователю в общем блоке ошибок
            // Возможно, стоит сбросить форму после ошибки урока
            // resetBuilder();
        }
        // Обратите внимание: этот эффект реагирует только на состояние createLesson
    }, [isLessonCreated, isCreateLessonError, lessonCreationResult, createLessonError]); // Добавьте createLessonError в зависимости


    // Обработчик для завершения Шага 1 (Детали курса) - Просто переход
    const handleStep1Complete = () => {
        // Валидация уже есть в Step1CourseDetails перед вызовом onNext
        setCurrentStep(2); // Переход к новому Шагу 2
    };

    // Обработчик для завершения Шага 2 (Детали первого урока) - Сохранение данных и переход
    const handleStep2Complete = (lessonDetails) => {
        // Валидация на наличие названия урока (описание опционально)
        if (!lessonDetails.title.trim()) {
            alert('Пожалуйста, введите название урока.');
            return;
        }
        // Сохраняем детали урока в состоянии родителя
        setFirstLessonDetails(lessonDetails);
        setCurrentStep(3); // Переход к Шагу 3
    };


    // Обработчик для завершения Шага 3 (Контент/Лекции) - Сохранение данных и переход
    const handleStep3Complete = (contentItems) => {
        // Валидация: можно добавить проверку, что есть хотя бы один элемент контента, если это обязательно
        if (contentItems.length === 0) {
            if (!window.confirm("Вы не добавили ни одного элемента контента. Продолжить без контента?")) {
                // Если пользователь отменил, остаемся на этом шаге
                return;
            }
        }
        // Сохраняем контент в состоянии родителя
        setContentItemsData(contentItems);
        setCurrentStep(4); // Переход к Шагу 4
    };


    // Обработчик для завершения Шага 4 (Тест) - Триггер API запроса на создание КУРСА
    // Создание урока происходит автоматически в useEffect после успеха создания курса
    const handleStep4Complete = async (questions) => {
        // Сохраняем тест в состоянии родителя (опционально)
        setTestQuestionsData(questions);

        // Валидация перед финальной отправкой
        if (!courseData.courseName || !courseData.courseDescription || !courseData.previewImageFile) {
            alert('Ошибка: Отсутствуют необходимые данные курса (Шаг 1 не завершен?).');
            console.error("Missing course data for initial API call.");
            return;
        }
        if (!firstLessonDetails.title) {
            // Это менее вероятно, т.к. проверяем при переходе на Шаг 3, но для надежности.
            alert('Ошибка: Отсутствуют данные первого урока (Шаг 2 не завершен?).');
            console.error("Missing first lesson details for lesson creation.");
            return;
        }
        // Валидация контента и теста может быть добавлена по необходимости

        // Создаем объект FormData для создания КУРСА (Первый запрос)
        const courseFormData = new FormData(); // Corrected variable name
        courseFormData.append('Title', courseData.courseName);
        courseFormData.append('Description', courseData.courseDescription);
        courseFormData.append('PreviewPhoto', courseData.previewImageFile); // Corrected variable name


        console.log("Отправка POST запроса на создание курса...");
        // Отправляем мутацию создания КУРСА.
        // Результат (успех с ID курса или ошибка) и последующее создание урока обрабатываются в useEffect
        try {
            // Используем unwrap() здесь, чтобы поймать ошибку курса сразу и не переходить к созданию урока при ней
            // await createCourse(courseFormData).unwrap(); // If you want to handle error here
            // Отправляем мутацию, эффект сработать при isCourseCreated
            await createCourse(courseFormData);
        } catch (err) {
            // Ошибка будет доступна через isCreateCourseError / createCourseError
            console.error("createCourse request error:", err);
            // Ошибка будет показана в общем блоке ошибок
        }
    };

    // Обработчик кнопки "Назад"
    const handlePrevStep = () => {
        // Не позволяем переходить назад во время любых активных API запросов
        if (isAnySaving) return;
        // Очищаем ошибку при переходе назад, если она была
        // RTK Query error states should clear automatically or managed externally
        // if (isAnyError) { /* logic to clear RTK error state if available */ }
        setCurrentStep(prev => Math.max(1, prev - 1));
    };

    // Функция для сброса всего конструктора
    const resetBuilder = () => {
        setCurrentStep(1);
        setCourseData({ courseName: '', courseDescription: '', previewImage: null, previewImageFile: null, imageName: '' });
        setFirstLessonDetails({ title: '', description: '' });
        setContentItemsData([]);
        setTestQuestionsData([]);
        // Сброс состояния мутаций RTK Query
        // coursesGetApi.util.resetApiState(); // Используйте осторожно! Сбрасывает ВСЕ состояния API
        // Можно попытаться сбросить только конкретные мутации, если RTK Query предоставляет такую утилиту или через диспетчеризацию action
        // Для данного примера полагаемся на то, что при сбросе формы, новые вызовы мутаций будут работать корректно.

        // Отзываем временный blob URL при сбросе
        if (courseData.previewImage && typeof courseData.previewImage === 'string' && courseData.previewImage.startsWith('blob:')) {
            URL.revokeObjectURL(courseData.previewImage);
        }
    };

    // Рендерим текущий шаг
    const renderStep = () => {
        // Используем общее состояние isAnySaving для блокировки интерфейса во время ЛЮБОГО запроса
        const isStepDisabled = isAnySaving;

        switch (currentStep) {
            case 1:
                return (
                    <Step1CourseDetails
                        courseData={courseData}
                        setCourseData={setCourseData} // Позволяем Step1 управлять состоянием courseData
                        onNext={handleStep1Complete}
                        isSaving={isStepDisabled} // Блокируется во время финальной отправки
                    />
                );
            case 2:
                return (
                    <Step2LessonDetails
                        initialDetails={firstLessonDetails}
                        onDataChange={setFirstLessonDetails} // Позволяем Step2 управлять состоянием firstLessonDetails
                        onNext={handleStep2Complete}
                        onPrev={handlePrevStep}
                        isSaving={isStepDisabled} // Блокируется во время финальной отправки
                    />
                );
            case 3:
                return (
                    <Step3ContentEditor
                        initialContentItems={contentItemsData}
                        onNext={handleStep3Complete}
                        onPrev={handlePrevStep}
                        isSaving={isStepDisabled} // Блокируется во время финальной отправки
                    />
                );
            case 4:
                return (
                    <Step4TestCreator
                        initialQuestions={testQuestionsData}
                        onFinish={handleStep4Complete} // Триггер финальных API запросов
                        onPrev={handlePrevStep}
                        isSaving={isStepDisabled} // Блокируется во время финальной отправки (пока идут API запросы)
                    />
                );
            default:
                return <div>Неизвестный шаг</div>;
        }
    };

    // Общее количество шагов
    const totalSteps = 4;

    return (
        <div className={styles.courseBuilderContainer}>
            <h2>Конструктор курсов</h2>

            {/* Индикатор прогресса */}
            <div className={styles.progressBar}>
                <div
                    className={styles.progress}
                    style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }} // 0%, 33.3%, 66.6%, 100%
                ></div>
                {[...Array(totalSteps)].map((_, index) => (
                    <div
                        key={index + 1}
                        className={`${styles.stepIndicator} ${currentStep >= (index + 1) ? styles.activeStep : ''}`}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>


            {/* Отображение состояния реальных API запросов */}
            {isAnySaving && (
                <div className={styles.loadingOverlay}>
                    {isCreatingCourse ? 'Создание курса...' : 'Создание урока...'}
                </div>
            )}

            {isAnyError && (
                <div className={styles.errorMessage}>
                    Ошибка: {anyError?.data?.message || anyError?.error || 'Неизвестная ошибка'}
                </div>
            )}

            <div className={styles.stepContent}>
                {/* Рендерим текущий шаг, если нет активной ошибки */}
                {!isAnyError && renderStep()}
            </div>

            {/* Кнопка сброса */}
            {(currentStep > 1 || courseData.courseName || courseData.courseDescription || courseData.previewImageFile) && !isAnySaving && !isAnyError && (
                <button onClick={resetBuilder} className={styles.resetButton}>Начать заново</button>
            )}
        </div>
    );
};

export default CourseBuilderPage;