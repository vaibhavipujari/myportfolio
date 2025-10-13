import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Upload, FileText, Download } from 'lucide-react';
import { uploadResume, getResumeUrl } from '../../lib/api';
import { getSession } from '../../lib/auth';
import { toast } from 'sonner@2.0.3';

export function ResumeManager() {
  const [resumeUrl, setResumeUrl] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      const url = await getResumeUrl();
      setResumeUrl(url);
    } catch (error: any) {
      console.log('No resume found');
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const session = await getSession();
      if (!session?.access_token) {
        toast.error('Not authenticated');
        return;
      }

      await uploadResume(file, session.access_token);
      toast.success('Resume uploaded successfully');
      await loadResume();
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload resume');
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return <div className="text-white text-center">Loading resume...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-white">Manage Resume</h2>

      <div className="bg-gradient-to-br from-emerald-950/50 to-teal-950/50 rounded-xl border border-emerald-500/20 p-6">
        <div className="space-y-6">
          {resumeUrl && (
            <div className="flex items-center justify-between p-4 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <div className="flex items-center gap-3">
                <FileText className="text-emerald-400" size={24} />
                <div>
                  <p className="text-white">Current Resume</p>
                  <p className="text-gray-400">PDF uploaded</p>
                </div>
              </div>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30"
              >
                <Download size={18} />
                Download
              </a>
            </div>
          )}

          <div>
            <label htmlFor="resume-upload" className="block mb-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="cursor-pointer border-2 border-dashed border-emerald-500/30 rounded-lg p-8 text-center hover:border-emerald-500/50 transition-colors"
              >
                <Upload className="text-emerald-400 mx-auto mb-4" size={48} />
                <p className="text-white mb-2">
                  {uploading ? 'Uploading...' : 'Click to upload resume'}
                </p>
                <p className="text-gray-400">PDF format, max 5MB</p>
              </motion.div>
            </label>
            <input
              id="resume-upload"
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
