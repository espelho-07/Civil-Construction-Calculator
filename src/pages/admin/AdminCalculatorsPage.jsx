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
                <div className="w-12 h-12 border-4 border-[#3B68FC] border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const maxCount = Math.max(...topCalculators.map((c) => c.count), 1);

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-[#0A0A0A]">Calculator Usage</h1>
                <p className="text-[#6b7280] mt-2 flex items-center gap-2">
                    <i className="fas fa-chart-bar"></i>
                    Most used calculators across the platform
                </p>
            </div>

            <div className="rounded-2xl bg-white border border-[#e5e7eb] p-8 shadow-sm">
                <div className="space-y-6">
                    {topCalculators.map((calc, i) => (
                        <div key={calc.slug} className="flex items-center gap-4">
                            <span className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B68FC] to-[#2a4add] text-white flex items-center justify-center text-sm font-bold shrink-0 shadow-md">
                                {i + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[#0A0A0A] font-semibold truncate">{calc.name}</span>
                                    <span className="text-[#3B68FC] font-bold shrink-0 ml-2 text-lg">{calc.count}</span>
                                </div>
                                <div className="h-2.5 rounded-full bg-[#e5e7eb] overflow-hidden">
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-[#3B68FC] to-indigo-600 transition-all duration-700 shadow-sm"
                                        style={{ width: `${(calc.count / maxCount) * 100}%` }}
                                    />
                                </div>
                            </div>
                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center shrink-0">
                                <i className={`fas ${calc.icon || 'fa-calculator'} text-[#3B68FC] text-lg`}></i>
                            </div>
                        </div>
                    ))}
                </div>
                {topCalculators.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-[#6b7280] font-medium">No calculation data yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
