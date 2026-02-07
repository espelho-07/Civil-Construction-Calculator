import { useState, useEffect } from 'react';
import { getAdminStats } from '../../services/supabaseService';

export default function AdminCalculatorsPage() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const data = await getAdminStats();
                setStats(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const topCalculators = stats?.topCalculators || [];

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const maxCount = Math.max(...topCalculators.map((c) => c.count), 1);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Calculator Usage</h1>
                <p className="text-slate-400 mt-1">Most used calculators across the platform</p>
            </div>

            <div className="rounded-2xl bg-slate-800/50 border border-slate-700 p-6">
                <div className="space-y-4">
                    {topCalculators.map((calc, i) => (
                        <div key={calc.slug} className="flex items-center gap-4">
                            <span className="w-8 h-8 rounded-lg bg-slate-700 text-slate-400 flex items-center justify-center text-sm font-bold shrink-0">
                                {i + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-white font-medium truncate">{calc.name}</span>
                                    <span className="text-amber-400 font-semibold shrink-0 ml-2">{calc.count}</span>
                                </div>
                                <div className="h-2 rounded-full bg-slate-700 overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 transition-all duration-500"
                                        style={{ width: `${(calc.count / maxCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
                                <i className={`fas ${calc.icon || 'fa-calculator'} text-amber-400`}></i>
                            </div>
                        </div>
                    ))}
                </div>
                {topCalculators.length === 0 && (
                    <p className="text-slate-500 text-center py-8">No calculation data yet.</p>
                )}
            </div>
        </div>
    );
}
