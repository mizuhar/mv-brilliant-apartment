import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase"; // Провери дали пътят до твоя firebase.js е правилен

import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Gallery from "./components/Gallery";
import Amenities from "./components/Amenities";
import Location from "./components/Location";
import Calendar from "./components/Calendar";
import Booking from "./components/Booking";
import AdminPricing from "./components/AdminPricing";
import AdminCalendar from "./components/AdminCalendar";
import AdminLogin from "./components/AdminLogin";
import Footer from "./components/Footer";

function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === "#admin");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Следим за промяна в хеша (#admin)
  useEffect(() => {
    const handleHashChange = () =>
      setIsAdmin(window.location.hash === "#admin");
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  // Следим дали има логнат Firebase потребител
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
  };

  // Админ изглед
  if (isAdmin) {
    if (loading) {
      return (
        <div
          style={{
            textAlign: "center",
            padding: "3rem",
            fontFamily: "sans-serif",
          }}
        >
          Зареждане на админ панела...
        </div>
      );
    }

    // Ако потребителят не е логнат, показваме логин формата
    if (!user) {
      return (
        <div
          className="app"
          style={{ padding: "2rem", maxWidth: "450px", margin: "0 auto" }}
        >
          <a
            href="#"
            style={{
              display: "inline-block",
              marginBottom: "1.5rem",
              color: "#2563eb",
              textDecoration: "none",
              fontFamily: "system-ui, -apple-system, sans-serif",
              fontWeight: "500",
              fontSize: "0.95rem",
            }}
          >
            ← Обратно към сайта
          </a>
          <AdminLogin />
        </div>
      );
    }

    // Ако е логнат, показваме админ панела с Header и бутон за Изход
    return (
      <div
        className="app"
        style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto" }}
      >
        <div
          style={{
            display: "flex",
            justify: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            paddingBottom: "1rem",
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          <a
            href="#"
            style={{
              color: "#2563eb",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            ← Обратно към сайта
          </a>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span style={{ fontSize: "0.9rem", color: "#64748b" }}>
              Профил: <strong>{user.email}</strong>
            </span>
            <button
              onClick={handleLogout}
              style={{
                background: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "0.5rem 1rem",
                borderRadius: "6px",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              Изход
            </button>
          </div>
        </div>

        <AdminPricing />
        <AdminCalendar/>
      </div>
    );
  }

  // Публичен изглед на сайта
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <About />
      <Gallery />
      <Amenities />
      <Location />
      <Calendar />
      <Booking />
      <Footer />
    </div>
  );
}

export default App;
