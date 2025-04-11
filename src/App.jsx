import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Mainwindow from "./Components/Mainwindow/Mainwindow.jsx";
import CoursesPage from "./Components/Layout/CoursesPage.jsx"; // Создадим чуть позже

function App() {
    return (
        <Routes>
            <Route path="/" element={<Mainwindow/>}/>
            <Route path="/courses" element={<CoursesPage/>}/>
        </Routes>

    );
}

export default App;
