// src/components/Teacher/CoursesPage.js
import React, { useState, useEffect } from 'react';
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

    const getFileTypeFromKey = (key) => {
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
    };

    const RenderFileItem = ({ fileKey, index, sectionName }) => {
        const fileType = getFileTypeFromKey(fileKey);
        const fileName = getFileNameFromKey(fileKey, `${sectionName} ${index + 1}`);

        let content;

        if (fileType === 'image') {
            content = <img src={fileKey} alt={fileName} className={styles.embeddedImage} />;
        } else if (fileType === 'audio') {
            console.log('Аудиофайл:', fileKey); // <-- отладочный вывод
            content = (
                <audio controls src={fileKey} className={styles.audioPlayer}>
                    Ваш браузер не поддерживает аудио.
                </audio>
            );
        } else if (fileType === 'video_file') {
            content = (
                <video controls src={fileKey} className={styles.videoPlayer}>
                    Ваш браузер не поддерживает видео.
                </video>
            );
        } else if (fileType === 'pdf') {
            content = (
                <div className={styles.pdfEmbedContainer}>
                    <iframe
                        src={fileKey}
                        width="100%"
                        height="100%"
                        style={{border: 'none'}}
                        title={`Просмотр PDF: ${fileName}`}
                    >
                        Ваш браузер не поддерживает встраивание PDF.
                    </iframe>
                </div>
            );
        }

        if (['image', 'audio', 'video_file', 'pdf'].includes(fileType)) {
            return (
                <li key={index} className={styles.fileItem}>
                    <div className={styles.filePreview}>
                        {content}
                    </div>
                    <div className={styles.fileDetails}>

                        {fileType === 'pdf' && (
                            <a href={fileKey} target="_blank" rel="noopener noreferrer" download className={styles.downloadLink}>
                                Скачать PDF
                            </a>
                        )}
                        {fileType === 'image' && (
                            <a href={fileKey} target="_blank" rel="noopener noreferrer" download className={styles.downloadLink}>
                                Скачать Изображение
                            </a>
                        )}
                    </div>
                </li>
            );
        }

        return (
            <li key={index} className={styles.fileItem}>
                <a href={fileKey} target="_blank" rel="noopener noreferrer" download className={styles.fileLinkContent}>
                    <div className={styles.fileIcon}>
                        {fileType === 'document' && '📄'}
                        {fileType === 'ebook' && '📚'}
                        {fileType === 'text' && '📝'}
                        {fileType === 'archive' && '📦'}
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
        return <div className={styles.error}>Ошибка загрузки уроков: {lessonsError.message || JSON.stringify(lessonsError)}</div>;
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
                        {lesson.duration && <span className={styles.duration}>{lesson.duration}</span>}
                    </div>
                ))}
            </aside>

            <main className={styles.content}>
                {mainContentView === 'lesson' && (
                    <>
                        {isLoadingLessonInfo && <div className={styles.loading}>Загрузка данных урока...</div>}
                        {lessonInfoError && <div className={styles.error}>Ошибка загрузки данных урока: {lessonInfoError.message || JSON.stringify(lessonInfoError)}</div>}

                        {!isLoadingLessonInfo && !lessonInfoError && lessonInfo && (
                            <div>
                                {lessonInfo.videoKeys && lessonInfo.videoKeys.length > 0 ? (
                                    <div className={styles.videoWrapper}>
                                        <iframe
                                            src={lessonInfo.videoKeys[0]}
                                            title={lessonInfo.title || 'Урок'}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"

                                        ></iframe>
                                    </div>
                                ) : (
                                    (lessonInfo.photoKeys?.some(key => getFileTypeFromKey(key) === 'video_file') ||
                                        lessonInfo.ebookKeys?.some(key => getFileTypeFromKey(key) === 'video_file') ||
                                        lessonInfo.lectureKeys?.some(key => getFileTypeFromKey(key) === 'video_file') ||
                                        lessonInfo.audioKeys?.some(key => getFileTypeFromKey(key) === 'video_file')) ? null /* Видеофайл будет в другой секции */ : (
                                        <div className={styles.noVideoMessage}>
                                            <p>Видео для этого урока недоступно.</p>
                                        </div>
                                    )
                                )}

                                <h2>{lessonInfo.title}</h2>
                                <p>{lessonInfo.description}</p>

                                {lessonInfo.lectureKeys && lessonInfo.lectureKeys.length > 0 && (
                                    <div className={styles.contentSection}>
                                        <h3>Материалы лекции:</h3>
                                        <ul className={styles.fileList}>
                                            {lessonInfo.lectureKeys.map((key, index) => (
                                                <RenderFileItem key={index} fileKey={key} index={index} sectionName="Лекция" />
                                            ))}
                                        </ul>
                                    </div>
                                )}

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

                {mainContentView === 'test' && (
                    <TestComponent lessonTests={lessonInfo?.tests} />
                )}
            </main>
        </div>
    );
};

export default CoursesPage;