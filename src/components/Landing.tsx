import { motion } from 'motion/react';
import { useRef, useEffect, useState } from 'react';
import { useWebGLSupport } from './useWebGLSupport';
import { getProfile, getResumeUrl, Profile } from '../lib/api';
import { toast } from 'sonner@2.0.3';
import { 
  ThreeCanvas, 
  useFrame, 
  OrbitControls, 
  PerspectiveCamera, 
  MeshDistortMaterial, 
  Sphere 
} from './ThreeWrapper';

function AnimatedSphere() {
  const meshRef = useRef<any>(null);
  const groupRef = useRef<any>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.2;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={2.5}>
        <MeshDistortMaterial
          color="#10b981"
          attach="material"
          distort={0.5}
          speed={2}
          roughness={0.2}
          metalness={0.8}
        />
      </Sphere>
      <pointLight position={[10, 10, 10]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} color="#84cc16" intensity={1} />
    </group>
  );
}

export function Landing() {
  const webGLSupported = useWebGLSupport();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [resumeLoading, setResumeLoading] = useState(false);

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

  const handleDownloadResume = async () => {
    setResumeLoading(true);
    try {
      const url = await getResumeUrl();
      if (url) {
        window.open(url, '_blank');
        toast.success('Opening resume...');
      } else {
        toast.error('No resume available. Please upload one in the admin panel.');
      }
    } catch (error: any) {
      console.error('Resume download error:', error);
      toast.error('Failed to download resume. Please try again.');
    } finally {
      setResumeLoading(false);
    }
  };

  const textVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.8,
        ease: 'easeOut',
      },
    }),
  };

  const fallbackBackground = (
    <div className="w-full h-full bg-gradient-to-br from-emerald-500/20 via-transparent to-lime-500/20">
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          className="w-96 h-96 rounded-full bg-gradient-to-br from-emerald-500/30 to-lime-500/30 blur-3xl"
        />
      </div>
    </div>
  );

  return (
    <section id="home" className="relative h-screen w-full bg-gradient-to-b from-black via-emerald-950/20 to-black overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0">
        {!webGLSupported ? (
          fallbackBackground
        ) : (
          <ThreeCanvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <ambientLight intensity={0.5} />
            <AnimatedSphere />
            <OrbitControls enableZoom={false} enablePan={false} />
          </ThreeCanvas>
        )}
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center justify-center px-4">
        <div className="text-center">
          <motion.div
            custom={0}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="mb-4"
          >
            <span className="text-lime-400 tracking-widest">WELCOME TO MY PORTFOLIO</span>
          </motion.div>
          
          <motion.h1
            custom={1}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-white mb-4"
          >
            Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-400">{profile?.name || 'Your Name'}</span>
          </motion.h1>
          
          <motion.p
            custom={2}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="text-gray-400 max-w-2xl mx-auto mb-8"
          >
            {profile?.role || 'Creative Developer & 3D Artist'}
          </motion.p>

          <motion.div
            custom={3}
            initial="hidden"
            animate="visible"
            variants={textVariants}
            className="flex gap-4 justify-center flex-wrap"
          >
            <a
              href="#projects"
              className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-lime-500 text-white rounded-full hover:shadow-lg hover:shadow-emerald-500/50 transition-all duration-300"
            >
              View Work
            </a>
            <button
              onClick={handleDownloadResume}
              disabled={resumeLoading}
              className="px-8 py-3 border border-teal-500 text-teal-400 rounded-full hover:bg-teal-500/10 transition-all duration-300 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {resumeLoading ? 'Loading...' : 'Resume'}
            </button>
            <a
              href="#contact"
              className="px-8 py-3 border border-emerald-500 text-emerald-400 rounded-full hover:bg-emerald-500/10 transition-all duration-300"
            >
              Contact
            </a>
            <a
              href="/admin"
              onClick={(e) => {
                e.preventDefault();
                window.history.pushState({}, '', '/admin');
                window.dispatchEvent(new PopStateEvent('popstate'));
              }}
              className="px-8 py-3 border border-lime-500 text-lime-400 rounded-full hover:bg-lime-500/10 transition-all duration-300 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Admin
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-emerald-400 rounded-full flex justify-center p-2"
        >
          <motion.div className="w-1 h-3 bg-emerald-400 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
