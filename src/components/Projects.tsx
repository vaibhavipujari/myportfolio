import { motion } from 'motion/react';
import { useState, useEffect } from 'react';
import { X, ExternalLink, Github } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { getProjects, Project } from '../lib/api';

export function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="projects" className="min-h-screen w-full bg-gradient-to-b from-black via-emerald-950/10 to-black py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-white mb-4">Featured Projects</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-lime-500 mx-auto" />
        </motion.div>

        {loading ? (
          <div className="text-center text-white">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center text-gray-400">No projects yet. Add some in the admin panel!</div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group cursor-pointer"
              onClick={() => setSelectedProject(project)}
            >
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border border-emerald-500/20 backdrop-blur-sm">
                <div className="aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                <div className="p-6">
                  <h3 className="text-white mb-2 group-hover:text-lime-400 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  
                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Project Modal */}
      <Dialog open={!!selectedProject} onOpenChange={() => setSelectedProject(null)}>
        <DialogContent className="max-w-3xl bg-black/95 border border-emerald-500/20 text-white">
          {selectedProject && (
            <>
              <DialogHeader>
                <DialogTitle className="text-white">{selectedProject.title}</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-64 object-cover rounded-lg"
                />
                
                <p className="text-gray-300">{selectedProject.details}</p>
                
                <div className="flex flex-wrap gap-2">
                  {selectedProject.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <a
                    href={selectedProject.link}
                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-emerald-500 to-lime-500 text-white rounded-full hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
                  >
                    <ExternalLink size={16} />
                    Live Demo
                  </a>
                  <a
                    href={selectedProject.github}
                    className="flex items-center gap-2 px-6 py-2 border border-emerald-500 text-emerald-400 rounded-full hover:bg-emerald-500/10 transition-all"
                  >
                    <Github size={16} />
                    View Code
                  </a>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
