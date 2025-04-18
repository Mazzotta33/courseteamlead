// src/components/Teacher/CourseBuilder/Step2LectureEditor.js
import React, { useState } from 'react';
import styles from '../CoursesBuilderPage.module.css'; // Используем те же стили

const Step2LectureEditor = ({ lectures, setLectures, onNext, onPrev }) => {
    const [newLecture, setNewLecture] = useState({ type: 'text', title: '', content: '' });

    const addLecture = () => {
        if (!newLecture.title) {
            alert('Введите название лекции');
            return;
        }
        if ((newLecture.type === 'file' || newLecture.type === 'video') && !newLecture.content) {
            alert(`Пожалуйста, ${newLecture.type === 'file' ? 'добавьте файл' : 'добавьте видео'} или введите его имитацию.`);
            return;
        }
        if (newLecture.type === 'text' && !newLecture.content.trim()) {
            alert('Пожалуйста, введите текст лекции.');
            return;
        }

        setLectures(prev => [...prev, { id: Date.now(), ...newLecture }]);
        setNewLecture({ type: 'text', title: '', content: '' }); // Сброс формы
    };

    const handleNewLectureChange = (e) => {
        const { name, value } = e.target;
        setNewLecture(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (type) => {
        const fileName = prompt(`Имитация выбора ${type === 'file' ? 'файла' : 'видео'}. Введите имя:`, `example.${type === 'file' ? 'pdf' : 'mp4'}`);
        if (fileName) {
            setNewLecture(prev => ({ ...prev, content: fileName, type: type }));
            console.log(`${type === 'file' ? 'Файл' : 'Видео'} '${fileName}' добавлено (заглушка).`);
        } else {
            if (!newLecture.content || newLecture.type !== type) {
                // setNewLecture(prev => ({ ...prev, type: 'text' })); // Можно раскомментировать, если нужно явно сбрасывать на текст
            }
        }
    };

    const removeLecture = (id) => {
        setLectures(prev => prev.filter(lecture => lecture.id !== id));
    };

    return (
        <div>
            <h3>Этап 2: Добавление лекций</h3>

            <div className={styles.lectureList}>
                <h4>Добавленные лекции ({lectures.length}):</h4>
                {lectures.length === 0 && <p>Пока нет добавленных лекций.</p>}
                <ul>
                    {lectures.map((lecture) => (
                        <li key={lecture.id}>
                            <span>
                                <strong>{lecture.title}</strong> ({lecture.type}):{' '}
                                {lecture.type === 'text' ? `${lecture.content.substring(0, 50)}${lecture.content.length > 50 ? '...' : ''}` : lecture.content}
                            </span>
                            <button onClick={() => removeLecture(lecture.id)} className={styles.removeButton} title="Удалить лекцию">×</button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className={styles.addLectureForm}>
                <h4>Добавить новую лекцию:</h4>
                <div className={styles.formGroup}>
                    <label htmlFor="lectureTitle">Название лекции</label>
                    <input
                        type="text"
                        id="lectureTitle"
                        name="title"
                        value={newLecture.title}
                        onChange={handleNewLectureChange}
                        placeholder="Название лекции"
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Тип контента:</label>
                    <div className={styles.contentTypeButtons}>
                        <button
                            type="button"
                            onClick={() => setNewLecture(prev => ({ ...prev, type: 'text', content: '' }))} // Сбрасываем контент при смене на текст
                            className={`${styles.typeButton} ${newLecture.type === 'text' ? styles.activeType : ''}`}
                        >
                            Текст
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFileChange('file')}
                            className={`${styles.typeButton} ${newLecture.type === 'file' ? styles.activeType : ''}`}
                        >
                            Файл (Заглушка)
                        </button>
                        <button
                            type="button"
                            onClick={() => handleFileChange('video')}
                            className={`${styles.typeButton} ${newLecture.type === 'video' ? styles.activeType : ''}`}
                        >
                            Видео (Заглушка)
                        </button>
                    </div>
                </div>

                {newLecture.type === 'text' && (
                    <div className={styles.formGroup}>
                        <label htmlFor="lectureContent">Текст лекции</label>
                        <textarea
                            id="lectureContent"
                            name="content"
                            value={newLecture.content}
                            onChange={handleNewLectureChange}
                            placeholder="Введите текст лекции..."
                            rows="5"
                        />
                    </div>
                )}
                {newLecture.type === 'file' && (
                    <div className={styles.formGroup}>
                        <label>Файл (заглушка):</label>
                        <p className={styles.placeholderContent}>
                            {newLecture.content || 'Нажмите кнопку "Файл" выше для добавления.'}
                            {newLecture.content && <button type="button" onClick={() => handleFileChange('file')} className={styles.changePlaceholderButton}>Изменить</button>}
                        </p>
                    </div>
                )}
                {newLecture.type === 'video' && (
                    <div className={styles.formGroup}>
                        <label>Видео (заглушка):</label>
                        <p className={styles.placeholderContent}>
                            {newLecture.content || 'Нажмите кнопку "Видео" выше для добавления.'}
                            {newLecture.content && <button type="button" onClick={() => handleFileChange('video')} className={styles.changePlaceholderButton}>Изменить</button>}
                        </p>
                    </div>
                )}

                <button type="button" onClick={addLecture} className={styles.addButton}>Добавить лекцию в список</button>
            </div>


            <div className={styles.navigationButtons}>
                <button onClick={onPrev} className={styles.navButton}>Назад</button>
                <button onClick={onNext} className={styles.navButton}>Продолжить</button>
            </div>
        </div>
    );
};

export default Step2LectureEditor;