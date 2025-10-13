import { motion } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { Code2, Palette, Database, Layout, Smartphone, Zap } from 'lucide-react';
import { useWebGLSupport } from './useWebGLSupport';
import { getSkills, Skill } from '../lib/api';
import { ThreeCanvas, useFrame, PerspectiveCamera, Sphere } from './ThreeWrapper';

interface SkillWithIcon extends Skill {
  icon: typeof Code2;
}

function FloatingSphere({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = position[1] + Math.sin(state.clock.getElapsedTime() + position[0]) * 0.3;
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
    }
  });

  return (
    <Sphere ref={meshRef} position={position} args={[0.2, 16, 16]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
    </Sphere>
  );
}

function TechCloud() {
  const count = 6;
  
  return (
    <group>
      {Array.from({ length: count }).map((_, index) => {
        const angle = (index / count) * Math.PI * 2;
        const radius = 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const color = index % 2 === 0 ? '#10b981' : '#84cc16';
        return <FloatingSphere key={index} position={[x, 0, z]} color={color} />;
      })}
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#10b981" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#84cc16" />
    </group>
  );
}

export function TechStack() {
  const webGLSupported = useWebGLSupport();
  const [skills, setSkills] = useState<SkillWithIcon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSkills();
  }, []);

  const loadSkills = async () => {
    try {
      const data = await getSkills();
      // Add icons to skills
      const icons = [Code2, Palette, Database, Layout, Smartphone, Zap];
      const skillsWithIcons: SkillWithIcon[] = data.map((skill, index) => ({
        ...skill,
        icon: icons[index % icons.length],
      }));
      setSkills(skillsWithIcons);
    } catch (error) {
      console.error('Failed to load skills:', error);
    } finally {
      setLoading(false);
    }
  };

  const techFallback = (
    <div className="w-full h-full flex items-center justify-center p-8">
      <div className="grid grid-cols-3 gap-6">
        {['React', 'Three.js', 'TypeScript', 'Node.js', 'Tailwind', 'WebGL'].map((tech, index) => (
          <motion.div
            key={tech}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
              className="px-4 py-2 bg-emerald-500/20 rounded-lg border border-emerald-500/30 text-center"
            >
              <p className="text-emerald-300">{tech}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  return (
    <section id="skills" className="min-h-screen w-full bg-black py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-white mb-4">Tech Stack</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-lime-500 mx-auto" />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* 3D Visualization */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-[500px] rounded-xl overflow-hidden bg-gradient-to-br from-emerald-950/30 to-teal-950/30 backdrop-blur-sm border border-emerald-500/20"
          >
            {!webGLSupported ? (
              techFallback
            ) : (
              <ThreeCanvas>
                <PerspectiveCamera makeDefault position={[0, 0, 8]} />
                <TechCloud />
              </ThreeCanvas>
            )}
          </motion.div>

          {/* Skills List */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {loading ? (
              <div className="text-white text-center">Loading skills...</div>
            ) : (
              skills.map((skill, index) => {
              const Icon = skill.icon;
              return (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Icon className="text-emerald-400" size={20} />
                      </div>
                      <span className="text-white">{skill.name}</span>
                    </div>
                    <span className="text-lime-400">{skill.level}%</span>
                  </div>
                  
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-gradient-to-r from-emerald-500 to-lime-500 rounded-full"
                    />
                  </div>
                </motion.div>
              );
              })
            )}
          </motion.div>
        </div>

        {/* Additional Technologies */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
        >
          {['React', 'TypeScript', 'Three.js', 'Next.js', 'Tailwind', 'Node.js'].map((tech, index) => (
            <motion.div
              key={tech}
              whileHover={{ scale: 1.05, y: -5 }}
              className="p-6 bg-gradient-to-br from-emerald-950/50 to-teal-950/50 border border-emerald-500/20 rounded-xl text-center backdrop-blur-sm"
            >
              <Zap className="text-lime-400 mx-auto mb-2" size={32} />
              <p className="text-gray-300">{tech}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
