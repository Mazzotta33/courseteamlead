import React, { useState, useEffect } from 'react'; // Добавили useEffect для чтения из localStorage
import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import TeacherNavbar from "./Components/teacher/TeacherNavbar.jsx";
import Login from "./Components/AuthAndReg/Login.jsx";
import Register from "./Components/AuthAndReg/Register.jsx";
import TeacherDashboard from "./Components/teacher/TeacherDashboard.jsx";
import CourseBuilderPage from "./Components/teacher/CourseBuilderPage.jsx";
import StatisticsPage from "./Components/teacher/StatisticsPage.jsx";
import ChatPage from "./Components/Chat/ChatPage.jsx";
import Mainwindow from "./Components/Mainwindow/Mainwindow.jsx";
import CoursesPage from "./Components/Layout/CoursesPage.jsx";

const TeacherLayout = () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const role = localStorage.getItem('userRole');

    if (!isLoggedIn || role !== 'teacher') {
        return <Navigate to="/login" replace />;
    }

    return (
        <div>
            <TeacherNavbar />
            <main><Outlet /></main>
        </div>
    );
};

function App() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userRole = localStorage.getItem('userRole');

    return (
            <Routes>
                <Route path="/login" element={<Login /* onLoginSuccess={updateAuth} */ />} />
                <Route path="/" element={<Register />} />

                {isLoggedIn && userRole === 'teacher' ? (
                    <Route path="/teacher" element={<TeacherLayout />}>
                        <Route index element={<TeacherDashboard />} />
                        <Route path="builder" element={<CourseBuilderPage />} />
                        <Route path="stats" element={<StatisticsPage />} />
                        <Route path="chat" element={<ChatPage role={'teacher'}/>} />
                    </Route>
                ) : null}


                {isLoggedIn && userRole === 'student' ? (
                    <>
                        <Route path="/mainwindow" element={<Mainwindow />} />
                        <Route path="/courses" element={<CoursesPage />} />
                        <Route path="/chat" element={<ChatPage role={'student'}/>} />
                    </>
                ) : null}

                <Route path="*" element={
                    <Navigate to={isLoggedIn ? (userRole === 'teacher' ? '/teacher' : '/mainwindow') : '/login'} replace />
                } />

            </Routes>
    );
}

export default App;