import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import PercentageCalculator from './pages/PercentageCalculator';
import BMICalculator from './pages/BMICalculator';
import AgeCalculator from './pages/AgeCalculator';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#F7F9FF]">
        <Header />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/category/:categorySlug" element={<CategoryPage />} />
            <Route path="/percentage" element={<PercentageCalculator />} />
            <Route path="/bmi" element={<BMICalculator />} />
            <Route path="/age" element={<AgeCalculator />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
