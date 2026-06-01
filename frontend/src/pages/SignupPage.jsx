import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const SignupPage = () => {
  const { signup } = useAuthStore();
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setIsLoading(true);
    try {
      await signup(formData);
    } catch {
      setError("Signup failed. Try a different email.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      backgroundColor: 'var(--bg-secondary)',
      transition: 'background-color 0.2s ease',
    }}>
      {/* Left illustration panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, var(--bg-sent) 0%, #0f766e 100%)',
        padding: '48px',
        position: 'relative',
        overflow: 'hidden',
      }} className="auth-illustration">
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.08) 0%, transparent 60%)',
        }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 360 }}>
          {/* People illustration */}
          <div style={{ marginBottom: 32 }}>
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" style={{ margin: '0 auto', display: 'block' }}>
              <circle cx="40" cy="40" r="18" fill="rgba(255,255,255,0.2)" />
              <circle cx="80" cy="40" r="18" fill="rgba(255,255,255,0.2)" />
              <circle cx="60" cy="75" r="18" fill="rgba(255,255,255,0.35)" />
              <path d="M40 55 L60 60 L80 55" stroke="rgba(255,255,255,0.3)" strokeWidth="2" fill="none" />
              <path d="M40 55 L60 90" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
              <path d="M80 55 L60 90" stroke="rgba(255,255,255,0.2)" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <h2 style={{
            color: '#ffffff',
            fontSize: 28,
            fontWeight: 700,
            marginBottom: 12,
            letterSpacing: '-0.02em',
          }}>Join the conversation</h2>
          <p style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: 15,
            lineHeight: 1.6,
          }}>Create your account and start messaging with people around you.</p>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '48px 24px',
        backgroundColor: 'var(--bg-primary)',
      }}>
        <div className="animate-fade-in" style={{ width: '100%', maxWidth: 380 }}>
          {/* Logo */}
          <div style={{ marginBottom: 32 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              marginBottom: 8,
            }}>
              <div style={{
                width: 36,
                height: 36,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <span style={{
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--text-primary)',
                letterSpacing: '-0.02em',
              }}>Conversa</span>
            </div>
          </div>

          <h1 style={{
            fontSize: 24,
            fontWeight: 700,
            color: 'var(--text-primary)',
            marginBottom: 4,
            letterSpacing: '-0.01em',
          }}>Create account</h1>
          <p style={{
            color: 'var(--text-tertiary)',
            fontSize: 14,
            marginBottom: 28,
          }}>Start chatting in seconds. It's free!</p>

          {error && (
            <div className="animate-fade-in" style={{
              color: '#ef4444',
              fontSize: 13,
              backgroundColor: 'color-mix(in srgb, #ef4444 8%, var(--bg-secondary))',
              border: '1px solid color-mix(in srgb, #ef4444 20%, var(--border-primary))',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{
                color: 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 500,
              }}>Full Name</label>
              <input
                type="text"
                name="fullName"
                id="signup-fullname"
                placeholder="Your full name"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="focus-ring"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-input)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--border-focus)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-input)'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{
                color: 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 500,
              }}>Email</label>
              <input
                type="email"
                name="email"
                id="signup-email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
                className="focus-ring"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-input)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--border-focus)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-input)'}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={{
                color: 'var(--text-secondary)',
                fontSize: 13,
                fontWeight: 500,
              }}>Password</label>
              <input
                type="password"
                name="password"
                id="signup-password"
                placeholder="Min 6 characters"
                value={formData.password}
                onChange={handleChange}
                required
                className="focus-ring"
                style={{
                  backgroundColor: 'var(--bg-input)',
                  border: '1px solid var(--border-input)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 14px',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  outline: 'none',
                  transition: 'border-color 0.2s ease',
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--border-focus)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--border-input)'}
              />
            </div>

            <button
              type="submit"
              id="signup-submit"
              disabled={isLoading}
              style={{
                marginTop: 4,
                background: 'linear-gradient(135deg, #0d9488, #14b8a6)',
                color: '#ffffff',
                fontWeight: 600,
                borderRadius: 'var(--radius-md)',
                padding: '11px 0',
                fontSize: 14,
                border: 'none',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1,
                transition: 'opacity 0.2s ease, transform 0.1s ease',
              }}
              onMouseDown={(e) => !isLoading && (e.target.style.transform = 'scale(0.98)')}
              onMouseUp={(e) => (e.target.style.transform = 'scale(1)')}
              onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
            >
              {isLoading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p style={{
            color: 'var(--text-tertiary)',
            fontSize: 13,
            textAlign: 'center',
            marginTop: 28,
          }}>
            Already have an account?{" "}
            <Link to="/login" style={{
              color: 'var(--text-accent)',
              textDecoration: 'none',
              fontWeight: 500,
            }}>Sign in</Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-illustration { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default SignupPage;