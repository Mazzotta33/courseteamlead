import React from 'react';
import styles from './Mainwindow.module.css';

import TopNavbar from '../Layout/TopNavbar';
import SearchBanner from '../Layout/SearchBanner';
import CoursesGrid from '../Layout/CoursesGrid';
import ReviewsSection from '../Layout/ReviewsSection';

const Mainwindow = () => {
    return (
        <div className={styles.mainwindow}>
            {/*<TopNavbar />*/}
            <SearchBanner />
            <CoursesGrid />
            {/*<ReviewsSection />*/}
        </div>
    );
};

export default Mainwindow;
