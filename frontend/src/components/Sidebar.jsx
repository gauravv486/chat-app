import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore.js";
import { useAuthStore } from "../store/useAuthStore.js";

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

const Sidebar = ({ theme, toggleTheme }) => {
  const { users, getUsers, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers, authUser, logout } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.fullName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* ── Header ─────────────────────────── */}
      <div className="sb-header">
        <div className="sb-header-left">
          <div className="sb-logo">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
          </div>
          <span className="sb-title">Messages</span>
        </div>
        <button
          onClick={toggleTheme}
          id="theme-toggle"
          className="sb-icon-btn"
          title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
        >
          {theme === 'dark' ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Search ──────────────────────────── */}
      <div className="sb-search-wrap">
        <svg className="sb-search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          type="text"
          id="search-users"
          className="sb-search"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* ── User list ──────────────────────── */}
      <div className="sb-list">
        {isUsersLoading ? (
          <div className="sb-empty">
            <div className="sb-spinner" />
            <p>Loading...</p>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="sb-empty">
            <p>{searchQuery ? 'No users found' : 'No conversations yet'}</p>
          </div>
        ) : (
          filteredUsers.map((user) => {
            const isOnline = onlineUsers.includes(user._id);
            const isActive = selectedUser?._id === user._id;
            return (
              <button
                key={user._id}
                onClick={() => setSelectedUser(user)}
                className={`sb-user ${isActive ? 'active' : ''}`}
              >
                <div className="sb-avatar-wrap">
                  <div className="sb-avatar" style={{ backgroundColor: getAvatarColor(user._id) }}>
                    {user.fullName?.charAt(0).toUpperCase()}
                  </div>
                  {isOnline && <span className="sb-online-dot" />}
                </div>
                <div className="sb-user-info">
                  <p className="sb-user-name">{user.fullName}</p>
                  <p className={`sb-user-status ${isOnline ? 'online' : ''}`}>
                    {isOnline ? "Online" : "Offline"}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* ── Footer (current user) ──────────── */}
      <div className="sb-footer">
        <div className="sb-avatar" style={{ backgroundColor: getAvatarColor(authUser?._id), width: 34, height: 34, fontSize: 13 }}>
          {authUser?.fullName?.charAt(0).toUpperCase()}
        </div>
        <div className="sb-user-info">
          <p className="sb-user-name" style={{ fontSize: 13 }}>{authUser?.fullName}</p>
          <p className="sb-user-status online" style={{ fontSize: 11 }}>● Online</p>
        </div>
        <button onClick={logout} id="logout-btn" className="sb-icon-btn sb-logout-btn" title="Sign out">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        </button>
      </div>

      <style>{`
        /* ── HEADER ─────────────────── */
        .sb-header {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-primary);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
        }
        .sb-header-left {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .sb-logo {
          width: 30px; height: 30px; border-radius: 8px;
          background: linear-gradient(135deg, #0d9488, #14b8a6);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .sb-title {
          font-size: 16px; font-weight: 700;
          color: var(--text-primary); letter-spacing: -0.02em;
        }

        /* ── ICON BUTTONS ───────────── */
        .sb-icon-btn {
          width: 32px; height: 32px; border-radius: 8px;
          border: 1px solid var(--border-primary);
          background: var(--bg-secondary);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer; color: var(--text-secondary);
          transition: all 0.15s ease; flex-shrink: 0;
        }
        .sb-icon-btn:hover {
          background: var(--bg-hover);
          border-color: var(--border-secondary);
        }
        .sb-logout-btn:hover {
          background: color-mix(in srgb, #ef4444 10%, var(--bg-secondary));
          border-color: color-mix(in srgb, #ef4444 25%, var(--border-primary));
          color: #ef4444;
        }

        /* ── SEARCH ─────────────────── */
        .sb-search-wrap {
          padding: 10px 12px;
          border-bottom: 1px solid var(--border-primary);
          position: relative; flex-shrink: 0;
        }
        .sb-search-icon {
          position: absolute; left: 24px; top: 50%;
          transform: translateY(-50%); pointer-events: none;
        }
        .sb-search {
          width: 100%; background: var(--bg-tertiary);
          border: 1px solid transparent; border-radius: 8px;
          padding: 8px 12px 8px 36px; color: var(--text-primary);
          font-size: 13px; outline: none; font-family: inherit;
          transition: border-color 0.15s ease, background-color 0.15s ease;
        }
        .sb-search:focus {
          border-color: var(--border-focus);
          background: var(--bg-input);
        }
        .sb-search::placeholder { color: var(--text-tertiary); }

        /* ── USER LIST ──────────────── */
        .sb-list {
          flex: 1; overflow-y: auto;
          padding: 4px 6px;
        }
        .sb-empty {
          padding: 32px 16px; text-align: center;
          color: var(--text-tertiary); font-size: 13px;
        }
        .sb-spinner {
          width: 22px; height: 22px; margin: 0 auto 10px;
          border: 2.5px solid var(--border-primary);
          border-top-color: var(--text-accent);
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* ── USER ITEM ──────────────── */
        .sb-user {
          width: 100%; display: flex; align-items: center;
          gap: 12px; padding: 10px 12px; border-radius: 10px;
          border: none; background: transparent; cursor: pointer;
          text-align: left; transition: background-color 0.12s ease;
          font-family: inherit;
        }
        .sb-user:hover { background: var(--bg-hover); }
        .sb-user.active { background: var(--bg-active); }

        /* ── AVATAR ─────────────────── */
        .sb-avatar-wrap { position: relative; flex-shrink: 0; }
        .sb-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-size: 15px; font-weight: 600;
          flex-shrink: 0;
        }
        .sb-online-dot {
          position: absolute; bottom: 1px; right: 1px;
          width: 10px; height: 10px; border-radius: 50%;
          background: #22c55e;
          border: 2px solid var(--bg-primary);
        }

        /* ── USER INFO ──────────────── */
        .sb-user-info { flex: 1; min-width: 0; }
        .sb-user-name {
          color: var(--text-primary); font-size: 14px;
          font-weight: 500; white-space: nowrap;
          overflow: hidden; text-overflow: ellipsis;
        }
        .sb-user.active .sb-user-name { font-weight: 600; }
        .sb-user-status {
          color: var(--text-tertiary); font-size: 12px; margin-top: 1px;
        }
        .sb-user-status.online { color: #22c55e; font-weight: 500; }

        /* ── FOOTER ─────────────────── */
        .sb-footer {
          padding: 12px 14px;
          border-top: 1px solid var(--border-primary);
          display: flex; align-items: center; gap: 10px;
          flex-shrink: 0;
          background: var(--bg-primary);
        }
      `}</style>
    </>
  );
};

export default Sidebar;