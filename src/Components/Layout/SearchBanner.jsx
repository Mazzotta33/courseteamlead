import React from 'react';
import styles from './SearchBanner.module.css';

const SearchBanner = () => {
    return (
        <div className={styles.banner}>
            <div className={styles.contentWrapper}>
                <h2 className={styles.title}>Раскройте Свой Потенциал С Помощью Наших Онлайн-Курсов</h2>
                <div className={styles.searchWrapper}>
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Чему вы хотите научиться сегодня?"
                    />
                </div>
                <p className={styles.popular}><strong>Популярные:</strong> <span className={styles.link}>TeamLead</span>
                </p>
            </div>
        </div>
    );
};

export default SearchBanner;