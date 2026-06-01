import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useAuthStore } from "./store/useAuthStore";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import HomePage from "./pages/HomePage";   // ← new

const Router = () => {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();

  useEffect(() => { checkAuth(); }, []);

  if (isCheckingAuth) {
    return (
      <div
        className="animate-fade-in"
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-primary)',
          transition: 'background-color 0.2s ease',
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 40,
            height: 40,
            border: '3px solid var(--border-primary)',
            borderTopColor: 'var(--text-accent)',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
            margin: '0 auto 16px',
          }} />
          <span style={{
            color: 'var(--text-tertiary)',
            fontSize: 14,
            fontWeight: 500,
          }}>Loading Conversa...</span>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const router = createBrowserRouter([
    { path: "/", element: authUser ? <HomePage /> : <Navigate to="/login" /> },
    { path: "/login", element: !authUser ? <LoginPage /> : <Navigate to="/" /> },
    { path: "/signup", element: !authUser ? <SignupPage /> : <Navigate to="/" /> },
  ]);

  return <RouterProvider router={router} />;
};

export default Router;