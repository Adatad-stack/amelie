import { chatWithGpt } from "./utils/gpt.js";
import orchestrateur from "./orchestrateur.json";
import prompts from "./prompts_amelie.json";
import infosAExtraire from "./informations_a_extraire.json";
import interpreteur from "./interpreteur_prompt.json";
import fullResidences from "./full_residences_nohee.json";

function findResidenceContact(query) {
  const normalize = (str) => str.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const match = Object.entries(fullResidences).find(([nom, data]) =>
    normalize(nom).includes(normalize(query))
  );
  if (!match) return null;
  const data = match[1];
  const fiche = data["Fiche résidence"];
  return {
    nom: match[0],
    adresse: fiche["Localisation et adresse"].Adresse,
    telephone: fiche.Contact.Téléphone,
    email: fiche.Contact.Email
  };
}

function detectInfosFromMessage(message, infosAExtraire) {
  const detected = {};
  for (const [id, info] of Object.entries(infosAExtraire)) {
    const patterns = info.exemples_valeurs || [];
    for (const val of patterns) {
      if (message.toLowerCase().includes(val.toLowerCase())) {
        detected[id] = val;
        break;
      }
    }
  }
  return detected;
}

function updateEtapes(context, phase, infosAExtraire, infosDetectees) {
  const phaseObj = orchestrateur.phases.find(p => p.id === phase);
  const questions = phaseObj?.questions_a_valider || [];
  let phaseValidee = true;
  for (const q of questions) {
    if (!context[q] && infosDetectees[q]) {
      context[q] = infosDetectees[q];
    }
    if (!context[q]) phaseValidee = false;
  }
  return phaseValidee;
}

function getNextPhase(currentPhaseId) {
  const phases = orchestrateur.phases;
  const index = phases.findIndex(p => p.id === currentPhaseId);
  return phases[index + 1]?.id || currentPhaseId;
}

export async function POST(req) {
  try {
    const body = await req.json();
    const message = body.message;
    const contexte = body.contexte || {};

    if (!contexte.phase) contexte.phase = "accueil";
    if (!contexte.etapes) contexte.etapes = [];
    if (!contexte.messages) contexte.messages = [];
    contexte.last_message = message;
    contexte.messages.push({ role: "user", content: message });

    const patternContact = /(contacter|appeler|joindre|num[ée]ro|t[ée]l[ée]phone|email).*r[ée]sidence|r[ée]sidence.*(num[ée]ro|t[ée]l[ée]phone|email|contact)/i;
    const matchContact = message.match(patternContact);
    if (matchContact) {
      const contact = findResidenceContact(message);
      if (contact) {
        const texte = `Voici les coordonnées de ${contact.nom} :<br>📍 ${contact.adresse}<br>📞 ${contact.telephone}<br>${contact.email ? `✉️ ${contact.email}` : ""}`;
        return Response.json({ reponseBot: { texte, contexte } });
      }
    }

    const infosDetectees = detectInfosFromMessage(message, infosAExtraire);
    const phaseValidee = updateEtapes(contexte, contexte.phase, infosAExtraire, infosDetectees);
    if (phaseValidee) {
      contexte.etapes.push(contexte.phase);
      const nextPhase = getNextPhase(contexte.phase);
      contexte.phase = nextPhase;
    }

    const promptPhase = prompts.phases[contexte.phase]?.reponse || "";
    const systemPrompt = `${prompts.system_prompt_global}\n\n${promptPhase}`;

    // Appel GPT interpréteur pour détection contextuelle intelligente
    const gptInterpreteurResponse = await chatWithGpt([
      { role: "system", content: interpreteur.interpreteur_prompt },
      { role: "user", content: message }
    ]);

    let analyse = {};
    try {
      analyse = JSON.parse(gptInterpreteurResponse);
    } catch {
      analyse = { error: "Format JSON invalide" };
    }

    const gptResponse = await chatWithGpt(
      [
        { role: "system", content: systemPrompt },
        ...contexte.messages.slice(-3),
        { role: "user", content: message }
      ],
      contexte
    );

    contexte.messages.push({ role: "assistant", content: gptResponse });

    const firstPromptWord = promptPhase.split(" ")[0]?.toLowerCase();
    const reponseNonConforme = firstPromptWord && !gptResponse.toLowerCase().includes(firstPromptWord);

    return Response.json({
      reponseBot: {
        texte: gptResponse,
        contexte,
        logique: {
          phase: contexte.phase,
          etapes: contexte.etapes,
          infos_detectees: infosDetectees,
          analyse_interpreteur: analyse
        },
        debug: {
          phase: contexte.phase,
          prompt_utilise: promptPhase,
          message_user: message,
          reponse_resume: gptResponse.slice(0, 300),
          infos_detectees: infosDetectees,
          non_conforme: reponseNonConforme
        }
      }
    });
  } catch (error) {
    console.error("Erreur dans /api/chat :", error);
    return new Response(
      JSON.stringify({
        error: error.message,
        stack: error.stack
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}