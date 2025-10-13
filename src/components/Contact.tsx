import { motion } from 'motion/react';
import { useState, useRef, useMemo, useEffect } from 'react';
import { Mail, MapPin, Phone, Github, Linkedin, Twitter } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useWebGLSupport } from './useWebGLSupport';
import { getProfile, Profile } from '../lib/api';
import { ThreeCanvas, useFrame, PerspectiveCamera, Points } from './ThreeWrapper';

function StarField() {
  const pointsRef = useRef<any>(null);
  
  const positions = useMemo(() => {
    const count = 2000;
    const positions = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    
    return positions;
  }, []);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.05;
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.075;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <pointsMaterial
        size={0.02}
        color="#10b981"
        sizeAttenuation={true}
        transparent={true}
        opacity={0.8}
        depthWrite={false}
      />
    </Points>
  );
}

export function Contact() {
  const webGLSupported = useWebGLSupport();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent successfully! I\'ll get back to you soon.');
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const socialLinks = [
    { icon: Github, href: profile?.socialLinks.github || '#', label: 'GitHub' },
    { icon: Linkedin, href: profile?.socialLinks.linkedin || '#', label: 'LinkedIn' },
    { icon: Twitter, href: profile?.socialLinks.twitter || '#', label: 'Twitter' },
  ];

  const starsFallback = (
    <div className="w-full h-full relative overflow-hidden">
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-emerald-400 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            opacity: [0.2, 0.8, 0.2],
            scale: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );

  return (
    <section id="contact" className="relative min-h-screen w-full bg-gradient-to-b from-black via-emerald-950/10 to-black py-20 px-4 overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 opacity-30">
        {!webGLSupported ? (
          starsFallback
        ) : (
          <ThreeCanvas>
            <PerspectiveCamera makeDefault position={[0, 0, 5]} />
            <StarField />
          </ThreeCanvas>
        )}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-white mb-4">Get In Touch</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-emerald-500 to-lime-500 mx-auto mb-4" />
          <p className="text-gray-400 max-w-2xl mx-auto">
            Have a project in mind? Let's work together to create something amazing.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-white mb-6">Contact Information</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 bg-emerald-950/30 rounded-lg border border-emerald-500/20 backdrop-blur-sm">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Mail className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-400">Email</p>
                    <p className="text-white">{profile?.email || 'hello@example.com'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-emerald-950/30 rounded-lg border border-emerald-500/20 backdrop-blur-sm">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <Phone className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-400">Phone</p>
                    <p className="text-white">{profile?.phone || '+1 (555) 123-4567'}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 bg-emerald-950/30 rounded-lg border border-emerald-500/20 backdrop-blur-sm">
                  <div className="p-2 bg-emerald-500/20 rounded-lg">
                    <MapPin className="text-emerald-400" size={20} />
                  </div>
                  <div>
                    <p className="text-gray-400">Location</p>
                    <p className="text-white">{profile?.location || 'San Francisco, CA'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-white mb-4">Follow Me</h3>
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.label}
                      href={social.href}
                      whileHover={{ scale: 1.1, y: -5 }}
                      className="p-3 bg-emerald-950/30 rounded-lg border border-emerald-500/20 hover:border-emerald-500/50 transition-colors backdrop-blur-sm"
                      aria-label={social.label}
                    >
                      <Icon className="text-emerald-400" size={24} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="p-8 bg-gradient-to-br from-emerald-950/50 to-teal-950/50 rounded-xl border border-emerald-500/20 backdrop-blur-sm"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-emerald-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-gray-300 mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-black/50 border border-emerald-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-gray-300 mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 bg-black/50 border border-emerald-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50 transition-colors resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-8 py-3 bg-gradient-to-r from-emerald-500 to-lime-500 text-white rounded-lg hover:shadow-lg hover:shadow-emerald-500/50 transition-all"
              >
                Send Message
              </motion.button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
