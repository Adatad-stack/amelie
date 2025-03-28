export default function Cockpit({ logique }) {
  return (
    <div className="text-sm font-sans">
      <h2 className="text-xl font-bold text-pink-700 mb-4">🚀 Cockpit Amélie</h2>
      {logique.map((entry, i) => (
        <div key={i} className="mb-4 border rounded-xl p-4 bg-gradient-to-r from-pink-50 to-purple-50 shadow-md hover:shadow-lg transition-shadow">
          <div className="mb-2">
            <span className="font-semibold">🧭 Phase :</span>
            <span className="ml-1 text-purple-800 font-medium">{entry.phase || "—"}</span>
          </div>

          <div className="mb-2">
            <span className="font-semibold">📦 Contexte enrichi :</span>
          </div>
          <pre className="bg-white rounded-lg p-2 text-xs whitespace-pre-wrap shadow-inner">
{JSON.stringify(entry.contexte, null, 2)}
          </pre>

          <div className="mt-2 mb-1">
            <span className="font-semibold">✅ Étapes validées :</span>
            <span className="ml-1 text-green-600 font-medium">{entry.etapesValidees?.join(", ") || "—"}</span>
          </div>

          <div className="mb-1">
            <span className="font-semibold">🔄 Étape en cours :</span>
            <span className="ml-1 text-yellow-600 font-medium">{entry.etapeEnCours || "—"}</span>
          </div>

          <div className="mb-1">
            <span className="font-semibold">🎯 Intention détectée :</span>
            <span className="ml-1 text-blue-600 font-medium">{entry.intention || "—"}</span>
          </div>
        </div>
      ))}
    </div>
  );
}