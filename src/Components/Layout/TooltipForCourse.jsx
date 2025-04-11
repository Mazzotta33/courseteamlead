import React from 'react';
import styles from './TopNavbar.module.css';
import { useNavigate } from 'react-router-dom';

const TooltipForCourse = ({ isVisible }) => {
    const navigate = useNavigate();

    return (
        <div className={`${styles.tool} ${isVisible ? styles.visible : ''}`}>
            <ul>
                <li onClick={() => navigate('/courses')}>TeamLead</li>
                <li>Лидерские качества</li>
            </ul>
            <ul>
                <li>SoftSkill</li>
                <li>HardSkill</li>
            </ul>
        </div>
    );
};

export default TooltipForCourse;
