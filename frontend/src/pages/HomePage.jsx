import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";
import { useChatStore } from "../store/useChatStore";

const HomePage = () => {
  const { selectedUser } = useChatStore();
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('conversa-theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('conversa-theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <>
      <div className="chat-layout">
        {/* Sidebar — on mobile, hide when a user is selected (WhatsApp style) */}
        <div className={`chat-sidebar ${selectedUser ? 'has-selection' : ''}`}>
          <Sidebar theme={theme} toggleTheme={toggleTheme} />
        </div>

        {/* Main chat area — on mobile, hide when no user selected */}
        <div className={`chat-main ${selectedUser ? 'has-selection' : ''}`}>
          {selectedUser
            ? <ChatWindow />
            : <NoChatSelected />
          }
        </div>
      </div>

      <style>{`
        .chat-layout {
          height: 100vh;
          height: 100dvh;
          display: flex;
          overflow: hidden;
          background-color: var(--bg-secondary);
        }

        /* ── SIDEBAR ────────────────────────────── */
        .chat-sidebar {
          width: 340px;
          min-width: 340px;
          max-width: 340px;
          height: 100%;
          border-right: 1px solid var(--border-primary);
          background-color: var(--bg-primary);
          display: flex;
          flex-direction: column;
          overflow: hidden;
          transition: background-color 0.2s ease, border-color 0.2s ease;
        }

        /* ── MAIN CHAT ──────────────────────────── */
        .chat-main {
          flex: 1;
          min-width: 0;
          height: 100%;
          display: flex;
          flex-direction: column;
          background-color: var(--bg-chat);
          transition: background-color 0.2s ease;
        }

        /* ── MOBILE: WhatsApp-style toggle ───────── */
        @media (max-width: 768px) {
          .chat-sidebar {
            width: 100%;
            min-width: 100%;
            max-width: 100%;
            border-right: none;
          }

          /* When a user is selected, hide sidebar and show chat */
          .chat-sidebar.has-selection {
            display: none;
          }

          .chat-main {
            display: none;
          }

          .chat-main.has-selection {
            display: flex;
          }
        }
      `}</style>
    </>
  );
};

const NoChatSelected = () => (
  <div className="animate-fade-in" style={{
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  }}>
    <div style={{ marginBottom: 24 }}>
      <svg width="140" height="140" viewBox="0 0 160 160" fill="none">
        <circle cx="80" cy="80" r="60" fill="var(--bg-tertiary)" />
        <rect x="45" y="50" width="50" height="35" rx="10" fill="var(--text-accent)" opacity="0.2" />
        <rect x="65" y="70" width="50" height="35" rx="10" fill="var(--text-accent)" opacity="0.35" />
        <circle cx="62" cy="67" r="2.5" fill="var(--text-accent)" opacity="0.5" />
        <circle cx="70" cy="67" r="2.5" fill="var(--text-accent)" opacity="0.5" />
        <circle cx="78" cy="67" r="2.5" fill="var(--text-accent)" opacity="0.5" />
      </svg>
    </div>
    <h2 style={{
      fontSize: 18,
      fontWeight: 600,
      color: 'var(--text-primary)',
      marginBottom: 8,
    }}>Select a conversation</h2>
    <p style={{
      color: 'var(--text-tertiary)',
      fontSize: 14,
      textAlign: 'center',
      maxWidth: 260,
      lineHeight: 1.5,
    }}>
      Choose someone from the sidebar to start chatting.
    </p>
  </div>
);

export default HomePage;