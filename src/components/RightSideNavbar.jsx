import { Link, useLocation } from 'react-router-dom';

export default function RightSideNavbar({ items, title = "Calculators" }) {
    const location = useLocation();

    return (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="px-5 py-3 bg-gray-50 border-b border-gray-100">
                <h3 className="font-bold text-gray-700 text-sm flex items-center gap-2">
                    <i className="fas fa-list-ul text-blue-500"></i>
                    {title}
                </h3>
            </div>
            <div className="p-2 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                {items.map((item, idx) => {
                    const isActive = location.pathname === item.slug;
                    return (
                        <Link
                            key={idx}
                            to={item.slug}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all mb-1 ${isActive
                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                }`}
                        >
                            <i className={`fas ${item.icon} w-5 text-center ${isActive ? 'text-blue-500' : 'text-gray-400'}`}></i>
                            {item.name}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
