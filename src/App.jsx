import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './components/auth/AuthContext';
import { RecordCalculatorVisit } from './hooks/useActivityMemory';
import { SettingsProvider, useSettings } from './contexts/SettingsContext';
import { useAuth } from './components/auth/AuthContext';
import { GuestRoute, ProtectedRoute } from './components/auth/ProtectedRoute';
import ErrorBoundary from './components/ErrorBoundary';
import AdminLayout from './components/admin/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminCalculationsPage from './pages/admin/AdminCalculationsPage';
import AdminCalculatorsPage from './pages/admin/AdminCalculatorsPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminSiteSettingsPage from './pages/admin/AdminSiteSettingsPage';
import { SiteSettingsProvider } from './contexts/SiteSettingsContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTopButton from './components/ScrollToTopButton';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import AboutPage from './pages/AboutPage';
import ComingSoonPage from './pages/ComingSoonPage';
import ContactPage from './pages/ContactPage';
import TermsOfUsePage from './pages/TermsOfUsePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import NotFoundPage from './pages/NotFoundPage';
// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';
import VerifyEmailPage from './pages/auth/VerifyEmailPage';
import VerifyEmailRequiredPage from './pages/auth/VerifyEmailRequiredPage';
// User Profile Pages
import ProfilePage from './pages/ProfilePage';
import EditProfilePage from './pages/EditProfilePage';
import SettingsPage from './pages/SettingsPage';
import HistoryPage from './pages/HistoryPage';
import SavedPage from './pages/SavedPage';
// Dashboard Pages
import DashboardPage from './pages/dashboard/DashboardPage';
import CalculationsPage from './pages/dashboard/CalculationsPage';
import SecurityPage from './pages/dashboard/SecurityPage';
// Calculator Pages
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
import WaterContentCalculator from './pages/WaterContentCalculator';
import SpecificGravityCalculator from './pages/SpecificGravityCalculator';
import FreeSwellIndexCalculator from './pages/FreeSwellIndexCalculator';
import LiquidLimitCalculator from './pages/LiquidLimitCalculator';
import SoilSieveAnalysisCalculator from './pages/SoilSieveAnalysisCalculator';
import UCSTestCalculator from './pages/UCSTestCalculator';
import VaneShearCalculator from './pages/VaneShearCalculator';
import DirectShearCalculator from './pages/DirectShearCalculator';
import PermeabilityFallingHeadCalculator from './pages/PermeabilityFallingHeadCalculator';
import PermeabilityConstantHeadCalculator from './pages/PermeabilityConstantHeadCalculator';
import InSituDensityCalculator from './pages/InSituDensityCalculator';
import CBRTestCalculator from './pages/CBRTestCalculator';
import GSBGradingCalculator from './pages/GSBGradingCalculator';
import WBMGradingCalculator from './pages/WBMGradingCalculator';
import BituminousMacadamCalculator from './pages/BituminousMacadamCalculator';
import DBMCalculator from './pages/DBMCalculator';
import WMMCalculator from './pages/WMMCalculator';
import BituminousConcreteCalculator from './pages/BituminousConcreteCalculator';
import MSSCalculator from './pages/MSSCalculator';
import SandAsphaltCalculator from './pages/SandAsphaltCalculator';
import SurfaceDressingCalculator from './pages/SurfaceDressingCalculator';
import SlurrySealCalculator from './pages/SlurrySealCalculator';
import SMACalculator from './pages/SMACalculator';
import MasticAsphaltCalculator from './pages/MasticAsphaltCalculator';

// Scroll to top on route change
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

// Main app content with settings-aware background
// When admin (darpantrader1727@gmail.com) is logged in: only admin panel — no normal site, no Header/Footer on /admin
function AppContent() {
    const location = useLocation();
    const { isAuthenticated, isAdmin, loading } = useAuth();
    const isDarkMode = useSettings().isDarkMode;
    const bgColor = isDarkMode ? 'bg-[#0f172a]' : 'bg-[#F7F9FF]';
    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <>
            <ScrollToTop />
            <RecordCalculatorVisit />
            {!loading && isAuthenticated && isAdmin && !isAdminRoute ? (
                <Navigate to="/admin" replace />
            ) : (
            <div className={`min-h-screen flex flex-col ${bgColor} transition-colors duration-300`}>
                {!isAdminRoute && <Header />}
                {!isAdminRoute && <ScrollToTopButton />}
                <div className="flex-1">
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/coming-soon" element={<ComingSoonPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/terms-of-use" element={<TermsOfUsePage />} />
                        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
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
                        <Route path="/water-content" element={<WaterContentCalculator />} />
                        <Route path="/specific-gravity" element={<SpecificGravityCalculator />} />
                        <Route path="/free-swell-index" element={<FreeSwellIndexCalculator />} />
                        <Route path="/liquid-limit" element={<LiquidLimitCalculator />} />
                        <Route path="/soil-sieve-analysis" element={<SoilSieveAnalysisCalculator />} />
                        <Route path="/ucs-test" element={<UCSTestCalculator />} />
                        <Route path="/vane-shear" element={<VaneShearCalculator />} />
                        <Route path="/direct-shear" element={<DirectShearCalculator />} />
                        <Route path="/permeability-falling-head" element={<PermeabilityFallingHeadCalculator />} />
                        <Route path="/permeability-constant-head" element={<PermeabilityConstantHeadCalculator />} />
                        <Route path="/in-situ-density" element={<InSituDensityCalculator />} />
                        <Route path="/cbr-test" element={<CBRTestCalculator />} />
                        <Route path="/gsb-grading" element={<GSBGradingCalculator />} />
                        <Route path="/wbm-grading" element={<WBMGradingCalculator />} />
                        <Route path="/bituminous-macadam" element={<BituminousMacadamCalculator />} />
                        <Route path="/dbm-grading" element={<DBMCalculator />} />
                        <Route path="/wmm-grading" element={<WMMCalculator />} />
                        <Route path="/bituminous-concrete" element={<BituminousConcreteCalculator />} />
                        <Route path="/mss-grading" element={<MSSCalculator />} />
                        <Route path="/sand-asphalt" element={<SandAsphaltCalculator />} />
                        <Route path="/surface-dressing" element={<SurfaceDressingCalculator />} />
                        <Route path="/slurry-seal" element={<SlurrySealCalculator />} />
                        <Route path="/sma-grading" element={<SMACalculator />} />
                        <Route path="/mastic-asphalt" element={<MasticAsphaltCalculator />} />

                        {/* Blending Aggregates Routes - reusing same calculator components */}
                        <Route path="/blending-aggregates/gsb-grading-1" element={<GSBGradingCalculator />} />
                        <Route path="/blending-aggregates/gsb-grading-2" element={<GSBGradingCalculator />} />
                        <Route path="/blending-aggregates/gsb-grading-3" element={<GSBGradingCalculator />} />
                        <Route path="/blending-aggregates/gsb-grading-4" element={<GSBGradingCalculator />} />
                        <Route path="/blending-aggregates/gsb-grading-5" element={<GSBGradingCalculator />} />
                        <Route path="/blending-aggregates/gsb-grading-6" element={<GSBGradingCalculator />} />
                        <Route path="/blending-aggregates/wbm-coarse-1" element={<WBMGradingCalculator />} />
                        <Route path="/blending-aggregates/wbm-coarse-2" element={<WBMGradingCalculator />} />
                        <Route path="/blending-aggregates/wbm-screening-a" element={<WBMGradingCalculator />} />
                        <Route path="/blending-aggregates/wbm-screening-b" element={<WBMGradingCalculator />} />
                        <Route path="/blending-aggregates/wmm" element={<WMMCalculator />} />
                        <Route path="/blending-aggregates/bm-grading-1" element={<BituminousMacadamCalculator />} />
                        <Route path="/blending-aggregates/bm-grading-2" element={<BituminousMacadamCalculator />} />
                        <Route path="/blending-aggregates/dbm-grading-1" element={<DBMCalculator />} />
                        <Route path="/blending-aggregates/dbm-grading-2" element={<DBMCalculator />} />
                        <Route path="/blending-aggregates/sand-asphalt" element={<SandAsphaltCalculator />} />
                        <Route path="/blending-aggregates/bc-grading-1" element={<BituminousConcreteCalculator />} />
                        <Route path="/blending-aggregates/bc-grading-2" element={<BituminousConcreteCalculator />} />
                        <Route path="/blending-aggregates/mss-type-a" element={<MSSCalculator />} />
                        <Route path="/blending-aggregates/mss-type-b" element={<MSSCalculator />} />
                        <Route path="/blending-aggregates/sd-19mm" element={<SurfaceDressingCalculator />} />
                        <Route path="/blending-aggregates/sd-13mm" element={<SurfaceDressingCalculator />} />
                        <Route path="/blending-aggregates/sd-10mm" element={<SurfaceDressingCalculator />} />
                        <Route path="/blending-aggregates/sd-6mm" element={<SurfaceDressingCalculator />} />
                        <Route path="/blending-aggregates/slurry-type-1" element={<SlurrySealCalculator />} />
                        <Route path="/blending-aggregates/slurry-type-2" element={<SlurrySealCalculator />} />
                        <Route path="/blending-aggregates/slurry-type-3" element={<SlurrySealCalculator />} />
                        <Route path="/blending-aggregates/sma-13mm" element={<SMACalculator />} />
                        <Route path="/blending-aggregates/sma-19mm" element={<SMACalculator />} />
                        <Route path="/blending-aggregates/mastic-coarse" element={<MasticAsphaltCalculator />} />
                        <Route path="/blending-aggregates/mastic-fine" element={<MasticAsphaltCalculator />} />

                        {/* Sieve Analysis Routes - same paths for sieve analysis */}
                        <Route path="/sieve-analysis/gsb-grading-1" element={<GSBGradingCalculator />} />
                        <Route path="/sieve-analysis/gsb-grading-2" element={<GSBGradingCalculator />} />
                        <Route path="/sieve-analysis/gsb-grading-3" element={<GSBGradingCalculator />} />
                        <Route path="/sieve-analysis/gsb-grading-4" element={<GSBGradingCalculator />} />
                        <Route path="/sieve-analysis/gsb-grading-5" element={<GSBGradingCalculator />} />
                        <Route path="/sieve-analysis/gsb-grading-6" element={<GSBGradingCalculator />} />
                        <Route path="/sieve-analysis/wbm-coarse-1" element={<WBMGradingCalculator />} />
                        <Route path="/sieve-analysis/wbm-coarse-2" element={<WBMGradingCalculator />} />
                        <Route path="/sieve-analysis/wbm-screening-a" element={<WBMGradingCalculator />} />
                        <Route path="/sieve-analysis/wbm-screening-b" element={<WBMGradingCalculator />} />
                        <Route path="/sieve-analysis/wmm" element={<WMMCalculator />} />
                        <Route path="/sieve-analysis/bm-grading-1" element={<BituminousMacadamCalculator />} />
                        <Route path="/sieve-analysis/bm-grading-2" element={<BituminousMacadamCalculator />} />
                        <Route path="/sieve-analysis/dbm-grading-1" element={<DBMCalculator />} />
                        <Route path="/sieve-analysis/dbm-grading-2" element={<DBMCalculator />} />
                        <Route path="/sieve-analysis/sand-asphalt" element={<SandAsphaltCalculator />} />
                        <Route path="/sieve-analysis/bc-grading-1" element={<BituminousConcreteCalculator />} />
                        <Route path="/sieve-analysis/bc-grading-2" element={<BituminousConcreteCalculator />} />
                        <Route path="/sieve-analysis/mss-type-a" element={<MSSCalculator />} />
                        <Route path="/sieve-analysis/mss-type-b" element={<MSSCalculator />} />
                        <Route path="/sieve-analysis/sd-19mm" element={<SurfaceDressingCalculator />} />
                        <Route path="/sieve-analysis/sd-13mm" element={<SurfaceDressingCalculator />} />
                        <Route path="/sieve-analysis/sd-10mm" element={<SurfaceDressingCalculator />} />
                        <Route path="/sieve-analysis/sd-6mm" element={<SurfaceDressingCalculator />} />
                        <Route path="/sieve-analysis/slurry-type-1" element={<SlurrySealCalculator />} />
                        <Route path="/sieve-analysis/slurry-type-2" element={<SlurrySealCalculator />} />
                        <Route path="/sieve-analysis/slurry-type-3" element={<SlurrySealCalculator />} />
                        <Route path="/sieve-analysis/sma-13mm" element={<SMACalculator />} />
                        <Route path="/sieve-analysis/sma-19mm" element={<SMACalculator />} />
                        <Route path="/sieve-analysis/mastic-coarse" element={<MasticAsphaltCalculator />} />
                        <Route path="/sieve-analysis/mastic-fine" element={<MasticAsphaltCalculator />} />
                        {/* Auth Routes */}
                        <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
                        <Route path="/signup" element={<GuestRoute><SignupPage /></GuestRoute>} />
                        <Route path="/forgot-password" element={<GuestRoute><ForgotPasswordPage /></GuestRoute>} />
                        <Route path="/reset-password" element={<ResetPasswordPage />} />
                        <Route path="/verify-email" element={<VerifyEmailPage />} />
                        <Route path="/verify-email-required" element={<VerifyEmailRequiredPage />} />
                        {/* User Profile Routes (Protected) */}
                        <Route path="/profile" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                        <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />
                        <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
                        <Route path="/history" element={<ProtectedRoute><HistoryPage /></ProtectedRoute>} />
                        <Route path="/saved" element={<ProtectedRoute><SavedPage /></ProtectedRoute>} />
                        {/* Dashboard Routes (Protected) */}
                        <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
                        <Route path="/dashboard/calculations" element={<ProtectedRoute><CalculationsPage /></ProtectedRoute>} />
                        <Route path="/dashboard/security" element={<ProtectedRoute><SecurityPage /></ProtectedRoute>} />
                        {/* Admin Routes (admin only) */}
                        <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminLayout /></ProtectedRoute>}>
                            <Route index element={<AdminDashboardPage />} />
                            <Route path="calculations" element={<AdminCalculationsPage />} />
                            <Route path="calculators" element={<AdminCalculatorsPage />} />
                            <Route path="users" element={<AdminUsersPage />} />
                            <Route path="site-settings" element={<AdminSiteSettingsPage />} />
                            <Route path="*" element={<Navigate to="/admin" replace />} />
                        </Route>
                        {/* 404 Route */}
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
                {!isAdminRoute && <Footer />}
            </div>
            )}
        </>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <SettingsProvider>
                <AuthProvider>
                    <SiteSettingsProvider>
                        <Router>
                            <AppContent />
                        </Router>
                    </SiteSettingsProvider>
                </AuthProvider>
            </SettingsProvider>
        </ErrorBoundary>
    );
}

export default App;
