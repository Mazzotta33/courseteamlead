import {Navigate, Outlet} from "react-router-dom";
import TeacherNavbar from "../teacher/TeacherNavbar.jsx";
import React from "react";

const TeacherLayout = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');

    if (!isLoggedIn || (role !== 'Admin' && role !== 'teacher')) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div>
            <TeacherNavbar />
            <main><Outlet /></main>
        </div>
    );
};

export default TeacherLayout