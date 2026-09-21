import { UserProfile } from '../types';
import { CURRENT_USER } from '../data/mockData';

export interface PasswordValidationResult {
  hasMinLength: boolean;
  hasCapital: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isStrong: boolean;
  score: number; // 0 to 4
}

export interface StoredAccount {
  email: string;
  passwordHash: string; // Plain/stored password in this client prototype
  profile: UserProfile;
  createdAt: string;
  updatedAt: string;
}

export interface OtpRecord {
  email: string;
  otp: string;
  expiresAt: number; // timestamp in ms
  createdAt: number;
}

const ACCOUNTS_STORAGE_KEY = 'verifyx_auth_accounts_v1';
const OTP_STORAGE_KEY = 'verifyx_auth_otp_active_v1';

// Initial default accounts seeded for testing & seamless demo access
const DEFAULT_ACCOUNTS: StoredAccount[] = [
  {
    email: 'elena.rostova@forensics.verifyx.ai',
    passwordHash: 'VerifyX2026@Secure',
    profile: {
      name: 'Elena Rostova',
      email: 'elena.rostova@forensics.verifyx.ai',
      role: 'Lead Forensic Examiner',
      organization: 'National Cyber Forensics Laboratory',
      badgeId: 'VX-FORENSIC-8492',
      avatarUrl: CURRENT_USER.avatarUrl,
      twoFactorEnabled: true,
      lastLogin: 'Today at 09:15 AM',
      scansPerformed: 142,
      clearanceLevel: 'Level 4 Clearance'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    email: 'evelyn.vance@forensics.verifyx.ai',
    passwordHash: 'VerifyX2026@Secure',
    profile: { ...CURRENT_USER },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    email: 'chalapaka2022@gmail.com',
    passwordHash: 'VerifyX2026@Secure',
    profile: {
      name: 'Dr. C. Halapaka',
      email: 'chalapaka2022@gmail.com',
      role: 'Chief Forensic Scientist',
      organization: 'Global Forensic Trust Network',
      badgeId: 'VX-EXEC-0022',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=250',
      twoFactorEnabled: true,
      lastLogin: 'Today at 08:30 AM',
      scansPerformed: 215,
      clearanceLevel: 'Level 4 Clearance'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    email: 'm.thorne@cyber-investigations.gov',
    passwordHash: 'ForensicSecurity99!',
    profile: {
      name: 'Marcus Thorne',
      email: 'm.thorne@cyber-investigations.gov',
      role: 'Senior Digital Forensic Investigator',
      organization: 'Federal Forensic Division',
      badgeId: 'VX-FED-1049',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=250',
      twoFactorEnabled: true,
      lastLogin: 'Yesterday at 04:20 PM',
      scansPerformed: 87,
      clearanceLevel: 'Level 3 Clearance'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

/**
 * Validate password requirements:
 * 1. At least 8 characters
 * 2. At least one capital letter (A-Z)
 * 3. At least one number (0-9)
 * 4. At least one special character (!@#$%^&*...)
 */
export function validatePasswordStrength(password: string): PasswordValidationResult {
  const hasMinLength = password.length >= 8;
  const hasCapital = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  // Special character: check for symbols or punctuation
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?`~§±€£¥]/.test(password);

  let score = 0;
  if (hasMinLength) score++;
  if (hasCapital) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  const isStrong = hasMinLength && hasCapital && hasNumber && hasSpecial;

  return {
    hasMinLength,
    hasCapital,
    hasNumber,
    hasSpecial,
    isStrong,
    score
  };
}

/**
 * Retrieve all registered accounts from localStorage, seeded with defaults.
 */
export function getRegisteredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
      return DEFAULT_ACCOUNTS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load accounts from storage', e);
  }
  return DEFAULT_ACCOUNTS;
}

/**
 * Save accounts array to localStorage.
 */
function saveAccounts(accounts: StoredAccount[]): void {
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.error('Failed to save accounts to storage', e);
  }
}

/**
 * Find account by email (case-insensitive).
 */
export function findAccountByEmail(email: string): StoredAccount | null {
  const accounts = getRegisteredAccounts();
  const normalized = email.trim().toLowerCase();
  return accounts.find(a => a.email.toLowerCase() === normalized) || null;
}

/**
 * Verify credentials on login.
 * Returns the matching user profile if valid, or throws an error.
 */
export function authenticateWithPassword(
  email: string, 
  passwordInput: string
): { success: boolean; user?: UserProfile; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const account = findAccountByEmail(normalizedEmail);

  if (!account) {
    return {
      success: false,
      error: `No account found for "${email.trim()}". Please create a new account or check your spelling.`
    };
  }

  if (account.passwordHash !== passwordInput) {
    return {
      success: false,
      error: 'Incorrect password entered. Please try again or reset your password using the "Forgot Password?" link below.'
    };
  }

  // Update last login
  const updatedAccounts = getRegisteredAccounts().map(acc => {
    if (acc.email.toLowerCase() === normalizedEmail) {
      return {
        ...acc,
        profile: {
          ...acc.profile,
          lastLogin: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        updatedAt: new Date().toISOString()
      };
    }
    return acc;
  });
  saveAccounts(updatedAccounts);

  return {
    success: true,
    user: {
      ...account.profile,
      lastLogin: 'Today at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  };
}

/**
 * Register a new user account with strong password.
 */
export function registerNewAccount(
  name: string,
  email: string,
  password: string,
  organization: string
): { success: boolean; user?: UserProfile; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const existing = findAccountByEmail(normalizedEmail);

  if (existing) {
    return {
      success: false,
      error: `An account with the email "${email.trim()}" already exists. Please sign in or use Forgot Password.`
    };
  }

  const validation = validatePasswordStrength(password);
  if (!validation.isStrong) {
    return {
      success: false,
      error: 'Password does not meet strong security requirements (must have at least 8 characters, a capital letter, a number, and a special character).'
    };
  }

  const newProfile: UserProfile = {
    name: name.trim(),
    email: email.trim(),
    role: 'Forensic Document Specialist',
    organization: organization.trim() || 'VerifyX Forensic Partner Network',
    badgeId: `VX-${Math.floor(1000 + Math.random() * 9000)}`,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250',
    twoFactorEnabled: true,
    lastLogin: 'First Session Initialized',
    scansPerformed: 0,
    clearanceLevel: 'Level 3 Clearance'
  };

  const newAccount: StoredAccount = {
    email: email.trim(),
    passwordHash: password,
    profile: newProfile,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  const accounts = getRegisteredAccounts();
  accounts.push(newAccount);
  saveAccounts(accounts);

  return {
    success: true,
    user: newProfile
  };
}

/**
 * Generate a 6-digit OTP for Forgot Password flow.
 * Valid for 10 minutes.
 */
export function generateOtpForEmail(email: string): OtpRecord {
  const normalizedEmail = email.trim().toLowerCase();
  // Generate 6 random digits
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const now = Date.now();
  const expiresAt = now + (10 * 60 * 1000); // 10 minutes validity

  const record: OtpRecord = {
    email: normalizedEmail,
    otp,
    expiresAt,
    createdAt: now
  };

  try {
    sessionStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(record));
  } catch (e) {
    console.error('Failed to store OTP in session', e);
  }

  return record;
}

/**
 * Retrieve current active OTP record if not expired.
 */
export function getActiveOtp(): OtpRecord | null {
  try {
    const raw = sessionStorage.getItem(OTP_STORAGE_KEY);
    if (!raw) return null;
    const record: OtpRecord = JSON.parse(raw);
    if (Date.now() > record.expiresAt) {
      sessionStorage.removeItem(OTP_STORAGE_KEY);
      return null;
    }
    return record;
  } catch (e) {
    return null;
  }
}

/**
 * Verify the user submitted OTP against stored OTP.
 */
export function verifyOtpForEmail(email: string, submittedOtp: string): { success: boolean; error?: string } {
  const activeOtp = getActiveOtp();
  const normalizedEmail = email.trim().toLowerCase();

  if (!activeOtp) {
    return {
      success: false,
      error: 'OTP code has expired or was not requested. Please request a new verification OTP.'
    };
  }

  if (activeOtp.email !== normalizedEmail) {
    return {
      success: false,
      error: 'Email mismatch for this OTP. Please restart password recovery with your registered email.'
    };
  }

  if (activeOtp.otp !== submittedOtp.trim()) {
    return {
      success: false,
      error: 'Invalid 6-digit verification OTP. Please check the code dispatched to your email.'
    };
  }

  return { success: true };
}

/**
 * Update the user's password following successful OTP verification.
 */
export function resetAccountPassword(
  email: string,
  newPassword: string
): { success: boolean; error?: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const validation = validatePasswordStrength(newPassword);

  if (!validation.isStrong) {
    return {
      success: false,
      error: 'New password does not meet strong security requirements (must have at least 8 characters, a capital letter, a number, and a special character).'
    };
  }

  const accounts = getRegisteredAccounts();
  let found = false;

  const updatedAccounts = accounts.map(acc => {
    if (acc.email.toLowerCase() === normalizedEmail) {
      found = true;
      return {
        ...acc,
        passwordHash: newPassword,
        updatedAt: new Date().toISOString()
      };
    }
    return acc;
  });

  if (!found) {
    // If user account wasn't pre-existing, create it so they can log in
    const defaultProfile: UserProfile = {
      name: email.split('@')[0].replace('.', ' ').replace(/(^\w|\s\w)/g, m => m.toUpperCase()),
      email: email.trim(),
      role: 'Forensic Document Specialist',
      organization: 'VerifyX Forensic Network',
      badgeId: `VX-${Math.floor(1000 + Math.random() * 9000)}`,
      avatarUrl: CURRENT_USER.avatarUrl,
      twoFactorEnabled: true,
      lastLogin: 'Password Recovered Just Now',
      scansPerformed: 1,
      clearanceLevel: 'Level 3 Clearance'
    };

    updatedAccounts.push({
      email: email.trim(),
      passwordHash: newPassword,
      profile: defaultProfile,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  saveAccounts(updatedAccounts);

  // Clear consumed OTP
  try {
    sessionStorage.removeItem(OTP_STORAGE_KEY);
  } catch (e) {
    // Ignore
  }

  return { success: true };
}
