import React from 'react';
import styles from './ReviewsSection.module.css';

const reviews = [
    {
        name: 'Анна Ковалева',
        text: 'Курс по веб-разработке помог мне найти новую работу!',
        rating: 5,
    },
    {
        name: 'Игорь Смирнов',
        text: 'Отличный курс по Data Science! Много практики.',
        rating: 4,
    },
    {
        name: 'Мария Литвинова',
        text: 'Благодаря курсу по UX/UI смогла сделать портфолио.',
        rating: 5,
    },
];

const ReviewsSection = () => {
    return (
        <div className={styles.section}>
            <h2 className={styles.heading}>Отзывы наших студентов</h2>
            <div className={styles.cards}>
                {reviews.map((review, idx) => (
                    <div className={styles.card} key={idx}>
                        <p className={styles.name}>{review.name}</p>
                        <p className={styles.text}>&quot;{review.text}&quot;</p>
                        <p className={styles.rating}>{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewsSection;
