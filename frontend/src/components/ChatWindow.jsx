import { useEffect, useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";

const getAvatarColor = (id) => {
  const colors = [
    'var(--avatar-1)', 'var(--avatar-2)', 'var(--avatar-3)',
    'var(--avatar-4)', 'var(--avatar-5)', 'var(--avatar-6)',
  ];
  let hash = 0;
  for (let i = 0; i < (id || '').length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const formatTime = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

const formatDateSeparator = (dateStr) => {
  const date = new Date(dateStr);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return 'Today';
  if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

const shouldShowDateSeparator = (messages, index) => {
  if (index === 0) return true;
  const prev = new Date(messages[index - 1].createdAt).toDateString();
  const curr = new Date(messages[index].createdAt).toDateString();
  return prev !== curr;
};

const ChatWindow = () => {
    const { messages, getMessages, sendMessage,
        subscribeToMessages, unsubscribeFromMessages,
        selectedUser, setSelectedUser } = useChatStore();
    const { authUser, onlineUsers } = useAuthStore();
    const [text, setText] = useState("");
    const bottomRef = useRef(null);
    const isOnline = onlineUsers.includes(selectedUser._id);

    useEffect(() => {
        getMessages(selectedUser._id);
        subscribeToMessages();
        return () => unsubscribeFromMessages();
    }, [selectedUser._id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSend = async (e) => {
        e.preventDefault();
        if (!text.trim()) return;
        await sendMessage(text.trim());
        setText("");
    };

    const handleBack = () => {
        setSelectedUser(null);
    };

    return (
        <>
            <div className="cw-container">
                {/* ── Header ──────────────── */}
                <div className="cw-header">
                    <button onClick={handleBack} className="cw-back-btn" aria-label="Back">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="15 18 9 12 15 6" />
                        </svg>
                    </button>

                    <div className="cw-avatar-wrap">
                        <div className="cw-avatar" style={{ backgroundColor: getAvatarColor(selectedUser._id) }}>
                            {selectedUser.fullName?.charAt(0).toUpperCase()}
                        </div>
                        {isOnline && <span className="cw-online-dot" />}
                    </div>

                    <div className="cw-header-info">
                        <p className="cw-header-name">{selectedUser.fullName}</p>
                        <p className={`cw-header-status ${isOnline ? 'online' : ''}`}>
                            {isOnline ? 'Active now' : 'Offline'}
                        </p>
                    </div>
                </div>

                {/* ── Messages ─────────────── */}
                <div className="cw-messages">
                    {messages.length === 0 ? (
                        <div className="cw-empty animate-fade-in">
                            <div className="cw-empty-icon">
                                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                                </svg>
                            </div>
                            <p>No messages yet. Say hi! 👋</p>
                        </div>
                    ) : (
                        messages.map((msg, i) => (
                            <div key={msg._id}>
                                {shouldShowDateSeparator(messages, i) && (
                                    <div className="cw-date-sep">
                                        <div className="cw-date-line" />
                                        <span className="cw-date-label">
                                            {formatDateSeparator(msg.createdAt)}
                                        </span>
                                        <div className="cw-date-line" />
                                    </div>
                                )}
                                <MessageBubble
                                    msg={msg}
                                    isMine={msg.senderId === authUser._id}
                                    selectedUser={selectedUser}
                                />
                            </div>
                        ))
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* ── Input ────────────────── */}
                <form onSubmit={handleSend} className="cw-input-bar">
                    <input
                        type="text"
                        id="message-input"
                        className="cw-input"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder="Type a message..."
                        autoComplete="off"
                    />
                    <button
                        type="submit"
                        id="send-btn"
                        disabled={!text.trim()}
                        className={`cw-send-btn ${text.trim() ? 'active' : ''}`}
                    >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="22" y1="2" x2="11" y2="13" />
                            <polygon points="22 2 15 22 11 13 2 9 22 2" />
                        </svg>
                    </button>
                </form>
            </div>

            <style>{`
                .cw-container {
                    display: flex; flex-direction: column;
                    height: 100%; min-height: 0;
                }

                /* ── HEADER ──────────── */
                .cw-header {
                    padding: 12px 16px;
                    border-bottom: 1px solid var(--border-primary);
                    display: flex; align-items: center; gap: 12px;
                    background: var(--bg-primary); flex-shrink: 0;
                }
                .cw-back-btn {
                    display: none; width: 32px; height: 32px;
                    border-radius: 8px; border: 1px solid var(--border-primary);
                    background: transparent; cursor: pointer;
                    align-items: center; justify-content: center;
                    color: var(--text-secondary); flex-shrink: 0;
                    transition: all 0.15s ease;
                }
                .cw-back-btn:hover { background: var(--bg-hover); }

                @media (max-width: 768px) {
                    .cw-back-btn { display: flex; }
                }

                .cw-avatar-wrap { position: relative; flex-shrink: 0; }
                .cw-avatar {
                    width: 36px; height: 36px; border-radius: 50%;
                    display: flex; align-items: center; justify-content: center;
                    color: #fff; font-size: 14px; font-weight: 600;
                }
                .cw-online-dot {
                    position: absolute; bottom: 0; right: 0;
                    width: 10px; height: 10px; border-radius: 50%;
                    background: #22c55e;
                    border: 2px solid var(--bg-primary);
                }
                .cw-header-info { flex: 1; min-width: 0; }
                .cw-header-name {
                    color: var(--text-primary); font-size: 15px;
                    font-weight: 600; white-space: nowrap;
                    overflow: hidden; text-overflow: ellipsis;
                }
                .cw-header-status {
                    color: var(--text-tertiary); font-size: 12px; margin-top: 1px;
                }
                .cw-header-status.online { color: #22c55e; font-weight: 500; }

                /* ── MESSAGES ─────────── */
                .cw-messages {
                    flex: 1; overflow-y: auto;
                    padding: 12px 16px;
                    display: flex; flex-direction: column; gap: 2px;
                    min-height: 0;
                }
                .cw-empty {
                    flex: 1; display: flex; flex-direction: column;
                    align-items: center; justify-content: center; gap: 12px;
                    color: var(--text-tertiary); font-size: 14px;
                }
                .cw-empty-icon {
                    width: 56px; height: 56px; border-radius: 50%;
                    background: var(--bg-tertiary);
                    display: flex; align-items: center; justify-content: center;
                }

                /* Date separator */
                .cw-date-sep {
                    display: flex; align-items: center; gap: 12px;
                    margin: 14px 0 10px; padding: 0 8px;
                }
                .cw-date-line { flex: 1; height: 1px; background: var(--border-primary); }
                .cw-date-label {
                    color: var(--text-tertiary); font-size: 11px; font-weight: 500;
                    white-space: nowrap; padding: 3px 10px;
                    background: var(--bg-tertiary); border-radius: 99px;
                }

                /* ── INPUT BAR ─────────── */
                .cw-input-bar {
                    padding: 12px 16px;
                    border-top: 1px solid var(--border-primary);
                    display: flex; align-items: center; gap: 10px;
                    background: var(--bg-primary); flex-shrink: 0;
                }
                .cw-input {
                    flex: 1; min-width: 0;
                    background: var(--bg-tertiary);
                    border: 1px solid transparent;
                    border-radius: 99px; padding: 10px 16px;
                    color: var(--text-primary); font-size: 14px;
                    outline: none; font-family: inherit;
                    transition: border-color 0.15s ease, background-color 0.15s ease;
                }
                .cw-input:focus {
                    border-color: var(--border-focus);
                    background: var(--bg-input);
                }
                .cw-input::placeholder { color: var(--text-tertiary); }

                .cw-send-btn {
                    width: 38px; height: 38px; border-radius: 50%;
                    border: none; background: var(--bg-tertiary);
                    display: flex; align-items: center; justify-content: center;
                    cursor: default; color: var(--text-tertiary);
                    transition: all 0.15s ease; flex-shrink: 0;
                }
                .cw-send-btn.active {
                    background: linear-gradient(135deg, #0d9488, #14b8a6);
                    color: #fff; cursor: pointer;
                }
                .cw-send-btn.active:hover { opacity: 0.9; }
            `}</style>
        </>
    );
};

const MessageBubble = ({ msg, isMine, selectedUser }) => (
    <div className={`msg-row ${isMine ? 'mine' : 'theirs'}`}>
        {!isMine && (
            <div className="msg-avatar" style={{ backgroundColor: getAvatarColor(selectedUser._id) }}>
                {selectedUser.fullName?.charAt(0).toUpperCase()}
            </div>
        )}
        <div className="msg-content">
            <div className={`msg-bubble ${isMine ? 'mine' : 'theirs'}`}>
                {msg.message}
            </div>
            <span className={`msg-time ${isMine ? 'mine' : 'theirs'}`}>
                {formatTime(msg.createdAt)}
            </span>
        </div>

        <style>{`
            .msg-row {
                display: flex; align-items: flex-end;
                gap: 8px; margin-bottom: 3px; padding: 1px 0;
            }
            .msg-row.mine { justify-content: flex-end; }
            .msg-row.theirs { justify-content: flex-start; }

            .msg-avatar {
                width: 26px; height: 26px; border-radius: 50%;
                display: flex; align-items: center; justify-content: center;
                color: #fff; font-size: 11px; font-weight: 600;
                flex-shrink: 0;
            }
            .msg-content { max-width: 70%; min-width: 60px; }

            .msg-bubble {
                padding: 9px 13px; font-size: 14px; line-height: 1.45;
                word-break: break-word;
            }
            .msg-bubble.mine {
                background: var(--bg-sent); color: var(--text-sent);
                border-radius: 16px 16px 4px 16px;
            }
            .msg-bubble.theirs {
                background: var(--bg-received); color: var(--text-received);
                border-radius: 16px 16px 16px 4px;
                border: 1px solid var(--border-primary);
            }

            .msg-time {
                display: block; font-size: 10px;
                color: var(--text-tertiary); margin-top: 3px;
            }
            .msg-time.mine { text-align: right; padding-right: 4px; }
            .msg-time.theirs { text-align: left; padding-left: 4px; }

            @media (max-width: 768px) {
                .msg-content { max-width: 80%; }
            }
        `}</style>
    </div>
);

export default ChatWindow;