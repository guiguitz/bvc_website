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
            <p style={{ color: "#c4c0b3", marginTop: "10px" }}>Beatriz Costa | beatrizvc.adv@gmail.com</p>
        </nav>
    );
}

export default Navbar;
