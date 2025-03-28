export default function Cockpit({ logique }) {
  return (
    <div className="text-sm font-sans">
      <h2 className="text-xl font-bold text-pink-700 mb-4">🚀 Cockpit Amélie</h2>
      {logique.map((entry, i) => (
        <div
          key={i}
          className="mb-4 border rounded-xl p-4 bg-gradient-to-r from-pink-50 to-purple-50 shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="mb-2">
            <span className="font-semibold">🧭 Phase :</span>
            <span className="ml-1 text-purple-800 font-medium">
              {entry.phase || "—"}
            </span>
          </div>

          <div className="mb-2">
            <span className="font-semibold">📦 Contexte enrichi :</span>
          </div>
          <pre className="bg-white rounded-lg p-2 text-xs whitespace-pre-wrap shadow-inner">
            {JSON.stringify(entry.contexte, null, 2)}
          </pre>

          <div className="mt-2 mb-1">
            <span className="font-semibold">✅ Étapes validées :</span>
            <span className="ml-1 text-green-600 font-medium">
              {entry.etapesValidees?.join(", ") || "—"}
            </span>
          </div>

          <div className="mb-1">
            <span className="font-semibold">🔄 Étape en cours :</span>
            <span className="ml-1 text-yellow-600 font-medium">
              {entry.etapeEnCours || "—"}
            </span>
          </div>

          <div className="mb-1">
            <span className="font-semibold">🎯 Intention détectée :</span>
            <span className="ml-1 text-blue-600 font-medium">
              {entry.intention || "—"}
            </span>
          </div>

          {entry.debug && (
            <div className="mt-3 pt-3 border-t border-purple-200">
              <div className="mb-1">
                <span className="font-semibold">🧪 Message utilisateur :</span>
                <span className="ml-1 text-gray-700">{entry.debug.message_user}</span>
              </div>
              <div className="mb-1">
                <span className="font-semibold">📤 Prompt utilisé :</span>
                <pre className="text-xs bg-white rounded p-2 whitespace-pre-wrap">
                  {entry.debug.prompt_utilise}
                </pre>
              </div>
              <div className="mb-1">
                <span className="font-semibold">🧠 Réponse GPT :</span>
                <pre className="text-xs bg-white rounded p-2 whitespace-pre-wrap">
                  {entry.debug.reponse_resume}
                </pre>
              </div>
              <div className="mb-1">
                <span className="font-semibold">🔎 Infos détectées :</span>
                {Object.keys(entry.debug.infos_detectees || {}).length > 0 ? (
                  <ul className="list-disc list-inside">
                    {Object.entries(entry.debug.infos_detectees).map(([k, v]) => (
                      <li key={k}>
                        <strong>{k}</strong> : {v}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="italic text-gray-500">Aucune</div>
                )}
              </div>
              {entry.debug.non_conforme && (
                <div className="mt-2 text-red-600 font-bold">⚠️ Réponse non conforme au prompt</div>
              )}
            </div>
          )}

          {entry.analyse_interpreteur && (
            <div className="mt-4 pt-3 border-t border-gray-300">
              <h3 className="font-semibold text-purple-700 mb-2">🧠 Analyse Interpréteur GPT</h3>
              <pre className="text-xs bg-white rounded p-2 whitespace-pre-wrap">
                {JSON.stringify(entry.analyse_interpreteur, null, 2)}
              </pre>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
