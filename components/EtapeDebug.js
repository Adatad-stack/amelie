export default function EtapeDebug({ etape, sousEtape, intention, contexte, regles }) {
  return (
    <div style={{
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '1rem',
      backgroundColor: '#f9f9f9',
      fontFamily: 'sans-serif',
      marginTop: '2rem'
    }}>
      <h2 style={{ fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '1rem' }}>🧠 Debug IA – Contexte</h2>
      <p><strong>Étape :</strong> {etape}</p>
      <p><strong>Sous-étape :</strong> {sousEtape}</p>
      <p><strong>Intention :</strong> {intention}</p>
      <p><strong>Contexte :</strong></p>
      <pre style={{
        background: '#eee',
        padding: '0.5rem',
        borderRadius: '5px'
      }}>
        {JSON.stringify(contexte, null, 2)}
      </pre>
      <p><strong>Règles appliquées :</strong></p>
      <ul>
        {regles.map((regle, index) => (
          <li key={index}>– {regle}</li>
        ))}
      </ul>
    </div>
  );
}
