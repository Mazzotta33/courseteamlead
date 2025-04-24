import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Login from "./Components/AuthAndReg/Login.jsx";
import Register from "./Components/AuthAndReg/Register.jsx";
import TeacherDashboard from "./Components/teacher/TeacherDashboard.jsx";
import CourseBuilderPage from "./Components/teacher/CourseBuilderPage.jsx";
import StatisticsPage from "./Components/teacher/StatisticsPage.jsx";
import ChatPage from "./Components/Chat/ChatPage.jsx";
import CoursesPage from "./Components/Layout/CoursesPage.jsx";
import AdminCourses from "./Components/teacher/Courses/AdminCourses.jsx";
import CourseDetail from "./Components/teacher/Courses/CourseDetail.jsx";
import UserLayout from "./Components/Layout/UserLayout.jsx";
import TeacherLayout from "./Components/Layout/TeacherLayout.jsx";
import ProfilePage from "./Components/Layout/ProfilePage.jsx";
import CoursesGrid from "./Components/Layout/CoursesGrid.jsx";
import StudentCoursesGrid from "./Components/Layout/StudentCoursesGrid.jsx";

    const initData = null//"query_id=AAH8wTozAAAAAPzBOjOX8e3U&user=%7B%22id%22%3A859488764%2C%22first_name%22%3A%22%D0%A0%D0%B0%D0%B7%D0%B8%D0%BB%D1%8C%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22Mazzotta33%22%2C%22language_code%22%3A%22ru%22%2C%22allows_write_to_pm%22%3Atrue%2C%22photo_url%22%3A%22https%3A%5C%2F%5C%2Ft.me%5C%2Fi%5C%2Fuserpic%5C%2F320%5C%2Ff45apqRNWD5RmkFvYeL-6aH5IrCwrgCfJZjFn-39XLc.svg%22%7D&auth_date=1745135545&signature=p9LbGC0ZhSGtJbi4WgIuXlP2AgwHrtjw_BffiSIIrPmYzT612SNunSV8b5ow5FUvCOZG6fJRXiIgO1UOfsceBA&hash=e48befb5bfd901c7a2ea677e193b007241fb224567ed686863eb300277b8b3c7";
const InitialRedirect = () => {
    const redirectPath = initData ? '/courses' : '/register';
    return <Navigate to={redirectPath} replace />;
};

function App() {
    const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
    const [isLoading, setIsLoading] = useState(true);
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const location = useLocation();

    useEffect(() => {
        const handleStorageChange = () => {
            setUserRole(localStorage.getItem('userRole'));
        };
        window.addEventListener('storage', handleStorageChange);

        // Отправляем initData на сервер при его наличии
        if (initData) {
            const authenticateTelegramUser = async () => {
                try {
                    const response = await axios.post('http://localhost:5231/api/account/telegramAuth', initData, {
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });

                    // Сохраняем данные пользователя в localStorage
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('userRole', response.data.role = 'User');
                    localStorage.setItem('token', response.data.token);

                    setUserRole(response.data.role = 'User');
                } catch (error) {
                    console.error('Telegram auth error:', error);
                    // Перенаправляем на регистрацию при ошибке аутентификации
                    //window.location.href = '/register';
                } finally {
                    setIsLoading(false);
                }
            };

            authenticateTelegramUser();
        } else {
            setIsLoading(false);
        }

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Routes location={location} key={location.pathname}>
            <Route path="/" element={<InitialRedirect />} />
            <Route path="/login" element={<Login setUserRole={setUserRole} />} />
            <Route path="/register" element={<Register />} />
            {isLoggedIn && userRole === 'Admin' && (
                <Route path="/teacher" element={<TeacherLayout />}>
                    <Route index element={<TeacherDashboard />} />
                    <Route path="builder" element={<CourseBuilderPage />} />
                    <Route path="stats" element={<StatisticsPage />} />
                    <Route path="chat" element={<ChatPage role={userRole} />} />
                    <Route path="mycourses" element={<AdminCourses />} />
                    <Route path="mycourses/detail/:courseId" element={<CourseDetail />} />
                    <Route path="courses/:courseId" element={<CoursesPage role={userRole} />} />
                </Route>
            )}

            {isLoggedIn && userRole === 'User' ? (
                <Route path="/" element={<UserLayout />}>
                    <Route path="mainwindow" element={<CoursesGrid/>} />
                    <Route path="courses/:courseId" element={<CoursesPage role={userRole} />} />
                    <Route path={"courses"} element={<StudentCoursesGrid/>} />
                    <Route path="chat" element={<ChatPage role={userRole} />} />
                    <Route path="profile" element={<ProfilePage/>}/>
                </Route>
            ) : null}

            <Route path="*" element={
                <Navigate to={isLoggedIn ? (userRole === 'Admin' ? '/teacher' : '/mainwindow') : '/login'} replace />
            } />
        </Routes>
    );
}

export default App;
