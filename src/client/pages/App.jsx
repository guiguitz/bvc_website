import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard.jsx";
import CasesTable from "./CasesTable.jsx";
import NewCase from "./NewCase.jsx";
import Finance from "./Finance.jsx";
import Sidebar from "../components/Sidebar.jsx";
import "../styles/global.css";

function App() {
    return (
        <Router>
            <div style={{ display: "flex" }}>
                <Sidebar />
                <div style={{ marginLeft: "200px", padding: "20px", width: "100%" }}>
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/cases" element={<CasesTable />} />
                        <Route path="/cases/new" element={<NewCase />} />
                        <Route path="/finance" element={<Finance />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
