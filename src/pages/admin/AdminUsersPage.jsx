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
                <h1 className="text-4xl font-bold text-[#0A0A0A]">Users</h1>
                <p className="text-[#6b7280] mt-2 flex items-center gap-2">
                    <i className="fas fa-users"></i>
                    Registered user profiles
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
                                        <th className="text-left py-4 px-6 text-[#6b7280] font-semibold text-sm">Name</th>
                                        <th className="text-left py-4 px-6 text-[#6b7280] font-semibold text-sm">Role</th>
                                        <th className="text-left py-4 px-6 text-[#6b7280] font-semibold text-sm">Phone</th>
                                        <th className="text-left py-4 px-6 text-[#6b7280] font-semibold text-sm">Joined</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.profiles.map((profile) => (
                                        <tr key={profile.id} className="border-b border-[#e5e7eb] hover:bg-[#f9fafb] transition-colors">
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center text-[#3B68FC] font-bold text-sm">
                                                        {profile.full_name?.[0]?.toUpperCase() || '?'}
                                                    </div>
                                                    <span className="text-[#0A0A0A] font-medium">{profile.full_name || '—'}</span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                {profile.role === 'admin' ? (
                                                    <span className="px-3 py-1 rounded-full bg-blue-100 text-[#3B68FC] text-xs font-semibold">Admin</span>
                                                ) : (
                                                    <span className="text-[#6b7280] text-sm">User</span>
                                                )}
                                            </td>
                                            <td className="py-4 px-6 text-[#6b7280]">{profile.phone || '—'}</td>
                                            <td className="py-4 px-6 text-[#6b7280] text-sm">
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
