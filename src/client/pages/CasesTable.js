import React, { useState, useEffect } from "react";
import styles from "../styles/CasesTable.css";
import { FiSearch, FiFilter, FiFolder } from "react-icons/fi";

function CasesTable() {
    const [cases, setCases] = useState([]);
    const [filteredCases, setFilteredCases] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState(null);

    useEffect(() => {
        const fetchCases = async () => {
            try {
                const response = await fetch("http://localhost:5000/api/cases-with-deadlines");
                const data = await response.json();
                setCases(data);
                setFilteredCases(data);
            } catch (error) {
                console.error("Error fetching cases:", error);
            }
        };
        fetchCases();
    }, []);

    useEffect(() => {
        const filtered = cases.filter((c) =>
            c.NomeDoAutor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.NumeroProcesso.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCases(filtered);
    }, [searchTerm, cases]);

    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        const sortedData = [...filteredCases].sort((a, b) => {
            if (a[key] < b[key]) return direction === "ascending" ? -1 : 1;
            if (a[key] > b[key]) return direction === "ascending" ? 1 : -1;
            return 0;
        });
        setFilteredCases(sortedData);
        setSortConfig({ key, direction });
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <FiSearch className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Pesquisar processos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className={styles.searchBar}
                />
            </div>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th onClick={() => handleSort("NomeDoAutor")}>
                            Nome do Autor <FiFilter className={styles.filterIcon} />
                        </th>
                        <th onClick={() => handleSort("NumeroProcesso")}>
                            #Processo <FiFilter className={styles.filterIcon} />
                        </th>
                        <th onClick={() => handleSort("TipoPrazo")}>
                            Tipo de Prazo <FiFilter className={styles.filterIcon} />
                        </th>
                        <th onClick={() => handleSort("Prazo")}>
                            Prazo <FiFilter className={styles.filterIcon} />
                        </th>
                        <th onClick={() => handleSort("Status")}>
                            Status <FiFilter className={styles.filterIcon} />
                        </th>
                        <th>Observações</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCases.map((caseItem, index) => (
                        <tr key={index}>
                            <td><FiFolder className={styles.folderIcon} /> {caseItem.NomeDoAutor}</td>
                            <td>{caseItem.NumeroProcesso}</td>
                            <td>{caseItem.TipoPrazo}</td>
                            <td>{caseItem.Prazo}</td>
                            <td>{caseItem.Status}</td>
                            <td>{caseItem.Observacoes}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default CasesTable;
