// src/components/Teacher/CourseBuilderPage.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import styles from './CoursesBuilderPage.module.css';
import Step1CourseDetails from "./Coursebuild/Step1CourseDetails.jsx";
import Step2LessonDetails from "./Coursebuild/Step2LessonDetails.jsx";
import Step3ContentEditor from "./Coursebuild/Step3ContentEditor.jsx";
import Step4TestCreator from "./Coursebuild/Step4TestCreator.jsx";
import { useCreateCourseMutation, useCreateLessonMutation /*, useCreateTestMutation */ } from '../../Redux/api/coursesApi';

const CourseBuilderPage = () => {
    const [currentStep, setCurrentStep] = useState(1);

    const [courseData, setCourseData] = useState({
        courseName: '',
        courseDescription: '',
        previewImage: null,
        previewImageFile: null,
        imageName: '',
    });

    const [firstLessonDetails, setFirstLessonDetails] = useState({
        title: '',
        description: ''
    });

    const [contentItemsData, setContentItemsData] = useState([]);
    const [testQuestionsData, setTestQuestionsData] = useState([]);

    const [createCourse, {
        isLoading: isCreatingCourse,
        isSuccess: isCourseCreatedSuccess,
        isError: isCreateCourseError,
        error: createCourseError,
        data: courseCreationResult,
        reset: resetCreateCourse
    }] = useCreateCourseMutation();

    const [createLesson, {
        isLoading: isCreatingLesson,
        isSuccess: isLessonCreatedSuccess,
        isError: isCreateLessonError,
        error: createLessonError,
        data: lessonCreationResult,
        reset: resetCreateLesson
    }] = useCreateLessonMutation();

    // Флаг для предотвращения повторной попытки создания урока в том же цикле useEffect
    const [lessonCreationAttempted, setLessonCreationAttempted] = useState(false);

    const isAnySaving = isCreatingCourse || isCreatingLesson;
    const isAnyError = isCreateCourseError || isCreateLessonError;
    const anyError = isCreateLessonError ? createLessonError : createCourseError;

    const courseDataRef = useRef(courseData);
    useEffect(() => {
        courseDataRef.current = courseData;
    }, [courseData]);

    const resetBuilder = useCallback(() => {
        console.log("Сброс конструктора...");
        setCurrentStep(1);
        setCourseData({ courseName: '', courseDescription: '', previewImage: null, previewImageFile: null, imageName: '' });
        setFirstLessonDetails({ title: '', description: '' });
        setContentItemsData([]);
        setTestQuestionsData([]);
        setLessonCreationAttempted(false); // Сброс флага попытки

        // Безопасно вызываем reset функции, если они существуют (могут быть undefined до первого вызова мутации)
        if (typeof resetCreateCourse === 'function') resetCreateCourse();
        if (typeof resetCreateLesson === 'function') resetCreateLesson();

        // Очистка Blob URL для превью изображения при сбросе
        const currentImage = courseDataRef.current?.previewImage;
        if (currentImage && typeof currentImage === 'string' && currentImage.startsWith('blob:')) {
            URL.revokeObjectURL(currentImage);
            console.log("Отозван URL при сбросе:", currentImage);
        }
    }, [resetCreateCourse, resetCreateLesson]); // Зависимости для useCallback

    // Очистка Blob URL для превью изображения при размонтировании компонента или смене изображения
    useEffect(() => {
        const imageUrl = courseData.previewImage;
        return () => {
            if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('blob:')) {
                URL.revokeObjectURL(imageUrl);
                console.log("Отозван URL в Effect cleanup:", imageUrl);
            }
        };
    }, [courseData.previewImage]); // Зависит только от previewImage

    // Effect для запуска создания урока после успешного создания курса
    useEffect(() => {
        // Проверяем, что курс успешно создан, есть его ID, урок еще не создается
        // и мы еще не пытались создать урок в этом цикле создания курса
        if (isCourseCreatedSuccess && courseCreationResult?.id && !isCreatingLesson && !lessonCreationAttempted) {
            console.log("Effect 2: Курс успешно создан. ID:", courseCreationResult.id, " - Подготовка к созданию урока...");
            setLessonCreationAttempted(true); // Устанавливаем флаг, что попытка будет

            // Проверяем, что есть данные для первого урока
            if (!firstLessonDetails.title || firstLessonDetails.title.trim() === '') {
                console.error("Effect 2: Ошибка: Отсутствуют детали первого урока.");
                alert('Внутренняя ошибка: Не удалось получить данные урока для отправки.');
                return; // Прерываем выполнение эффекта
            }

            // Параметры запроса для урока (имя, описание)
            const lessonQueryParams = {
                Name: firstLessonDetails.title,
                ...(firstLessonDetails.description && { Description: firstLessonDetails.description }) // Добавляем описание, если оно есть
            };

            // FormData для контента (файлы и текст)
            const lessonFormData = new FormData();
            let hasContent = false; // Флаг для проверки, добавили ли что-то в FormData

            // --- ВОЗВРАЩЕНИЕ К СТАНДАРТНОМУ МЕТОДУ ОТПРАВКИ МАССИВА В FormData ---
            // Бэкенд ожидает массив строк для 'Lectures'.
            // В FormData это достигается многократным добавлением одного ключа с разными значениями.
            // Собираем все текстовые лекции и добавляем их индивидуально.
            contentItemsData.forEach(item => {
                if (item.type === 'text' && item.content && item.content.trim()) {
                    // Предполагаем, что бэкенд ожидает текст лекции под ключом 'Lectures'
                    // Добавляем каждое текстовое содержимое как отдельный элемент массива
                    lessonFormData.append('Lectures', item.content.trim()); // Добавлено .trim()
                    hasContent = true;
                }
            });
            // --- КОНЕЦ ВОЗВРАЩЕНИЯ К СТАНДАРТНОМУ МЕТОДУ ---


            // Добавляем остальные файловые типы контента
            contentItemsData.forEach(item => {
                // Пропускаем текст, так как он уже обработан выше
                if (item.type === 'text') return;

                // Обработка файловых типов
                if (item.content instanceof File) {
                    switch (item.type) {
                        case 'video':
                            // Предполагаем ключ 'Videos' для видео
                            lessonFormData.append('Videos', item.content, item.content.name);
                            hasContent = true;
                            break;
                        case 'photo':
                            // Предполагаем ключ 'Photos' для фото/документов
                            lessonFormData.append('Photos', item.content, item.content.name);
                            hasContent = true;
                            break;
                        case 'book':
                            // Предполагаем ключ 'Books' для книг
                            lessonFormData.append('Books', item.content, item.content.name);
                            hasContent = true;
                            break;
                        case 'audio':
                            // Предполагаем ключ 'Audios' для аудио
                            lessonFormData.append('Audios', item.content, item.content.name);
                            hasContent = true;
                            break;
                        default:
                            console.warn(`Неизвестный тип контента для FormData: ${item.type}`);
                            break;
                    }
                } else {
                    console.warn(`Элемент контента типа '${item.type}' не содержит File:`, item.content);
                }
            });

            console.log("Effect 2: Отправка POST /lessons для курса ID:", courseCreationResult.id);
            console.log("Effect 2: Query Params:", lessonQueryParams);
            if (hasContent) {
                // Вывод содержимого FormData для отладки
                console.log("Effect 2: FormData entries:");
                for (let [key, value] of lessonFormData.entries()) {
                    // Для лекций выводим начало текста, если это строка
                    const displayValue = key === 'Lectures' && typeof value === 'string'
                        ? `${value.substring(0, 100)}${value.length > 100 ? '...' : ''}`
                        : (value instanceof File ? `File: ${value.name} (${value.size} bytes)` : value);
                    console.log(`  ${key}:`, displayValue);
                }
            } else {
                console.log("Effect 2: FormData: (empty)");
            }


            // Запускаем мутацию создания урока
            createLesson({
                courseId: courseCreationResult.id,
                params: lessonQueryParams,
                lessonData: lessonFormData // Это наш FormData
            });
        }
        // Обработка ошибки создания курса, если она произошла
        if (isCreateCourseError) {
            console.error('Effect 2: Ошибка создания курса (API error):', createCourseError);
            // Ошибка уже могла быть показана в основном блоке рендеринга, но можно добавить логику здесь
        }

    }, [
        isCourseCreatedSuccess, // Запускаем, когда курс создан
        courseCreationResult,   // Запускаем, если результат создания курса изменился
        isCreatingLesson,       // Запускаем, если статус создания урока меняется
        lessonCreationAttempted,// Запускаем, если меняется флаг попытки
        createLesson,           // Функция мутации стабильна, но хорошая практика добавить
        firstLessonDetails,     // Зависит от деталей первого урока
        contentItemsData,       // Зависит от контента урока
        isCreateCourseError,    // Запускаем, если произошла ошибка создания курса
        createCourseError       // Запускаем, если объект ошибки изменился
    ]);

    // Effect для обработки результата создания урока
    useEffect(() => {
        if (isLessonCreatedSuccess) {
            console.log("Effect 3: Урок успешно создан (API response):", lessonCreationResult);
            alert('Первый урок успешно создан!');

            // Здесь можно было бы запускать создание теста, если бы была такая мутация
            if (testQuestionsData && testQuestionsData.length > 0 /* && useCreateTestMutation */) {
                console.log("Effect 3: Есть данные теста. Логика создания теста еще не добавлена.");
                alert('Курс и первый урок созданы. Логика создания теста пока отсутствует.');
                // Здесь должен быть вызов мутации создания теста
                resetBuilder(); // Сброс формы пока что здесь
            } else {
                console.log("Effect 3: Нет данных теста или логика теста отсутствует. Процесс завершен.");
                alert('Курс и первый урок успешно созданы!');
                resetBuilder(); // Сброс формы, так как процесс завершен
            }
        }

        // Обработка ошибки создания урока
        if (isCreateLessonError) {
            console.error('Effect 3: Ошибка создания урока (API error):', createLessonError);
            const lessonApiError = createLessonError;
            // Показываем пользователю сообщение об ошибке урока
            alert(`Ошибка создания урока: ${lessonApiError?.data?.message || lessonApiError?.error || 'Неизвестная ошибка'}`);
            // Возможно, здесь нужно не сбрасывать всю форму, а позволить пользователю попробовать снова или отредактировать
            // В данном случае, оставляем форму на текущем шаге с ошибкой
        }

    }, [ // Зависимости Effect 3
        isLessonCreatedSuccess, // Запускаем при успехе создания урока
        isCreateLessonError,    // Запускаем при ошибке создания урока
        lessonCreationResult,   // Запускаем, если результат создания урока изменился
        testQuestionsData,      // Зависит от данных теста
        resetBuilder            // Зависит от функции сброса
        // Если бы была мутация создания теста, ее и ее состояние добавили бы сюда
    ]);


    // Переход к следующему шагу
    const handleStep1Complete = () => { setCurrentStep(2); };

    const handleStep2Complete = (lessonDetails) => {
        if (!lessonDetails.title.trim()) {
            alert('Пожалуйста, введите название урока.');
            return;
        }
        setFirstLessonDetails(lessonDetails);
        setCurrentStep(3);
    };

    const handleStep3Complete = (contentItems) => {
        // Оставляем возможность создать урок без контента
        // if (contentItems.length === 0) {
        //     if (!window.confirm("Вы не добавили ни одного элемента контента. Продолжить без контента?")) {
        //         return;
        //     }
        // }
        setContentItemsData(contentItems);
        setCurrentStep(4); // Переходим к созданию теста
    };

    // Завершение всего процесса - запуск создания курса
    const handleStep4Complete = async (questions) => {
        setTestQuestionsData(questions); // Сохраняем данные теста

        // Финальные проверки перед запуском создания курса
        if (!courseData.courseName || !courseData.courseDescription || !courseData.previewImageFile) {
            alert('Ошибка: Отсутствуют необходимые данные курса (Шаг 1).');
            setCurrentStep(1); return;
        }
        if (!firstLessonDetails.title.trim()) {
            alert('Ошибка: Отсутствует название первого урока (Шаг 2).');
            setCurrentStep(2); return;
        }
        // Контент и тест могут быть опциональными, поэтому их не проверяем на наличие

        console.log("handleStep4Complete: Сброс состояния мутаций для новой попытки создания...");
        // Сбрасываем флаг попытки создания урока и состояние мутаций
        setLessonCreationAttempted(false);
        if (typeof resetCreateCourse === 'function') resetCreateCourse();
        if (typeof resetCreateLesson === 'function') resetCreateLesson();

        // Подготовка FormData для создания курса
        const courseFormData = new FormData();
        // Используем ключи, соответствующие Swagger API для создания курса
        courseFormData.append('Title', courseData.courseName);
        courseFormData.append('Description', courseData.courseDescription);
        courseFormData.append('PreviewPhoto', courseData.previewImageFile, courseData.previewImageFile.name);

        console.log("handleStep4Complete: Отправка POST запроса на создание курса...");
        try {
            // Запускаем мутацию создания курса
            // .unwrap() позволяет обработать ошибку напрямую здесь с помощью try/catch
            await createCourse(courseFormData).unwrap();
            console.log("handleStep4Complete: createCourse mutation triggered successfully.");
            // Успех создания курса обрабатывается в отдельном useEffect (Effect 2),
            // который затем запускает создание урока.
        } catch (err) {
            console.error("handleStep4Complete: createCourse mutation failed:", err);
            // Ошибка будет также показана в основном блоке рендеринга через anyError
        }
    };

    // Переход к предыдущему шагу
    const handlePrevStep = () => {
        if (isAnySaving) return; // Запрещаем переход во время сохранения
        setCurrentStep(prev => Math.max(1, prev - 1)); // Не уходим ниже шага 1
    };

    // Рендеринг текущего шага
    const renderStep = () => {
        // Отключаем интерактивность шагов во время сохранения
        const isStepDisabled = isAnySaving;

        switch (currentStep) {
            case 1: return <Step1CourseDetails courseData={courseData} setCourseData={setCourseData} onNext={handleStep1Complete} isSaving={isStepDisabled} />;
            case 2: return <Step2LessonDetails initialDetails={firstLessonDetails} onDataChange={setFirstLessonDetails} onNext={handleStep2Complete} onPrev={handlePrevStep} isSaving={isStepDisabled} />;
            case 3: return <Step3ContentEditor initialContentItems={contentItemsData} onNext={handleStep3Complete} onPrev={handlePrevStep} isSaving={isStepDisabled} />;
            case 4: return <Step4TestCreator initialQuestions={testQuestionsData} onFinish={handleStep4Complete} onPrev={handlePrevStep} isSaving={isStepDisabled} />;
            default: return <div>Неизвестный шаг</div>;
        }
    };

    const totalSteps = 4; // Общее количество шагов в конструкторе

    return (
        <div className={styles.courseBuilderContainer}>
            <h2>Конструктор курсов</h2>

            {/* Индикатор прогресса */}
            <div className={styles.progressBar}>
                {/* Заливка прогресса */}
                <div
                    className={styles.progress}
                    // Ширина прогресса: 0% на шаге 1, 100% на последнем шаге (или перед ним, если хотите)
                    // (currentStep - 1) / (totalSteps - 1) дает значение от 0 до 1
                    style={{ width: `${currentStep <= 1 ? 0 : ((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
                ></div>
                {/* Круги-индикаторы шагов */}
                {[...Array(totalSteps)].map((_, index) => (
                    <div
                        key={index + 1}
                        className={`${styles.stepIndicator} ${currentStep >= (index + 1) ? styles.activeStep : ''}`}
                    >
                        {index + 1}
                    </div>
                ))}
            </div>

            {/* Оверлей загрузки/сохранения */}
            {isAnySaving && (
                <div className={styles.loadingOverlay}>
                    {/* Текст статуса сохранения */}
                    {isCreatingCourse ? 'Создание курса...' : isCreatingLesson ? 'Создание первого урока...' : 'Сохранение...'} {/* Добавить текст для теста, когда будет реализовано */}
                </div>
            )}

            {/* Сообщение об ошибке */}
            {isAnyError && !isAnySaving && (
                <div className={styles.errorMessage}>
                    Ошибка: {anyError?.data?.message || anyError?.error || 'Неизвестная ошибка API'}
                </div>
            )}

            {/* Контент текущего шага */}
            {/* Показываем шаги только если нет фатальной ошибки (когда !isAnyError) ИЛИ если идет процесс сохранения (чтобы оверлей был над контентом) */}
            <div className={styles.stepContent}>
                {( !isAnyError || isAnySaving ) && renderStep()}
            </div>

            {/* Кнопка "Начать заново" */}
            {/* Показываем, если мы не на первом шаге ИЛИ если уже ввели какие-то данные курса */}
            {/* Скрываем во время сохранения */}
            {(currentStep > 1 || courseData.courseName || courseData.courseDescription || courseData.previewImageFile) && !isAnySaving && (
                <button onClick={resetBuilder} className={styles.resetButton} disabled={isAnySaving}>
                    Начать заново
                </button>
            )}
        </div>
    );
};

export default CourseBuilderPage;