import { useState } from 'react';
import { User, Globe } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { translations, Language } from '../lib/translations';

export function Profile() {
  const { profile, language, setLanguage } = useAuth();
  const t = translations[language];
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(language);
  const [updating, setUpdating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleUpdateLanguage = async () => {
    if (!profile) return;
    setUpdating(true);
    setSuccess(false);

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ preferred_language: selectedLanguage })
        .eq('id', profile.id);

      if (error) throw error;

      setLanguage(selectedLanguage);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating language:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (!profile) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{profile.full_name}</h2>
          <p className="text-gray-600 mt-1">
            {profile.role === 'resident' ? t.resident : t.supervisor}
          </p>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {t.address}
                </p>
                <p className="text-gray-900">{profile.address || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {t.role}
                </p>
                <p className="text-gray-900">
                  {profile.role === 'resident' ? t.resident : t.supervisor}
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Globe className="w-5 h-5 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                {t.language}
              </h3>
            </div>

            <div className="flex gap-4 items-center">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as Language)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="en">English</option>
                <option value="ur">اردو (Urdu)</option>
              </select>

              <button
                onClick={handleUpdateLanguage}
                disabled={updating || selectedLanguage === language}
                className="px-6 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating ? '...' : t.updateProfile}
              </button>
            </div>

            {success && (
              <div className="mt-4 bg-green-50 text-green-700 px-4 py-2 rounded-lg text-sm">
                {t.profileUpdated}
              </div>
            )}
          </div>

          <div className="border-t pt-6">
            <button
              onClick={() => supabase.auth.signOut()}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition"
            >
              {t.logout}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
