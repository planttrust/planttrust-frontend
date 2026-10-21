/* ─── Mock Data & Contract Reference Stubs ──────────────────────────────
 * Used for frontend development, UI prototyping, and offline fallback.
 * Strictly adheres to contracts/ for all 5 modules.
 * ──────────────────────────────────────────────────────────────────────── */

export const mockUsers = [
  {
    id: "u-1001-inv",
    name: "Aiden Silva",
    email: "aiden.investor@planttrust.org",
    role: "investor",
    phone: "+94 77 123 4567",
  },
  {
    id: "u-2002-comp",
    name: "Ceylon Agro Ventures PLC",
    email: "projects@ceylonagro.lk",
    role: "company",
    phone: "+94 11 234 5678",
  },
  {
    id: "u-3003-adm",
    name: "Admin Reviewer",
    email: "compliance@planttrust.org",
    role: "admin",
  },
];

export const mockCertificates = [
  {
    certificateId: "cert-ca-8921-xrpl",
    certificateNumber: "PT-CERT-2026-0089",
    companyId: "u-2002-comp",
    companyName: "Ceylon Agro Ventures PLC",
    status: "active",
    issuedAt: "2026-10-15T09:30:00Z",
    verified: true,
    anchorId: "anc-m1-7781-merkle",
    dataHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    txHash: "4A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6B9C23145E7A29F31",
    explorerUrl: "https://testnet.xrpl.org/transactions/4A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6B9C23145E7A29F31",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PT-CERT-2026-0089",
  },
  {
    certificateId: "cert-lh-4412-xrpl",
    certificateNumber: "PT-CERT-2026-0044",
    companyId: "u-2004-comp",
    companyName: "Lanka Highlands Teak Estate",
    status: "active",
    issuedAt: "2026-09-28T14:15:00Z",
    verified: true,
    anchorId: "anc-m1-5512-merkle",
    dataHash: "7d793037a0760186574b0282f2f435e70d71686e9aa99a7b9fc855b3f2238030",
    txHash: "9C2E418A3D8412F35327B66D440E53B02844F357AE09BD8256F280D5E63BA912",
    explorerUrl: "https://testnet.xrpl.org/transactions/9C2E418A3D8412F35327B66D440E53B02844F357AE09BD8256F280D5E63BA912",
    qrCodeUrl: "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PT-CERT-2026-0044",
  },
];

export const mockListings = [
  {
    listingId: "lst-proj-01",
    projectId: "proj-kurunegala-agri",
    companyId: "u-2002-comp",
    companyName: "Ceylon Agro Ventures PLC",
    projectName: "Kurunegala Organic Vanilla & Agroforestry",
    description: "25-acre regenerative vanilla plantation with computerized drip irrigation and solar water extraction.",
    targetAmount: 250000,
    fundedAmount: 185000,
    minInvestment: 500,
    returnRate: 14.8,
    region: "North Western",
    trustScore: 94,
    riskLevel: "low",
    status: "open",
    nftTokenId: "00080000A2C919E4238562B9C874A3D9218A9E32198031A54E184F9329481284",
  },
  {
    listingId: "lst-proj-02",
    projectId: "proj-anuradhapura-solar",
    companyId: "u-2004-comp",
    companyName: "Lanka Highlands Teak Estate",
    projectName: "Rajarata High-Yield Teak & Cinnamon Reserve",
    description: "40-acre commercial timber plantation anchored on XRPL with satellite boundary geofencing.",
    targetAmount: 400000,
    fundedAmount: 310000,
    minInvestment: 1000,
    returnRate: 16.5,
    region: "North Central",
    trustScore: 88,
    riskLevel: "medium",
    status: "open",
    nftTokenId: "00080000C81F934271428591B2489A12089F5321B3819A42E4829381A5491201",
  },
  {
    listingId: "lst-proj-03",
    projectId: "proj-kandy-spices",
    companyId: "u-2005-comp",
    companyName: "Dumbara Spice Growers Co.",
    projectName: "Dumbara Highland Cardamom & Pepper Terraces",
    description: "Organic export-grade spice cultivation utilizing IoT weather station sensors and Merkle audit tracking.",
    targetAmount: 150000,
    fundedAmount: 150000,
    minInvestment: 250,
    returnRate: 12.2,
    region: "Central",
    trustScore: 91,
    riskLevel: "low",
    status: "fully_funded",
    nftTokenId: "00080000E53B91248A952134BC839120FA812948C91345E981248A9128347192",
  },
];

export const mockEscrowHistory = [
  {
    escrowId: "esc-9012-funded",
    projectId: "proj-kurunegala-agri",
    investorId: "u-1001-inv",
    amount: 15000,
    currentState: "LOCKED",
    history: [
      { fromState: "NONE", toState: "CREATED", triggeredBy: "u-1001-inv", anchorId: "anc-m2-001", timestamp: "2026-10-10T08:00:00Z" },
      { fromState: "CREATED", toState: "FUNDED", triggeredBy: "u-1001-inv", anchorId: "anc-m2-002", timestamp: "2026-10-10T08:05:00Z" },
      { fromState: "FUNDED", toState: "LOCKED", triggeredBy: "system_escrow_guard", anchorId: "anc-m2-003", timestamp: "2026-10-10T08:05:30Z" },
    ],
  },
];

export const mockChatbotHistory = [
  {
    role: "user",
    content: "What is the security backing for the Kurunegala Vanilla project?",
    timestamp: "2026-10-21T14:10:00Z",
  },
  {
    role: "assistant",
    content: "The Kurunegala Organic Vanilla project is backed by verified Land Deed #LK-8921 on-chain, holds an overall Trust Score of 94/100, and is protected under Escrow Lock. 100% of milestone funds require geofence GPS proof before release.",
    timestamp: "2026-10-21T14:10:05Z",
    sources: [
      { tool: "trust_index", module: "module-5", data: { score: 94 } },
      { tool: "escrow_status", module: "module-2", data: { state: "LOCKED" } },
      { tool: "cbsl_compliance", module: "module-3", data: { status: "COMPLIANT" } },
    ],
    reasoning: "Queried Module 5 for Trust Score composite and Module 2 for Escrow Ledger status. Cross-checked CBSL Direction #04/2024 compliance regulations.",
    confidence: 0.96,
  },
];

export const mockScamAuditLog = [
  {
    flagId: "flag-scam-098",
    projectId: "proj-suspicious-delta",
    type: "scam_typology",
    severity: "high",
    description: "Abnormal funding velocity detected: 89% funding from single unverified entity in 12 minutes.",
    anchorId: "anc-m3-flag-098",
    txHash: "5F1A8C92B431D892742910482B91A429E849201A84928194D812948192849102",
    verified: true,
    createdAt: "2026-10-20T18:22:00Z",
  },
  {
    flagId: "flag-scam-042",
    projectId: "proj-anuradhapura-solar",
    type: "compliance_violation",
    severity: "low",
    description: "Minor discrepancy in land registrar stamp format; flagged for human-in-the-loop audit review.",
    anchorId: "anc-m3-flag-042",
    txHash: "8B219481928491024A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6",
    verified: true,
    createdAt: "2026-10-18T11:05:00Z",
  },
];

export const mockMilestoneTimeline = [
  {
    reportId: "rep-001",
    milestone: "Site Preparation & Boundary Trenching",
    status: "approved",
    approvedAt: "2026-10-12T10:30:00Z",
    anchorId: "anc-m4-rep-001",
    txHash: "1A94D281948102948A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6",
    verified: true,
    explorerUrl: "https://testnet.xrpl.org/transactions/1A94D281948102948A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6",
    evidenceCount: 4,
    geofencePassRate: 100,
  },
  {
    reportId: "rep-002",
    milestone: "Deep Borehole & Solar Pump Installation",
    status: "approved",
    approvedAt: "2026-10-19T16:00:00Z",
    anchorId: "anc-m4-rep-002",
    txHash: "6C82948102948A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D61A94",
    verified: true,
    explorerUrl: "https://testnet.xrpl.org/transactions/6C82948102948A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D61A94",
    evidenceCount: 6,
    geofencePassRate: 100,
  },
  {
    reportId: "rep-003",
    milestone: "Seedling Nursery Bed Propagation",
    status: "pending_validation",
    submittedAt: "2026-10-21T09:15:00Z",
    evidenceCount: 5,
    geofencePassRate: 100,
  },
];

export const mockTrustIndex = {
  projectId: "proj-kurunegala-agri",
  trustScore: 94,
  components: {
    documentVerification: 96,
    escrowHealth: 95,
    complianceScore: 92,
    geofencePassRate: 98,
  },
  lastUpdated: new Date().toISOString(),
};

export const mockAuditTrail = [
  {
    id: "aud-001",
    sourceModule: "module-1",
    eventType: "certificate_issued",
    entityId: "cert-ca-8921-xrpl",
    dataHash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    merkleRoot: "7a2b9184c910482b91a429e849201a84928194d8129481928491025f1a8c92b4",
    xrplTxHash: "4A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6B9C23145E7A29F31",
    txHash: "4A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6B9C23145E7A29F31",
    xrplLedgerIndex: 89410294,
    status: "CONFIRMED",
    timestamp: "2026-10-15T09:30:15Z",
  },
  {
    id: "aud-002",
    sourceModule: "module-2",
    eventType: "escrow_funded",
    entityId: "esc-9012-funded",
    dataHash: "185f8db32271fe25f561a6fc938b2e264306ec304eda518007d1764826381969",
    merkleRoot: "7a2b9184c910482b91a429e849201a84928194d8129481928491025f1a8c92b4",
    xrplTxHash: "3B81948102948A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D61A94",
    txHash: "3B81948102948A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D61A94",
    xrplLedgerIndex: 89410310,
    status: "CONFIRMED",
    timestamp: "2026-10-16T12:05:22Z",
  },
  {
    id: "aud-003",
    sourceModule: "module-4",
    eventType: "report_approved",
    entityId: "rep-001",
    dataHash: "3f79bb7b435b05321651daefd374cd681b61935c13d130f6d2b716a2d77410f0",
    merkleRoot: "91829481928491024a9d3f82e5c9a17482d42079148f2a8cd996b34a9988d4d6",
    xrplTxHash: "1A94D281948102948A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6",
    txHash: "1A94D281948102948A9D3F82E5C9A17482D42079148F2A8CD996B34A9988D4D6",
    xrplLedgerIndex: 89410425,
    status: "CONFIRMED",
    timestamp: "2026-10-19T16:01:05Z",
  },
];

export const mockGeofencedProjects = [
  {
    id: "proj-kurunegala-agri",
    name: "Kurunegala Organic Vanilla & Agroforestry",
    location: "Alawwa, Kurunegala (North Western)",
    areaHectares: 5.86,
    polygonId: "poly-geo-kurunegala-01",
    centroid: { lat: 7.4867, lng: 80.3651 },
    polygonCoordinates: [
      [7.4855, 80.3642],
      [7.4882, 80.3648],
      [7.4878, 80.3672],
      [7.4851, 80.3665],
      [7.4855, 80.3642],
    ],
  },
  {
    id: "proj-anuradhapura-solar",
    name: "Rajarata High-Yield Teak & Cinnamon Reserve",
    location: "Nochchiyagama, Anuradhapura (North Central)",
    areaHectares: 16.2,
    polygonId: "poly-geo-anuradhapura-02",
    centroid: { lat: 8.3114, lng: 80.4037 },
    polygonCoordinates: [
      [8.3090, 80.4010],
      [8.3140, 80.4020],
      [8.3135, 80.4070],
      [8.3085, 80.4055],
      [8.3090, 80.4010],
    ],
  },
];

export const mockScamTypologies = [
  {
    id: "scam-typ-01",
    category: "UNREALISTIC_RETURNS",
    title: "Guaranteed Hyper-Yield Promise (>30% Monthly)",
    description: "Claims of fixed, risk-free returns exceeding market benchmarks without audited revenue mechanisms.",
    riskWeight: 0.95,
    cbslRule: "Section 28 of Central Bank Act No. 16 of 2023 (Prohibition of Pyramid and Unrealistic Return Schemes)",
  },
  {
    id: "scam-typ-02",
    category: "UNREGULATED_COLLECTIVE_INVESTMENT",
    title: "Unlicensed Cross-Border Crypto/Telegram Direct Funding",
    description: "Soliciting public capital directly via unhosted wallets or messaging apps without escrow custody.",
    riskWeight: 0.88,
    cbslRule: "CBSL Directions on Custody of Investor Capital & Mandatory Escrow Accounts",
  },
  {
    id: "scam-typ-03",
    category: "DEED_FORGERY_INDICATOR",
    title: "Cadastral Survey Discrepancy & Unlicensed Notary",
    description: "Survey plan acreage does not match land registry folio volume numbers.",
    riskWeight: 0.92,
    cbslRule: "Registration of Documents Ordinance (Cap. 117)",
  },
];

