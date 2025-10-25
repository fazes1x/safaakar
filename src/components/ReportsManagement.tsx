import { useState, useEffect } from 'react';
import { Camera, CheckCircle, Clock, ExternalLink } from 'lucide-react';
import { supabase, Report } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../lib/translations';

type ReportWithProfile = Report & {
  profiles: { full_name: string };
};

export function ReportsManagement() {
  const { language } = useAuth();
  const t = translations[language];
  const [reports, setReports] = useState<ReportWithProfile[]>([]);
  const [filter, setFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data } = await supabase
        .from('reports')
        .select(`
          *,
          profiles:user_id (full_name)
        `)
        .order('created_at', { ascending: false });

      if (data) {
        setReports(data as ReportWithProfile[]);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId: string) => {
    try {
      const { error } = await supabase
        .from('reports')
        .update({
          status: 'resolved',
          resolved_at: new Date().toISOString(),
        })
        .eq('id', reportId);

      if (error) throw error;
      loadReports();
    } catch (error) {
      console.error('Error resolving report:', error);
    }
  };

  const filteredReports = reports.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{t.allReports}</h2>

          <div className="flex gap-2">
            {(['all', 'open', 'resolved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg font-medium transition ${
                  filter === f
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {f === 'all' ? t.filterAll : t[f]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {filteredReports.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No reports found
            </div>
          ) : (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          report.status === 'open'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {report.status === 'open' ? (
                          <Clock className="w-3 h-3" />
                        ) : (
                          <CheckCircle className="w-3 h-3" />
                        )}
                        {t[report.status]}
                      </span>
                      <span className="text-sm text-gray-500">
                        {new Date(report.created_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          Resident:
                        </span>
                        <span className="text-sm text-gray-900 ml-2">
                          {report.profiles.full_name}
                        </span>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          {t.address}:
                        </span>
                        <span className="text-sm text-gray-900 ml-2">
                          {report.address}
                        </span>
                      </div>

                      <div>
                        <span className="text-sm font-medium text-gray-700">
                          {t.comment}:
                        </span>
                        <p className="text-sm text-gray-900 mt-1">
                          {report.comment}
                        </p>
                      </div>
                    </div>

                    {report.status === 'open' && (
                      <button
                        onClick={() => handleResolve(report.id)}
                        className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
                      >
                        {t.markResolved}
                      </button>
                    )}
                  </div>

                  {report.photo_url && (
                    <div className="flex-shrink-0">
                      <a
                        href={report.photo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block group"
                      >
                        <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-gray-200 group-hover:border-green-500 transition">
                          <img
                            src={report.photo_url}
                            alt="Report"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition flex items-center justify-center">
                            <ExternalLink className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition" />
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-green-600 mt-2 justify-center">
                          <Camera className="w-3 h-3" />
                          {t.viewPhoto}
                        </div>
                      </a>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
