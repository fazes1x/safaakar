import { useState, useEffect } from 'react';
import { Trophy, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { translations } from '../lib/translations';

export function ScoreView() {
  const { user, language } = useAuth();
  const t = translations[language];
  const [score, setScore] = useState(0);
  const [collectedDays, setCollectedDays] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadScore();
    }
  }, [user]);

  const loadScore = async () => {
    try {
      const { data: pickups } = await supabase
        .from('trash_pickups')
        .select('status')
        .eq('user_id', user?.id);

      if (pickups) {
        const collected = pickups.filter((p) => p.status === 'collected').length;
        const total = pickups.length;
        const calculatedScore = total > 0 ? Math.round((collected / total) * 100) : 0;

        setCollectedDays(collected);
        setTotalDays(total);
        setScore(calculatedScore);
      }
    } catch (error) {
      console.error('Error loading score:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {t.cleanlinessScore}
          </h2>
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-6xl font-bold text-green-600">{score}%</span>
              <TrendingUp className="w-12 h-12 text-green-500" />
            </div>

            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-green-600 mb-2">
                {collectedDays}
              </p>
              <p className="text-sm text-gray-600">{t.daysCollected}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <p className="text-3xl font-bold text-gray-700 mb-2">{totalDays}</p>
              <p className="text-sm text-gray-600">{t.totalDays}</p>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 mt-6">
            Keep marking your collections to improve your score!
          </div>
        </div>
      </div>
    </div>
  );
}
