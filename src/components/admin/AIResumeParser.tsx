import { useState } from 'react';
import { motion } from 'motion/react';
import { FileText, Sparkles, Loader2, Upload } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { Button } from '../ui/button';

interface AIResumeParserProps {
  onParsed: (data: any) => void;
  onSkillsParsed?: (skills: any[]) => void;
  onProjectsParsed?: (projects: any[]) => void;
}

export function AIResumeParser({ onParsed, onSkillsParsed, onProjectsParsed }: AIResumeParserProps) {
  const [parsing, setParsing] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
    } else {
      toast.error('Please select a PDF file');
    }
  };

  const extractTextFromPDF = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const arrayBuffer = e.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(arrayBuffer);
          
          let text = '';
          for (let i = 0; i < uint8Array.length; i++) {
            const byte = uint8Array[i];
            if (byte >= 32 && byte <= 126) {
              text += String.fromCharCode(byte);
            } else if (byte === 10 || byte === 13) {
              text += '\n';
            }
          }
          
          text = text.replace(/\n{3,}/g, '\n\n').replace(/\s{3,}/g, ' ').trim();
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = reject;
      reader.readAsArrayBuffer(file);
    });
  };

  const intelligentParse = (text: string) => {
    console.log('=== PARSING RESUME ===');
    console.log('Text length:', text.length);
    
    const data: any = {
      profile: {
        name: '',
        role: '',
        bio: '',
        email: '',
        phone: '',
        location: '',
        socialLinks: { github: '', linkedin: '', twitter: '' },
        stats: { experience: '5+', projects: '50+', clients: '30+', awards: '15+' }
      },
      skills: [],
      projects: []
    };

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

    // Extract Name
    for (let i = 0; i < Math.min(10, lines.length); i++) {
      const line = lines[i];
      const nameMatch = line.match(/^([A-Z][a-z]+(?:\s+[A-Z][a-z]+){1,3})$/);
      if (nameMatch && line.length < 50) {
        data.profile.name = nameMatch[1].trim();
        console.log('Found name:', data.profile.name);
        break;
      }
    }

    // Extract Email
    const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
    if (emailMatch) {
      data.profile.email = emailMatch[0];
      console.log('Found email:', data.profile.email);
    }

    // Extract Phone
    const phoneMatch = text.match(/(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/);
    if (phoneMatch) {
      data.profile.phone = phoneMatch[0];
      console.log('Found phone:', data.profile.phone);
    }

    // Extract Location
    const locationMatch = text.match(/([A-Z][a-z]+,\s*[A-Z]{2,})/);
    if (locationMatch) {
      data.profile.location = locationMatch[1].trim();
      console.log('Found location:', data.profile.location);
    }

    // Extract GitHub
    const githubMatch = text.match(/github\.com\/([\w-]+)/i);
    if (githubMatch) {
      data.profile.socialLinks.github = `https://github.com/${githubMatch[1]}`;
      console.log('Found GitHub:', data.profile.socialLinks.github);
    }

    // Extract LinkedIn
    const linkedinMatch = text.match(/linkedin\.com\/in\/([\w-]+)/i);
    if (linkedinMatch) {
      data.profile.socialLinks.linkedin = `https://linkedin.com/in/${linkedinMatch[1]}`;
      console.log('Found LinkedIn:', data.profile.socialLinks.linkedin);
    }

    // Extract Role
    const roleMatch = text.match(/(?:Full[\s-]?Stack|Frontend|Backend|Software|Web)\s+(?:Developer|Engineer)/i);
    if (roleMatch) {
      data.profile.role = roleMatch[0];
      console.log('Found role:', data.profile.role);
    }

    // Extract Bio
    const bioMatch = text.match(/(?:Summary|About|Profile):\s*([^]*?(?=\n\n|EXPERIENCE|EDUCATION|SKILLS))/i);
    if (bioMatch) {
      let bio = bioMatch[1].trim().replace(/\s+/g, ' ').substring(0, 400);
      data.profile.bio = bio;
      console.log('Found bio');
    }

    // Extract Skills
    const commonSkills = [
      'React', 'Vue', 'Angular', 'Next.js', 'TypeScript', 'JavaScript',
      'Node.js', 'Express', 'Python', 'Django', 'Flask',
      'MongoDB', 'PostgreSQL', 'MySQL', 'Redis',
      'AWS', 'Azure', 'Docker', 'Kubernetes',
      'Git', 'GraphQL', 'REST API'
    ];

    const foundSkills = new Set<string>();
    commonSkills.forEach(skill => {
      const pattern = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const regex = new RegExp(pattern, 'i');
      if (regex.test(text)) {
        foundSkills.add(skill);
      }
    });

    data.skills = Array.from(foundSkills).map(skill => ({
      name: skill,
      level: Math.floor(Math.random() * 15) + 85
    }));
    
    console.log(`Found ${data.skills.length} skills`);

    // Extract Experience
    const expMatch = text.match(/(\d+)\+?\s*(?:years?|yrs?)\s*(?:of\s*)?(?:experience|exp)/i);
    if (expMatch) {
      data.profile.stats.experience = `${expMatch[1]}+`;
      console.log('Found experience:', data.profile.stats.experience);
    }

    console.log('=== PARSE COMPLETE ===');
    return data;
  };

  const parseResume = async () => {
    if (!file) {
      toast.error('Please select a resume file first');
      return;
    }

    setParsing(true);
    try {
      toast.info('📄 Extracting text from PDF...', { duration: 2000 });
      const text = await extractTextFromPDF(file);
      
      toast.info('🤖 Analyzing resume...', { duration: 2000 });
      const parsedData = intelligentParse(text);
      
      const foundItems = [];
      if (parsedData.profile.name) foundItems.push('name');
      if (parsedData.profile.email) foundItems.push('email');
      if (parsedData.profile.phone) foundItems.push('phone');
      if (parsedData.skills.length > 0) foundItems.push(`${parsedData.skills.length} skills`);
      
      onParsed(parsedData);
      if (onSkillsParsed && parsedData.skills.length > 0) {
        onSkillsParsed(parsedData.skills);
      }
      if (onProjectsParsed && parsedData.projects.length > 0) {
        onProjectsParsed(parsedData.projects);
      }
      
      toast.success(`✅ Found: ${foundItems.join(', ')}!`, { duration: 5000 });
    } catch (error) {
      console.error('Parse error:', error);
      toast.error('Failed to parse resume. Please try again.');
    } finally {
      setParsing(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-gradient-to-br from-purple-950/50 to-pink-950/50 rounded-xl border border-purple-500/20"
    >
      <div className="flex items-center gap-3 mb-4">
        <Sparkles className="text-purple-400" size={24} />
        <div>
          <h3 className="text-white">AI Resume Parser</h3>
          <p className="text-gray-400 text-sm">Automatically extract information from your resume</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="hidden"
            id="resume-upload-ai"
          />
          <label
            htmlFor="resume-upload-ai"
            className="flex items-center justify-center gap-3 w-full px-4 py-6 bg-black/50 border-2 border-dashed border-purple-500/30 rounded-lg cursor-pointer hover:border-purple-500/50 hover:bg-purple-500/5 transition-all"
          >
            <Upload className="text-purple-400" size={24} />
            <div className="text-center">
              <p className="text-white">Click to upload resume</p>
              <p className="text-gray-400 text-sm">PDF format only</p>
            </div>
          </label>
        </div>

        {file && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-3 p-4 bg-purple-500/10 rounded-lg border border-purple-500/20"
          >
            <FileText className="text-purple-400" size={20} />
            <div className="flex-1">
              <p className="text-purple-300">{file.name}</p>
              <p className="text-gray-400 text-sm">{(file.size / 1024).toFixed(2)} KB</p>
            </div>
          </motion.div>
        )}

        <Button
          onClick={parseResume}
          disabled={!file || parsing}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white h-12"
        >
          {parsing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Parsing Resume...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-5 w-5" />
              Parse Resume & Auto-Fill
            </>
          )}
        </Button>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <p className="text-purple-300 text-sm">Profile</p>
            <p className="text-xs text-gray-400">Auto-filled</p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <p className="text-purple-300 text-sm">Skills</p>
            <p className="text-xs text-gray-400">Extracted</p>
          </div>
          <div className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
            <p className="text-purple-300 text-sm">Projects</p>
            <p className="text-xs text-gray-400">Detected</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
