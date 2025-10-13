import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Save } from 'lucide-react';
import { getProfile, updateProfile, Profile } from '../../lib/api';
import { getSession } from '../../lib/auth';
import { toast } from 'sonner@2.0.3';

interface ProfileEditorProps {
  parsedData?: any;
}

export function ProfileEditor({ parsedData }: ProfileEditorProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (parsedData) {
      console.log('ProfileEditor received parsed data:', parsedData);
      setProfile(parsedData);
      setLoading(false);
      toast.success('Profile auto-filled from resume! Review and click Save.');
    } else {
      loadProfile();
    }
  }, [parsedData]);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!profile) return;

    setSaving(true);
    try {
      const session = await getSession();
      if (!session?.access_token) {
        toast.error('Not authenticated');
        return;
      }

      await updateProfile(profile, session.access_token);
      toast.success('Profile updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading profile...</div>;
  }

  if (!profile) {
    return <div className="text-white text-center">Profile not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white">Edit Profile</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-lime-500 text-white rounded-lg disabled:opacity-50"
        >
          <Save size={18} />
          {saving ? 'Saving...' : 'Save Changes'}
        </motion.button>
      </div>

      <div className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 rounded-xl border border-emerald-500/20 p-6">
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Role</label>
              <input
                type="text"
                value={profile.role}
                onChange={(e) => setProfile({ ...profile, role: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Phone</label>
              <input
                type="text"
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
              />
            </div>
          </div>

          <div>
            <h3 className="text-white mb-4">Social Links</h3>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">GitHub</label>
                <input
                  type="text"
                  value={profile.socialLinks.github}
                  onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, github: e.target.value } })}
                  className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">LinkedIn</label>
                <input
                  type="text"
                  value={profile.socialLinks.linkedin}
                  onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, linkedin: e.target.value } })}
                  className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Twitter</label>
                <input
                  type="text"
                  value={profile.socialLinks.twitter}
                  onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, twitter: e.target.value } })}
                  className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-white mb-4">Stats</h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div>
                <label className="block text-gray-300 mb-2">Experience</label>
                <input
                  type="text"
                  value={profile.stats.experience}
                  onChange={(e) => setProfile({ ...profile, stats: { ...profile.stats, experience: e.target.value } })}
                  className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Projects</label>
                <input
                  type="text"
                  value={profile.stats.projects}
                  onChange={(e) => setProfile({ ...profile, stats: { ...profile.stats, projects: e.target.value } })}
                  className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Clients</label>
                <input
                  type="text"
                  value={profile.stats.clients}
                  onChange={(e) => setProfile({ ...profile, stats: { ...profile.stats, clients: e.target.value } })}
                  className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-2">Awards</label>
                <input
                  type="text"
                  value={profile.stats.awards}
                  onChange={(e) => setProfile({ ...profile, stats: { ...profile.stats, awards: e.target.value } })}
                  className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
