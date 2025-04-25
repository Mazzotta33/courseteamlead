// src/App.jsx

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from "./Components/AuthAndReg/Login.jsx";
import Register from "./Components/AuthAndReg/Register.jsx";
import TeacherDashboard from "./Components/teacher/TeacherDashboard.jsx";
import CourseBuilderPage from "./Components/teacher/CourseBuilderPage.jsx";
import StatisticsPage from "./Components/teacher/StatisticsPage.jsx";
import ChatPage from "./Components/Chat/ChatPage.jsx";
import LessonPage from "./Components/Layout/LessonPage.jsx";
import AdminCourses from "./Components/teacher/Courses/AdminCourses.jsx";
import CourseDetail from "./Components/teacher/Courses/CourseDetail.jsx";
import UserLayout from "./Components/Layout/UserLayout.jsx";
import TeacherLayout from "./Components/teacher/TeacherLayout.jsx";
import ProfilePage from "./Components/Layout/ProfilePage.jsx";
import CoursesGrid from "./Components/Layout/CoursesGrid.jsx";
import StudentCoursesGrid from "./Components/Layout/StudentCoursesGrid.jsx";
import { useTelegramAuthMutation } from "./Redux/api/authApi.js";
import TestThemeInputPage from "./Components/Layout/TestThemeInputPage.jsx";

const initData = window.Telegram?.WebApp?.initData || null;
//const initData = "query_id=AAH8wTozAAAAAPzBOjOX8e3U&user=%7B%22id%22%3A859488764%2C%22first_name%22%3A%22%D0%A0%D0%B0%D0%B7%D0%B8%D0%BB%D1%8C%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Mazzotta33%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Ff45apqRNWD5RmkFvYeL-6aH5IrCwrgCfJZjFn-39XLc.svg%22%7D&auth_date=1745135545&signature=p9LbGC0ZhSGtJbi4WgIuXlP2AgwHrtjw_BffiSIIrPmYzT612SNunSV8b5ow5FUvCOZG6fJRXiIgO1UOfsceBA&hash=e48befb5bfd901c7a2ea677e193b007241fb224567ed686863eb300277b8b3c7"

const LoadingScreen = () => {
    return <div>Загрузка приложения...</div>;
};

function App() {
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
    const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');
    const [isLoading, setIsLoading] = useState(true);

    const location = useLocation();

    const [telegramAuth, {
        isLoading: isAuthLoading,
        isSuccess: isAuthSuccess,
        isError: isAuthError,
        error: authError,
        data: authData
    }] = useTelegramAuthMutation();

    const handleLogout = () => {
        console.log('Logging out...');
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('token');

        setIsLoggedIn(false);
        setUserRole(null);
        console.log('Navigating to /register after logout.');
    };

    useEffect(() => {
        console.log("App useEffect: Checking auth status.");
        console.log("initData:", initData ? "Available" : "Not available");
        console.log("isLoggedIn from localStorage:", isLoggedIn);

        if (initData && !isLoggedIn) {
            console.log("Attempting Telegram auth with initData...");
            telegramAuth(initData);
        } else {
            console.log("No initData or already logged in. Initial loading finished.");
            setIsLoading(false);
        }

        const handleStorageChange = () => {
            console.log("localStorage change detected.");
            const newIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const newUserRole = localStorage.getItem('userRole');
            setIsLoggedIn(newIsLoggedIn);
            setUserRole(newUserRole);
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            console.log("App cleanup: Removing storage listener.");
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [telegramAuth]);

    useEffect(() => {
        if (isAuthSuccess && authData) {
            console.log('Telegram auth successful:', authData);
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', authData.role || 'User');
            localStorage.setItem('token', authData.token);

            setIsLoggedIn(true);
            setUserRole(authData.role || 'User');

            setIsLoading(false);
        }
    }, [isAuthSuccess, authData]);

    useEffect(() => {
        if (isAuthError) {
            console.error('Telegram auth error:', authError);
            setIsLoading(false);
        }
    }, [isAuthError, authError]);


    if (isLoading || isAuthLoading) {
        return <LoadingScreen />;
    }

    let targetPath;
    if (isLoggedIn) {
        targetPath = userRole === 'Admin' ? '/teacher' : '/mainwindow';
    } else {
        targetPath = '/register';
    }

    return (
        <Routes>
            {location.pathname === '/' && <Route path="/" element={<Navigate to={targetPath} replace />} />}
            {!isLoggedIn && (
                <>
                    <Route path="/login" element={<Login onLoginSuccess={(role) => { setIsLoggedIn(true); setUserRole(role); }} />} /> {/* /login */}
                    <Route path="/register" element={<Register />} />
                    <Route path="*" element={<Navigate to="/register" replace />} />
                </>
            )}

            {isLoggedIn && userRole === 'Admin' && (
                <Route path="/teacher/*" element={<TeacherLayout handleLogout={handleLogout} />}>
                    <Route index element={<TeacherDashboard />} />
                    <Route path="builder" element={<CourseBuilderPage />} />
                    <Route path="stats" element={<StatisticsPage />} />
                    <Route path="chat" element={<ChatPage role={userRole} />} />
                    <Route path="mycourses" element={<AdminCourses />} />
                    <Route path="mycourses/detail/:courseId" element={<CourseDetail />} />
                    <Route path="courses/:courseId" element={<LessonPage role={userRole} />} />
                    <Route path="*" element={<Navigate to="/teacher" replace />} />
                </Route>
            )}

            {isLoggedIn && userRole === 'User' && (
                <Route path="/*" element={<UserLayout />}>
                    <Route path="mainwindow" element={<CoursesGrid/>} />
                    <Route path="courses/:courseId" element={<LessonPage role={userRole} />} />
                    <Route path="courses" element={<StudentCoursesGrid/>} />
                    <Route path="chat" element={<ChatPage role={userRole} />} />
                    <Route path="profile" element={<ProfilePage/>}/>
                    <Route path="take-test" element={<TestThemeInputPage />} />
                    <Route path="*" element={<Navigate to="/mainwindow" replace />} />
                </Route>
            )}

            {isLoggedIn && (
                <Route path="*" element={<Navigate to={userRole === 'Admin' ? '/teacher' : '/mainwindow'} replace />} />
            )}

        </Routes>
    );
}

export default App;
