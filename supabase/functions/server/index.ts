import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.ts';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Default admin credentials
const DEFAULT_ADMIN = {
  email: 'vihaa22030@admin.com',
  password: 'vihaa22030',
  name: 'Admin User'
};

// Initialize default admin account on server start
async function initializeDefaultAdmin() {
  try {
    console.log('🔍 Checking for default admin account...');

    // Check if admin already exists
    const { data: users, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Error listing users:', listError);
      return;
    }

    // Check if default admin exists
    const defaultAdminExists = users?.users.some(user => user.email === DEFAULT_ADMIN.email);

    if (defaultAdminExists) {
      console.log('✅ Default admin account already exists');
      return;
    }

    // If no users exist or default admin doesn't exist, create it
    if (!users || users.users.length === 0 || !defaultAdminExists) {
      console.log('📝 Creating default admin account...');

      const { data, error } = await supabase.auth.admin.createUser({
        email: DEFAULT_ADMIN.email,
        password: DEFAULT_ADMIN.password,
        email_confirm: true,
        user_metadata: {
          name: DEFAULT_ADMIN.name
        }
      });

      if (error) {
        console.error('❌ Error creating default admin:', error);
      } else {
        console.log('✅ Default admin account created successfully!');
        console.log('   📧 Email:', DEFAULT_ADMIN.email);
        console.log('   🔑 Password:', DEFAULT_ADMIN.password);
        console.log('   ⚠️  Please change these credentials after first login!');
      }
    } else {
      console.log(`ℹ️  Found ${users.users.length} existing user(s). Default admin not needed.`);
    }
  } catch (error) {
    console.error('❌ Error in initializeDefaultAdmin:', error);
  }
}

// Initialize on server start
initializeDefaultAdmin();

// Create storage bucket on startup
const bucketName = 'make-9576ae76-resumes';
const { data: buckets } = await supabase.storage.listBuckets();
const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
if (!bucketExists) {
  await supabase.storage.createBucket(bucketName, { public: false });
  console.log('Created resume bucket');
}

// Auth middleware
async function requireAuth(c: any, next: any) {
  const accessToken = c.req.header('Authorization')?.split(' ')[1];
  if (!accessToken) {
    return c.json({ error: 'Unauthorized - No token provided' }, 401);
  }

  const { data: { user }, error } = await supabase.auth.getUser(accessToken);
  if (error || !user?.id) {
    return c.json({ error: 'Unauthorized - Invalid token' }, 401);
  }

  c.set('userId', user.id);
  await next();
}

// Sign up route
app.post('/make-server-9576ae76/auth/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: 'Password must be at least 6 characters' }, 400);
    }

    // Check if user already exists
    const { data: existingUsers } = await supabase.auth.admin.listUsers();
    const userExists = existingUsers?.users.some(user => user.email === email);

    if (userExists) {
      return c.json({ error: 'User with this email already exists' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true, // Auto-confirm since no email server configured
    });

    if (error) {
      console.error('Signup error:', error);
      return c.json({ error: error.message }, 400);
    }

    console.log('✅ User created successfully:', data.user.email);
    return c.json({ user: data.user });
  } catch (error) {
    console.error('Signup exception:', error);
    return c.json({ error: 'Signup failed' }, 500);
  }
});

// Get profile
app.get('/make-server-9576ae76/profile', async (c) => {
  try {
    const profile = await kv.get('portfolio_profile');
    return c.json(profile || {
      name: 'Your Name',
      role: 'Creative Developer & 3D Artist',
      bio: 'I\'m a passionate developer with expertise in creating immersive web experiences.',
      email: 'hello@example.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      socialLinks: {
        github: '#',
        linkedin: '#',
        twitter: '#',
      },
      stats: {
        experience: '5+',
        projects: '50+',
        clients: '30+',
        awards: '15+',
      },
    });
  } catch (error) {
    console.error('Get profile error:', error);
    return c.json({ error: 'Failed to fetch profile' }, 500);
  }
});

// Update profile (protected)
app.put('/make-server-9576ae76/profile', requireAuth, async (c) => {
  try {
    const profile = await c.req.json();
    await kv.set('portfolio_profile', profile);
    return c.json({ success: true, profile });
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: 'Failed to update profile' }, 500);
  }
});

// Get all projects
app.get('/make-server-9576ae76/projects', async (c) => {
  try {
    const projects = await kv.get('portfolio_projects');
    return c.json(projects || []);
  } catch (error) {
    console.error('Get projects error:', error);
    return c.json({ error: 'Failed to fetch projects' }, 500);
  }
});

// Create project (protected)
app.post('/make-server-9576ae76/projects', requireAuth, async (c) => {
  try {
    const newProject = await c.req.json();
    const projects = await kv.get('portfolio_projects') || [];

    newProject.id = Date.now();
    projects.push(newProject);

    await kv.set('portfolio_projects', projects);
    return c.json({ success: true, project: newProject });
  } catch (error) {
    console.error('Create project error:', error);
    return c.json({ error: 'Failed to create project' }, 500);
  }
});

// Update project (protected)
app.put('/make-server-9576ae76/projects/:id', requireAuth, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const updatedProject = await c.req.json();
    const projects = await kv.get('portfolio_projects') || [];

    const index = projects.findIndex((p: any) => p.id === id);
    if (index === -1) {
      return c.json({ error: 'Project not found' }, 404);
    }

    projects[index] = { ...projects[index], ...updatedProject, id };
    await kv.set('portfolio_projects', projects);

    return c.json({ success: true, project: projects[index] });
  } catch (error) {
    console.error('Update project error:', error);
    return c.json({ error: 'Failed to update project' }, 500);
  }
});

// Delete project (protected)
app.delete('/make-server-9576ae76/projects/:id', requireAuth, async (c) => {
  try {
    const id = parseInt(c.req.param('id'));
    const projects = await kv.get('portfolio_projects') || [];

    const filtered = projects.filter((p: any) => p.id !== id);
    await kv.set('portfolio_projects', filtered);

    return c.json({ success: true });
  } catch (error) {
    console.error('Delete project error:', error);
    return c.json({ error: 'Failed to delete project' }, 500);
  }
});

// Upload resume (protected)
app.post('/make-server-9576ae76/resume/upload', requireAuth, async (c) => {
  try {
    const formData = await c.req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return c.json({ error: 'No file provided' }, 400);
    }

    const fileBuffer = await file.arrayBuffer();
    const fileName = `resume-${Date.now()}.pdf`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (error) {
      console.error('Upload error:', error);
      return c.json({ error: 'Failed to upload resume' }, 500);
    }

    // Store the filename in KV
    await kv.set('portfolio_resume', fileName);

    return c.json({ success: true, fileName });
  } catch (error) {
    console.error('Resume upload error:', error);
    return c.json({ error: 'Failed to upload resume' }, 500);
  }
});

// Get resume URL
app.get('/make-server-9576ae76/resume', async (c) => {
  try {
    const fileName = await kv.get('portfolio_resume');

    if (!fileName) {
      return c.json({ error: 'No resume found' }, 404);
    }

    const { data, error } = await supabase.storage
      .from(bucketName)
      .createSignedUrl(fileName, 3600); // 1 hour expiry

    if (error) {
      console.error('Get resume URL error:', error);
      return c.json({ error: 'Failed to get resume URL' }, 500);
    }

    return c.json({ url: data.signedUrl });
  } catch (error) {
    console.error('Get resume error:', error);
    return c.json({ error: 'Failed to get resume' }, 500);
  }
});

// Get skills
app.get('/make-server-9576ae76/skills', async (c) => {
  try {
    const skills = await kv.get('portfolio_skills');
    return c.json(skills || [
      { name: 'React & Next.js', level: 95 },
      { name: 'Three.js & WebGL', level: 90 },
      { name: 'TypeScript', level: 88 },
      { name: 'Tailwind CSS', level: 92 },
      { name: 'Node.js', level: 85 },
      { name: 'Responsive Design', level: 93 },
    ]);
  } catch (error) {
    console.error('Get skills error:', error);
    return c.json({ error: 'Failed to fetch skills' }, 500);
  }
});

// Update skills (protected)
app.put('/make-server-9576ae76/skills', requireAuth, async (c) => {
  try {
    const skills = await c.req.json();
    await kv.set('portfolio_skills', skills);
    return c.json({ success: true, skills });
  } catch (error) {
    console.error('Update skills error:', error);
    return c.json({ error: 'Failed to update skills' }, 500);
  }
});

Deno.serve(app.fetch);
