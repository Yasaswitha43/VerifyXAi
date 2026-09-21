import { SyntheticDocument, UserProfile, NotificationItem } from '../types';

export const CURRENT_USER: UserProfile = {
  name: 'Dr. Evelyn Vance',
  email: 'evelyn.vance@forensics.verifyx.ai',
  role: 'Senior Digital Forensic Investigator',
  organization: 'Apex Forensic Intelligence Lab',
  badgeId: 'VFX-IND-9941',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  twoFactorEnabled: true,
  lastLogin: 'Today at 08:42 AM',
  scansPerformed: 1284,
  clearanceLevel: 'Level 4 (Forensic Auditor)'
};

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'High-Risk Specimen Flagged',
    message: 'Specimen #VX-8891 (Bank Statement) showed 89% probability of digital splicing.',
    timestamp: '12m ago',
    read: false,
    type: 'warning'
  },
  {
    id: 'n-2',
    title: 'Forensic Audit Report Ready',
    message: 'SHA-256 integrity report for Invoice #INV-3304 is archived and signed.',
    timestamp: '1h ago',
    read: false,
    type: 'success'
  },
  {
    id: 'n-3',
    title: 'Model Definition Updated',
    message: 'Synthetic GenAI artifact detector updated with latest Diffusion noise profiles.',
    timestamp: '4h ago',
    read: true,
    type: 'info'
  }
];

export const SAMPLE_DOCUMENTS: SyntheticDocument[] = [
  {
    id: 'doc-8891',
    name: 'Synthetic_Apex_Bank_Statement_May.pdf',
    type: 'Bank Statement',
    uploadedAt: '2026-09-20 14:28:10',
    fileSize: '2.4 MB',
    format: 'PDF',
    riskScore: 78,
    riskLevel: 'High',
    confidence: 94.2,
    thumbnailUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    aiOriginScore: 83,
    templateDeviationScore: 76,
    riskBreakdown: {
      font: 92,
      layout: 78,
      metadata: 88,
      aiOrigin: 83,
      splicing: 68,
      crossField: 96
    },
    verification: {
      verified: false,
      method: 'OTP',
      recipient: '+1 (555) •••-8891'
    },
    metadata: {
      creationTool: 'Adobe Photoshop 24.2 / Ghostscript PDF Engine',
      originalDate: '2026-05-12 09:15:00',
      modifiedDate: '2026-09-18 22:41:19',
      colorSpace: 'DeviceRGB (Inconsistent with native bank PDF CMYK)',
      resolution: '300 DPI mixed with 144 DPI patches',
      digitalSignaturePresent: false,
      hashSha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
    },
    dna: {
      hash: 'VFX-DNA-8891-B73-X9',
      entropyScore: 0.88,
      layoutSignature: 'GRID-VAR-0.34_MISALIGNED_COL3',
      fontFingerprint: 'HELV-NEUE-MOD_KERNING_DELTA_4.2',
      metadataVector: 'XMP-MODIFIED_RESIDUAL_CANVAS',
      pixelVariance: 0.72,
      chromaDelta: 0.65,
      structuralCoherence: 48,
      radialFeatures: [88, 74, 91, 62, 85, 93, 70, 78]
    },
    anomalies: [
      {
        id: 'a-1',
        category: 'Font',
        title: 'Micro-Typography Inconsistency in Ending Balance',
        description: 'Digit "8" and "5" in "$85,420.00" use a slightly varied sub-pixel raster weight differing from the institutional standard font.',
        severity: 'critical',
        confidence: 96.4,
        location: { x: 62, y: 34, width: 28, height: 8 },
        evidence: 'Glyph outline baseline drops by 1.8 pixels; anti-aliasing curve matches standard web rasterizer rather than embedded vector font.',
        detectedDifference: 'Original estimated: $5,420.00 → Modified to: $85,420.00'
      },
      {
        id: 'a-2',
        category: 'Layout',
        title: 'Column Grid Deviation & Spacing Shift',
        description: 'Line item spacing on row 14 shifts vertically by 3.4mm, inconsistent with automated banking engine output.',
        severity: 'high',
        confidence: 91.0,
        location: { x: 15, y: 52, width: 70, height: 12 },
        evidence: 'Bounding box vertical rhythm breaks automated template constraints.'
      },
      {
        id: 'a-3',
        category: 'Metadata',
        title: 'Editing Software Trace & Timestamp Mismatch',
        description: 'XMP metadata contains history packet from raster graphic editor; file modified 128 days after declared generation date.',
        severity: 'high',
        confidence: 98.8,
        evidence: 'Metadata tag history: Action=saved, SoftwareAgent=Adobe Photoshop 24.2, InstanceID=xmp.iid:71092.'
      },
      {
        id: 'a-4',
        category: 'Cross-Field',
        title: 'Mathematical Cross-Field Sum Inconsistency',
        description: 'Calculated sum of credit items ($14,200.00) + opening balance ($3,800.00) does not equal recorded ending balance ($85,420.00).',
        severity: 'critical',
        confidence: 99.9,
        location: { x: 50, y: 72, width: 40, height: 14 },
        evidence: 'Discrepancy delta: +$67,420.00 unexplained variance across transaction ledger.'
      }
    ],
    riskExplanation: 'Specimen displays significant evidence of synthetic manipulation. Font baseline variations, raster anti-aliasing halos on the final balance, and a direct mathematical discrepancy across the transaction ledger point to localized numerical alterations. Furthermore, internal metadata confirms raster editor reprocessing.',
    recommendedAction: 'Flag for secondary compliance audit. Request primary direct-from-institution cryptographic transmission.',
    isSyntheticDemo: true
  },
  {
    id: 'doc-3304',
    name: 'Synthetic_Global_Tech_Invoice_771.pdf',
    type: 'Commercial Invoice',
    uploadedAt: '2026-09-19 11:14:02',
    fileSize: '1.8 MB',
    format: 'PDF',
    riskScore: 64,
    riskLevel: 'Moderate',
    confidence: 89.5,
    thumbnailUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
    aiOriginScore: 58,
    metadata: {
      creationTool: 'Canva / ReportLab PDF Lib',
      originalDate: '2026-08-10 16:30:00',
      modifiedDate: '2026-08-11 04:12:00',
      colorSpace: 'DeviceRGB',
      resolution: 'Vector elements + 150 DPI stamps',
      digitalSignaturePresent: false,
      hashSha256: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08'
    },
    dna: {
      hash: 'VFX-DNA-3304-INV-K2',
      entropyScore: 0.62,
      layoutSignature: 'INVOICE-MODERN-MOD-1',
      fontFingerprint: 'INTER-DISPLAY-PATCHED',
      metadataVector: 'CANVA-WEB-PRINT',
      pixelVariance: 0.44,
      chromaDelta: 0.38,
      structuralCoherence: 68,
      radialFeatures: [60, 52, 70, 68, 64, 59, 72, 61]
    },
    anomalies: [
      {
        id: 'a-21',
        category: 'Image Splicing',
        title: 'Company Stamp & Signature Pixel Compression Discontinuity',
        description: 'The authorization stamp contains compression block artifacts that do not align with the surrounding 8x8 DCT grid.',
        severity: 'high',
        confidence: 88.2,
        location: { x: 65, y: 75, width: 25, height: 18 },
        evidence: 'Error Level Analysis (ELA) highlights high error contrast on the seal perimeter.'
      },
      {
        id: 'a-22',
        category: 'Cross-Field',
        title: 'VAT Number Checksum Warning',
        description: 'Vendor VAT registration number checksum fails mod-97 validation for declared jurisdiction.',
        severity: 'medium',
        confidence: 94.0,
        evidence: 'Declared VAT: GB998234102. Expected checksum residue: 12, Received: 54.'
      }
    ],
    riskExplanation: 'The invoice exhibits signature stamping overlay with mismatched compression boundaries, indicating potential re-use of an executive stamp across multiple unauthorized invoices.',
    recommendedAction: 'Verify vendor VAT credentials through national database and request counter-signature confirmation.',
    isSyntheticDemo: true
  },
  {
    id: 'doc-1049',
    name: 'Synthetic_Specimen_Passport_Identity.png',
    type: 'Identity Passport',
    uploadedAt: '2026-09-18 09:05:44',
    fileSize: '4.1 MB',
    format: 'PNG',
    riskScore: 92,
    riskLevel: 'Critical',
    confidence: 97.8,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    aiOriginScore: 95,
    metadata: {
      creationTool: 'Midjourney v6.1 / FaceSwap Latent Model',
      originalDate: '2026-09-17 18:22:00',
      colorSpace: 'sRGB',
      resolution: '600 DPI',
      digitalSignaturePresent: false,
      hashSha256: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a'
    },
    dna: {
      hash: 'VFX-DNA-1049-ID-AI99',
      entropyScore: 0.94,
      layoutSignature: 'ICAO-9303-DEVIANT-ZONE',
      fontFingerprint: 'OCR-B-SYNTHETIC-NOISE',
      metadataVector: 'DIFFUSION-FREQUENCY-SPIKE',
      pixelVariance: 0.89,
      chromaDelta: 0.91,
      structuralCoherence: 28,
      radialFeatures: [95, 92, 98, 89, 94, 96, 91, 88]
    },
    anomalies: [
      {
        id: 'a-31',
        category: 'AI Origin',
        title: 'Generative AI Biometric Portrait Synthesis',
        description: 'Portrait photograph displays high-frequency spectral signatures typical of diffusion and GAN latent upscalers.',
        severity: 'critical',
        confidence: 98.6,
        location: { x: 10, y: 25, width: 32, height: 45 },
        evidence: 'Pupil reflection asymmetry detected; hair boundary micro-geometry shows diffusion blending artifacts.'
      },
      {
        id: 'a-32',
        category: 'Font',
        title: 'Machine Readable Zone (MRZ) Checksum & Font Glitch',
        description: 'MRZ lines contain OCR-B font spacing irregularities and failed composite check digit.',
        severity: 'critical',
        confidence: 99.1,
        location: { x: 8, y: 80, width: 84, height: 14 },
        evidence: 'Line 2 MRZ: P<UTOALVAREZ<<CARLOS<<<<<<<<<<<<<<<<<< fails international ICAO Doc 9303 checksum standards.'
      }
    ],
    riskExplanation: 'Critical risk: Portrait exhibits undeniable generative AI synthesis indicators, combined with invalid ICAO 9303 MRZ checksum calculations. Synthetic identity specimen.',
    recommendedAction: 'Immediate rejection and escalation to fraud prevention team.',
    isSyntheticDemo: true
  },
  {
    id: 'doc-0042',
    name: 'Synthetic_Verified_Medical_Clearance.pdf',
    type: 'Medical Certificate',
    uploadedAt: '2026-09-17 16:40:22',
    fileSize: '1.2 MB',
    format: 'PDF',
    riskScore: 12,
    riskLevel: 'Low',
    confidence: 98.2,
    thumbnailUrl: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?w=600&auto=format&fit=crop&q=80',
    aiOriginScore: 5,
    metadata: {
      creationTool: 'Epic EHR PDF Export v2026',
      originalDate: '2026-09-17 14:10:00',
      colorSpace: 'DeviceGray',
      resolution: 'Vector native',
      digitalSignaturePresent: true,
      hashSha256: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8'
    },
    dna: {
      hash: 'VFX-DNA-0042-MED-OK',
      entropyScore: 0.15,
      layoutSignature: 'CLINICAL-STANDARD-V4',
      fontFingerprint: 'ARIAL-MT-GENUINE-VECT',
      metadataVector: 'CRYPTO-VERIFIED-CERT',
      pixelVariance: 0.12,
      chromaDelta: 0.08,
      structuralCoherence: 96,
      radialFeatures: [12, 10, 15, 14, 8, 11, 16, 9]
    },
    anomalies: [],
    riskExplanation: 'No anomalies detected. Layout aligns strictly with institutional EHR templates, font vector baselines are consistent, and internal digital cryptographic signature matches public healthcare authority ledger.',
    recommendedAction: 'Specimen verified as compliant with synthetic benchmark standards.',
    isSyntheticDemo: true
  },
  {
    id: 'doc-aadhaar-902',
    name: 'Synthetic_Aadhaar_Card_Specimen.png',
    type: 'Aadhaar-style ID',
    uploadedAt: '2026-09-21 09:12:00',
    fileSize: '1.9 MB',
    format: 'PNG',
    riskScore: 86,
    riskLevel: 'High',
    confidence: 96.8,
    thumbnailUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
    aiOriginScore: 89,
    templateDeviationScore: 78,
    riskBreakdown: {
      font: 84,
      layout: 72,
      metadata: 92,
      aiOrigin: 89,
      splicing: 88,
      crossField: 95
    },
    verification: {
      verified: false,
      method: 'OTP',
      recipient: '+91 ••••• ••891'
    },
    metadata: {
      creationTool: 'StableDiffusion WebUI / Inpainting v1.9',
      originalDate: '2026-04-10 11:20:00',
      modifiedDate: '2026-09-20 23:14:02',
      colorSpace: 'sRGB (Expected: Security-Grade CMYK Micro-Print)',
      resolution: '450 DPI (Mixed 72 DPI photo crop)',
      digitalSignaturePresent: false,
      hashSha256: 'c81b2e88a3df19f564192b67812bc8f92147df90b6a982143df89912048aa771'
    },
    dna: {
      hash: 'VFX-DNA-902-UID-IN99',
      entropyScore: 0.91,
      layoutSignature: 'UIDAI-CANONICAL-V3-MISALIGNED',
      fontFingerprint: 'AADHAAR-NUM-KERNING-TAMPERED',
      metadataVector: 'DIFFUSION-INPAINTING-SEAL',
      pixelVariance: 0.86,
      chromaDelta: 0.79,
      structuralCoherence: 42,
      radialFeatures: [92, 85, 94, 88, 91, 96, 75, 84]
    },
    anomalies: [
      {
        id: 'a-adh-1',
        category: 'Cross-Field',
        title: 'Verhoeff Checksum Failure on 12-Digit UID',
        description: 'Printed 12-digit number 4829 1048 9921 fails the national Verhoeff dihedral group D5 checksum validation.',
        severity: 'critical',
        confidence: 99.8,
        location: { x: 22, y: 78, width: 56, height: 10 },
        evidence: 'Expected Verhoeff check-digit for prefix 48291048992 is 7; found: 1.'
      },
      {
        id: 'a-adh-2',
        category: 'AI Origin',
        title: 'Synthetic Generative Portrait Inpainting',
        description: 'Holder facial photo displays high-frequency spectral latent artifacts consistent with diffusion-based face swaps.',
        severity: 'critical',
        confidence: 97.4,
        location: { x: 12, y: 28, width: 30, height: 42 },
        evidence: 'Bilateral eye reflections lack natural light vector symmetry; earlobe boundary blends into background security lattice.'
      },
      {
        id: 'a-adh-3',
        category: 'Image Splicing',
        title: 'QR Code Compression Block Discontinuity',
        description: 'Secure QR code bounding region has 8x8 DCT grid misalignment compared to the surrounding micro-line guilloche background.',
        severity: 'high',
        confidence: 93.2,
        location: { x: 68, y: 24, width: 24, height: 36 },
        evidence: 'ELA reveals elevated pixel noise floor on the QR perimeter, characteristic of a pasted raster graphic.'
      }
    ],
    riskExplanation: 'Specimen exhibits unmistakable indications of synthetic tampering: the 12-digit UID fails mathematical Verhoeff checksum validation, the biometric photo demonstrates generative AI inpainting, and the QR code was spliced from a secondary source.',
    recommendedAction: 'Reject specimen immediately. Request cryptographic XML e-KYC or offline signed QR verification.',
    isSyntheticDemo: true
  },
  {
    id: 'doc-pan-4401',
    name: 'Synthetic_PAN_Card_Tax_Specimen.jpg',
    type: 'PAN-style Card',
    uploadedAt: '2026-09-20 17:40:11',
    fileSize: '2.1 MB',
    format: 'JPG',
    riskScore: 74,
    riskLevel: 'High',
    confidence: 93.4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    aiOriginScore: 42,
    templateDeviationScore: 68,
    riskBreakdown: {
      font: 78,
      layout: 65,
      metadata: 80,
      aiOrigin: 42,
      splicing: 82,
      crossField: 91
    },
    verification: {
      verified: false,
      method: 'OTP',
      recipient: 'taxpayer••••@domain.com'
    },
    metadata: {
      creationTool: 'CorelDRAW 2024 / PDF Creator',
      originalDate: '2026-03-14 16:22:00',
      modifiedDate: '2026-09-19 20:05:18',
      colorSpace: 'DeviceRGB',
      resolution: '300 DPI',
      digitalSignaturePresent: false,
      hashSha256: '98a4bc7102de87c10915ba890123fe451029ba87612ef10928374a56bca91024'
    },
    dna: {
      hash: 'VFX-DNA-4401-PAN-TX7',
      entropyScore: 0.76,
      layoutSignature: 'NSDL-CANONICAL-GRID-MOD-2',
      fontFingerprint: 'HELVETICA-CONDENSED-OVERLAY',
      metadataVector: 'CORELDRAW-EXPORT-VECTOR',
      pixelVariance: 0.69,
      chromaDelta: 0.64,
      structuralCoherence: 55,
      radialFeatures: [78, 65, 82, 70, 75, 91, 60, 72]
    },
    anomalies: [
      {
        id: 'a-pan-1',
        category: 'Cross-Field',
        title: '5th Character Entity Category Mismatch',
        description: 'Declared surname "Sharma" requires 5th letter of PAN to be "S". Specimen displays "ABCPR1042K" with letter "R".',
        severity: 'critical',
        confidence: 99.4,
        location: { x: 30, y: 48, width: 44, height: 10 },
        evidence: 'PAN schema rule violation: Format [AAAAA 9999 A]. 5th character must match the first letter of cardholder legal surname.'
      },
      {
        id: 'a-pan-2',
        category: 'Image Splicing',
        title: 'Hologram Security Boundary Splicing',
        description: 'Income Tax Department hologram seal displays razor edge clipping and inconsistent drop shadow.',
        severity: 'high',
        confidence: 89.6,
        location: { x: 74, y: 62, width: 18, height: 26 },
        evidence: 'Sub-pixel contour gradient exhibits a sharp 1px mask feather anomaly.'
      }
    ],
    riskExplanation: 'Specimen demonstrates a critical schema discrepancy: the 5th character of the Permanent Account Number violates statutory surname concordance rules, and the official security hologram displays artificial overlay masking.',
    recommendedAction: 'Cross-reference with central direct-tax database; require official cryptographic verification.',
    isSyntheticDemo: true
  },
  {
    id: 'doc-college-772',
    name: 'Synthetic_University_Student_ID.png',
    type: 'College ID',
    uploadedAt: '2026-09-19 14:15:30',
    fileSize: '1.4 MB',
    format: 'PNG',
    riskScore: 54,
    riskLevel: 'Moderate',
    confidence: 88.7,
    thumbnailUrl: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=600&auto=format&fit=crop&q=80',
    aiOriginScore: 35,
    templateDeviationScore: 48,
    riskBreakdown: {
      font: 74,
      layout: 45,
      metadata: 60,
      aiOrigin: 35,
      splicing: 52,
      crossField: 88
    },
    verification: {
      verified: false,
      method: 'OTP',
      recipient: 'student••••@university.edu'
    },
    metadata: {
      creationTool: 'GIMP 2.10.34 Image Editor',
      originalDate: '2024-08-20 10:15:00',
      modifiedDate: '2026-09-18 19:44:11',
      colorSpace: 'sRGB',
      resolution: '300 DPI',
      digitalSignaturePresent: false,
      hashSha256: '5172ea8910bc441098efca1029471928bcda9102948756bc1029384756102938'
    },
    dna: {
      hash: 'VFX-DNA-772-STU-OX2',
      entropyScore: 0.58,
      layoutSignature: 'ACADEMIC-STUDENT-CARD-V2',
      fontFingerprint: 'ARIAL-BOLD-PITCH-DELTA',
      metadataVector: 'GIMP-XCF-CONVERT',
      pixelVariance: 0.51,
      chromaDelta: 0.44,
      structuralCoherence: 68,
      radialFeatures: [65, 48, 55, 62, 59, 88, 52, 60]
    },
    anomalies: [
      {
        id: 'a-col-1',
        category: 'Font',
        title: 'Expiry Date Numerical Overwrite',
        description: 'Digit "7" in "Valid Thru: 2027" displays a differing kerning pitch and subpixel raster halo over original "4".',
        severity: 'high',
        confidence: 91.2,
        location: { x: 42, y: 68, width: 32, height: 8 },
        evidence: 'Micro-typography raster curve shows 1.2px baseline descent differing from adjacent numerals.'
      },
      {
        id: 'a-col-2',
        category: 'Cross-Field',
        title: 'Barcode Encoding Mismatch',
        description: 'Code-39 barcode on rear/front decodes to student matriculation number VX-2021 instead of printed VX-2024.',
        severity: 'high',
        confidence: 96.0,
        evidence: 'Decoded barcode string: "STU-2021-0891". Printed alphanumeric ID: "STU-2024-0891".'
      }
    ],
    riskExplanation: 'Specimen shows localized temporal tampering: the card expiry year has been altered to prolong validity, and the embedded barcode values contradict the printed matriculation year.',
    recommendedAction: 'Verify active student enrollment status via university registrar API.',
    isSyntheticDemo: true
  },
  {
    id: 'doc-dl-1108',
    name: 'Synthetic_Driving_Licence_Specimen.png',
    type: 'Driving Licence-style',
    uploadedAt: '2026-09-18 10:22:45',
    fileSize: '2.8 MB',
    format: 'PNG',
    riskScore: 91,
    riskLevel: 'Critical',
    confidence: 97.4,
    thumbnailUrl: 'https://images.unsplash.com/photo-1508873696983-2df5293cb32f?w=600&auto=format&fit=crop&q=80',
    aiOriginScore: 93,
    templateDeviationScore: 89,
    riskBreakdown: {
      font: 90,
      layout: 88,
      metadata: 94,
      aiOrigin: 93,
      splicing: 89,
      crossField: 92
    },
    verification: {
      verified: false,
      method: 'OTP',
      recipient: '+91 ••••• ••442'
    },
    metadata: {
      creationTool: 'Midjourney v6 / Photoshop Generative Fill',
      originalDate: '2026-09-17 08:30:00',
      colorSpace: 'Display P3',
      resolution: '600 DPI',
      digitalSignaturePresent: false,
      hashSha256: '772b10948576c10928374a56bca910245172ea8910bc441098efca1029471928'
    },
    dna: {
      hash: 'VFX-DNA-1108-DL-CR9',
      entropyScore: 0.95,
      layoutSignature: 'SARATHI-TRANSPORT-V2-DEVIANT',
      fontFingerprint: 'SYNTHETIC-GUILLOCHE-FAILURE',
      metadataVector: 'DIFFUSION-LATENT-WARP',
      pixelVariance: 0.92,
      chromaDelta: 0.88,
      structuralCoherence: 32,
      radialFeatures: [94, 91, 95, 89, 93, 98, 88, 92]
    },
    anomalies: [
      {
        id: 'a-dl-1',
        category: 'Template Deviation',
        title: 'State Transport Crest Geometric Deviation',
        description: 'Official national emblem displaced vertically by 4.8mm relative to canonical Sarathi transport layout specifications.',
        severity: 'critical',
        confidence: 98.2,
        location: { x: 8, y: 12, width: 22, height: 26 },
        evidence: 'Vector bounding box comparison against official regulatory template indicates an 18.4% coordinate variance.'
      },
      {
        id: 'a-dl-2',
        category: 'AI Origin',
        title: 'Guilloche Micro-Pattern Neural Blur',
        description: 'Anti-counterfeiting guilloche wavy lines lack crisp vector continuous contours, presenting characteristic diffusion blending blur.',
        severity: 'critical',
        confidence: 96.9,
        location: { x: 30, y: 30, width: 60, height: 40 },
        evidence: 'High-pass filter reveals loss of frequency fidelity in micro-text background layers.'
      }
    ],
    riskExplanation: 'Critical risk: specimen exhibits complete synthetic generation hallmarks. The anti-counterfeiting guilloche lines fail micro-structure examination, and institutional emblem alignment diverges significantly from transport department standards.',
    recommendedAction: 'Immediate referral to national transport portal verification and fraud investigation department.',
    isSyntheticDemo: true
  },
  {
    id: 'doc-cert-550',
    name: 'Synthetic_Certified_Forensic_Analyst_Diploma.pdf',
    type: 'Certificate',
    uploadedAt: '2026-09-17 12:04:18',
    fileSize: '1.6 MB',
    format: 'PDF',
    riskScore: 16,
    riskLevel: 'Low',
    confidence: 98.6,
    thumbnailUrl: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?w=600&auto=format&fit=crop&q=80',
    aiOriginScore: 8,
    templateDeviationScore: 12,
    riskBreakdown: {
      font: 14,
      layout: 12,
      metadata: 18,
      aiOrigin: 8,
      splicing: 15,
      crossField: 10
    },
    verification: {
      verified: true,
      verifiedAt: '2026-09-17 12:05:00',
      token: 'VX-PKI-CERT-8849',
      method: 'Digital Signature',
      recipient: 'cert-authority@accreditation.org'
    },
    metadata: {
      creationTool: 'Adobe InDesign 19.4 / Certified PDF/X-4',
      originalDate: '2026-09-17 10:00:00',
      colorSpace: 'CMYK (U.S. Web Coated)',
      resolution: 'Vector native + 1200 DPI foil stamp',
      digitalSignaturePresent: true,
      hashSha256: '44a8b1c92019e8374a56bca910245172ea8910bc441098efca1029471928bcda'
    },
    dna: {
      hash: 'VFX-DNA-550-CERT-OK',
      entropyScore: 0.18,
      layoutSignature: 'INSTITUTE-CANONICAL-DIPLOMA',
      fontFingerprint: 'TRAJAN-PRO-GENUINE-KERNING',
      metadataVector: 'ADOBE-X4-CRYPTOSIGNED',
      pixelVariance: 0.14,
      chromaDelta: 0.11,
      structuralCoherence: 95,
      radialFeatures: [15, 12, 18, 14, 11, 16, 19, 13]
    },
    anomalies: [],
    riskExplanation: 'Authentic certificate: all vector font baselines adhere strictly to accreditation standards, PDF/X-4 cryptographic signature is valid and untampered, and seal coordinates match the institute master template.',
    recommendedAction: 'Specimen verified as genuine against synthetic benchmarks. Issue cryptographic attestation record.',
    isSyntheticDemo: true
  }
];

export const MOCK_HISTORY = [
  {
    id: 'HIST-901',
    docName: 'Synthetic_Apex_Bank_Statement_May.pdf',
    type: 'Bank Statement',
    date: '2026-09-20 14:28',
    riskScore: 78,
    riskLevel: 'High',
    status: 'Flagged',
    verifiedBy: 'Dr. Evelyn Vance'
  },
  {
    id: 'HIST-902',
    docName: 'Synthetic_Global_Tech_Invoice_771.pdf',
    type: 'Commercial Invoice',
    date: '2026-09-19 11:14',
    riskScore: 64,
    riskLevel: 'Moderate',
    status: 'Under Review',
    verifiedBy: 'Automated Agent'
  },
  {
    id: 'HIST-903',
    docName: 'Synthetic_Specimen_Passport_Identity.png',
    type: 'Identity Passport',
    date: '2026-09-18 09:05',
    riskScore: 92,
    riskLevel: 'Critical',
    status: 'Rejected',
    verifiedBy: 'Dr. Evelyn Vance'
  },
  {
    id: 'HIST-904',
    docName: 'Synthetic_Verified_Medical_Clearance.pdf',
    type: 'Medical Certificate',
    date: '2026-09-17 16:40',
    riskScore: 12,
    riskLevel: 'Low',
    status: 'Approved',
    verifiedBy: 'Automated Agent'
  },
  {
    id: 'HIST-905',
    docName: 'Synthetic_Academic_Transcript_Oxford.pdf',
    type: 'Academic Degree',
    date: '2026-09-16 13:20',
    riskScore: 45,
    riskLevel: 'Moderate',
    status: 'Under Review',
    verifiedBy: 'Compliance Desk'
  }
];

export const MOCK_VOICE_KNOWLEDGE_BASE: Record<string, string> = {
  'what is document dna': 'Document DNA is VerifyX\'s multi-dimensional biometric fingerprint for documents. It constructs a 64-point forensic vector encoding micro-typography entropy, pixel variance, metadata timelines, and structural grid coherence to detect re-used templates or synthetic alterations.',
  'why was the bank statement flagged': 'The sample bank statement was flagged with a 78% High Risk score due to three key anomalies: micro-typography font alterations in the ending balance ($85,420 vs $5,420), a mathematical cross-field summation delta of +$67,420, and Adobe Photoshop history residuals in the XMP metadata.',
  'explain the tamper heatmap': 'The Tamper Heatmap uses Error Level Analysis (ELA), frequency domain discrete cosine transforms, and edge boundary detection. Areas with unexpected compression variance glow warm (yellow to red), revealing spliced stamps, cloned digits, or re-saved regions.',
  'how does ai x-ray mode work': 'AI X-Ray Mode simulates high-pass and subterranean visual filters. When you toggle or hover the X-Ray beam, it strips superficial color rendering to inspect vector font baseline alignments, hidden white-on-white text layers, and digital artifact residuals.',
  'is this document authentic': 'VerifyX provides forensic risk probability and anomaly indicators based on synthetic benchmarks. In accordance with forensic ethics, VerifyX highlights mathematical inconsistencies and tampering signatures without asserting absolute judicial authenticity.',
  'default': 'I am Ask VerifyX, your forensic intelligence AI assistant. You can ask me about Document DNA, Tamper Heatmaps, AI X-Ray mode, why specific specimens were flagged, or how our forensic detection models operate.'
};
