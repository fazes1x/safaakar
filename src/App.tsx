import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './components/Auth';
import { ResidentDashboard } from './components/ResidentDashboard';
import { ReportForm } from './components/ReportForm';
import { ScoreView } from './components/ScoreView';
import { SupervisorDashboard } from './components/SupervisorDashboard';
import { ReportsManagement } from './components/ReportsManagement';
import { Education } from './components/Education';
import { Profile } from './components/Profile';
import { translations } from './lib/translations';
import {
  LayoutDashboard,
  FileText,
  Trophy,
  BookOpen,
  User,
  Trash2,
} from 'lucide-react';

type Tab = 'dashboard' | 'reports' | 'score' | 'education' | 'profile';

function MainApp() {
  const { user, profile, loading, language } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const t = translations[language];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center">
        <div className="text-xl text-green-700">Loading...</div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Auth />;
  }

  const residentTabs = [
    { id: 'dashboard' as Tab, label: t.dashboard, icon: LayoutDashboard },
    { id: 'reports' as Tab, label: t.reports, icon: FileText },
    { id: 'score' as Tab, label: t.myScore, icon: Trophy },
    { id: 'education' as Tab, label: t.education, icon: BookOpen },
    { id: 'profile' as Tab, label: t.profile, icon: User },
  ];

  const supervisorTabs = [
    { id: 'dashboard' as Tab, label: t.dashboard, icon: LayoutDashboard },
    { id: 'reports' as Tab, label: t.reports, icon: FileText },
    { id: 'education' as Tab, label: t.education, icon: BookOpen },
    { id: 'profile' as Tab, label: t.profile, icon: User },
  ];

  const tabs = profile.role === 'resident' ? residentTabs : supervisorTabs;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Trash2 className="w-8 h-8 text-green-600" />
              <h1 className="text-xl font-bold text-gray-800">
                Trash Collection Tracker
              </h1>
            </div>
            <div className="text-sm text-gray-600">
              {profile.full_name} ({profile.role})
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-green-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        <div className="transition-opacity duration-200">
          {profile.role === 'resident' && (
            <>
              {activeTab === 'dashboard' && <ResidentDashboard />}
              {activeTab === 'reports' && <ReportForm />}
              {activeTab === 'score' && <ScoreView />}
            </>
          )}

          {profile.role === 'supervisor' && (
            <>
              {activeTab === 'dashboard' && <SupervisorDashboard />}
              {activeTab === 'reports' && <ReportsManagement />}
            </>
          )}

          {activeTab === 'education' && <Education />}
          {activeTab === 'profile' && <Profile />}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;
