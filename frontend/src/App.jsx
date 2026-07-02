import { useEffect } from "react";
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import Portfolio from "./pages/Portfolio.jsx";
import About from "./pages/About.jsx";
import Projects from "./pages/Projects.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";

// On page-to-page navigation, start the new page at the top. Skips when a hash
// is present so in-page anchors (#contact, #projects, …) still scroll normally.
function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

// Redirects already-authenticated users away from the login page.
function GuestRoute({ children }) {
  const { admin, ready } = useAuth();
  if (!ready) return null;
  if (admin) return <Navigate to="/admin" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Portfolio />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
