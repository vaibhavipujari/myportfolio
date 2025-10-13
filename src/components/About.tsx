import { motion } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { useWebGLSupport } from './useWebGLSupport';
import { getProfile, Profile } from '../lib/api';
import { ThreeCanvas, useFrame, Box, PerspectiveCamera } from './ThreeWrapper';

function RotatingCube() {
  const meshRef = useRef<any>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      
      if (hovered) {
        meshRef.current.rotation.y += 0.03;
      }
    }
  });

  return (
    <Box
      ref={meshRef}
      args={[2, 2, 2]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={hovered ? '#84cc16' : '#10b981'}
        wireframe
        emissive={hovered ? '#84cc16' : '#10b981'}
        emissiveIntensity={0.5}
      />
    </Box>
  );
}

export function About() {
  const webGLSupported = useWebGLSupport();
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      setProfile(data);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const fallback3D = (
    <div className="w-full h-full flex items-center justify-center relative overflow-hidden">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="w-48 h-48 border-4 border-emerald-500/30 rounded-lg"
        style={{ borderStyle: 'dashed' }}
      />
    </div>
  );

  return (
    <section id="about" className="min-h-screen w-full bg-black py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-white mb-4">About Me</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-lime-500 mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* 3D Model */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="h-[400px] rounded-xl overflow-hidden bg-gradient-to-br from-emerald-950/30 to-teal-950/30 backdrop-blur-sm border border-emerald-500/20"
          >
            {!webGLSupported ? (
              fallback3D
            ) : (
              <ThreeCanvas>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                <ambientLight intensity={0.5} />
                <pointLight position={[10, 10, 10]} intensity={1} />
                <pointLight position={[-10, -10, -10]} color="#84cc16" intensity={0.5} />
                <RotatingCube />
              </ThreeCanvas>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <p className="text-gray-300">
              {profile?.bio || "I'm a passionate developer with expertise in creating immersive web experiences. My work combines cutting-edge technologies with creative design to build applications that are both beautiful and functional."}
            </p>
            
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="p-4 bg-emerald-950/30 rounded-lg border border-emerald-500/20">
                <div className="text-lime-400 mb-2">{profile?.stats?.experience || '5+'}</div>
                <p className="text-gray-400">Years Experience</p>
              </div>
              <div className="p-4 bg-emerald-950/30 rounded-lg border border-emerald-500/20">
                <div className="text-lime-400 mb-2">{profile?.stats?.projects || '50+'}</div>
                <p className="text-gray-400">Projects Completed</p>
              </div>
              <div className="p-4 bg-emerald-950/30 rounded-lg border border-emerald-500/20">
                <div className="text-lime-400 mb-2">{profile?.stats?.clients || '30+'}</div>
                <p className="text-gray-400">Happy Clients</p>
              </div>
              <div className="p-4 bg-emerald-950/30 rounded-lg border border-emerald-500/20">
                <div className="text-lime-400 mb-2">{profile?.stats?.awards || '15+'}</div>
                <p className="text-gray-400">Awards Won</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
