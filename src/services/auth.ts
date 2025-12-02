// super-simple "fake" auth to get the UI working.
// accepted users:
//  - admin@demo.com / password123 (role: admin)
//  - user@demo.com  / password123 (role: user)

import { STORAGE_KEY } from '../constants/auth';

interface User {
  email: string;
  role: string;
  token: string;
  loggedAt: number;
}

function persistUser(user: User, remember: boolean) {
  const data = JSON.stringify(user)
  if (remember) localStorage.setItem(STORAGE_KEY, data)
  else sessionStorage.setItem(STORAGE_KEY, data)
}

export async function login({ email, password, remember }: { email?: string, password?: string, remember?: boolean }): Promise<User> {
  // simulate network delay
  await new Promise((r) => setTimeout(r, 800))

  const directory: { [key: string]: { role: string } } = {
    'admin@demo.com': { role: 'admin' },
    'user@demo.com': { role: 'user' },
  }

  const userEntry = directory[email?.toLowerCase() || '']
  const isValidPassword = typeof password === 'string' && password.length >= 8

  if (userEntry && isValidPassword) {
    const user: User = {
      email: email || '',
      role: userEntry.role,
      token: 'demo-jwt-token',
      loggedAt: Date.now(),
    }
    persistUser(user, remember || false)
    return user
  }
  throw new Error('Invalid email or password')
}

export function logout() {
  localStorage.removeItem(STORAGE_KEY)
  sessionStorage.removeItem(STORAGE_KEY)
}

export function getCurrentUser(): User | null {
  const s = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY)
  return s ? JSON.parse(s) : null
}
