// src/components/Teacher/Coursebuild/Step3ContentEditor.js
// Был Step2LectureEditor.js
import React, { useState, useRef, useEffect } from 'react';
import styles from '../CoursesBuilderPage.module.css';

// Убрали пропс courseId
const Step3ContentEditor = ({ initialContentItems = [], onNext, onPrev, isSaving }) => {
    const [contentItems, setContentItems] = useState(initialContentItems);
    const [newItem, setNewItem] = useState({ type: 'text', title: '', content: '' });

    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);

    useEffect(() => {
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (videoInputRef.current) videoInputRef.current.value = '';
    }, [contentItems]);

    const addItem = () => {
        if (!newItem.title.trim()) {
            alert('Введите название для этого элемента контента.');
            return;
        }

        if (newItem.type === 'text' && !newItem.content.trim()) {
            alert('Пожалуйста, введите текст.');
            return;
        }

        if ((newItem.type === 'file' || newItem.type === 'video') && !(newItem.content instanceof File)) {
            alert(`Пожалуйста, ${newItem.type === 'file' ? 'добавьте файл' : 'добавьте видео'}.`);
            return;
        }

        setContentItems(prev => [...prev, { id: Date.now(), ...newItem }]);

        setNewItem({ type: 'text', title: '', content: '' });
    };

    const handleNewItemChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = (event, type) => {
        const file = event.target.files[0];
        if (file) {
            setNewItem(prev => ({
                ...prev,
                type: type,
                content: file
            }));
            console.log(`${type === 'file' ? 'Файл' : 'Видео'} '${file.name}' выбрано.`);
        } else {
            setNewItem(prev => ({
                ...prev,
                content: ''
            }));
        }
    };

    const removeItem = (id) => {
        setContentItems(prev => prev.filter(item => item.id !== id));
    };

    const triggerFileInput = (type) => {
        if (type === 'file' && fileInputRef.current) {
            fileInputRef.current.click();
        } else if (type === 'video' && videoInputRef.current) {
            videoInputRef.current.click();
        }
    };

    const handleNextClick = () => {
        if (contentItems.length === 0) {
            if (!window.confirm("Вы не добавили ни одного элемента контента. Продолжить без контента?")) {
                return;
            }
        }
        onNext(contentItems);
    };


    return (
        <div>
            <h3>Этап 3: Добавление контента курса</h3>
            {/* Убрали отображение Course ID */}

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e, 'file')}
                disabled={isSaving}
            />
            <input
                type="file"
                ref={videoInputRef}
                style={{ display: 'none' }}
                onChange={(e) => handleFileSelect(e, 'video')}
                accept="video/*"
                disabled={isSaving}
            />


            <div className={styles.lectureList}>
                <h4>Добавленные элементы контента ({contentItems.length}):</h4>
                {contentItems.length === 0 && <p>Пока нет добавленных элементов контента.</p>}
                <ul>
                    {contentItems.map((item) => (
                        <li key={item.id}>
                            <span>
                                <strong>{item.title}</strong> ({item.type}):{' '}
                                {item.type === 'text'
                                    ? `${item.content.substring(0, 50)}${item.content.length > 50 ? '...' : ''}`
                                    : (item.content instanceof File ? item.content.name : 'Ошибка: файл не выбран')
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
                        placeholder="Название элемента контента"
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
                            Текст
                        </button>
                        <button
                            type="button"
                            onClick={() => triggerFileInput('file')}
                            className={`${styles.typeButton} ${newItem.type === 'file' ? styles.activeType : ''}`}
                            disabled={isSaving}
                        >
                            Файл
                        </button>
                        <button
                            type="button"
                            onClick={() => triggerFileInput('video')}
                            className={`${styles.typeButton} ${newItem.type === 'video' ? styles.activeType : ''}`}
                            disabled={isSaving}
                        >
                            Видео
                        </button>
                    </div>
                </div>

                {newItem.type === 'text' && (
                    <div className={styles.formGroup}>
                        <label htmlFor="itemContent">Содержание (текст)</label>
                        <textarea
                            id="itemContent"
                            name="content"
                            value={newItem.content}
                            onChange={handleNewItemChange}
                            placeholder="Введите текст..."
                            rows="5"
                            disabled={isSaving}
                        />
                    </div>
                )}
                {newItem.type === 'file' && (
                    <div className={styles.formGroup}>
                        <label>Выбран файл:</label>
                        <p className={styles.placeholderContent}>
                            {(newItem.content instanceof File) ? newItem.content.name : 'Нажмите кнопку "Файл" выше для выбора.'}
                            {(newItem.content instanceof File) && (
                                <button type="button" onClick={() => triggerFileInput('file')} className={styles.changePlaceholderButton} disabled={isSaving}>Изменить</button>
                            )}
                        </p>
                    </div>
                )}
                {newItem.type === 'video' && (
                    <div className={styles.formGroup}>
                        <label>Выбран видеофайл:</label>
                        <p className={styles.placeholderContent}>
                            {(newItem.content instanceof File) ? newItem.content.name : 'Нажмите кнопку "Видео" выше для выбора.'}
                            {(newItem.content instanceof File) && (
                                <button type="button" onClick={() => triggerFileInput('video')} className={styles.changePlaceholderButton} disabled={isSaving}>Изменить</button>
                            )}
                        </p>
                    </div>
                )}


                <button type="button" onClick={addItem} className={styles.addButton} disabled={isSaving}>Добавить в список</button>
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