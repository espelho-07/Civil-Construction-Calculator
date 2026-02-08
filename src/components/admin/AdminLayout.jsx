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
        <div className="min-h-screen bg-gradient-to-br from-[#F7F9FF] via-white to-[#f0f4ff] flex">
            {/* Sidebar - Modern Design */}
            <aside
                className={`${
                    sidebarOpen ? 'w-64' : 'w-20'
                } bg-white border-r border-[#e5e7eb] shadow-lg flex flex-col transition-all duration-300 fixed h-full z-40`}
            >
                {/* Header */}
                <div className="p-6 border-b border-[#e5e7eb] flex items-center justify-between">
                    <Link to="/admin" className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3B68FC] to-[#2a4add] flex items-center justify-center shrink-0 shadow-md">
                            <i className="fas fa-shield-halved text-white"></i>
                        </div>
                        {sidebarOpen && (
                            <span className="font-bold text-[#0A0A0A] truncate">Admin</span>
                        )}
                    </Link>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 text-[#6b7280] hover:text-[#0A0A0A] rounded-lg hover:bg-[#f3f4f6] transition-colors"
                    >
                        <i className={`fas fa-${sidebarOpen ? 'chevron-left' : 'chevron-right'}`}></i>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.to === '/admin'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-medium ${
                                    isActive
                                        ? 'bg-gradient-to-r from-[#3B68FC]/10 to-[#2a4add]/10 text-[#3B68FC] border border-[#3B68FC]/20 shadow-sm'
                                        : 'text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#0A0A0A]'
                                }`
                            }
                        >
                            <i className={`fas ${item.icon} w-5 text-center shrink-0`}></i>
                            {sidebarOpen && <span className="truncate">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="p-4 border-t border-[#e5e7eb] space-y-3">
                    <Link
                        to="/"
                        className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-[#6b7280] hover:bg-[#f3f4f6] hover:text-[#0A0A0A] transition-colors font-medium`}
                    >
                        <i className="fas fa-external-link-alt w-5 text-center shrink-0"></i>
                        {sidebarOpen && <span className="truncate">Back to Site</span>}
                    </Link>
                    <div className={`px-4 py-3 rounded-xl bg-gradient-to-br from-[#f0f4ff] to-[#e0e8ff] border border-[#d0d9ff] ${!sidebarOpen && 'flex justify-center'}`}>
                        {sidebarOpen ? (
                            <>
                                <p className="text-xs text-[#6b7280] truncate">Logged in as</p>
                                <p className="text-sm font-semibold text-[#0A0A0A] truncate">{user?.email}</p>
                            </>
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#3B68FC] to-[#2a4add] flex items-center justify-center text-white text-sm font-bold shadow-md">
                                {user?.email?.[0]?.toUpperCase() || 'A'}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-colors font-medium"
                    >
                        <i className="fas fa-sign-out-alt w-5 text-center shrink-0"></i>
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'} bg-gradient-to-br from-[#F7F9FF] via-white to-[#f0f4ff] min-h-screen`}>
                <div className="p-6 lg:p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
