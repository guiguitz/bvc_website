
import React, { useEffect, useState } from 'react';
import '../styles/CasesTable.css';
import { FaSort, FaSortUp, FaSortDown, FaFilter } from 'react-icons/fa';
import { validateCPF, validateEmail, validateRG, validatePhone } from '../../utils/validation.js';

const CasesTable = () => {
  const [cases, setCases] = useState([]);
  const [filteredCases, setFilteredCases] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ Name: '', ProcessNumber: '', CaseStatusName: '' });
  const [sortConfig, setSortConfig] = useState({ key: '', direction: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCase, setSelectedCase] = useState(null);
  const [validationErrors, setValidationErrors] = useState({});
  const [canSave, setCanSave] = useState(false);
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
        Object.values(c).some(val =>
          typeof val === 'string' && val.toLowerCase().includes(lower)
        )
      );
    }

    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        temp = temp.filter(c => c[key] === filters[key]);
      }
    });

    setFilteredCases(temp);
    setCurrentPage(1);
  }, [searchTerm, filters, cases]);

  useEffect(() => {
    const escListener = (e) => {
      if (e.key === 'Escape') setSelectedCase(null);
    };
    document.addEventListener('keydown', escListener);
    return () => document.removeEventListener('keydown', escListener);
  }, []);

  const getSortedCases = () => {
    let sortable = [...filteredCases];
    if (sortConfig.key) {
      sortable.sort((a, b) => {
        let valA = a[sortConfig.key];
        let valB = b[sortConfig.key];
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

  const handleFilterChange = (key, value) => {
    setFilters({ ...filters, [key]: value });
    setActiveFilterDropdown(null);
  };

  const toggleFilterDropdown = (e, key) => {
    e.stopPropagation();
    setActiveFilterDropdown(activeFilterDropdown === key ? null : key);
  };

  const renderFilterOptions = (key) => {
    const uniqueValues = [...new Set(cases.map((c) => c[key]))];
    return (
      <div className="filter-dropdown">
        <div onClick={() => handleFilterChange(key, '')}>Todos</div>
        {uniqueValues.map((val, idx) => (
          <div key={idx} onClick={() => handleFilterChange(key, val)}>{val}</div>
        ))}
      </div>
    );
  };

  const handleInputChange = (field, value) => {
    const updatedCase = { ...selectedCase, [field]: value };
    setSelectedCase(updatedCase);

    let error = '';
    if (field === 'CPF' && !validateCPF(value)) error = 'CPF inválido';
    if (field === 'Email' && !validateEmail(value)) error = 'Email inválido';
    if (field === 'RG' && !validateRG(value)) error = 'RG inválido';
    if (field === 'Phone' && !validatePhone(value)) error = 'Telefone inválido';

    const updatedErrors = { ...validationErrors, [field]: error };
    setValidationErrors(updatedErrors);

    const allValid = Object.values(updatedErrors).every(e => !e);
    setCanSave(allValid);
  };

  const renderEditableField = (label, field) => (
    <div className="field-block">
      <label><strong>{label}</strong></label>
      <input
        type="text"
        value={selectedCase[field] || ''}
        onChange={(e) => handleInputChange(field, e.target.value)}
        className={`modal-input ${validationErrors[field] ? 'error' : ''}`}
      />
      {validationErrors[field] && (
        <div className="error-text">{validationErrors[field]}</div>
      )}
    </div>
  );

  const sortedCases = getSortedCases();
  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = sortedCases.slice(indexOfFirstCase, indexOfLastCase);
  const totalPages = Math.ceil(filteredCases.length / casesPerPage);

  const renderList = (items) => (
    <div className="modal-list">{items.map((i, idx) => <div key={idx}>{i}</div>)}</div>
  );

  const handleSave = async () => {
    await fetch("http://localhost:5000/api/databaseInsert", {
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
            {['Name', 'ProcessNumber', 'CaseStatusName'].map(key => (
              <th key={key} onClick={() => handleSort(key)}>
                {key === 'Name' ? 'Nome' : key === 'ProcessNumber' ? 'Número do Processo' : 'Status'}
  <button className="filter-btn" onClick={(e) => toggleFilterDropdown(e, key)}><FaFilter /></button>
                {activeFilterDropdown === key && renderFilterOptions(key)}
              </th>
            ))}
            <th>Prazos Pendentes</th>
            <th>Honorários Recebidos</th>
            <th>Honorários Pendentes</th>
          </tr>
        </thead>
        <tbody>
          {currentCases.map((c) => {
            const pendentes = c.Deadlines.filter(d => d.DeadlineStatus !== 'Entregue').map(d => d.DeadlineDate);
            const pagos = c.Fees.filter(f => f.FeeStatus.toLowerCase() === 'pago').reduce((sum, f) => sum + f.FeeValue, 0);
            const naoPagos = c.Fees.filter(f => f.FeeStatus.toLowerCase() !== 'pago').reduce((sum, f) => sum + f.FeeValue, 0);

            return (
              <tr key={c.CaseID} onClick={() => setSelectedCase(c)}>
                <td>{c.Name}</td>
                <td>{c.ProcessNumber}</td>
                <td>{c.CaseStatusName}</td>
                <td>{renderList(pendentes)}</td>
                <td>R$ {pagos}</td>
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
            <h2>Detalhes do Caso</h2>
            {renderEditableField("Nome:", "Name")}
            {renderEditableField("CPF:", "CPF")}
            {renderEditableField("RG:", "RG")}
            {renderEditableField("Email:", "Email")}
            {renderEditableField("Telefone:", "Phone")}
            {renderEditableField("Endereço:", "Address")}
            {renderEditableField("Organização:", "Organization")}
            {renderEditableField("Profissão:", "Profession")}
            {renderEditableField("Estado Civil:", "CivilStatus")}
            {renderEditableField("Data de Nascimento:", "BirthDate")}
            {renderEditableField("Banco:", "BankDetails")}
            {renderEditableField("Escopo da Justiça:", "JusticeScopeName")}
            {renderEditableField("Tipo de Demanda:", "DemandTypeName")}
            {renderEditableField("Descrição:", "CaseDescription")}
            {renderEditableField("Observações:", "Observation")}

            <h3>Honorários</h3>
            {renderList(selectedCase.Fees.map(f => `${f.FeeType}: R$ ${f.FeeValue} - ${f.FeeStatus}`))}

            <h3>Prazos</h3>
            {renderList(selectedCase.Deadlines.map(d => `${d.DeadlineType} - ${d.DeadlineDate} - ${d.DeadlineStatus}`))}

            <div className="modal-buttons">
              <button onClick={() => setSelectedCase(null)}>Fechar</button>
              <button onClick={handleSave} disabled={!canSave} className="save-btn">Salvar Alterações</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesTable;
