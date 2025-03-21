import React, { useState, useEffect } from "react";
import styles from "./CaseForm.module.css";

export function CaseForm() {
    const [formData, setFormData] = useState({
        Name: "", CPF: "", RG: "", Address: "", Profession: "", Phone: "", Email: "",
        CivilStatus: "", BankDetails: "", BirthDate: "", JusticeScopeID: "",
        DemandTypeID: "", Organization: "", CaseDescription: "", ProcessNumber: "",
        Observations: "", PrazoTipo: "", PrazoData: "", PrazoStatus: "",
        HonorariosTipo: "", HonorariosValor: "", HonorariosStatus: "", CaseStatusID: ""
    });

    const [justiceScopes, setJusticeScopes] = useState([]);
    const [demandTypes, setDemandTypes] = useState([]);
    const [caseStatuses, setCaseStatuses] = useState([]);
    const [deadlineTypes, setDeadlineTypes] = useState([]);
    const [deadlineStatuses, setDeadlineStatuses] = useState([]);
    const [errors, setErrors] = useState({});
    const [deadlines, setDeadlines] = useState([{ PrazoTipo: "", PrazoData: "", PrazoStatus: "" }]);
    const [fees, setFees] = useState([{ HonorariosTipo: "", HonorariosValor: "", HonorariosStatus: "" }]);

    const validateCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]/g, ""); // Remove non-numeric characters
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false; // Check length and repeated digits

        let sum = 0, remainder;
        for (let i = 1; i <= 9; i++) sum += parseInt(cpf[i - 1]) * (11 - i);
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf[9])) return false;

        sum = 0;
        for (let i = 1; i <= 10; i++) sum += parseInt(cpf[i - 1]) * (12 - i);
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        return remainder === parseInt(cpf[10]);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validateRG = (rg) => {
        const rgRegex = /^(\d{1,2}\.?\d{3}\.?\d{3}-?[0-9XxA-Za-z]?|\d{5,9}[0-9XxA-Za-z]?)$/;
        return rgRegex.test(rg);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^\d{10,11}$/; // Accepts 10 or 11 digits (e.g., 1234567890 or 12345678901)
        return phoneRegex.test(phone);
    };

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const responses = await Promise.all([
                    fetch("http://localhost:5000/api/options?type=justiceScopes"),
                    fetch("http://localhost:5000/api/options?type=demandTypes"),
                    fetch("http://localhost:5000/api/options?type=caseStatus"),
                    fetch("http://localhost:5000/api/options?type=deadlineTypes"),
                    fetch("http://localhost:5000/api/options?type=deadlineStatus")
                ]);

                const data = await Promise.all(responses.map(async (res) => {
                    if (!res.ok) {
                        console.error(`Error fetching ${res.url}:`, res.status, res.statusText);
                        throw new Error(`Failed to fetch ${res.url}`);
                    }
                    try {
                        return await res.json();
                    } catch (error) {
                        console.error(`Invalid JSON from ${res.url}:`, error);
                        throw new Error(`Invalid JSON from ${res.url}`);
                    }
                }));

                const [
                    justiceScopesData,
                    demandTypesData,
                    caseStatusesData,
                    deadlineTypesData,
                    deadlineStatusesData
                ] = data;

                console.log("Fetched justiceScopes:", justiceScopesData);
                console.log("Fetched demandTypes:", demandTypesData);
                console.log("Fetched caseStatuses:", caseStatusesData);
                console.log("Fetched deadlineTypes:", deadlineTypesData);
                console.log("Fetched deadlineStatuses:", deadlineStatusesData);

                setJusticeScopes(justiceScopesData, "JusticeScopeID");
                setDemandTypes(demandTypesData, "DemandTypeID");
                setCaseStatuses(caseStatusesData, "CaseStatusID");
                setDeadlineTypes(deadlineTypesData, "DeadlineTypeID");
                setDeadlineStatuses(deadlineStatusesData, "DeadlineStatusID");
            } catch (error) {
                console.error("Erro ao carregar opções:", error);
            }
        };

        fetchOptions();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Simple validation: Make sure required fields are not empty
        if (value.trim() === "") {
            setErrors({ ...errors, [name]: "Este campo é obrigatório" });
        } else {
            const newErrors = { ...errors };
            delete newErrors[name];
            setErrors(newErrors);
        }

        // Additional validation for CPF
        if (name === "CPF" && value.trim() !== "" && !validateCPF(value)) {
            setErrors({ ...errors, CPF: "CPF inválido" });
        }

        // Additional validation for Email
        if (name === "Email" && value.trim() !== "" && !validateEmail(value)) {
            setErrors({ ...errors, Email: "E-mail inválido" });
        }

        // Additional validation for RG
        if (name === "RG" && value.trim() !== "" && !validateRG(value)) {
            setErrors({ ...errors, RG: "RG inválido" });
        }

        // Additional validation for Phone
        if (name === "Phone" && value.trim() !== "" && !validatePhone(value)) {
            setErrors({ ...errors, Phone: "Telefone inválido" });
        }
    };

    const handleDeadlineChange = (index, e) => {
        const { name, value } = e.target;
        const updatedDeadlines = [...deadlines];
        updatedDeadlines[index][name] = value;
        setDeadlines(updatedDeadlines);
    };

    const addDeadline = () => {
        setDeadlines([...deadlines, { PrazoTipo: "", PrazoData: "", PrazoStatus: "" }]);
    };

    const removeDeadline = (index) => {
        const updatedDeadlines = deadlines.filter((_, i) => i !== index);
        setDeadlines(updatedDeadlines);
    };

    const handleFeeChange = (index, e) => {
        const { name, value } = e.target;
        const updatedFees = [...fees];
        updatedFees[index][name] = value;
        setFees(updatedFees);
    };

    const addFee = () => {
        setFees([...fees, { HonorariosTipo: "", HonorariosValor: "", HonorariosStatus: "" }]);
    };

    const removeFee = (index) => {
        const updatedFees = fees.filter((_, i) => i !== index);
        setFees(updatedFees);
    };

    const handleSave = async () => {
        console.log("Form data before submission:", formData); // Log form data

        if (Object.keys(errors).length > 0) {
            alert("Por favor, corrija os erros antes de salvar.");
            return;
        }

        const formDataWithFees = { ...formData, deadlines, fees };

        try {
            const response = await fetch("http://localhost:5000/api/cases", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formDataWithFees),
            });

            console.log("Response status:", response.status);

            if (response.ok) {
                const result = await response.json();
                console.log("Response from server:", result);
                alert("Caso salvo com sucesso!");
                setFormData({
                    Name: "", CPF: "", RG: "", Address: "", Profession: "", Phone: "", Email: "",
                    CivilStatus: "", BankDetails: "", BirthDate: "", JusticeScopeID: "",
                    DemandTypeID: "", Organization: "", CaseDescription: "", ProcessNumber: "",
                    Observations: "", PrazoTipo: "", PrazoData: "", PrazoStatus: "",
                    HonorariosTipo: "", HonorariosValor: "", HonorariosStatus: "", CaseStatusID: ""
                });
                setDeadlines([{ PrazoTipo: "", PrazoData: "", PrazoStatus: "" }]);
                setFees([{ HonorariosTipo: "", HonorariosValor: "", HonorariosStatus: "" }]);
            } else {
                const contentType = response.headers.get("Content-Type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    console.error("Erro ao salvar o caso:", errorData); // Log error details
                    alert(`Erro ao salvar o caso: ${errorData.error}`);
                } else {
                    const errorText = await response.text();
                    console.error("Erro ao salvar o caso (HTML response):", errorText); // Log HTML response
                    alert("Erro ao salvar o caso. Verifique o console para mais detalhes.");
                }
            }
        } catch (error) {
            console.error("Erro ao salvar o caso:", error); // Log unexpected errors
            alert("Erro ao salvar o caso.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Novo Caso</h1>
                <select
                    className={styles.statusDropdown}
                    name="CaseStatusID"
                    value={formData.CaseStatusID}
                    onChange={handleChange}
                >
                    <option value="">Selecione um status</option>
                    {caseStatuses.map((status) => (
                        <option key={status.CaseStatusID} value={status.CaseStatusID}>{status.StatusName}</option>
                    ))}
                </select>
            </div>

            <form className={`${styles.form} ${styles.formSpacing}`}>
                {/* Section: Autor */}
                <fieldset className={styles.fieldset}>
                    <legend>Autor</legend>
                    <div className={styles.grid}>
                        <label>Nome:<input type="text" name="Name" value={formData.Name} onChange={handleChange} /></label>
                        <label>CPF:
                            <input type="text" name="CPF" value={formData.CPF} onChange={handleChange} />
                            {errors.CPF && <span className={styles.error}>{errors.CPF}</span>}
                        </label>
                        <label>RG:
                            <input type="text" name="RG" value={formData.RG} onChange={handleChange} />
                            {errors.RG && <span className={styles.error}>{errors.RG}</span>}
                        </label>
                        <label>Endereço:<textarea name="Address" value={formData.Address} onChange={handleChange}></textarea></label>
                        <label>Profissão:<input type="text" name="Profession" value={formData.Profession} onChange={handleChange} /></label>
                        <label>Telefone:
                            <input type="text" name="Phone" value={formData.Phone} onChange={handleChange} />
                            {errors.Phone && <span className={styles.error}>{errors.Phone}</span>}
                        </label>
                        <label>Email:
                            <input type="email" name="Email" value={formData.Email} onChange={handleChange} />
                            {errors.Email && <span className={styles.error}>{errors.Email}</span>}
                        </label>
                        <label>Estado Civil:<input type="text" name="CivilStatus" value={formData.CivilStatus} onChange={handleChange} /></label>
                        <label>Dados Bancários:<textarea name="BankDetails" value={formData.BankDetails} onChange={handleChange}></textarea></label>
                        <label>Data de Nascimento:<input type="date" name="BirthDate" value={formData.BirthDate} onChange={handleChange} /></label>
                    </div>
                </fieldset>

                {/* Section: Informações do Caso */}
                <fieldset className={styles.fieldset}>
                    <legend>Informações do Caso</legend>
                    <div className={styles.grid}>
                        {/* Removed "Status do Caso" from here */}
                        <label>Número do Processo:<input type="text" name="ProcessNumber" value={formData.ProcessNumber} onChange={handleChange} /></label>
                        <label>Escopo da Justiça:
                            <select name="JusticeScopeID" value={formData.JusticeScopeID} onChange={handleChange}>
                                <option value="">Selecione um escopo</option>
                                {justiceScopes.map((scope) => (
                                    <option key={scope.JusticeScopeID} value={scope.JusticeScopeID}>{scope.ScopeName}</option>
                                ))}
                            </select>
                        </label>
                        <label>Tipo de Demanda:
                            <select name="DemandTypeID" value={formData.DemandTypeID} onChange={handleChange}>
                                <option value="">Selecione um tipo de demanda</option>
                                {demandTypes.map((type) => (
                                    <option key={type.DemandTypeID} value={type.DemandTypeID}>{type.DemandName}</option>
                                ))}
                            </select>
                        </label>
                        <label>Descrição do Caso:
                            <textarea name="CaseDescription" value={formData.CaseDescription} onChange={handleChange} rows="6"></textarea>
                        </label>
                    </div>
                </fieldset>

                {/* Section: Prazos */}
                <fieldset className={styles.fieldset}>
                    <legend>Prazos</legend>
                    {deadlines.map((deadline, index) => (
                        <div key={index} className={styles.deadlineBox}>
                            <div className={styles.grid}>
                                <label>Tipo:
                                    <select
                                        name="PrazoTipo"
                                        value={deadline.PrazoTipo}
                                        onChange={(e) => handleDeadlineChange(index, e)}
                                    >
                                        <option value="">Selecione um tipo de prazo</option>
                                        {deadlineTypes.map((type) => (
                                            <option key={type.DeadlineTypeID} value={type.DeadlineTypeID}>{type.TypeName}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>Status:
                                    <select
                                        name="PrazoStatus"
                                        value={deadline.PrazoStatus}
                                        onChange={(e) => handleDeadlineChange(index, e)}
                                    >
                                        <option value="">Selecione um status</option>
                                        {deadlineStatuses.map((status) => (
                                            <option key={status.DeadlineStatusID} value={status.DeadlineStatusID}>{status.StatusName}</option>
                                        ))}
                                    </select>
                                </label>
                                <label>Data:
                                    <input
                                        type="date"
                                        name="PrazoData"
                                        value={deadline.PrazoData}
                                        onChange={(e) => handleDeadlineChange(index, e)}
                                    />
                                </label>
                            </div>
                            <div className={styles.deadlineActions}>
                                <button type="button" onClick={() => removeDeadline(index)}>-</button>
                            </div>
                        </div>
                    ))}
                    <button type="button" className={styles.addDeadlineButton} onClick={addDeadline}>
                        Adicionar novo prazo
                    </button>
                </fieldset>

                {/* Section: Honorários */}
                <fieldset className={styles.fieldset}>
                    <legend>Honorários</legend>
                    {fees.map((fee, index) => (
                        <div key={index} className={styles.feeBox}>
                            <div className={styles.grid}>
                                <label>Tipo:
                                    <input
                                        type="text"
                                        name="HonorariosTipo"
                                        value={fee.HonorariosTipo}
                                        onChange={(e) => handleFeeChange(index, e)}
                                    />
                                </label>
                                <label>Valor:
                                    <input
                                        type="text"
                                        name="HonorariosValor"
                                        value={fee.HonorariosValor}
                                        onChange={(e) => handleFeeChange(index, e)}
                                    />
                                </label>
                                <label>Status:
                                    <input
                                        type="text"
                                        name="HonorariosStatus"
                                        value={fee.HonorariosStatus}
                                        onChange={(e) => handleFeeChange(index, e)}
                                    />
                                </label>
                            </div>
                            <div className={styles.feeActions}>
                                <button type="button" onClick={() => removeFee(index)}>-</button>
                            </div>
                        </div>
                    ))}
                    <button type="button" className={styles.addFeeButton} onClick={addFee}>
                        Adicionar novo honorário
                    </button>
                </fieldset>
            </form>

            <button className={styles.saveButton} onClick={handleSave}>Salvar</button>
        </div>
    );
}

export default CaseForm;
