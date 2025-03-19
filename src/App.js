import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Cases from "./pages/Cases";
import CaseForm from "./pages/CaseForm";
import Finance from "./pages/Finance";
import Navbar from "./components/NavBar";
import "./styles/global.css";

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
