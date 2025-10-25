import { useState, useEffect } from 'react';
import { CheckCircle2, Circle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../lib/translations';

export function ResidentDashboard() {
  const { user, language } = useAuth();
  const t = translations[language];
  const [isCollected, setIsCollected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (user) {
      loadTodayStatus();
    }
  }, [user]);

  const loadTodayStatus = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const { data } = await supabase
        .from('trash_pickups')
        .select('status')
        .eq('user_id', user?.id)
        .eq('pickup_date', today)
        .maybeSingle();

      setIsCollected(data?.status === 'collected');
    } catch (error) {
      console.error('Error loading status:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCollection = async () => {
    if (!user) return;
    setUpdating(true);

    try {
      const today = new Date().toISOString().split('T')[0];
      const newStatus = isCollected ? 'pending' : 'collected';

      const { error } = await supabase
        .from('trash_pickups')
        .upsert({
          user_id: user.id,
          pickup_date: today,
          status: newStatus,
          marked_at: new Date().toISOString(),
        }, {
          onConflict: 'user_id,pickup_date',
        });

      if (error) throw error;
      setIsCollected(!isCollected);
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          {t.todayCollection}
        </h2>

        <div className="flex flex-col items-center space-y-6">
          <button
            onClick={toggleCollection}
            disabled={updating}
            className={`w-40 h-40 rounded-full flex items-center justify-center transition-all transform hover:scale-105 ${
              isCollected
                ? 'bg-green-500 shadow-lg shadow-green-200'
                : 'bg-gray-200 hover:bg-gray-300'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isCollected ? (
              <CheckCircle2 className="w-24 h-24 text-white" />
            ) : (
              <Circle className="w-24 h-24 text-gray-400" />
            )}
          </button>

          <div className="text-center">
            <p className="text-lg font-semibold text-gray-700">
              {isCollected ? t.collected : t.markCollected}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {isCollected ? t.collectionMarked : 'Click to mark collection'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
