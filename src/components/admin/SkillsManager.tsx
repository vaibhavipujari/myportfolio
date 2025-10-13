import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Save, Trash2 } from 'lucide-react';
import { getSkills, updateSkills, Skill } from '../../lib/api';
import { getSession } from '../../lib/auth';
import { toast } from 'sonner@2.0.3';

interface SkillsManagerProps {
  parsedSkills?: Skill[];
}

export function SkillsManager({ parsedSkills }: SkillsManagerProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (parsedSkills && parsedSkills.length > 0) {
      console.log('SkillsManager received parsed skills:', parsedSkills);
      setSkills(parsedSkills);
      setLoading(false);
      toast.success(`${parsedSkills.length} skills auto-filled from resume! Review and click Save.`);
    } else {
      loadSkills();
    }
  }, [parsedSkills]);

  const loadSkills = async () => {
    try {
      const data = await getSkills();
      setSkills(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSkills([...skills, { name: '', level: 50 }]);
  };

  const handleUpdate = (index: number, field: keyof Skill, value: string | number) => {
    const updated = [...skills];
    updated[index] = { ...updated[index], [field]: value };
    setSkills(updated);
  };

  const handleDelete = (index: number) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const session = await getSession();
      if (!session?.access_token) {
        toast.error('Not authenticated');
        return;
      }

      await updateSkills(skills, session.access_token);
      toast.success('Skills updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update skills');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading skills...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white">Manage Skills</h2>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAdd}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg"
          >
            <Plus size={18} />
            Add Skill
          </motion.button>
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
      </div>

      <div className="space-y-4">
        {skills.map((skill, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 rounded-xl border border-emerald-500/20 p-4"
          >
            <div className="grid md:grid-cols-12 gap-4 items-center">
              <div className="md:col-span-5">
                <input
                  type="text"
                  value={skill.name}
                  onChange={(e) => handleUpdate(index, 'name', e.target.value)}
                  placeholder="Skill name"
                  className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
                />
              </div>
              <div className="md:col-span-6">
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={skill.level}
                    onChange={(e) => handleUpdate(index, 'level', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-lime-400 w-12">{skill.level}%</span>
                </div>
              </div>
              <div className="md:col-span-1">
                <button
                  onClick={() => handleDelete(index)}
                  className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
