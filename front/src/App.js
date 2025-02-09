import './App.css';
import Navbar from './Components/Navbar';
import Sidebar from './Components/Sidebar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Engin from './pages/Engin';
import Chauffeur from './pages/Chauffeur';
import ChauffeurUpdate from './pages/ChauffeurUpdate';
import Reservation from './pages/Reservation';
import Footer from './Components/Footer';
import Invoice from './Components/invoice/invoice';
import InvoicePdf from './Components/invoice';

function App() {
  return (
    <div className='wrapper'>
      <Navbar />
      <Sidebar />
      <div className="content-wrapper">

        <div className="content">
          <Router>
            <Routes>
              <Route path="/" element={<Engin />} />
              <Route path="/chauffeur" element={<Chauffeur />} />
              <Route path="/chauffeurUpdate/:id" element={<ChauffeurUpdate />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/reservation/:id" element={<Reservation />} />
              <Route path='/document' element={<Invoice />} />
              <Route path='/invoice' element={<InvoicePdf />} />
            </Routes>
          </Router>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default App;
