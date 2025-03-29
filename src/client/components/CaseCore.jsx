import React, { useEffect, useState } from "react";
import styles from "../styles/CaseCore.module.css";
import {
    validateCPF, validateEmail, validateRG, validatePhone,
} from "../../utils/validation.js";

const fieldLabels = {
    Name: "Nome",
    CPF: "CPF",
    RG: "RG",
    Address: "Endereço",
    Profession: "Profissão",
    Phone: "Telefone",
    Email: "E-mail",
    CivilStatus: "Estado Civil",
    BankDetails: "Dados Bancários",
    BirthDate: "Data de Nascimento",
    Organization: "Orgão",
    ProcessNumber: "Número do Processo",
    JusticeScope: "Escopo da Justiça",
    DemandType: "Tipo de Demanda",
    CaseDescription: "Descrição do Caso"
};

const deadlineLabels = {
    DeadlineType: "Tipo",
    DeadlineDate: "Data",
    DeadlineStatus: "Status"
};

const feeLabels = {
    FeeType: "Tipo",
    FeeValue: "Valor",
    FeeStatus: "Status"
};

export default function CaseCore({
    formData, setFormData,
    deadlines = [], setDeadlines,
    fees = [], setFees,
    onSubmit, submitText = "Salvar"
}) {

    const [errors, setErrors] = useState({});
    const [justiceScopes, setJusticeScopes] = useState([]);
    const [demandTypes, setDemandTypes] = useState([]);
    const [caseStatuses, setCaseStatuses] = useState([]);
    const [deadlineTypes, setDeadlineTypes] = useState([]);
    const [deadlineStatuses, setDeadlineStatuses] = useState([]);
    const [feeTypes, setFeeTypes] = useState([]);
    const [feeStatuses, setFeeStatuses] = useState([]);

    const [showJsonModal, setShowJsonModal] = useState(false);
    const [jsonInput, setJsonInput] = useState("");
    const [loadingJson, setLoadingJson] = useState(false);
    const [jsonError, setJsonError] = useState("");

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const urls = [
                    "justiceScopes", "demandTypes", "caseStatuses",
                    "deadlineTypes", "deadlineStatuses", "feeTypes", "feeStatuses"
                ].map(type => fetch(`http://localhost:5000/api/databaseSelect?type=${type}`));

                const res = await Promise.all(urls);
                const data = await Promise.all(res.map(r => r.json()));

                setJusticeScopes(data[0]);
                setDemandTypes(data[1]);
                setCaseStatuses(data[2]);
                setDeadlineTypes(data[3]);
                setDeadlineStatuses(data[4]);
                setFeeTypes(data[5]);
                setFeeStatuses(data[6]);

            } catch (err) {
                console.error("Erro ao carregar listas suspensas:", err);
            }
        };
        fetchOptions();
    }, []);

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setFormData({ ...formData, [name]: value });

        let error = "";
        if (!value.trim()) error = "Este campo é obrigatório";
        if (name === "CPF" && value && !validateCPF(value)) error = "CPF inválido";
        if (name === "Email" && value && !validateEmail(value)) error = "E-mail inválido";
        if (name === "RG" && value && !validateRG(value)) error = "RG inválido";
        if (name === "Phone" && value && !validatePhone(value)) error = "Telefone inválido";

        setErrors(prev => ({ ...prev, [name]: error }));
    };

    const handleDeadlineChange = (index, e) => {
        const updated = [...deadlines];
        updated[index][e.target.name] = e.target.value;
        setDeadlines(updated);
    };

    const addDeadline = () => setDeadlines([...deadlines, { DeadlineType: "", DeadlineDate: "", DeadlineStatus: "" }]);
    const removeDeadline = (index) => setDeadlines(deadlines.filter((_, i) => i !== index));

    const handleFeeChange = (index, e) => {
        const updated = [...fees];
        updated[index][e.target.name] = e.target.value;
        setFees(updated);
    };

    const addFee = () => setFees([...fees, { FeeType: "", FeeValue: "", FeeStatus: "" }]);
    const removeFee = (index) => setFees(fees.filter((_, i) => i !== index));

    const isFormValid = () => {
        const required = ["Name", "CPF", "RG", "Address", "Phone", "Email"];
        return required.every(field => formData[field]?.trim()) && Object.values(errors).every(e => !e);
    };

    const handleJsonParse = () => {
        setLoadingJson(true);
        setJsonError("");

        try {
            const parsed = JSON.parse(jsonInput);

            const parsedForm = {
                Name: parsed.Name,
                CPF: parsed.CPF,
                RG: parsed.RG,
                Address: parsed.Address,
                Profession: parsed.Profession,
                Phone: parsed.Phone,
                Email: parsed.Email,
                CivilStatus: parsed.CivilStatus,
                BankDetails: parsed.BankDetails,
                BirthDate: parsed.BirthDate,
                JusticeScope: parsed.JusticeScope,
                DemandType: parsed.DemandType,
                Organization: parsed.Organization,
                CaseDescription: parsed.CaseDescription,
                ProcessNumber: parsed.ProcessNumber,
                CaseStatus: parsed.CaseStatus
            };

            const parsedDeadlines = Array.isArray(parsed.deadlines) ? parsed.deadlines : parsed.Deadlines || [];
            const parsedFees = Array.isArray(parsed.fees) ? parsed.fees : parsed.Fees || [];

            setFormData({ ...formData, ...parsedForm });
            setDeadlines(parsedDeadlines);
            setFees(parsedFees);

            setShowJsonModal(false);
            setJsonInput("");
        } catch (err) {
            console.error("JSON parse error:", err);
            setJsonError("Erro ao interpretar o JSON. Verifique o formato.");
        } finally {
            setLoadingJson(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Detalhes do Caso</h1>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <select
                        className={styles.statusDropdown}
                        name="CaseStatus"
                        value={formData["CaseStatus"] || ""}
                        onChange={handleChange}
                    >
                        <option value="">Selecione um status</option>
                        {caseStatuses.map(s => (
                            <option key={s.CaseStatusID} value={s.StatusName}>
                                {s.StatusName}
                            </option>
                        ))}
                    </select>

                    <button
                        className={styles.jsonButton}
                        onClick={() => setShowJsonModal(true)}
                        title="Importar de JSON"
                    >
                        📄
                    </button>

                </div>
            </div>

            <form className={`${styles.form} ${styles.formSpacing}`} onSubmit={e => e.preventDefault()}>
                {/* Autor */}
                <fieldset className={styles.fieldset}>
                    <legend>Autor</legend>
                    <div className={styles.grid}>
                        {Object.keys(fieldLabels).slice(0, 10).map(field => (
                            <label key={field}>
                                {fieldLabels[field]}:
                                {["Address", "BankDetails"].includes(field)
                                    ? <textarea name={field} value={formData[field] || ""} onChange={handleChange} />
                                    : <input
                                        type={field === "BirthDate" ? "date" : "text"}
                                        name={field}
                                        value={formData[field] || ""}
                                        onChange={handleChange}
                                    />}
                                {errors[field] && <span className={styles.error}>{errors[field]}</span>}
                            </label>
                        ))}
                    </div>
                </fieldset>

                {/* Informações do Caso */}
                <fieldset className={styles.fieldset}>
                    <legend>Informações do Caso</legend>
                    <div className={styles.grid}>
                        {["ProcessNumber", "JusticeScope", "DemandType", "Organization", "CaseDescription"].map(field => (
                            <label key={field}>
                                {fieldLabels[field]}:
                                {["JusticeScope", "DemandType"].includes(field) ? (
                                    <select name={field} value={formData[field] || ""} onChange={handleChange}>
                                        <option value="">Selecione</option>
                                        {(field === "JusticeScope" ? justiceScopes : demandTypes).map(item => (
                                            <option
                                                key={item.JusticeScopeID || item.DemandType}
                                                value={item.JusticeScopeName || item.DemandTypeName}
                                            >
                                                {item.ScopeName || item.DemandName}
                                            </option>
                                        ))}
                                    </select>
                                ) : field === "CaseDescription" ? (
                                    <textarea name={field} value={formData[field] || ""} onChange={handleChange} rows={4} />
                                ) : (
                                    <input type="text" name={field} value={formData[field] || ""} onChange={handleChange} />
                                )}
                            </label>
                        ))}
                    </div>
                </fieldset>

                {/* Prazos */}
                <fieldset className={styles.fieldset}>
                    <legend>Prazos</legend>
                    {Array.isArray(deadlines) && deadlines.map((d, i) => (
                        <div key={i} className={styles.deadlineBox}>
                            <div className={styles.grid}>
                                {Object.entries(deadlineLabels).map(([key, label]) => (
                                    <label key={key}>
                                        {label}:
                                        {key === "DeadlineDate" ? (
                                            <input type="date" name={key} value={d[key]} onChange={e => handleDeadlineChange(i, e)} />
                                        ) : (
                                            <select name={key} value={d[key] || ""} onChange={e => handleDeadlineChange(i, e)}>
                                                <option value="">Selecione</option>
                                                {(key === "DeadlineType" ? deadlineTypes : deadlineStatuses).map(item => (
                                                    <option
                                                        key={item.DeadlineTypeID || item.DeadlineStatusID}
                                                        value={item.TypeName || item.StatusName}
                                                    >
                                                        {item.TypeName || item.StatusName}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </label>
                                ))}
                            </div>
                            <div className={styles.deadlineActions}>
                                <button type="button" onClick={() => removeDeadline(i)}>-</button>
                            </div>
                        </div>
                    ))}
                    <button type="button" className={styles.addDeadlineButton} onClick={addDeadline}>
                        + Adicionar novo prazo
                    </button>
                </fieldset>

                {/* Honorários */}
                <fieldset className={styles.fieldset}>
                    <legend>Honorários</legend>
                    {Array.isArray(fees) && fees.map((f, i) => (
                        <div key={i} className={styles.feeBox}>
                            <div className={styles.grid}>
                                {Object.entries(feeLabels).map(([key, label]) => (
                                    <label key={key}>
                                        {label}:
                                        {key === "FeeValue" ? (
                                            <input type="text" name={key} value={f[key]} onChange={e => handleFeeChange(i, e)} />
                                        ) : (
                                            <select name={key} value={f[key] || ""} onChange={e => handleFeeChange(i, e)}>
                                                <option value="">Selecione</option>
                                                {(key === "FeeType" ? feeTypes : feeStatuses).map(item => (
                                                    <option
                                                        key={item.FeeTypeID || item.FeeStatusID}
                                                        value={item.TypeName || item.StatusName}
                                                    >
                                                        {item.TypeName || item.StatusName}
                                                    </option>
                                                ))}
                                            </select>
                                        )}
                                    </label>
                                ))}
                            </div>
                            <div className={styles.feeActions}>
                                <button type="button" onClick={() => removeFee(i)}>-</button>
                            </div>
                        </div>
                    ))}
                    <button type="button" className={styles.addFeeButton} onClick={addFee}>
                        + Adicionar novo honorário
                    </button>
                </fieldset>
            </form>

            <button
                className={styles.saveButton}
                onClick={() => isFormValid() && onSubmit()}
                disabled={!isFormValid()}
            >
                {submitText}
            </button>

            {showJsonModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <h2>📄 Importar Dados do Caso via JSON</h2>
                        <p>
                            Cole abaixo o conteúdo de um arquivo JSON contendo os dados do caso, prazos e honorários.
                        </p>

                        <textarea
                            rows={10}
                            className={styles.jsonTextarea}
                            placeholder={`{
  "formData": {
    "Name": "João da Silva",
    "CPF": "123.456.789-00"
  },
  "deadlines": [...],
  "fees": [...]
}`}
                            value={jsonInput}
                            onChange={(e) => setJsonInput(e.target.value)}
                        />

                        {jsonError && <div className={styles.jsonError}>{jsonError}</div>}

                        <div className={styles.modalActions}>
                            <button className={styles.primaryButton} onClick={handleJsonParse} disabled={loadingJson}>
                                {loadingJson ? "Carregando..." : "Preencher com JSON"}
                            </button>
                            <button className={styles.secondaryButton} onClick={() => setShowJsonModal(false)}>
                                Cancelar
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}
