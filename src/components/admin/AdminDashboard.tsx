import { useState } from 'react';
import { motion } from 'motion/react';
import { LogOut, FolderOpen, User, FileText, Award, Home, Sparkles } from 'lucide-react';
import { signOut } from '../../lib/auth';
import { toast } from 'sonner@2.0.3';
import { ProjectsManager } from './ProjectsManager';
import { ProfileEditor } from './ProfileEditor';
import { ResumeManager } from './ResumeManager';
import { SkillsManager } from './SkillsManager';
import { AIResumeParser } from './AIResumeParser';

interface AdminDashboardProps {
  onLogout: () => void;
}

type Tab = 'ai-parser' | 'profile' | 'projects' | 'skills' | 'resume';

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('ai-parser');
  const [parsedProfile, setParsedProfile] = useState<any>(null);
  const [parsedSkills, setParsedSkills] = useState<any[]>([]);
  const [parsedProjects, setParsedProjects] = useState<any[]>([]);

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      onLogout();
    } catch (error: any) {
      toast.error(error.message || 'Logout failed');
    }
  };

  const handleBackToHome = () => {
    window.history.pushState({}, '', '/');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  const tabs = [
    { id: 'ai-parser' as Tab, label: 'AI Parser', icon: Sparkles },
    { id: 'profile' as Tab, label: 'Profile', icon: User },
    { id: 'projects' as Tab, label: 'Projects', icon: FolderOpen },
    { id: 'skills' as Tab, label: 'Skills', icon: Award },
    { id: 'resume' as Tab, label: 'Resume', icon: FileText },
  ];

  const handleParsedData = async (data: any) => {
    console.log('Dashboard received parsed data:', data);
    setParsedProfile(data.profile);
    setParsedSkills(data.skills || []);
    setParsedProjects(data.projects || []);
    
    // Show summary of what was parsed
    const summary = [];
    if (data.profile?.name) summary.push('profile');
    if (data.skills?.length > 0) summary.push(`${data.skills.length} skills`);
    if (data.projects?.length > 0) summary.push(`${data.projects.length} projects`);
    
    toast.success(`✅ Parsed: ${summary.join(', ')}! Auto-filling forms...`, { duration: 4000 });
    
    // Auto-switch to profile tab after a brief delay
    setTimeout(() => {
      setActiveTab('profile');
      toast.info('📝 Review and Save each section: Profile → Skills → Projects', { duration: 6000 });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-950/50 to-teal-950/50 border-b border-emerald-500/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-white">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleBackToHome}
              className="flex items-center gap-2 px-4 py-2 bg-lime-500/20 text-lime-400 rounded-lg hover:bg-lime-500/30 transition-colors"
            >
              <Home size={18} />
              Back to Portfolio
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </motion.button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-2 mb-8 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-lime-500 text-white'
                    : 'bg-emerald-950/30 text-gray-400 hover:bg-emerald-950/50'
                }`}
              >
                <Icon size={20} />
                {tab.label}
              </motion.button>
            );
          })}
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'ai-parser' && (
            <div className="max-w-3xl mx-auto">
              <div className="mb-6">
                <h2 className="text-white mb-2">🤖 AI Resume Parser</h2>
                <p className="text-gray-400">
                  Upload your resume PDF and let AI automatically extract all information to populate your entire portfolio
                </p>
              </div>
              <AIResumeParser 
                onParsed={handleParsedData}
                onSkillsParsed={setParsedSkills}
                onProjectsParsed={setParsedProjects}
              />
              {parsedProfile && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-6 bg-gradient-to-r from-emerald-950/50 to-lime-950/50 rounded-xl border border-emerald-500/30"
                >
                  <div className="flex items-start gap-3">
                    <Sparkles className="text-emerald-400 mt-1" size={24} />
                    <div className="flex-1">
                      <p className="text-emerald-400 mb-2">✅ Resume Parsed & Auto-Filled!</p>
                      <p className="text-gray-300 mb-3">
                        Your portfolio has been automatically populated with:
                      </p>
                      <ul className="space-y-1 text-gray-400 text-sm mb-4">
                        <li>• <strong className="text-white">Profile:</strong> {parsedProfile.name || 'Name'}, {parsedProfile.email || 'Email'}, {parsedProfile.phone || 'Phone'}</li>
                        {parsedSkills.length > 0 && <li>• <strong className="text-white">Skills:</strong> {parsedSkills.length} technologies detected</li>}
                        {parsedProjects.length > 0 && <li>• <strong className="text-white">Projects:</strong> {parsedProjects.length} projects found</li>}
                      </ul>
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-4 mb-4">
                        <p className="text-purple-300 text-sm">
                          <strong>🎯 Action Required:</strong> Click on each tab to review the auto-filled data, make any adjustments, then click <strong>"Save"</strong> to apply changes.
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveTab('profile')}
                          className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                        >
                          Review Profile →
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setActiveTab('skills')}
                          className="px-4 py-2 bg-lime-500/20 text-lime-400 rounded-lg hover:bg-lime-500/30 transition-colors"
                        >
                          Review Skills →
                        </motion.button>
                        {parsedProjects.length > 0 && (
                          <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setActiveTab('projects')}
                            className="px-4 py-2 bg-teal-500/20 text-teal-400 rounded-lg hover:bg-teal-500/30 transition-colors"
                          >
                            Review Projects →
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
          {activeTab === 'profile' && <ProfileEditor parsedData={parsedProfile} />}
          {activeTab === 'projects' && <ProjectsManager parsedProjects={parsedProjects} />}
          {activeTab === 'skills' && <SkillsManager parsedSkills={parsedSkills} />}
          {activeTab === 'resume' && <ResumeManager />}
        </motion.div>
      </div>
    </div>
  );
}
