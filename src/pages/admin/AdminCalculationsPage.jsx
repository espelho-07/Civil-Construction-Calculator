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
                <h1 className="text-3xl font-bold text-white">All Calculations</h1>
                <p className="text-slate-400 mt-1">Recent calculations across all users</p>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
            ) : (
                <>
                    <div className="rounded-2xl bg-slate-800/50 border border-slate-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-700 bg-slate-800/80">
                                        <th className="text-left py-4 px-4 text-slate-400 font-medium">Calculator</th>
                                        <th className="text-left py-4 px-4 text-slate-400 font-medium">User ID</th>
                                        <th className="text-left py-4 px-4 text-slate-400 font-medium">Saved</th>
                                        <th className="text-left py-4 px-4 text-slate-400 font-medium">Date</th>
                                        <th className="text-left py-4 px-4 text-slate-400 font-medium">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.calculations.map((calc) => (
                                        <tr key={calc.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                                                        <i className={`fas ${calc.calculator_icon || 'fa-calculator'} text-amber-400`}></i>
                                                    </div>
                                                    <span className="text-white font-medium">{calc.calculator_name}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-slate-400 font-mono text-sm truncate max-w-[120px]">
                                                {calc.user_id}
                                            </td>
                                            <td className="py-4 px-4">
                                                {calc.is_saved ? (
                                                    <span className="px-2 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs">Saved</span>
                                                ) : (
                                                    <span className="text-slate-500">—</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-slate-400 text-sm">
                                                {new Date(calc.created_at).toLocaleDateString('en-IN', {
                                                    day: 'numeric',
                                                    month: 'short',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                            <td className="py-4 px-4">
                                                <Link
                                                    to={slugToPath(calc.calculator_slug)}
                                                    className="text-amber-400 hover:text-amber-300 text-sm font-medium"
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
                            <p className="text-slate-400 text-sm">
                                Total {data.pagination.total} • Page {data.pagination.page} of {data.pagination.totalPages}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page <= 1}
                                    className="px-4 py-2 rounded-lg bg-slate-700 text-white disabled:opacity-50 hover:bg-slate-600"
                                >
                                    Previous
                                </button>
                                <button
                                    onClick={() => setPage((p) => p + 1)}
                                    disabled={page >= data.pagination.totalPages}
                                    className="px-4 py-2 rounded-lg bg-slate-700 text-white disabled:opacity-50 hover:bg-slate-600"
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
