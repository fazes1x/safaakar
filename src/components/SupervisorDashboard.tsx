import { useState, useEffect } from 'react';
import { Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../lib/translations';

type ResidentStatus = {
  id: string;
  full_name: string;
  address: string;
  status: 'collected' | 'pending';
  has_report: boolean;
};

export function SupervisorDashboard() {
  const { language } = useAuth();
  const t = translations[language];
  const [residents, setResidents] = useState<ResidentStatus[]>([]);
  const [filter, setFilter] = useState<'all' | 'collected' | 'pending' | 'reported'>('all');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    collected: 0,
    pending: 0,
    reported: 0,
  });

  useEffect(() => {
    loadResidents();
  }, []);

  const loadResidents = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, full_name, address')
        .eq('role', 'resident');

      if (!profiles) return;

      const { data: pickups } = await supabase
        .from('trash_pickups')
        .select('user_id, status')
        .eq('pickup_date', today);

      const { data: reports } = await supabase
        .from('reports')
        .select('user_id')
        .eq('status', 'open')
        .gte('created_at', today);

      const residentData: ResidentStatus[] = profiles.map((profile) => {
        const pickup = pickups?.find((p) => p.user_id === profile.id);
        const hasReport = reports?.some((r) => r.user_id === profile.id) || false;

        return {
          id: profile.id,
          full_name: profile.full_name,
          address: profile.address || 'N/A',
          status: pickup?.status || 'pending',
          has_report: hasReport,
        };
      });

      setResidents(residentData);

      setStats({
        total: residentData.length,
        collected: residentData.filter((r) => r.status === 'collected').length,
        pending: residentData.filter((r) => r.status === 'pending').length,
        reported: residentData.filter((r) => r.has_report).length,
      });
    } catch (error) {
      console.error('Error loading residents:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredResidents = residents.filter((r) => {
    if (filter === 'all') return true;
    if (filter === 'collected') return r.status === 'collected';
    if (filter === 'pending') return r.status === 'pending';
    if (filter === 'reported') return r.has_report;
    return true;
  });

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t.totalResidents}</p>
              <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
            </div>
            <Users className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t.collected}</p>
              <p className="text-3xl font-bold text-green-600">{stats.collected}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t.pending}</p>
              <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
            </div>
            <Clock className="w-10 h-10 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">{t.filterReported}</p>
              <p className="text-3xl font-bold text-red-600">{stats.reported}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-red-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t.allResidents}</h2>

          <div className="flex gap-2">
            {(['all', 'collected', 'pending', 'reported'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {t[`filter${f.charAt(0).toUpperCase() + f.slice(1)}` as keyof typeof t]}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t.fullName}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t.address}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t.status}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {t.issueReported}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredResidents.map((resident) => (
                <tr key={resident.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {resident.full_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {resident.address}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                        resident.status === 'collected'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}
                    >
                      {resident.status === 'collected' ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {t[resident.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {resident.has_report ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                        <AlertTriangle className="w-3 h-3" />
                        Yes
                      </span>
                    ) : (
                      <span className="text-sm text-gray-400">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
