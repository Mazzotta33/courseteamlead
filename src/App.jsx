import React, { useState, useEffect } from 'react'; // Добавили useEffect для чтения из localStorage
import {Routes, Route, Outlet, Navigate } from 'react-router-dom';
import TeacherNavbar from "./Components/teacher/TeacherNavbar.jsx";
import Login from "./Components/AuthAndReg/Login.jsx";
import Register from "./Components/AuthAndReg/Register.jsx";
import TeacherDashboard from "./Components/teacher/TeacherDashboard.jsx";
import CourseBuilderPage from "./Components/teacher/CourseBuilderPage.jsx";
import StatisticsPage from "./Components/teacher/StatisticsPage.jsx";
import ChatPage from "./Components/Chat/ChatPage.jsx";
import CoursesPage from "./Components/Layout/CoursesPage.jsx";
import Mainwindow from "./Components/Mainwindow/Mainwindow.jsx";
import AdminCourses from "./Components/teacher/Courses/AdminCourses.jsx";
import CourseDetail from "./Components/teacher/Courses/CourseDetail.jsx";
import UserLayout from "./Components/Layout/UserLayout.jsx";
import TeacherLayout from "./Components/Layout/TeacherLayout.jsx";

function App() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    return (
            <Routes>
                <Route path="/login" element={<Login /* onLoginSuccess={updateAuth} */ />} />
                <Route path="/" element={<Register />} />

                {isLoggedIn && userRole === 'Admin' ? (
                    <Route path="/teacher" element={<TeacherLayout />}>
                        <Route index element={<TeacherDashboard />} />
                        <Route path="builder" element={<CourseBuilderPage />} />
                        <Route path="stats" element={<StatisticsPage />} />
                        <Route path="chat" element={<ChatPage role={userRole}/>} />
                        <Route path="mycourses" element={<AdminCourses/>}/>
                        <Route path="mycourses/detail/:courseId" element={<CourseDetail/>}/>
                        <Route path="courses" element={<CoursesPage role={userRole}/>} />
                    </Route>
                ) : null}


                {isLoggedIn && userRole === 'User' ? (
                    <Route path="/" element={<UserLayout />}>
                        <Route path="mainwindow" element={<Mainwindow />} />
                        <Route path="courses" element={<CoursesPage role={userRole} />} />
                        <Route path="chat" element={<ChatPage role={userRole} />} />
                    </Route>
                ) : null}

                <Route path="*" element={
                    <Navigate to={isLoggedIn ? (userRole === 'Admin' ? '/teacher' : '/mainwindow') : '/login'} replace />
                } />

            </Routes>
    );
}

export default App;