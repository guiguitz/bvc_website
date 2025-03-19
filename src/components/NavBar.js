import React from "react";

export function Navbar() {
    return (
        <nav>
            <ul>
                <li><a href="/">Dashboard</a></li>
                <li><a href="/cases">Casos</a></li>
                <li><a href="/cases/new">Novo Caso</a></li>
                <li><a href="/finance">Financeiro</a></li>
            </ul>
        </nav>
    );
}

export default Navbar;
