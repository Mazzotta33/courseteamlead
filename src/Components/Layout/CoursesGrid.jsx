import React from 'react';
import styles from './CoursesGrid.module.css';
import {useNavigate} from "react-router-dom";

const CoursesGrid = () => {
    const navigate =useNavigate();

    let courseDates = [
        {link: "https://avatars.mds.yandex.net/i?id=80c92e08b6f3e2b7d7b0c50265a9c907_l-5875850-images-thumbs&n=13"},
        {link: "https://avatars.mds.yandex.net/i?id=80c92e08b6f3e2b7d7b0c50265a9c907_l-5875850-images-thumbs&n=13"},
        {link: "https://avatars.mds.yandex.net/i?id=80c92e08b6f3e2b7d7b0c50265a9c907_l-5875850-images-thumbs&n=13"},
        {link: "https://avatars.mds.yandex.net/i?id=80c92e08b6f3e2b7d7b0c50265a9c907_l-5875850-images-thumbs&n=13"},
        {link: "https://avatars.mds.yandex.net/i?id=80c92e08b6f3e2b7d7b0c50265a9c907_l-5875850-images-thumbs&n=13"},
        {link: "https://avatars.mds.yandex.net/i?id=80c92e08b6f3e2b7d7b0c50265a9c907_l-5875850-images-thumbs&n=13"},
        {link: "https://avatars.mds.yandex.net/i?id=80c92e08b6f3e2b7d7b0c50265a9c907_l-5875850-images-thumbs&n=13"},
        {link: "https://avatars.mds.yandex.net/i?id=80c92e08b6f3e2b7d7b0c50265a9c907_l-5875850-images-thumbs&n=13"},
        {link: "https://avatars.mds.yandex.net/i?id=80c92e08b6f3e2b7d7b0c50265a9c907_l-5875850-images-thumbs&n=13"},
    ]

    return (
            <div className={styles.wrapper}>
                <div className={styles.grid}>
                    {courseDates.map((course, idx) => (
                        <figure className={styles.card} key={idx} onClick={() => navigate('/courses')}>
                            <img src={course.link} alt={`Курс ${idx + 1}`} className={styles.image}/>
                            <figcaption>Course</figcaption>
                        </figure>
                    ))}
                </div>
            </div>
    );
};

export default CoursesGrid;
