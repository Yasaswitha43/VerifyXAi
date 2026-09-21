export type PageRoute = 
  | 'landing' 
  | 'login' 
  | 'signup'
  | 'dashboard' 
  | 'analyze' 
  | 'results' 
  | 'compare' 
  | 'history' 
  | 'reports' 
  | 'settings' 
  | 'profile';

export type DocumentType = 
  | 'Bank Statement' 
  | 'Identity Passport' 
  | 'Commercial Invoice' 
  | 'Academic Degree' 
  | 'Medical Certificate' 
  | 'Legal Contract'
  | 'Aadhaar-style ID'
  | 'PAN-style Card'
  | 'College ID'
  | 'Driving Licence-style'
  | 'Certificate';

export type RiskLevel = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface ForensicAnomaly {
  id: string;
  category: 'Font' | 'Layout' | 'Metadata' | 'AI Origin' | 'Image Splicing' | 'Cross-Field' | 'Template Deviation' | 'Partial Tampering';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0 - 100
  location?: { x: number; y: number; width: number; height: number; page?: number };
  evidence: string;
  detectedDifference?: string;
}

export interface DocumentDNAData {
  hash: string;
  entropyScore: number;
  layoutSignature: string;
  fontFingerprint: string;
  metadataVector: string;
  pixelVariance: number;
  chromaDelta: number;
  structuralCoherence: number;
  radialFeatures: number[]; // 8-12 axes for radar/polar plot
}

export interface VerificationState {
  verified: boolean;
  verifiedAt?: string;
  token?: string;
  method: 'OTP' | 'Digital Signature' | 'PKI SmartCard';
  recipient?: string;
}

export interface SyntheticDocument {
  id: string;
  name: string;
  type: DocumentType;
  uploadedAt: string;
  fileSize: string;
  format: 'PDF' | 'PNG' | 'JPG';
  riskScore: number; // 0 - 100
  riskLevel: RiskLevel;
  confidence: number;
  thumbnailUrl: string;
  maskedThumbnailUrl?: string;
  aiOriginScore: number; // 0 - 100 likelihood of generative AI manipulation
  templateDeviationScore?: number; // 0 - 100 deviation against institutional canonical template
  riskBreakdown?: {
    font: number;
    layout: number;
    metadata: number;
    aiOrigin: number;
    splicing: number;
    crossField: number;
  };
  verification?: VerificationState;
  metadata: {
    creationTool: string;
    originalDate: string;
    modifiedDate?: string;
    cameraOrDevice?: string;
    colorSpace: string;
    resolution: string;
    digitalSignaturePresent: boolean;
    hashSha256: string;
  };
  dna: DocumentDNAData;
  anomalies: ForensicAnomaly[];
  riskExplanation: string;
  recommendedAction: string;
  isSyntheticDemo: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'warning' | 'info' | 'success';
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  organization: string;
  badgeId: string;
  avatarUrl: string;
  twoFactorEnabled: boolean;
  lastLogin: string;
  scansPerformed: number;
  clearanceLevel: string;
}
