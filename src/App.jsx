import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import AboutPage from './pages/AboutPage';
import CountertopCalculator from './pages/CountertopCalculator';
import BitumenPrimeCoatCalculator from './pages/BitumenPrimeCoatCalculator';
import BitumenTackCoatCalculator from './pages/BitumenTackCoatCalculator';
import CODCalculator from './pages/CODCalculator';
import BODCalculator from './pages/BODCalculator';
import AmmonicalNitrogenCalculator from './pages/AmmonicalNitrogenCalculator';
import AggregateWaterAbsorptionCalculator from './pages/AggregateWaterAbsorptionCalculator';
import AggregateCrushingValueCalculator from './pages/AggregateCrushingValueCalculator';
import AggregateAbrasionValueCalculator from './pages/AggregateAbrasionValueCalculator';
import AggregateImpactValueCalculator from './pages/AggregateImpactValueCalculator';
import SieveAnalysisPage from './pages/SieveAnalysisPage';
import BlendingAggregatesPage from './pages/BlendingAggregatesPage';
import BrickMasonryCalculator from './pages/BrickMasonryCalculator';
import PlasterCalculator from './pages/PlasterCalculator';
import CementConcreteCalculator from './pages/CementConcreteCalculator';
import CarpetAreaCalculator from './pages/CarpetAreaCalculator';
import ConstructionCostCalculator from './pages/ConstructionCostCalculator';
import FlooringCalculator from './pages/FlooringCalculator';
import TankVolumeCalculator from './pages/TankVolumeCalculator';
import PrecastBoundaryWallCalculator from './pages/PrecastBoundaryWallCalculator';
import ConcreteBlockCalculator from './pages/ConcreteBlockCalculator';
import ExcavationCalculator from './pages/ExcavationCalculator';
import PaintWorkCalculator from './pages/PaintWorkCalculator';
import SolarRooftopCalculator from './pages/SolarRooftopCalculator';
import ACCalculator from './pages/ACCalculator';
import SolarWaterHeaterCalculator from './pages/SolarWaterHeaterCalculator';
import SteelWeightCalculator from './pages/SteelWeightCalculator';
import TopSoilCalculator from './pages/TopSoilCalculator';
import PlywoodCalculator from './pages/PlywoodCalculator';
import RoundColumnCalculator from './pages/RoundColumnCalculator';
import AntiTermiteCalculator from './pages/AntiTermiteCalculator';
import AsphaltCalculator from './pages/AsphaltCalculator';
import UnitConverter from './pages/UnitConverter';
import SteelQuantityCalculator from './pages/SteelQuantityCalculator';
import RoofPitchCalculator from './pages/RoofPitchCalculator';
import ConcreteTubeCalculator from './pages/ConcreteTubeCalculator';
import WoodFrameCalculator from './pages/WoodFrameCalculator';
import StairCaseCalculator from './pages/StairCaseCalculator';

// Scroll to top on route change
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

function App() {
    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen flex flex-col bg-[#F7F9FF]">
                <Header />
                <div className="flex-1">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/category/:categorySlug" element={<CategoryPage />} />
                        <Route path="/countertop" element={<CountertopCalculator />} />
                        <Route path="/bitumen-prime-coat" element={<BitumenPrimeCoatCalculator />} />
                        <Route path="/bitumen-tack-coat" element={<BitumenTackCoatCalculator />} />
                        <Route path="/cod-calculator" element={<CODCalculator />} />
                        <Route path="/bod-calculator" element={<BODCalculator />} />
                        <Route path="/ammonical-nitrogen" element={<AmmonicalNitrogenCalculator />} />
                        <Route path="/aggregate-water-absorption" element={<AggregateWaterAbsorptionCalculator />} />
                        <Route path="/aggregate-crushing-value" element={<AggregateCrushingValueCalculator />} />
                        <Route path="/aggregate-abrasion-value" element={<AggregateAbrasionValueCalculator />} />
                        <Route path="/aggregate-impact-value" element={<AggregateImpactValueCalculator />} />
                        <Route path="/sieve-analysis" element={<SieveAnalysisPage />} />
                        <Route path="/blending-aggregates" element={<BlendingAggregatesPage />} />
                        <Route path="/brick-masonry" element={<BrickMasonryCalculator />} />
                        <Route path="/plastering" element={<PlasterCalculator />} />
                        <Route path="/cement-concrete" element={<CementConcreteCalculator />} />
                        <Route path="/carpet-area" element={<CarpetAreaCalculator />} />
                        <Route path="/construction-cost" element={<ConstructionCostCalculator />} />
                        <Route path="/flooring" element={<FlooringCalculator />} />
                        <Route path="/tank-volume" element={<TankVolumeCalculator />} />
                        <Route path="/precast-boundary-wall" element={<PrecastBoundaryWallCalculator />} />
                        <Route path="/concrete-block" element={<ConcreteBlockCalculator />} />
                        <Route path="/excavation" element={<ExcavationCalculator />} />
                        <Route path="/paint-work" element={<PaintWorkCalculator />} />
                        <Route path="/solar-rooftop" element={<SolarRooftopCalculator />} />
                        <Route path="/ac-calculator" element={<ACCalculator />} />
                        <Route path="/solar-water-heater" element={<SolarWaterHeaterCalculator />} />
                        <Route path="/steel-weight" element={<SteelWeightCalculator />} />
                        <Route path="/top-soil" element={<TopSoilCalculator />} />
                        <Route path="/plywood" element={<PlywoodCalculator />} />
                        <Route path="/round-column" element={<RoundColumnCalculator />} />
                        <Route path="/anti-termite" element={<AntiTermiteCalculator />} />
                        <Route path="/asphalt" element={<AsphaltCalculator />} />
                        <Route path="/unit-converter" element={<UnitConverter />} />
                        <Route path="/steel-quantity" element={<SteelQuantityCalculator />} />
                        <Route path="/roof-pitch" element={<RoofPitchCalculator />} />
                        <Route path="/concrete-tube" element={<ConcreteTubeCalculator />} />
                        <Route path="/wood-frame" element={<WoodFrameCalculator />} />
                        <Route path="/stair-case" element={<StairCaseCalculator />} />
                    </Routes>
                </div>
                <Footer />
            </div>
        </Router>
    );
}

export default App;
