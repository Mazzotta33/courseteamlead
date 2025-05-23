// src/App.jsx

import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from "./Components/AuthAndReg/Login.jsx";
import Register from "./Components/AuthAndReg/Register.jsx";
import TeacherDashboard from "./Components/teacher/TeacherDashboard.jsx";
import CourseBuilderPage from "./Components/teacher/CourseBuilderPage.jsx";
import StatisticsPage from "./Components/teacher/StatisticsPage.jsx";
import ChatPage from "./Components/Chat/ChatPage.jsx";
import LessonPage from "./Components/Layout/LessonPage/LessonPage.jsx";
import AdminCourses from "./Components/teacher/Courses/AdminCourses.jsx";
import UserLayout from "./Components/Layout/UserLayout.jsx";
import TeacherLayout from "./Components/teacher/TeacherLayout.jsx";
import ProfilePage from "./Components/Layout/ProfilePage.jsx";
import CoursesGrid from "./Components/Layout/CoursesGrid.jsx";
import StudentCoursesGrid from "./Components/Layout/StudentCoursesGrid.jsx";
import { useTelegramAuthMutation } from "./Redux/api/authApi.js";
import TestThemeInputPage from "./Components/Quiz/TestThemeInputPage.jsx";
import CourseDetail from "./Components/teacher/Courses/CourseDetail/CourseDetail.jsx";

const initData = window.Telegram?.WebApp?.initData || null;
//const initData = "query_id=AAH8wTozAAAAAPzBOjOX8e3U&user=%7B%22id%22%3A859488764%2C%22first_name%22%3A%22%D0%A0%D0%B0%D0%B7%D0%B8%D0%BB%D1%8C%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Mazzotta33%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Ff45apqRNWD5RmkFvYeL-6aH5IrCwrgCfJZjFn-39XLc.svg%22%7D&auth_date=1745135545&signature=p9LbGC0ZhSGtJbi4WgIuXlP2AgwHrtjw_BffiSIIrPmYzT612SNunSV8b5ow5FUvCOZG6fJRXiIgO1UOfsceBA&hash=e48befb5bfd901c7a2ea677e193b007241fb224567ed686863eb300277b8b3c7";
//const initData = "query_id=AAHX6OwxAAAAANfo7DEyVj5r&user=%7B%22id%22%3A837609687%2C%22first_name%22%3A%22%D0%9A%D0%B0%D0%BC%D0%B8%D0%BB%D1%8C%22%2C%22last_name%22%3A%22%D0%97%D0%B0%D0%BB%D1%8F%D0%BB%D0%B8%D0%B5%D0%B2%22%2C%22username%22%3A%22cassidal%22%2C%22language_code%22%3A%22en%22%2C%22is_premium%22%3Atrue%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FXrx9ItlZPzQl7ZfbYies3VALmD0cxUE3u8PUjxf3mLA.svg%22%7D&auth_date=1745096360&signature=-IMaobJQBP6XvryTV0jZJqaeRpwdzHn8O5PwrV6nLNzvOARXmksrF_Jv9Yyf1uGXrXG18z9iNR2gH4nAhm6VCg&hash=0fb12c921d065bec5c141def772404932d032b1e25b9b6a684b7afe96513b1ca"
//const initData = "query_id=AAEe_oo7AAAAAB7-ijvOOx2C&user=%7B%22id%22%3A998964766%2C%22first_name%22%3A%22%D0%9D%D0%B8%D0%BA%D0%B8%D1%82%D0%B0%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Nikita_Pha%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2FoFsnkaRqnoz7yTDbXyfLTRy2-p3rDbT8rcH1OE_6lV4.svg%22%7D&auth_date=1745096365&signature=lyf3NUW0FX0LOT1oqtgJWlLuCYHu92U6R9X8udCaYBegPRgM2FafF5KxV9KzY1KYaw2CGnJjEcHs1fQRZGolDQ&hash=123d5d0fef85846c6e4b45364c1e0b8adef885cd4485ea22b27f70cbab3c63c4"

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
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('userRole');
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        setUserRole(null);
    };

    useEffect(() => {
        if (initData && !isLoggedIn) {
            telegramAuth(initData);
        } else {
            setIsLoading(false);
        }

        const handleStorageChange = () => {
            const newIsLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const newUserRole = localStorage.getItem('userRole');
            setIsLoggedIn(newIsLoggedIn);
            setUserRole(newUserRole);
        };
        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [telegramAuth]);

    useEffect(() => {
        if (isAuthSuccess && authData) {
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