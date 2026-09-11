import { UserProfile } from '../types';

export const DEMO_USERS: UserProfile[] = [
  {
    id: 'u1000000-0000-0000-0000-000000000001',
    name: 'Ramesh Kumar',
    email: 'ramesh.kumar@example.com',
    phone: '+91 98480 12345',
    role: 'citizen',
    designation: 'Citizen Resident (Ward 92 Banjara Hills)',
    wardNo: 'Ward 92',
    language: 'en',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'u1000000-0000-0000-0000-000000000002',
    name: 'Sunita Rao',
    email: 'sunita.rao@example.com',
    phone: '+91 94401 56789',
    role: 'citizen',
    designation: 'Citizen Resident (Ward 105 Madhapur)',
    wardNo: 'Ward 105',
    language: 'te',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'u2000000-0000-0000-0000-000000000001',
    name: 'Rajesh Patel',
    email: 'rajesh.patel@municipality.gov.in',
    phone: '+91 98765 43210',
    role: 'officer',
    departmentId: 'd1000000-0000-0000-0000-000000000001',
    departmentName: 'Sanitation & Solid Waste Management',
    designation: 'Senior Sanitation Inspector (Ward 105)',
    employeeCode: 'GHMC-SAN-402',
    language: 'en',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'u2000000-0000-0000-0000-000000000002',
    name: 'Er. Vikram Sharma',
    email: 'vikram.sharma@municipality.gov.in',
    phone: '+91 98765 43211',
    role: 'officer',
    departmentId: 'd1000000-0000-0000-0000-000000000004',
    departmentName: 'Electrical & Street Lighting',
    designation: 'Assistant Electrical Engineer',
    employeeCode: 'BBMP-ELE-108',
    language: 'hi',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'u3000000-0000-0000-0000-000000000001',
    name: 'Dr. A. K. Verma, IAS',
    email: 'commissioner@municipality.gov.in',
    phone: '+91 99999 88888',
    role: 'admin',
    designation: 'Zonal Additional Commissioner',
    employeeCode: 'ADMIN-IAS-001',
    language: 'en',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'
  }
];

const AUTH_STORAGE_KEY = 'nagarsetu_current_user';

export function getStoredUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading user from storage', e);
  }
  // Default to Ramesh Kumar (Citizen)
  return DEMO_USERS[0];
}

export function setStoredUser(user: UserProfile | null): void {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.error('Error saving user to storage', e);
  }
}
