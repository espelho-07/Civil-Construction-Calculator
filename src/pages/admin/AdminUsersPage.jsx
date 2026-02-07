import { useState, useEffect } from 'react';
import { getAdminProfiles } from '../../services/supabaseService';

export default function AdminUsersPage() {
    const [data, setData] = useState({ profiles: [], pagination: { page: 1, totalPages: 1, total: 0 } });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            try {
                const res = await getAdminProfiles(page, 15);
                setData({
                    profiles: res.profiles || [],
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

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">Users</h1>
                <p className="text-slate-400 mt-1">Registered user profiles</p>
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
                                        <th className="text-left py-4 px-4 text-slate-400 font-medium">Name</th>
                                        <th className="text-left py-4 px-4 text-slate-400 font-medium">Role</th>
                                        <th className="text-left py-4 px-4 text-slate-400 font-medium">Phone</th>
                                        <th className="text-left py-4 px-4 text-slate-400 font-medium">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.profiles.map((profile) => (
                                        <tr key={profile.id} className="border-b border-slate-700/50 hover:bg-slate-700/30">
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500/30 to-orange-500/30 flex items-center justify-center text-amber-400 font-bold">
                                                        {profile.full_name?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <span className="text-white font-medium">{profile.full_name || '—'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4">
                                                {profile.role === 'admin' ? (
                                                    <span className="px-2 py-1 rounded-lg bg-amber-500/20 text-amber-400 text-xs font-medium">Admin</span>
                                                ) : (
                                                    <span className="text-slate-500">User</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-4 text-slate-400">{profile.phone || '—'}</td>
                                            <td className="py-4 px-4 text-slate-400 text-sm">
                                                {profile.created_at
                                                    ? new Date(profile.created_at).toLocaleDateString('en-IN', {
                                                          day: 'numeric',
                                                          month: 'short',
                                                          year: 'numeric',
                                                      })
                                                    : '—'}
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
