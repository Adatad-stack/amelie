// /components/AmelieChat.jsx
import { useState } from "react";

export default function AmelieChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [etape, setEtape] = useState(2);
  const [contexte, setContexte] = useState({ type_utilisateur: "proche" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input, contexte, etape }),
    });

    const data = await res.json();
    setIsLoading(false);

    setEtape(data.etape);
    setContexte((prev) => ({ ...prev, ...data.contexte_enrichi }));
    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.reponse_finale },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-auto p-4 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-xl px-4 py-2 rounded-2xl shadow-sm whitespace-pre-wrap ${
              m.role === "user"
                ? "bg-gray-200 self-end"
                : "bg-white self-start border"
            }`}
          >
            {m.content}
          </div>
        ))}
        {isLoading && (
          <div className="bg-white border px-4 py-2 rounded-2xl w-fit">
            Amélie est en train d’écrire...
          </div>
        )}
      </div>
      <div className="p-4 border-t flex items-center">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Posez votre question..."
          className="flex-1 border rounded-2xl px-4 py-2 mr-2"
        />
        <button
          onClick={handleSend}
          className="bg-black text-white px-4 py-2 rounded-2xl"
        >
          ➤
        </button>
      </div>
    </div>
  );
}