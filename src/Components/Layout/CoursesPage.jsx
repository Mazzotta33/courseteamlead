// src/components/Teacher/CoursesPage.js
import React, { useState, useEffect, useCallback } from 'react';
import styles from './CoursesPage.module.css'; // Убедитесь, что этот CSS файл подключен и содержит все стили из наших последних обсуждений
import TestComponent from "./TestComponent.jsx";
import { useGetLessonsQuery, useGetSoloLessonQuery } from "../../Redux/api/coursesApi.js";
import { useParams } from "react-router-dom";

const CoursesPage = (props) => {
    const { courseId } = useParams();

    const [selectedLessonId, setSelectedLessonId] = useState(null);
    const [mainContentView, setMainContentView] = useState('lesson');

    const {
        data: lessonsList = [],
        isLoading: isLoadingLessons,
        error: lessonsError
    } = useGetLessonsQuery(courseId);

    const {
        data: lessonInfo,
        isLoading: isLoadingLessonInfo,
        error: lessonInfoError
    } = useGetSoloLessonQuery({ courseId, lessonId: selectedLessonId }, {
        skip: !selectedLessonId || !courseId,
    });

    useEffect(() => {
        if (lessonsList && lessonsList.length > 0 && selectedLessonId === null) {
            setSelectedLessonId(lessonsList[0].id);
        }
    }, [lessonsList, selectedLessonId]);

    const handleSelectLesson = (lessonId) => {
        setSelectedLessonId(lessonId);
        setMainContentView('lesson');
    };

    const handleShowTest = () => {
        setMainContentView('test');
    };

    const getFileNameFromKey = (key, defaultName) => {
        if (!key) return defaultName;
        try {
            const url = new URL(key);
            const fileName = url.pathname.split('/').pop();
            const decodedFileName = decodeURIComponent(fileName?.split('?')[0] || '');
            return decodedFileName || defaultName;
        } catch (e) {
            const fileName = key.split('/').pop();
            const decodedFileName = decodeURIComponent(fileName?.split('?')[0] || '');
            return decodedFileName || defaultName;
        }
    };

    const getFileTypeFromKey = useCallback((key) => { // Добавил useCallback, чтобы функция была стабильной для useEffect (хотя здесь она не используется в зависимостях Effect)
        if (!key) return 'unknown';
        const url = key.split('?')[0];
        const extension = url.split('.').pop()?.toLowerCase();

        if (!extension) return 'unknown';

        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp', 'svg'].includes(extension)) return 'image';
        if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(extension)) return 'audio';
        // Note: videoKeys is handled separately with iframe. This is for video files in other keys.
        if (['mp4', 'webm', 'ogg', 'avi', 'mov', 'mkv', 'flv'].includes(extension)) return 'video_file';
        if (['pdf'].includes(extension)) return 'pdf';
        if (['txt', 'log', 'md', 'rtf'].includes(extension)) return 'text';
        if (['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'odt', 'ods', 'odp'].includes(extension)) return 'document';
        if (['epub', 'fb2', 'mobi', 'azw', 'azw3'].includes(extension)) return 'ebook';
        if (['zip', 'rar', '7z', 'tar', 'gz'].includes(extension)) return 'archive';


        return 'unknown';
    }, []); // Пустой массив зависимостей, так как функция не зависит от пропсов или состояния


    const RenderFileItem = ({ fileKey, index, sectionName }) => {
        const fileType = getFileTypeFromKey(fileKey);
        const fileName = getFileNameFromKey(fileKey, `${sectionName} ${index + 1}`);

        let content;

        // Логика для встраиваемых типов (image, audio, video_file, pdf) из разных разделов (photoKeys, audioKeys, ebookKeys, lectureKeys)
        if (fileType === 'image') {
            content = <img src={fileKey} alt={fileName} className={styles.embeddedImage} />;
        } else if (fileType === 'audio') {
            content = (
                <audio controls src={fileKey} className={styles.audioPlayer}>
                    Ваш браузер не поддерживает аудио.
                </audio>
            );
        }
            // Обратите внимание: видео из videoKeys рендерится отдельно в основном компоненте.
        // Этот блок нужен для видеофайлов, которые могут попасть в другие списки ключей.
        else if (fileType === 'video_file') {
            content = (
                <video controls src={fileKey} className={styles.videoPlayer}>
                    Ваш браузер не поддерживает видео.
                </video>
            );
        }
        else if (fileType === 'pdf') {
            content = (
                <div className={styles.pdfEmbedContainer}>
                    <iframe
                        src={fileKey}
                        width="100%"
                        height="100%"
                        style={{border: 'none'}}
                        title={`Просмотр PDF: ${fileName}`}
                        allowFullScreen // Добавлен allowFullScreen для iframe
                    >
                        Ваш браузер не поддерживает встраивание PDF.
                    </iframe>
                </div>
            );
        }

        // Если тип файла - один из встраиваемых И контент был успешно создан
        if (['image', 'audio', 'video_file', 'pdf'].includes(fileType) && content) {
            return (
                <li key={index} className={styles.fileItem}>
                    <div className={styles.filePreview}>
                        {content} {/* Отображаем встроенный контент */}
                    </div>
                    <div className={styles.fileDetails}>
                        {/* Отображаем ссылку на скачивание для встраиваемых типов */}
                        <a href={fileKey} target="_blank" rel="noopener noreferrer" download={fileName} className={styles.downloadLink}>
                            Скачать {fileType.charAt(0).toUpperCase() + fileType.slice(1)}{fileType !== 'pdf' && fileType !== 'image' ? 'файл' : ''}
                        </a>
                    </div>
                </li>
            );
        }

        // Рендеринг для скачиваемых файлов (text, document, ebook, archive, unknown, и встраиваемые типы, если встраивание не удалось или не применимо)
        // Текстовые лекции из lessonInfo.textLectures обрабатываются отдельно.
        // Этот RenderFileItem используется для файлов, ссылки на которые приходят в ключах (lectureKeys, photoKeys, ebookKeys, audioKeys).
        return (
            <li key={index} className={styles.fileItem}>
                <a href={fileKey} target="_blank" rel="noopener noreferrer" download={fileName} className={styles.fileLinkContent}>
                    <div className={styles.fileIcon}>
                        {fileType === 'document' && '📄'}
                        {fileType === 'ebook' && '📚'}
                        {fileType === 'text' && '📝'}
                        {fileType === 'archive' && '📦'}
                        {/* Добавляем значки для встраиваемых типов, если они здесь оказались (например, если прямое встраивание не используется для них) */}
                        {fileType === 'image' && '🖼️'}
                        {fileType === 'audio' && '🎵'}
                        {fileType === 'video_file' && '🎥'}
                        {fileType === 'pdf' && '📄'} {/* PDF может быть иконкой, если не встраивается */}
                        {fileType === 'unknown' && '❓'}
                    </div>
                    <div className={styles.fileInfo}>
                        <p className={styles.linkedFileName}>{fileName}</p>
                        {fileType !== 'unknown' && (
                            <p className={styles.linkedFileType}>{fileType.charAt(0).toUpperCase() + fileType.slice(1)} файл</p>
                        )}
                    </div>
                    <div className={styles.downloadIcon}>
                        ⬇️
                    </div>
                </a>
            </li>
        );

    };

    if (isLoadingLessons) {
        return <div className={styles.loading}>Загрузка уроков...</div>;
    }

    if (lessonsError) {
        // Улучшенное сообщение об ошибке для уроков
        const lessonListErrorMsg = lessonsError?.data?.message || lessonsError?.error || JSON.stringify(lessonsError);
        return <div className={styles.error}>Ошибка загрузки уроков: {lessonListErrorMsg}</div>;
    }

    if (!lessonsList || lessonsList.length === 0) {
        return <div className={styles.noContent}>Нет доступных уроков для этого курса.</div>;
    }

    return (
        <div className={styles.courses}>
            <aside className={styles.sidebar}>
                <h2>Доступные уроки</h2>
                {lessonsList.map((lesson) => (
                    <div
                        key={lesson.id}
                        className={`${styles.lessonItem} ${selectedLessonId === lesson.id ? styles.active : ''}`}
                        onClick={() => handleSelectLesson(lesson.id)}
                    >
                        <h3>{lesson.name}</h3>
                        <p>{lesson.description}</p>
                        {/* Возможно, добавить здесь отображение длительности урока, если она есть */}
                        {lesson.duration && <span className={styles.duration}>{lesson.duration}</span>} {/* Если у урока есть поле duration */}
                    </div>
                ))}
            </aside>

            <main className={styles.content}>
                {mainContentView === 'lesson' && (
                    <>
                        {/* Отображение сообщений о загрузке или ошибке при получении данных конкретного урока */}
                        {isLoadingLessonInfo && <div className={styles.loading}>Загрузка данных урока...</div>}
                        {lessonInfoError && (
                            // Улучшенное сообщение об ошибке для данных урока
                            <div className={styles.error}>
                                Ошибка загрузки данных урока: {lessonInfoError?.data?.message || lessonInfoError?.error || JSON.stringify(lessonInfoError)}
                            </div>
                        )}


                        {/* Отображаем контент урока, только если данные загружены и нет ошибок */}
                        {!isLoadingLessonInfo && !lessonInfoError && lessonInfo && (
                            <div>
                                {/* Секция Видео из videoKeys (встраивается через iframe) */}
                                {/* Проверяем наличие videoKeys и что это массив с элементами */}
                                {lessonInfo.videoKeys && lessonInfo.videoKeys.length > 0 ? (
                                    <div className={styles.videoWrapper}>
                                        <iframe
                                            src={lessonInfo.videoKeys[0]} // Используем первый ключ видео для iframe
                                            title={lessonInfo.name || 'Видео урока'} // Используем имя урока как заголовок iframe
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                                            allowFullScreen // Убедитесь, что allowFullScreen здесь тоже есть, если нужно
                                        >
                                            Ваш браузер не поддерживает встроенное видео.
                                        </iframe>
                                    </div>
                                ) : (
                                    // Сообщение "Видео для этого урока недоступно.",
                                    // только если НЕТ видео в videoKeys И нет видеофайлов в других секциях, которые рендерятся ниже
                                    !lessonInfo.photoKeys?.some(key => getFileTypeFromKey(key) === 'video_file') &&
                                    !lessonInfo.ebookKeys?.some(key => getFileTypeFromKey(key) === 'video_file') &&
                                    !lessonInfo.lectureKeys?.some(key => getFileTypeFromKey(key) === 'video_file') &&
                                    !lessonInfo.audioKeys?.some(key => getFileTypeFromKey(key) === 'video_file')
                                    && (
                                        <div className={styles.noVideoMessage}>
                                            <p>Видео для этого урока недоступно.</p>
                                        </div>
                                    )
                                )}

                                {/* НОВАЯ Секция для Текстовых лекций из lessonInfo.textLectures */}
                                {/* Отображаем, только если есть текстовые лекции и это массив с элементами */}
                                {lessonInfo.textLectures && lessonInfo.textLectures.length > 0 && (
                                    <div className={styles.contentSection}> {/* Можно переиспользовать стиль секции */}
                                        <h3>Текстовые лекции:</h3> {/* Заголовок для секции текста */}
                                        {/* Перебираем и отображаем каждую текстовую лекцию */}
                                        {lessonInfo.textLectures.map((text, index) => (
                                            // Используйте тег <p> или <div> для каждого блока текста
                                            <p key={index} className={styles.lectureText}>{text}</p> // Убедитесь, что стиль .lectureText существует в CSS
                                        ))}
                                    </div>
                                )}


                                {/* Основная информация об уроке (название, описание) */}
                                {/* Теперь идет ПОСЛЕ видео и текстовых лекций, как просили */}
                                <h2>{lessonInfo.name}</h2> {/* Используем name из lessonInfo */}
                                <p>{lessonInfo.description}</p>


                                {/* Секция Материалы лекции (файлы) */}
                                {lessonInfo.lectureKeys && lessonInfo.lectureKeys.length > 0 && (
                                    <div className={styles.contentSection}>
                                        <h3>Материалы лекции (файлы):</h3> {/* Уточнил название */}
                                        <ul className={styles.fileList}>
                                            {lessonInfo.lectureKeys.map((key, index) => (
                                                // RenderFileItem теперь обрабатывает все типы файлов из lectureKeys как скачиваемые или встраиваемые (кроме inline text)
                                                <RenderFileItem key={index} fileKey={key} index={index} sectionName="Материал лекции" />
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Остальные секции файлов остаются на месте */}
                                {lessonInfo.photoKeys && lessonInfo.photoKeys.length > 0 && (
                                    <div className={styles.contentSection}>
                                        <h3>Фотографии и Документы:</h3>
                                        <ul className={styles.fileList}>
                                            {lessonInfo.photoKeys.map((key, index) => (
                                                <RenderFileItem key={index} fileKey={key} index={index} sectionName="Фото/Документ" />
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {lessonInfo.audioKeys && lessonInfo.audioKeys.length > 0 && (
                                    <div className={styles.contentSection}>
                                        <h3>Аудиозаписи:</h3>
                                        <ul className={styles.fileList}>
                                            {lessonInfo.audioKeys.map((key, index) => (
                                                <RenderFileItem key={index} fileKey={key} index={index} sectionName="Аудиозапись" />
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {lessonInfo.ebookKeys && lessonInfo.ebookKeys.length > 0 && (
                                    <div className={styles.contentSection}>
                                        <h3>Книги и Материалы:</h3>
                                        <ul className={styles.fileList}>
                                            {lessonInfo.ebookKeys.map((key, index) => (
                                                <RenderFileItem key={index} fileKey={key} index={index} sectionName="Материал" />
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Секция с кнопками (Тест, Редактировать) */}
                                <div className={styles.lessonButtons}>
                                    {lessonInfo.tests && lessonInfo.tests.length > 0 && (
                                        <button onClick={handleShowTest} className={styles.takeTestButton}>
                                            Пройти тест по этому уроку
                                        </button>
                                    )}

                                    {props.role === 'Admin' && (
                                        <button
                                            onClick={() => console.log("Редактировать урок", lessonInfo.id)}
                                            className={styles.editLessonButton}
                                        >
                                            Редактировать урок
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Рендеринг компонента теста, если выбран вид "test" */}
                {mainContentView === 'test' && (
                    // Передаем данные тестов урока в TestComponent
                    <TestComponent lessonTests={lessonInfo?.tests} />
                )}
            </main>
        </div>
    );
};

export default CoursesPage;