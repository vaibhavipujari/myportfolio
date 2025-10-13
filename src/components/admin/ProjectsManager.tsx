import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { getProjects, createProject, updateProject, deleteProject, Project } from '../../lib/api';
import { getSession } from '../../lib/auth';
import { toast } from 'sonner@2.0.3';

interface ProjectsManagerProps {
  parsedProjects?: Partial<Project>[];
}

export function ProjectsManager({ parsedProjects }: ProjectsManagerProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    image: '',
    tags: [],
    link: '',
    github: '',
    details: '',
  });

  useEffect(() => {
    if (parsedProjects && parsedProjects.length > 0) {
      console.log('ProjectsManager received parsed projects:', parsedProjects);
      // Convert parsed projects to proper format
      const formattedProjects = parsedProjects.map((p, index) => ({
        id: Date.now() + index, // Temporary ID
        title: p.title || '',
        description: p.description || '',
        image: p.image || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800',
        tags: p.tags || [],
        link: p.link || '#',
        github: p.github || '#',
        details: p.details || p.description || '',
      })) as Project[];
      setProjects(formattedProjects);
      setLoading(false);
      toast.success(`${parsedProjects.length} projects auto-filled from resume! Review and save each one.`);
    } else {
      loadProjects();
    }
  }, [parsedProjects]);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setIsCreating(true);
    setFormData({
      title: '',
      description: '',
      image: '',
      tags: [],
      link: '#',
      github: '#',
      details: '',
    });
  };

  const handleEdit = (project: Project) => {
    setEditingId(project.id);
    setFormData(project);
    setIsCreating(false);
  };

  const handleSave = async () => {
    try {
      const session = await getSession();
      if (!session?.access_token) {
        toast.error('Not authenticated');
        return;
      }

      if (isCreating) {
        await createProject(formData as Omit<Project, 'id'>, session.access_token);
        toast.success('Project created successfully');
      } else if (editingId) {
        await updateProject(editingId, formData, session.access_token);
        toast.success('Project updated successfully');
      }

      await loadProjects();
      setIsCreating(false);
      setEditingId(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save project');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const session = await getSession();
      if (!session?.access_token) {
        toast.error('Not authenticated');
        return;
      }

      await deleteProject(id, session.access_token);
      toast.success('Project deleted successfully');
      await loadProjects();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete project');
    }
  };

  const handleCancel = () => {
    setIsCreating(false);
    setEditingId(null);
  };

  if (loading) {
    return <div className="text-white text-center">Loading projects...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-white">Manage Projects</h2>
        {!isCreating && !editingId && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCreate}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-lime-500 text-white rounded-lg"
          >
            <Plus size={20} />
            Add Project
          </motion.button>
        )}
      </div>

      {(isCreating || editingId) && (
        <div className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 rounded-xl border border-emerald-500/20 p-6">
          <h3 className="text-white mb-4">{isCreating ? 'Create New Project' : 'Edit Project'}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Description</label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Image URL</label>
              <input
                type="text"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Tags (comma separated)</label>
              <input
                type="text"
                value={formData.tags?.join(', ')}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Live Link</label>
              <input
                type="text"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">GitHub Link</label>
              <input
                type="text"
                value={formData.github}
                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
              />
            </div>
            <div>
              <label className="block text-gray-300 mb-2">Details</label>
              <textarea
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                rows={4}
                className="w-full px-4 py-2 bg-black/50 border border-emerald-500/20 rounded-lg text-white"
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-lime-500 text-white rounded-lg"
              >
                <Save size={18} />
                Save
              </button>
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-6 py-2 bg-gray-700 text-white rounded-lg"
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 rounded-xl border border-emerald-500/20 overflow-hidden">
            <img src={project.image} alt={project.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-white mb-2">{project.title}</h3>
              <p className="text-gray-400 mb-4">{project.description}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30"
                >
                  <Edit size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="flex items-center gap-2 px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
