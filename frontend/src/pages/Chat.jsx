import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Sparkles, Trash2, HeartPulse } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

const SUGGESTIONS = [
  "What could cause a mild headache and fatigue?",
  "Explain what my blood pressure reading means",
  "Tips to improve my sleep quality",
  "What should I ask my cardiologist next visit?",
];

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!user) {
      setLoadingHistory(false);
      return;
    }
    api
      .get("/chat/history")
      .then((res) => setMessages(res.data.messages || []))
      .catch(() => setError("Couldn't load your chat history."))
      .finally(() => setLoadingHistory(false));
  }, [user]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  const send = async (text) => {
    const content = (text ?? input).trim();
    if (!content || sending) return;

    setError("");
    setInput("");
    // Optimistically show the user's message right away.
    const tempUser = { _id: `temp-${Date.now()}`, role: "user", content };
    setMessages((prev) => [...prev, tempUser]);
    setSending(true);

    try {
      const { data } = await api.post("/chat", { message: content });
      setMessages((prev) => [
        ...prev.filter((m) => m._id !== tempUser._id),
        data.userMessage,
        data.assistantMessage,
      ]);
    } catch (err) {
      setError(err.response?.data?.message || "Message failed to send. Please try again.");
      setMessages((prev) => prev.filter((m) => m._id !== tempUser._id));
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  const clearChat = async () => {
    try {
      await api.delete("/chat/history");
      setMessages([]);
    } catch {
      setError("Couldn't clear chat history.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />

        <main className="px-6 md:px-10 pb-6 flex-1 flex flex-col gap-4 min-h-0">
          {!user && (
            <div className="glass rounded-card p-4 text-sm flex items-center justify-between gap-4 flex-wrap">
              <span className="opacity-80">
                Log in to chat with the VedaCare AI Assistant and save your conversation history.
              </span>
              <a
                href="/login"
                className="bg-teal hover:bg-teal-dark text-white text-sm font-medium px-4 py-2 rounded-2xl transition-colors shrink-0"
              >
                Log in
              </a>
            </div>
          )}

          <div className="glass rounded-card flex-1 flex flex-col min-h-[60vh] overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-ink/5 dark:border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal text-white flex items-center justify-center">
                  <Sparkles size={18} />
                </div>
                <div>
                  <h2 className="font-display text-lg font-semibold">AI Assistant</h2>
                  <p className="text-xs opacity-60">
                    General health guidance — not a substitute for professional medical advice.
                  </p>
                </div>
              </div>
              {messages.length > 0 && (
                <button
                  onClick={clearChat}
                  aria-label="Clear conversation"
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-coral/10 text-coral-dark transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
              {loadingHistory ? (
                <p className="text-sm opacity-60">Loading conversation…</p>
              ) : messages.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 py-10">
                  <div className="w-14 h-14 rounded-2xl bg-teal/10 text-teal flex items-center justify-center">
                    <HeartPulse size={24} />
                  </div>
                  <div>
                    <p className="font-display text-lg font-semibold">How can I help today?</p>
                    <p className="text-sm opacity-60 mt-1">
                      Ask about symptoms, medicines, or general wellness.
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 justify-center max-w-md">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        disabled={!user}
                        className="text-xs px-3 py-2 rounded-2xl border border-ink/10 dark:border-white/10 hover:bg-teal/10 hover:border-teal/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <AnimatePresence initial={false}>
                  {messages.map((m) => (
                    <motion.div
                      key={m._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] md:max-w-[65%] rounded-2xl px-4 py-3 text-sm whitespace-pre-wrap leading-relaxed ${
                          m.role === "user"
                            ? "bg-teal text-white rounded-br-sm"
                            : "bg-white/70 dark:bg-dusk-700/70 rounded-bl-sm"
                        }`}
                      >
                        {m.content}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}

              {sending && (
                <div className="flex justify-start">
                  <div className="bg-white/70 dark:bg-dusk-700/70 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1 items-center">
                    <span className="w-2 h-2 rounded-full bg-teal/60 animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 rounded-full bg-teal/60 animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 rounded-full bg-teal/60 animate-bounce" />
                  </div>
                </div>
              )}

              {error && <p className="text-xs text-coral-dark">{error}</p>}
              <div ref={bottomRef} />
            </div>

            <div className="border-t border-ink/5 dark:border-white/5 p-4 flex items-end gap-3">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={!user || sending}
                rows={1}
                placeholder={user ? "Type your message…" : "Log in to start chatting…"}
                className="flex-1 resize-none rounded-2xl bg-white/70 dark:bg-dusk-700/70 border border-ink/10 dark:border-white/10 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/40 disabled:opacity-50"
              />
              <button
                onClick={() => send()}
                disabled={!user || sending || !input.trim()}
                aria-label="Send message"
                className="w-11 h-11 shrink-0 rounded-2xl bg-teal hover:bg-teal-dark text-white flex items-center justify-center transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
