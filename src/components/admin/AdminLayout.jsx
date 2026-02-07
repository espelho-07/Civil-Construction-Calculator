import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

const navItems = [
    { to: '/admin', label: 'Dashboard', icon: 'fa-chart-line' },
    { to: '/admin/calculations', label: 'All Calculations', icon: 'fa-calculator' },
    { to: '/admin/calculators', label: 'Calculator Usage', icon: 'fa-chart-pie' },
    { to: '/admin/users', label: 'Users', icon: 'fa-users' },
    { to: '/admin/site-settings', label: 'Site Settings', icon: 'fa-cog' },
];

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-slate-950 flex">
            {/* Sidebar */}
            <aside
                className={`${
                    sidebarOpen ? 'w-64' : 'w-20'
                } bg-slate-900 border-r border-slate-700 flex flex-col transition-all duration-300 fixed h-full z-40`}
            >
                <div className="p-4 border-b border-slate-700 flex items-center justify-between">
                    <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0">
                            <i className="fas fa-shield-halved text-white"></i>
                        </div>
                        {sidebarOpen && (
                            <span className="font-bold text-white truncate">Admin</span>
                        )}
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-700"
                    >
                        <i className={`fas fa-${sidebarOpen ? 'chevron-left' : 'chevron-right'}`}></i>
                    </button>
                </div>

                <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/admin'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                                    isActive
                                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                        : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                }`
                            }
                        >
                            <i className={`fas ${item.icon} w-5 text-center shrink-0`}></i>
                            {sidebarOpen && <span className="font-medium truncate">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-3 border-t border-slate-700">
                    <Link
                        to="/"
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-white transition-colors`}
                    >
                        <i className="fas fa-external-link-alt w-5 text-center shrink-0"></i>
                        {sidebarOpen && <span className="truncate">Back to Site</span>}
                    </Link>
                    <div className={`mt-2 px-3 py-2 rounded-xl bg-slate-800 ${!sidebarOpen && 'flex justify-center'}`}>
                        {sidebarOpen ? (
                            <>
                                <p className="text-xs text-slate-500 truncate">Logged in as</p>
                                <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                            </>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center text-white text-sm font-bold">
                                {user?.email?.[0]?.toUpperCase() || 'A'}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="mt-2 w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                        <i className="fas fa-sign-out-alt w-5 text-center shrink-0"></i>
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                <div className="p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
