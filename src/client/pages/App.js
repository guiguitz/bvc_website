import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard.js";
import CasesTable from "./CasesTable.js";
import CaseForm from "./CaseForm.js";
import Finance from "./Finance.js";
import Sidebar from "../components/Sidebar.js";
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
                        <Route path="/cases/new" element={<CaseForm />} />
                        <Route path="/finance" element={<Finance />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
