// src/components/Teacher/Coursebuild/Step3ContentEditor.jsx
import React, { useState, useRef, useEffect } from 'react';
import styles from '../CoursesBuilderPage.module.css';

const Step3ContentEditor = ({ initialContentItems = [], onNext, onPrev, isSaving }) => {
    const [contentItems, setContentItems] = useState(initialContentItems);
    // Типы контента будут соответствовать ключам в FormData/Swagger
    // 'text' -> Lectures (текст вручную)
    // 'photo' -> Photos (фотографии, общие документы типа PDF/DOCX/PPTX)
    // 'video' -> Videos
    // 'book' -> Books
    // 'audio' -> Audios
    const [newItem, setNewItem] = useState({ type: 'text', title: '', content: '' });

    const fileInputRef = useRef(null); // Для фото/документов
    const videoInputRef = useRef(null); // Для видео
    const bookInputRef = useRef(null); // Для книг (например, EPUB, PDF, FB2 - зависит от бэкенда)
    const audioInputRef = useRef(null); // Для аудио

    // Сброс значения input[type="file"] при добавлении элемента,
    // чтобы можно было выбрать тот же файл повторно
    useEffect(() => {
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (videoInputRef.current) videoInputRef.current.value = '';
        if (bookInputRef.current) bookInputRef.current.value = '';
        if (audioInputRef.current) audioInputRef.current.value = '';
    }, [contentItems]);

    const addItem = () => {
        if (!newItem.title.trim()) {
            alert('Введите название для этого элемента контента.');
            return;
        }

        if (newItem.type === 'text' && !newItem.content.trim()) {
            alert('Пожалуйста, введите текст лекции.');
            return;
        }

        // Проверка для всех файловых типов
        const isFileType = ['photo', 'video', 'book', 'audio'].includes(newItem.type);
        if (isFileType && !(newItem.content instanceof File)) {
            // Определяем более точное сообщение
            let fileTypeName = 'файл';
            switch (newItem.type) {
                case 'photo': fileTypeName = 'фотографию или документ'; break;
                case 'video': fileTypeName = 'видеофайл'; break;
                case 'book': fileTypeName = 'файл книги'; break;
                case 'audio': fileTypeName = 'аудиофайл'; break;
                default: break; // Не должно сюда попасть при правильной логике
            }
            alert(`Пожалуйста, добавьте ${fileTypeName}.`);
            return;
        }

        // Добавляем новый элемент с уникальным ID
        setContentItems(prev => [...prev, { id: Date.now(), ...newItem }]);

        // Сбрасываем форму добавления нового элемента
        setNewItem({ type: 'text', title: '', content: '' });
    };

    const handleNewItemChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    // Обработчик выбора файла. Принимает тип контента, который выбирается.
    const handleFileSelect = (event, type) => {
        const file = event.target.files[0];
        if (file) {
            setNewItem(prev => ({
                ...prev,
                type: type, // Сохраняем выбранный тип
                content: file // Сохраняем сам объект File
            }));
            console.log(`Выбран ${type === 'photo' ? 'файл (фото/документ)' : type === 'video' ? 'видео' : type === 'book' ? 'книга' : type === 'audio' ? 'аудио' : 'файл'}: '${file.name}'.`);
        } else {
            // Если файл не выбран (отменили выбор)
            setNewItem(prev => ({
                ...prev,
                content: ''
            }));
        }
    };

    const removeItem = (id) => {
        setContentItems(prev => prev.filter(item => item.id !== id));
    };

    // Функция для симуляции клика по скрытому input[type="file"]
    const triggerFileInput = (type) => {
        if (isSaving) return; // Не даем кликнуть, если идет сохранение

        // Сбрасываем текущее значение file input, чтобы событие change сработало,
        // даже если пользователь выберет тот же файл снова
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (videoInputRef.current) videoInputRef.current.value = '';
        if (bookInputRef.current) bookInputRef.current.value = '';
        if (audioInputRef.current) audioInputRef.current.value = '';

        // Устанавливаем тип нового элемента перед открытием диалога выбора файла
        setNewItem(prev => ({ ...prev, type: type, content: '' })); // Сбрасываем content

        // Открываем соответствующий диалог выбора файла
        if (type === 'photo' && fileInputRef.current) {
            fileInputRef.current.click();
        } else if (type === 'video' && videoInputRef.current) {
            videoInputRef.current.click();
        } else if (type === 'book' && bookInputRef.current) {
            bookInputRef.current.click();
        } else if (type === 'audio' && audioInputRef.current) {
            audioInputRef.current.click();
        }
        // Для 'text' не нужно открывать диалог, там просто textarea
    };

    const handleNextClick = () => {
        if (contentItems.length === 0) {
            if (!window.confirm("Вы не добавили ни одного элемента контента. Продолжить без контента?")) {
                return;
            }
        }
        onNext(contentItems);
    };

    // Вспомогательная функция для получения отображаемого типа
    const getDisplayTypeName = (type) => {
        switch (type) {
            case 'text': return 'Текст лекции';
            case 'photo': return 'Фото/Документ';
            case 'video': return 'Видео';
            case 'book': return 'Книга';
            case 'audio': return 'Аудио';
            default: return 'Неизвестный тип';
        }
    };


    return (
        <div>
            <h3>Этап 3: Добавление контента курса</h3>

            {/* Скрытые input для файлов */}
            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e, 'photo')} // Передаем тип 'photo'
                // Можно добавить accept="/image/*, .pdf, .doc, .docx, .ppt, .pptx" если нужно ограничить
                disabled={isSaving}
            />
            <input
                type="file"
                ref={videoInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e, 'video')} // Передаем тип 'video'
                accept="video/*" // Принимаем только видео
                disabled={isSaving}
            />
            <input
                type="file"
                ref={bookInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e, 'book')} // Передаем тип 'book'
                // Укажите нужные форматы книг: .epub, .pdf, .fb2 и т.д.
                accept=".epub, .pdf, .fb2, .mobi"
                disabled={isSaving}
            />
            <input
                type="file"
                ref={audioInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e, 'audio')} // Передаем тип 'audio'
                accept="audio/*" // Принимаем только аудио
                disabled={isSaving}
            />


            <div className={styles.lectureList}>
                <h4>Добавленные элементы контента ({contentItems.length}):</h4>
                {contentItems.length === 0 && <p>Пока нет добавленных элементов контента.</p>}
                <ul>
                    {contentItems.map((item) => (
                        <li key={item.id}>
                            <span>
                                <strong>{item.title}</strong> ({getDisplayTypeName(item.type)}):{' '} {/* Отображаем более понятное имя типа */}
                                {item.type === 'text'
                                    ? `${item.content.substring(0, 50)}${item.content.length > 50 ? '...' : ''}` // Показываем начало текста
                                    : (item.content instanceof File ? item.content.name : 'Ошибка: файл не выбран') // Показываем имя файла
                                }
                            </span>
                            <button onClick={() => removeItem(item.id)} className={styles.removeButton} title="Удалить" disabled={isSaving}>×</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.addLectureForm}>
                <h4>Добавить новый элемент контента:</h4>
                <div className={styles.formGroup}>
                    <label htmlFor="itemTitle">Название</label>
                    <input
                        type="text"
                        id="itemTitle"
                        name="title"
                        value={newItem.title}
                        onChange={handleNewItemChange}
                        placeholder="Название элемента контента (например, Глава 1, Введение, Слайды)"
                        disabled={isSaving}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Тип контента:</label>
                    <div className={styles.contentTypeButtons}>
                        <button
                            type="button"
                            onClick={() => setNewItem(prev => ({ ...prev, type: 'text', content: '' }))}
                            className={`${styles.typeButton} ${newItem.type === 'text' ? styles.activeType : ''}`}
                            disabled={isSaving}
                        >
                            Текст лекции
                        </button>
                        <button
                            type="button"
                            onClick={() => triggerFileInput('photo')} // Триггерим инпут для фото/документов
                            className={`${styles.typeButton} ${newItem.type === 'photo' ? styles.activeType : ''}`}
                            disabled={isSaving}
                        >
                            Фото/Документ
                        </button>
                        <button
                            type="button"
                            onClick={() => triggerFileInput('video')} // Триггерим инпут для видео
                            className={`${styles.typeButton} ${newItem.type === 'video' ? styles.activeType : ''}`}
                            disabled={isSaving}
                        >
                            Видео
                        </button>
                        <button
                            type="button"
                            onClick={() => triggerFileInput('book')} // Триггерим инпут для книг
                            className={`${styles.typeButton} ${newItem.type === 'book' ? styles.activeType : ''}`}
                            disabled={isSaving}
                        >
                            Книга
                        </button>
                        <button
                            type="button"
                            onClick={() => triggerFileInput('audio')} // Триггерим инпут для аудио
                            className={`${styles.typeButton} ${newItem.type === 'audio' ? styles.activeType : ''}`}
                            disabled={isSaving}
                        >
                            Аудио файл
                        </button>
                    </div>
                </div>

                {/* Поля ввода/отображения в зависимости от выбранного типа */}
                {newItem.type === 'text' && (
                    <div className={styles.formGroup}>
                        <label htmlFor="itemContent">Содержание (текст лекции)</label>
                        <textarea
                            id="itemContent"
                            name="content"
                            value={newItem.content}
                            onChange={handleNewItemChange}
                            placeholder="Введите текст лекции..."
                            rows="5"
                            disabled={isSaving}
                        />
                    </div>
                )}
                {['photo', 'video', 'book', 'audio'].includes(newItem.type) && (
                    <div className={styles.formGroup}>
                        <label>{getDisplayTypeName(newItem.type)}:</label>
                        <p className={styles.placeholderContent}>
                            {(newItem.content instanceof File) ? newItem.content.name : `Нажмите кнопку "${getDisplayTypeName(newItem.type)}" выше для выбора.`}
                            {(newItem.content instanceof File) && !isSaving && (
                                <button type="button" onClick={() => triggerFileInput(newItem.type)} className={styles.changePlaceholderButton}>Изменить</button>
                            )}
                        </p>
                    </div>
                )}


                <button type="button" onClick={addItem} className={styles.addButton} disabled={isSaving || !newItem.title.trim() || (newItem.type === 'text' && !newItem.content.trim()) || (['photo', 'video', 'book', 'audio'].includes(newItem.type) && !(newItem.content instanceof File))}>
                    Добавить в список
                </button>
            </div>

            <div className={styles.navigationButtons}>
                <button onClick={onPrev} className={styles.navButton} disabled={isSaving}>Назад</button>
                <button onClick={handleNextClick} className={styles.navButton} disabled={isSaving}>
                    {isSaving ? 'Создание курса...' : 'Продолжить'}
                </button>
            </div>
        </div>
    );
};

export default Step3ContentEditor;