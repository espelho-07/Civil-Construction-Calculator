import { useLocation, Link } from 'react-router-dom';
import { getThemeClasses } from '../constants/categories';
import { categories } from '../constants/categories';

export default function MiniNavbar({ themeName = 'blue' }) {
    const location = useLocation();
    const pathname = location.pathname;
    const theme = getThemeClasses(themeName);

    // Map path segments to category slugs
    const getCategoryFromPath = (path) => {
        if (path.includes('/sieve-analysis') || path.includes('/gsb-grading') || path.includes('/wbm-') || path.includes('/wmm') || path.includes('/dbm-grading') || path.includes('/bc-grading') || path.includes('/bm-grading') || path.includes('/mss-type') || path.includes('/sd-') || path.includes('/slurry-type') || path.includes('/sma-') || path.includes('/mastic-') || path.includes('/sand-asphalt')) {
            return { slug: 'sieve-analysis-aggregates', name: 'Sieve Analysis' };
        }
        if (path.includes('/blending-aggregates')) {
            return { slug: 'blending-aggregates', name: 'Blending Aggregates' };
        }
        if (path.includes('/soil-test') || path.includes('/cbr-test') || path.includes('/liquid-limit') || path.includes('/specific-gravity') || path.includes('/free-swell-index') || path.includes('/water-content') || path.includes('/soil-sieve-analysis') || path.includes('/permeability-') || path.includes('/vane-shear') || path.includes('/direct-shear') || path.includes('/ucs-test') || path.includes('/in-situ-density')) {
            return { slug: 'soil-test', name: 'Soil Test' };
        }
        if (path.includes('/quantity-estimator') || path.includes('/cement-concrete') || path.includes('/brick-masonry') || path.includes('/plastering') || path.includes('/flooring') || path.includes('/excavation') || path.includes('/stair-case') || path.includes('/carpet-area') || path.includes('/tank-volume') || path.includes('/precast-boundary-wall') || path.includes('/construction-cost') || path.includes('/countertop') || path.includes('/concrete-block') || path.includes('/ac-calculator') || path.includes('/solar-rooftop') || path.includes('/solar-water-heater') || path.includes('/paint-work') || path.includes('/wood-frame') || path.includes('/plywood') || path.includes('/anti-termite') || path.includes('/asphalt') || path.includes('/concrete-tube') || path.includes('/roof-pitch') || path.includes('/top-soil') || path.includes('/steel-weight') || path.includes('/steel-quantity') || path.includes('/round-column') || path.includes('/unit-converter')) {
            return { slug: 'quantity-estimator', name: 'Quantity Estimator' };
        }
        if (path.includes('/concrete-technology') || path.includes('/aggregate-impact-value') || path.includes('/aggregate-crushing-value') || path.includes('/aggregate-abrasion-value') || path.includes('/aggregate-water-absorption')) {
            return { slug: 'concrete-technology', name: 'Concrete Technology' };
        }
        if (path.includes('/environmental') || path.includes('/bod') || path.includes('/cod') || path.includes('/ammonical-nitrogen')) {
            return { slug: 'environmental-engineering', name: 'Environmental Eng.' };
        }
        if (path.includes('/road-construction') || path.includes('/bitumen-prime-coat') || path.includes('/bitumen-tack-coat')) {
            return { slug: 'road-construction', name: 'Road Construction' };
        }
        return null;
    };

    // Build breadcrumb from pathname
    const getBreadcrumbs = () => {
        const segments = pathname.split('/').filter(Boolean);
        const breadcrumbs = [];
        
        // Always start with Home
        breadcrumbs.push({ name: 'Home', path: '/' });
        
        // Detect category and add it
        const category = getCategoryFromPath(pathname);
        if (category) {
            breadcrumbs.push({ 
                name: category.name, 
                path: `/category/${category.slug}`,
                isLast: false
            });
        }
        
        // Build path progressively for calculator segments
        let currentPath = '';
        segments.forEach((segment, index) => {
            currentPath += `/${segment}`;
            
            // Skip if this is a category segment we already added
            if (category && (segment === category.slug || segment === 'category')) {
                return;
            }
            
            // Format segment name for display
            let displayName = segment
                .split('-')
                .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
            
            // Special formatting for common segments
            if (segment === 'sieve-analysis') {
                displayName = 'Sieve Analysis';
            } else if (segment === 'blending-aggregates') {
                displayName = 'Blending Aggregates';
            } else if (segment.startsWith('gsb-grading-')) {
                const gradeNum = segment.replace('gsb-grading-', '');
                displayName = `GSB Grade ${gradeNum}`;
            } else if (segment.startsWith('wbm-')) {
                displayName = segment.replace('wbm-', 'WBM ').replace(/-/g, ' ');
                displayName = displayName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
            } else if (segment.startsWith('dbm-grading-')) {
                const gradeNum = segment.replace('dbm-grading-', '');
                displayName = `DBM Grading ${gradeNum}`;
            } else if (segment.startsWith('bc-grading-')) {
                const gradeNum = segment.replace('bc-grading-', '');
                displayName = `BC Grading ${gradeNum}`;
            } else if (segment.startsWith('bm-grading-')) {
                const gradeNum = segment.replace('bm-grading-', '');
                displayName = `BM Grading ${gradeNum}`;
            } else if (segment.startsWith('mss-type-')) {
                const type = segment.replace('mss-type-', '').toUpperCase();
                displayName = `MSS Type ${type}`;
            } else if (segment.startsWith('sd-')) {
                const size = segment.replace('sd-', '');
                displayName = `Surface Dressing ${size}mm`;
            } else if (segment.startsWith('slurry-type-')) {
                const type = segment.replace('slurry-type-', '');
                displayName = `Slurry Seal Type ${type}`;
            } else if (segment.startsWith('sma-')) {
                const size = segment.replace('sma-', '');
                displayName = `SMA ${size}mm`;
            } else if (segment.startsWith('mastic-')) {
                const type = segment.replace('mastic-', '');
                displayName = `Mastic Asphalt ${type.charAt(0).toUpperCase() + type.slice(1)}`;
            }
            
            breadcrumbs.push({ 
                name: displayName, 
                path: currentPath,
                isLast: index === segments.length - 1
            });
        });
        
        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 mb-6">
            <div className={`px-5 py-4 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <i className="fas fa-sitemap"></i>
                    Navigation
                </h3>
            </div>
            <div className="p-4">
                <nav className="space-y-2">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={index} className="flex items-center gap-2">
                            {index > 0 && (
                                <i className="fas fa-chevron-right text-gray-300 text-xs"></i>
                            )}
                            {crumb.isLast ? (
                                <span className={`text-sm font-medium ${theme.text} flex items-center gap-2`}>
                                    <i className={`fas fa-map-marker-alt ${theme.accent}`}></i>
                                    {crumb.name}
                                </span>
                            ) : (
                                <Link
                                    to={crumb.path}
                                    className="text-sm text-gray-600 transition-colors flex items-center gap-2 hover:text-gray-900"
                                >
                                    {index === 0 && <i className="fas fa-home text-gray-400"></i>}
                                    {crumb.name}
                                </Link>
                            )}
                        </div>
                    ))}
                </nav>
            </div>
        </div>
    );
}
