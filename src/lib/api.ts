import { projectId, publicAnonKey } from '../utils/supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-9576ae76`;

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
  github: string;
  details: string;
}

export interface Profile {
  name: string;
  role: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  socialLinks: {
    github: string;
    linkedin: string;
    twitter: string;
  };
  stats: {
    experience: string;
    projects: string;
    clients: string;
    awards: string;
  };
}

export interface Skill {
  name: string;
  level: number;
}

// Auth functions
export async function signUp(email: string, password: string, name: string) {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    },
    body: JSON.stringify({ email, password, name }),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Signup failed');
  }
  
  return response.json();
}

// Profile functions
export async function getProfile(): Promise<Profile> {
  const response = await fetch(`${API_URL}/profile`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }
  
  return response.json();
}

export async function updateProfile(profile: Profile, accessToken: string) {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(profile),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update profile');
  }
  
  return response.json();
}

// Project functions
export async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${API_URL}/projects`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }
  
  return response.json();
}

export async function createProject(project: Omit<Project, 'id'>, accessToken: string) {
  const response = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(project),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create project');
  }
  
  return response.json();
}

export async function updateProject(id: number, project: Partial<Project>, accessToken: string) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(project),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update project');
  }
  
  return response.json();
}

export async function deleteProject(id: number, accessToken: string) {
  const response = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to delete project');
  }
  
  return response.json();
}

// Resume functions
export async function uploadResume(file: File, accessToken: string) {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await fetch(`${API_URL}/resume/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
    },
    body: formData,
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to upload resume');
  }
  
  return response.json();
}

export async function getResumeUrl(): Promise<string> {
  const response = await fetch(`${API_URL}/resume`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });
  
  if (!response.ok) {
    if (response.status === 404) {
      return '';
    }
    throw new Error('Failed to get resume URL');
  }
  
  const data = await response.json();
  return data.url;
}

// Skills functions
export async function getSkills(): Promise<Skill[]> {
  const response = await fetch(`${API_URL}/skills`, {
    headers: {
      'Authorization': `Bearer ${publicAnonKey}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch skills');
  }
  
  return response.json();
}

export async function updateSkills(skills: Skill[], accessToken: string) {
  const response = await fetch(`${API_URL}/skills`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(skills),
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update skills');
  }
  
  return response.json();
}
