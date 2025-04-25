import {Navigate, Outlet} from "react-router-dom";
import TeacherNavbar from "../teacher/TeacherNavbar.jsx";
import React from "react";

const TeacherLayout = ({handleLogout}) => {
    return (
        <div>
            <TeacherNavbar handleLogout={handleLogout}/>
            <main><Outlet /></main>
        </div>
    );
};

export default TeacherLayout