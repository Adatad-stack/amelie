// ✅ Patch visuel : suppression du liseré gris

"use client";

import { useState, useEffect, useRef } from "react";
import IntroMessage from "./IntroMessage";
import Cockpit from "./Cockpit";

export default function AmelieChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [contexte, setContexte] = useState({});
  const [isTyping, setIsTyping] = useState(false);
  const [logiqueDebug, setLogiqueDebug] = useState([]);
  const [showIntro, setShowIntro] = useState(true);
  const endRef = useRef(null);
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (messages.length > 0) setShowIntro(false);
    setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages, isTyping]);

  useEffect(() => {
    if (!isTyping) return;
    const lastMessage = messages[messages.length - 1];
    if (lastMessage?.role === "assistant") {
      let i = 0;
      setDisplayedText("");
      const interval = setInterval(() => {
        setDisplayedText((prev) => prev + lastMessage.content[i]);
        i++;
        if (i >= lastMessage.content.length) clearInterval(interval);
      }, 15);
      return () => clearInterval(interval);
    }
  }, [isTyping, messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setDisplayedText("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, contexte })
      });

      const data = await response.json();
      console.log("📦 Réponse brute du backend :", data);
      const bot = data.reponseBot;

      if (!bot) {
        throw new Error("La réponse ne contient pas de reponseBot.");
      }

      setContexte((prev) => ({ ...prev, ...bot.contexte }));
      setLogiqueDebug((prev) => [...prev, bot.logique]);

      const botContent = bot.texte;
      setMessages((prev) => [...prev, { role: "assistant", content: botContent }]);
    } catch (err) {
      console.error("Erreur front :", err);

      const msg = err?.message || err?.toString() || "Erreur inconnue";
      const trace = err?.stack || JSON.stringify(err, null, 2);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `<strong>Erreur côté frontend :</strong><br>${msg}<br><pre>${trace}</pre>`
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-screen relative">
      <div className="flex flex-col flex-1 bg-white z-10">
        <header className="p-4 border-b border-gray-100">
          <img src="/logo.png" alt="Logo AdataD" className="h-12 mx-auto" />
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-4 pb-32 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`message ${m.role}`}>
              {m.role === "assistant" ? (
                <div className="flex items-start gap-2">
                  <img
                    src="/amelie-avatar.png"
                    alt="Amélie"
                    className="w-8 h-8 rounded-full mt-1"
                  />
                  <div
                    className="message-content bg-gray-100 px-4 py-2 rounded-xl"
                    dangerouslySetInnerHTML={{
                      __html: i === messages.length - 1 && isTyping ? displayedText : m.content
                    }}
                  />
                </div>
              ) : (
                <div className="message-content">{m.content}</div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="message assistant">
              <div className="message-content italic text-gray-500">
                Amélie est en train de réfléchir...
              </div>
            </div>
          )}

          <div ref={endRef} />
        </main>

        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white p-4">
          {showIntro && (
            <div className="w-full text-base text-gray-900 mb-2">
              <IntroMessage visible={true} />
            </div>
          )}
          <div className="input-area flex gap-2">
            <textarea
              rows="1"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Posez votre question..."
              className="flex-1 input-textarea resize-none overflow-hidden"
            ></textarea>

            <button
              onClick={handleSend}
              aria-label={isTyping ? "Arrêter" : "Envoyer"}
              className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center"
            >
              {isTyping ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="6" y="6" width="12" height="12" rx="2" ry="2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M4.5 4.5l15 7.5-15 7.5V4.5z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          </div>
        </footer>
      </div>

      <aside className="absolute top-0 right-0 w-[400px] h-full overflow-y-auto bg-gray-50 border-l shadow-lg p-4 z-20">
        <Cockpit logique={logiqueDebug} />
      </aside>
    </div>
  );
}
