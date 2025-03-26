// /pages/api/chat.js
import { ChatOpenAI } from "@langchain/openai";
import { PromptTemplate } from "@langchain/core/prompts";
import fs from "fs";
import path from "path";

const chatModel = new ChatOpenAI({
  temperature: 0,
  modelName: "gpt-4",
  openAIApiKey: process.env.OPENAI_API_KEY,
});

const prompt = PromptTemplate.fromTemplate(`
Tu es Amélie, une assistante spécialisée en résidences services seniors.

Voici le contexte de l’utilisateur :
{contexte}

Voici l’étape actuelle de la conversation : {etape}

Voici la logique métier (extrait JSON) :
{logique}

Voici le message utilisateur :
"{message}"

Ta mission :
- détecte l’intention exprimée,
- identifie les infos utiles à extraire du message,
- enrichis le contexte si nécessaire,
- et génère une réponse fluide, personnalisée, utile.

Réponds dans ce format JSON :
{{
  "etape": number,
  "sous_etape": string,
  "intention": string,
  "reponse_finale": string,
  "contexte_enrichi": object
}}
`);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Méthode non autorisée" });
  }

  const { message, contexte, etape } = req.body;

  const filePath = path.resolve("datasets/etape_" + etape + "/logique_conversationnelle_etape_" + etape + ".json");
  let logique = "";
  try {
    logique = fs.readFileSync(filePath, "utf-8");
  } catch (err) {
    return res.status(500).json({ message: "Fichier logique introuvable" });
  }

  const promptFormatted = await prompt.format({
    message,
    contexte: JSON.stringify(contexte),
    etape,
    logique,
  });

  try {
    const result = await chatModel.invoke(promptFormatted);
    res.status(200).json(JSON.parse(result.content));
  } catch (error) {
    console.error("Erreur GPT:", error);
    res.status(500).json({ message: "Erreur GPT" });
  }
}
