import React, { useState } from "react";
import CaseCore from "../components/CaseCore.jsx";

const defaultData = {
  Name: "", CPF: "", RG: "", Address: "", Profession: "", Phone: "", Email: "",
  CivilStatus: "", BankDetails: "", BirthDate: "", Organization: "", CaseDescription: "",
  ProcessNumber: "", JusticeScope: "", DemandType: "", CaseStatus: ""
};

export default function NewCase() {
  const [formData, setFormData] = useState({ ...defaultData });
  const [Deadlines, setDeadlines] = useState([{ DeadlineType: "", DeadlineDate: "", DeadlineStatus: "" }]);
  const [Fees, setFees] = useState([{ FeeType: "", FeeValue: "", FeeStatus: "" }]);

  const handleSave = async () => {
    const body = { ...formData, Deadlines, Fees };
    const res = await fetch("http://localhost:5000/api/databaseInsert?type=newCase", {
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
      deadlines={Deadlines}
      setDeadlines={setDeadlines}
      fees={Fees}
      setFees={setFees}
      onSubmit={handleSave}
      submitText="Salvar Novo Caso"
    />
  );
}
