import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Gallery from './components/Gallery';
import Amenities from './components/Amenities';

function App() {
  return (
      <div className="app">
        <Navbar />
        <Hero />
        <About />
        <Gallery />
        <Amenities />
      </div>
  );
}

export default App;