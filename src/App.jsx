import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CoursesPage from "./Components/Layout/CoursesPage.jsx";
import Login from "./Components/AuthAndReg/Login.jsx";
import Register from "./Components/AuthAndReg/Register.jsx";
import Mainwindow from "./Components/Mainwindow/Mainwindow.jsx";
import ChatPage from "./Components/Chat/ChatPage.jsx"; // Убедитесь, что этот компонент существует


function App() {

    return (
        <>
            <Routes>
                <Route path="/" element={<Mainwindow />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/chat" element={<ChatPage />} />
            </Routes>
        </>
    );
}

export default App;