// /app/page.jsx
"use client";
import { useState, useEffect, useRef } from "react";

export default function Page() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [etape, setEtape] = useState(2);
  const [contexte, setContexte] = useState({ type_utilisateur: "proche" });
  const endRef = useRef(null);
  const inputRef = useRef(null);

  const handleSend = async () => {
    const message = inputRef.current?.value.trim();
    if (!message) return;

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    inputRef.current.value = "";
    inputRef.current.style.height = "auto";

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, contexte, etape }),
      });
      const data = await res.json();

      const botMessage = { role: "assistant", content: data.reponse_finale };
      setMessages((prev) => [...prev, botMessage]);
      setEtape(data.etape);
      setContexte((prev) => ({ ...prev, ...data.contexte_enrichi }));
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Erreur serveur. Veuillez réessayer." },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleInput = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <header>
        <img src="/logo.png" alt="Logo AdataD" className="h-12 mx-auto" />
      </header>

      <main>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.role === "assistant" && (
              <img src="/amelie.png" alt="Amelie" className="avatar" />
            )}
            <div className="message-content">{msg.content}</div>
          </div>
        ))}
        {isTyping && (
          <div className="message assistant">
            <img src="/amelie.png" alt="Amelie" className="avatar" />
            <div className="message-content italic text-gray-500">
              Amelie est en train d’écrire...
            </div>
          </div>
        )}
        <div ref={endRef} />
      </main>

      <footer>
        <div className="input-area">
          <textarea
            ref={inputRef}
            rows="1"
            className="input-textarea"
            placeholder="Posez votre question..."
            onInput={handleInput}
            onKeyDown={handleKeyDown}
          ></textarea>

          <button onClick={handleSend} aria-label="Envoyer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 19V5m0 0L5 12m7-7l7 7"
              />
            </svg>
          </button>
        </div>
      </footer>
    </div>
  );
}