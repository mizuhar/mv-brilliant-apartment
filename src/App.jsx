import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Gallery from './components/Gallery';
import Amenities from './components/Amenities';
import Location from './components/Location';
import Calendar from './components/Calendar';
import Booking from './components/Booking';
import AdminPricing from './components/AdminPricing';
import Footer from './components/Footer';

function App() {
  const [isAdmin, setIsAdmin] = useState(window.location.hash === '#admin');

  useEffect(() => {
    const handleHashChange = () => setIsAdmin(window.location.hash === '#admin');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  if (isAdmin) {
    return (
      <div className="app" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <a href="#" style={{ display: 'inline-block', marginBottom: '1rem', color: '#2563eb' }}>
          ← Обратно към сайта
        </a>
        <AdminPricing />
      </div>
    );
  }

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