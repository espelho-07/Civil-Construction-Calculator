import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAdminCalculations } from '../../services/supabaseService';

export default function AdminCalculationsPage() {
    const [data, setData] = useState({ calculations: [], pagination: { page: 1, totalPages: 1, total: 0 } });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await getAdminCalculations(page, 15);
                setData({
                    calculations: res.calculations || [],
                    pagination: res.pagination || { page: 1, totalPages: 1, total: 0 },
                });
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [page]);

    const slugToPath = (slug) => (slug?.startsWith('/') ? slug : `/${slug || ''}`);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-[#0A0A0A]">All Calculations</h1>
                <p className="text-[#6b7280] mt-2 flex items-center gap-2">
                    <i className="fas fa-history"></i>
                    Recent calculations across all users
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-12 h-12 border-4 border-[#3B68FC] border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <div className="rounded-2xl bg-white border border-[#e5e7eb] overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-[#e5e7eb] bg-[#f8f9fa]">
                                        <th className="text-left py-4 px-6 text-[#6b7280] font-semibold text-sm">Calculator</th>
                                        <th className="text-left py-4 px-6 text-[#6b7280] font-semibold text-sm">User ID</th>
                                        <th className="text-left py-4 px-6 text-[#6b7280] font-semibold text-sm">Saved</th>
                                        <th className="text-left py-4 px-6 text-[#6b7280] font-semibold text-sm">Date</th>
                                        <th className="text-left py-4 px-6 text-[#6b7280] font-semibold text-sm">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.calculations.map((calc) => (
                                        <tr key={calc.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                                                        <i className={`fas ${calc.calculator_icon || 'fa-calculator'} text-[#3B68FC]`}></i>
                                                    </div>
                                                    <span className="text-[#0A0A0A] font-medium">{calc.calculator_name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-[#6b7280] font-mono text-sm truncate max-w-[120px]">
                                                {calc.user_id}
                                            </td>
                                            <td className="py-4 px-6">
                                                {calc.is_saved ? (
                                                    <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">Saved</span>
                                                ) : (
                                                    <span className="text-[#6b7280]">—</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-[#6b7280] text-sm">
                                                {new Date(calc.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                            <td className="py-4 px-6">
                                                <Link
                                                    to={slugToPath(calc.calculator_slug)}
                                                    className="text-[#3B68FC] hover:text-[#2a4add] text-sm font-semibold transition-colors"
                                                >
                                                    Open
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {data.pagination.totalPages > 1 && (
                        <div className="mt-6 flex items-center justify-between">
                            <p className="text-[#6b7280] text-sm font-medium">
                                Total <span className="font-bold text-[#3B68FC]">{data.pagination.total}</span> • Page <span className="font-bold text-[#3B68FC]">{data.pagination.page}</span> of {data.pagination.totalPages}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className="px-4 py-2 rounded-lg bg-white border border-[#e5e7eb] text-[#0A0A0A] disabled:opacity-50 hover:bg-[#f8f9fa] transition-colors font-medium text-sm"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page >= data.pagination.totalPages}
                                    className="px-4 py-2 rounded-lg bg-white border border-[#e5e7eb] text-[#0A0A0A] disabled:opacity-50 hover:bg-[#f8f9fa] transition-colors font-medium text-sm"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
