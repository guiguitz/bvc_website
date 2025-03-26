import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import "../styles/Sidebar.css";

function Sidebar() {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
            <button className="toggle-button" onClick={toggleSidebar}>
                <FiMenu size={20} />
            </button>

            {isOpen && (
                <>
                    <ul className="sidebar-links">
                        <li><Link to="/">Dashboard</Link></li>
                        <li><Link to="/cases">Casos</Link></li>
                        <li><Link to="/cases/new">Novo Caso</Link></li>
                        <li><Link to="/finance">Financeiro</Link></li>
                    </ul>

                    <div className="user-info">
                        <p>Beatriz Costa</p>
                        <p className="email">beatrizvc.adv@gmail.com</p>
                    </div>
                </>
            )}
        </div>
    );
}

export default Sidebar;
