import React, { useState, useEffect } from 'react';
import styles from './FeedbackModal.module.css';

const adminList = [
    { id: 'support', name: 'Техническая поддержка' },
    { id: 'sales', name: 'Отдел продаж' },
    { id: 'hr', name: 'Отдел кадров' },
    { id: 'general', name: 'Общие вопросы' },
];

const FeedbackModal = ({ onClose }) => {
    const [mode, setMode] = useState('feedback');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const [selectedAdmin, setSelectedAdmin] = useState(adminList[0]?.id || '');
    const [feedbackMessage, setFeedbackMessage] = useState('');

    const [faqQuestion, setFaqQuestion] = useState('');
    const [faqAnswer, setFaqAnswer] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState(null);
    const handleCloseAttempt = (event) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    useEffect(() => {
        const handleEsc = (event) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        document.body.style.overflow = 'hidden';

        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [onClose]);

    const isFormValid = () => {
        if (mode === 'feedback') {
            return name && email && selectedAdmin && feedbackMessage;
        } else if (mode === 'faq') {
            return faqQuestion && faqAnswer;
        }
        return false;
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!isFormValid() || isSubmitting) return;

        setIsSubmitting(true);
        setSubmitStatus(null);

        let payload;
        let submissionType;

        if (mode === 'feedback') {
            payload = {
                type: 'Feedback',
                name,
                email,
                recipient: selectedAdmin,
                recipientName: adminList.find(a => a.id === selectedAdmin)?.name,
                message: feedbackMessage,
            };
            submissionType = "Обратная связь";
        } else {
            payload = {
                type: 'FAQ Suggestion',
                suggesterName: name,
                suggesterEmail: email,
                question: faqQuestion,
                suggestedAnswer: faqAnswer,
            };
            submissionType = "Предложение FAQ";
        }

        console.log(`Submitting ${submissionType}:`, payload);
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            console.log(`${submissionType} submitted successfully (simulated)`);
            setSubmitStatus('success');
            setTimeout(() => {
                setName('');
                setEmail('');
                if (mode === 'feedback') {
                    setFeedbackMessage('');
                    setSelectedAdmin(adminList[0]?.id || '');
                } else {
                    setFaqQuestion('');
                    setFaqAnswer('');
                }
                setTimeout(onClose, 1000);
            }, 2000);
        } catch (error) {
            console.error(`Error submitting ${submissionType} (simulated):`, error);
            setSubmitStatus('error');
        } finally {
            setTimeout(() => setIsSubmitting(false), 2000);
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={handleCloseAttempt}>
            <div className={styles.modalContent}>
                <button className={styles.closeButton} onClick={onClose} aria-label="Закрыть">
                    &times;
                </button>

                <div className={styles.modalHeader}>
                    <h2>Связаться с нами / Предложить FAQ</h2>
                    <div className={styles.modeSwitcher}>
                        <label className={styles.modeLabel}>
                            <input
                                type="radio"
                                name="mode"
                                value="feedback"
                                checked={mode === 'feedback'}
                                onChange={() => setMode('feedback')}
                                disabled={isSubmitting}
                            />
                            Обратная связь
                        </label>
                        <label className={styles.modeLabel}>
                            <input
                                type="radio"
                                name="mode"
                                value="faq"
                                checked={mode === 'faq'}
                                onChange={() => setMode('faq')}
                                disabled={isSubmitting}
                            />
                            Предложить FAQ
                        </label>
                    </div>
                </div>

                <div className={styles.modalBody}>
                    {submitStatus === 'success' ? (
                        <div className={styles.successMessage}>
                            {mode === 'feedback'
                                ? 'Спасибо за ваш отзыв! Мы скоро свяжемся с вами.'
                                : 'Спасибо за ваше предложение! Мы рассмотрим его для добавления в FAQ.'
                            }
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className={styles.feedbackForm}>
                            {submitStatus === 'error' && (
                                <div className={styles.errorMessage}>
                                    Произошла ошибка при отправке. Пожалуйста, попробуйте еще раз.
                                </div>
                            )}

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="feedback-name">
                                        Ваше имя {mode === 'feedback' ? '*' : '(Необязательно)'}
                                    </label>
                                    <input
                                        type="text"
                                        id="feedback-name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required={mode === 'feedback'} // Required only for feedback
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="feedback-email">
                                        Ваш Email {mode === 'feedback' ? '*' : '(Необязательно)'}
                                    </label>
                                    <input
                                        type="email"
                                        id="feedback-email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required={mode === 'feedback'} // Required only for feedback
                                        disabled={isSubmitting}
                                    />
                                </div>
                            </div>


                            {mode === 'feedback' && (
                                <>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="feedback-recipient">Кому адресовано? *</label>
                                        <select
                                            id="feedback-recipient"
                                            value={selectedAdmin}
                                            onChange={(e) => setSelectedAdmin(e.target.value)}
                                            required
                                            disabled={isSubmitting}
                                            className={styles.selectInput}
                                        >
                                            {adminList.map(admin => (
                                                <option key={admin.id} value={admin.id}>
                                                    {admin.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="feedback-message">Сообщение *</label>
                                        <textarea
                                            id="feedback-message"
                                            rows="6" // Adjust rows as needed
                                            value={feedbackMessage}
                                            onChange={(e) => setFeedbackMessage(e.target.value)}
                                            required
                                            disabled={isSubmitting}
                                        ></textarea>
                                    </div>
                                </>
                            )}

                            {/* --- FAQ Specific Fields --- */}
                            {mode === 'faq' && (
                                <>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="faq-question">Предлагаемый вопрос *</label>
                                        <textarea
                                            id="faq-question"
                                            rows="3"
                                            value={faqQuestion}
                                            onChange={(e) => setFaqQuestion(e.target.value)}
                                            required
                                            disabled={isSubmitting}
                                            placeholder="Сформулируйте вопрос, который вы хотите видеть в FAQ"
                                        ></textarea>
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label htmlFor="faq-answer">Предлагаемый ответ *</label>
                                        <textarea
                                            id="faq-answer"
                                            rows="5"
                                            value={faqAnswer}
                                            onChange={(e) => setFaqAnswer(e.target.value)}
                                            required
                                            disabled={isSubmitting}
                                            placeholder="Напишите ответ на предложенный выше вопрос"
                                        ></textarea>
                                    </div>
                                </>
                            )}

                            {/* Submit Button - always visible unless successful */}
                            <button
                                type="submit"
                                className={styles.submitButton}
                                disabled={!isFormValid() || isSubmitting}
                            >
                                {isSubmitting ? 'Отправка...' : (mode === 'feedback' ? 'Отправить отзыв' : 'Предложить FAQ')}
                            </button>
                        </form>
                    )}
                </div> {/* End modalBody */}
            </div> {/* End modalContent */}
        </div>
    );
};

export default FeedbackModal;