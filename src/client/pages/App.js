import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard.js";
import Cases from "./Cases.js";
import CaseForm from "./CaseForm.js";
import Finance from "./Finance.js";
import Navbar from "../components/NavBar.js";
import "../styles/global.css";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/cases" element={<Cases />} />
                <Route path="/cases/new" element={<CaseForm />} />
                <Route path="/finance" element={<Finance />} />
            </Routes>
        </Router>
    );
}

export default App;
