import { useLocation, Link } from 'react-router-dom';
import { getThemeClasses } from '../constants/categories';
import { categories } from '../constants/categories';

export default function MiniNavbar({ themeName = null }) {
    const location = useLocation();
    const pathname = location.pathname;
    
    // Auto-detect theme based on category
    let detectedTheme = themeName;
    if (!detectedTheme) {
        detectedTheme = pathname.includes('/blending-aggregates') || pathname.includes('/blending') ? 'purple' : 'blue';
    }
    const theme = getThemeClasses(detectedTheme);

    // Map path segments to category slugs
    const getCategoryFromPath = (path) => {
        // Check blending FIRST before individual sieve patterns
        if (path.includes('/blending-aggregates') || path.includes('/blending')) {
            return { slug: 'blending-aggregates', name: 'Blending of Aggregates' };
        }
        if (path.includes('/sieve-analysis') || path.includes('/gsb-grading') || path.includes('/wbm-') || path.includes('/wmm') || path.includes('/dbm-grading') || path.includes('/bc-grading') || path.includes('/bm-grading') || path.includes('/mss-type') || path.includes('/sd-') || path.includes('/slurry-type') || path.includes('/sma-') || path.includes('/mastic-') || path.includes('/sand-asphalt')) {
            return { slug: 'sieve-analysis-aggregates', name: 'Sieve Analysis' };
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

    // Get category from path
    const category = getCategoryFromPath(pathname);

    // Format current page name from last segment
    const formatPageName = (segment) => {
        if (segment.startsWith('gsb-grading-')) {
            const gradeNum = segment.replace('gsb-grading-', '');
            return `GSB Grade ${gradeNum}`;
        } else if (segment.startsWith('wbm-')) {
            let displayName = segment.replace('wbm-', 'WBM ').replace(/-/g, ' ');
            return displayName.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        } else if (segment.startsWith('dbm-grading-')) {
            const gradeNum = segment.replace('dbm-grading-', '');
            return `DBM Grading ${gradeNum}`;
        } else if (segment.startsWith('bc-grading-')) {
            const gradeNum = segment.replace('bc-grading-', '');
            return `BC Grading ${gradeNum}`;
        } else if (segment.startsWith('bm-grading-')) {
            const gradeNum = segment.replace('bm-grading-', '');
            return `BM Grading ${gradeNum}`;
        } else if (segment.startsWith('mss-type-')) {
            const type = segment.replace('mss-type-', '').toUpperCase();
            return `MSS Type ${type}`;
        } else if (segment.startsWith('sd-')) {
            const size = segment.replace('sd-', '');
            return `Surface Dressing ${size}mm`;
        } else if (segment.startsWith('slurry-type-')) {
            const type = segment.replace('slurry-type-', '');
            return `Slurry Seal Type ${type}`;
        } else if (segment.startsWith('sma-')) {
            const size = segment.replace('sma-', '');
            return `SMA ${size}mm`;
        } else if (segment.startsWith('mastic-')) {
            const type = segment.replace('mastic-', '');
            return `Mastic Asphalt ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        }
        return segment.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    // Build exactly 3 items: Home, Category, Current
    const segments = pathname.split('/').filter(Boolean);
    const lastSegment = segments[segments.length - 1] || '';
    const currentPageName = lastSegment ? formatPageName(lastSegment) : 'Current';

    const breadcrumbs = [
        { name: 'Home', path: '/', isLast: false },
        category ? { name: category.name, path: `/category/${category.slug}`, isLast: false } : { name: 'Categories', path: '/', isLast: false },
        { name: currentPageName, path: pathname, isLast: true }
    ];

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
