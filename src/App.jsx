import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Gallery from './components/Gallery';
import Amenities from './components/Amenities';
import Location from './components/Location';
import  Calendar from './components/Calendar'; // <- Добавяме го тук
import Booking from './components/Booking';
import Footer from './components/Footer';

function App() {
  return (
    <div className="app">
      <Navbar />
      <Hero />
      <About />
      <Gallery />
      <Amenities />
      <Location />
      < Calendar /> {/* <- Слагаме го тук */}
      <Booking />
      <Footer />
    </div>
  );
}

export default App;