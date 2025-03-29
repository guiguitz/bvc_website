import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import '../styles/CasesTable.css';
import { FaSort, FaSortUp, FaSortDown, FaFilter } from 'react-icons/fa';
import CaseCore from "../components/CaseCore.jsx";

const CasesTable = () => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ Name: '', ProcessNumber: '', CaseStatus: '' });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCase, setSelectedCase] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeFilterDropdown, setActiveFilterDropdown] = useState(null);
  const casesPerPage = 5;

  const fetchData = async () => {
    const response = await fetch("http://localhost:5000/api/databaseSelect?type=allCases");
    const data = await response.json();
    setCases(data);
    setFilteredCases(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let temp = [...cases];

    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      temp = temp.filter(c =>
        JSON.stringify(c).toLowerCase().includes(lower)
      );
    }

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        if (key === 'Deadlines') {
          temp = temp.filter(c =>
            c.Deadlines.some(d => d.DeadlineStatus !== 'Entregue' && d.DeadlineDate === filters[key])
          );
        } else if (key === 'Fees') {
          temp = temp.filter(c =>
            c.Fees.some(f => f.FeeStatus.toLowerCase() !== 'pago' && f.FeeValue.toString() === filters[key])
          );
        } else {
          temp = temp.filter(c => c[key] === filters[key]);
        }
      }
    });

    setFilteredCases(temp);
    setCurrentPage(1);
  }, [searchTerm, filters, cases]);

  useEffect(() => {
    const escListener = (e) => {
      if (e.key === 'Escape') {
        setSelectedCase(null);
        setActiveFilterDropdown(null);
      }
    };
    document.addEventListener('keydown', escListener);
    return () => document.removeEventListener('keydown', escListener);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.filter-dropdown') && !e.target.closest('.filter-btn')) {
        setActiveFilterDropdown(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const getSortedCases = () => {
    let sortable = [...filteredCases];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];

        // Handle specific cases for custom fields
        if (sortConfig.key === 'Deadlines') {
          valA = a.Deadlines.filter(d => d.DeadlineStatus !== 'Entregue').length;
          valB = b.Deadlines.filter(d => d.DeadlineStatus !== 'Entregue').length;
        } else if (sortConfig.key === 'Fees') {
          valA = a.Fees.filter(f => f.FeeStatus.toLowerCase() !== 'pago').reduce((sum, f) => sum + f.FeeValue, 0);
          valB = b.Fees.filter(f => f.FeeStatus.toLowerCase() !== 'pago').reduce((sum, f) => sum + f.FeeValue, 0);
        }

        if (typeof valA === 'string') valA = valA.toLowerCase();
        if (typeof valB === 'string') valB = valB.toLowerCase();
        if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1;
        if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return <FaSort className="sort-icon" />;
    return sortConfig.direction === 'asc' ? <FaSortUp className="sort-icon" /> : <FaSortDown className="sort-icon" />;
  };

  const renderFilterIcon = (key) => {
    return (
      <FaFilter className={`filter-icon ${filters[key] ? 'active' : ''}`} />
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setActiveFilterDropdown(null);
  };

  const renderFilterOptions = (key, buttonRef) => {
    let uniqueValues;
    if (key === 'Deadlines') {
      uniqueValues = [...new Set(cases.flatMap(c =>
        c.Deadlines.filter(d => d.DeadlineStatus !== 'Entregue').map(d => d.DeadlineDate)
      ))];
    } else if (key === 'Fees') {
      uniqueValues = [...new Set(cases.flatMap(c =>
        c.Fees.filter(f => f.FeeStatus.toLowerCase() !== 'pago').map(f => f.FeeValue.toString())
      ))];
    } else {
      uniqueValues = [...new Set(cases.map((c) => c[key]))];
    }

    const dropdownContent = (
      <div
        className="filter-dropdown"
        style={{
          position: 'absolute',
          top: buttonRef?.getBoundingClientRect().bottom + window.scrollY,
          left: buttonRef?.getBoundingClientRect().left + window.scrollX,
          zIndex: 1000,
        }}
      >
        <div onClick={() => handleFilterChange(key, '')}>Todos</div>
        {uniqueValues.map((val, idx) => (
          <div key={idx} onClick={() => handleFilterChange(key, val)}>{val}</div>
        ))}
      </div>
    );

    return ReactDOM.createPortal(
      dropdownContent,
      document.body
    );
  };

  const toggleFilterDropdown = (e, key) => {
    e.stopPropagation();
    const buttonRef = e.target.closest('.filter-btn');
    setActiveFilterDropdown(activeFilterDropdown === key ? null : { key, buttonRef });
  };

  const sortedCases = getSortedCases();
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = sortedCases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);

  const renderList = (items) => (
    <div className="modal-list">{items.map((i, idx) => <div key={idx}>{i}</div>)}</div>
  );

  const handleSave = async () => {
    await fetch("http://localhost:5000/api/databaseInsert?type=newCase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedCase),
    });
    setShowSuccess(true);
    setSelectedCase(null);
    setTimeout(async () => {
      await fetchData();
      setShowSuccess(false);
    }, 1500);
  };

  return (
    <div className="cases-container">
      <input
        className="search-box"
        type="text"
        placeholder="Buscar casos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <table className="cases-table">
        <thead>
          <tr>
            {['Name', 'ProcessNumber', 'CaseStatus', 'Deadlines', 'CaseDescription', 'Fees'].map(key => (
              <th key={key}>
                <div className="header-content">
                  {key === 'Name' ? 'Nome' :
                    key === 'ProcessNumber' ? 'Número do Processo' :
                      key === 'CaseStatus' ? 'Status' :
                        key === 'Deadlines' ? 'Prazos' :
                          key === 'CaseDescription' ? 'Descrição' : 'Honorários'}

                  <button className="filter-btn" onClick={(e) => toggleFilterDropdown(e, key)}>
                    {renderFilterIcon(key)}
                  </button>
                  <button className="sort-icon-btn" onClick={() => handleSort(key)}>
                    {renderSortIcon(key)}
                  </button>
                </div>
                {activeFilterDropdown?.key === key && renderFilterOptions(key, activeFilterDropdown.buttonRef)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {currentCases.map((c) => {
            const pendentes = c.Deadlines.filter(d => d.DeadlineStatus !== 'Entregue').map(d => d.DeadlineDate);
            const naoPagos = c.Fees.filter(f => f.FeeStatus.toLowerCase() !== 'pago').reduce((sum, f) => sum + f.FeeValue, 0);

            return (
              <tr key={c.CaseID} onClick={() => setSelectedCase(c)}>
                <td>{c.Name}</td>
                <td>{c.ProcessNumber}</td>
                <td>{c.CaseStatus}</td>
                <td>{renderList(pendentes)}</td>
                <td>{c.CaseDescription}</td>
                <td>R$ {naoPagos}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Anterior</button>
        <span>Página {currentPage} de {totalPages}</span>
        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Próxima</button>
      </div>

      {selectedCase && (
        <div className="modal-overlay" onClick={() => setSelectedCase(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            {showSuccess && (<div className="success-banner">Alterações salvas com sucesso!</div>)}
            <CaseCore
              formData={selectedCase}
              setFormData={setSelectedCase}
              deadlines={selectedCase.Deadlines || []}
              setDeadlines={updated => setSelectedCase({ ...selectedCase, Deadlines: updated })}
              fees={selectedCase.Fees || []}
              setFees={updated => setSelectedCase({ ...selectedCase, Fees: updated })}
              onSubmit={handleSave}
              submitText="Salvar Alterações"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesTable;
