import express from "express";
import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post("/", async (req, res) => {
  const { input } = req.body;

  const systemPrompt = `
Você é um assistente jurídico. Extraia os seguintes campos do texto fornecido e devolva em JSON com esta estrutura:

{
  formData: {
    Name, CPF, RG, Address, Profession, Phone, Email,
    CivilStatus, BankDetails, BirthDate, JusticeScope,
    DemandType, Organization, CaseDescription, ProcessNumber, CaseStatusID
  },
  deadlines: [{ DeadlineType, DeadlineDate, DeadlineStatus }],
  fees: [{ FeeType, FeeValue, FeeStatus }]
}

Se não houver algum campo no texto, use string vazia ou array vazio. Não invente dados.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: input }
      ],
      response_format: "json"
    });

    const parsed = JSON.parse(completion.choices[0].message.content);
    res.json(parsed);
  } catch (err) {
    console.error("GPT parsing error:", err);
    res.status(500).json({ error: "GPT parsing error." });
  }
});

export default router;
