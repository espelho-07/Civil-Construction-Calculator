import { Link, useLocation } from 'react-router-dom';
import { getThemeClasses } from '../constants/categories';

export default function CategoryQuickNav({ items, title, themeName = 'blue' }) {
    const location = useLocation();
    const theme = getThemeClasses(themeName);

    if (!items || items.length === 0) {
        return null;
    }

    return (
        <div className={`bg-white rounded-2xl shadow-lg border ${theme.border}`}>
            <div className={`px-5 py-3 bg-gradient-to-r ${theme.gradient} rounded-t-2xl`}>
                <h3 className="font-bold text-white text-sm flex items-center gap-2">
                    <i className="fas fa-compass"></i>
                    {title}
                </h3>
            </div>
            <div className="p-3 max-h-64 overflow-y-auto">
                {items.map((calc, idx) => {
                    const isActive = location.pathname.includes(calc.slug.split('/').pop());
                    return (
                        <Link
                            key={idx}
                            to={calc.slug}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                isActive
                                    ? `${theme.bgLight} ${theme.text} font-medium`
                                    : 'hover:bg-gray-50 text-gray-600'
                            }`}
                        >
                            <i className={`fas ${calc.icon} w-4 text-center ${
                                isActive ? theme.accent : 'text-gray-400'
                            }`}></i>
                            {calc.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
