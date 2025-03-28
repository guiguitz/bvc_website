import React, { useState } from "react";
import CaseCore from "../components/CaseCore.jsx";

const defaultData = {
  Name: "", CPF: "", RG: "", Address: "", Profession: "", Phone: "", Email: "",
  CivilStatus: "", BankDetails: "", BirthDate: "", JusticeScopeID: "",
  DemandTypeID: "", Organization: "", CaseDescription: "", ProcessNumber: "",
  Observations: "", CaseStatusID: ""
};

export default function NewCase() {
  const [formData, setFormData] = useState({ ...defaultData });
  const [deadlines, setDeadlines] = useState([{ DeadlineType: "", DeadlineDate: "", DeadlineStatus: "" }]);
  const [fees, setFees] = useState([{ FeeType: "", FeeValue: "", FeeStatus: "" }]);

  const handleSave = async () => {
    const body = { ...formData, deadlines, fees };
    const res = await fetch("http://localhost:5000/api/saveCase", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      alert("Caso salvo com sucesso!");
      setFormData({ ...defaultData });
      setDeadlines([{ DeadlineType: "", DeadlineDate: "", DeadlineStatus: "" }]);
      setFees([{ FeeType: "", FeeValue: "", FeeStatus: "" }]);
    } else {
      alert("Erro ao salvar o caso.");
    }
  };

  return (
    <CaseCore
      formData={formData}
      setFormData={setFormData}
      deadlines={deadlines}
      setDeadlines={setDeadlines}
      fees={fees}
      setFees={setFees}
      onSubmit={handleSave}
      submitText="Salvar Novo Caso"
    />
  );
}
