import type { RepairCase } from './types';

// ── Sample Repair Database ──────────────────────────────────────────────────

export const SAMPLE_CASES: RepairCase[] = [
  {
    id: 'case_001',
    brand: 'Dell',
    model: 'Inspiron 15',
    category: 'Power / Boot',
    symptoms: 'No power, blank screen, laptop does not turn on at all even when charger is connected.',
    steps: 'Checked charger with multimeter, tested with replacement charger, inspected power jack for damage.',
    solution: 'Replaced faulty DC power jack. Laptop powers on normally.',
    sourceType: 'sample',
    createdAt: '2024-08-10T10:00:00.000Z',
  },
  {
    id: 'case_002',
    brand: 'HP',
    model: 'Pavilion G4',
    category: 'Overheating',
    symptoms: 'Overheating and sudden shutdown after heavy use. Fan runs loudly at maximum speed.',
    steps: 'Ran temperature monitoring software. Opened bottom panel, inspected cooling system. Found heavy dust buildup on fan and heatsink.',
    solution: 'Cleaned cooling fan and heatsink. Applied new thermal paste on CPU. Temperature now stays below 75°C.',
    sourceType: 'sample',
    createdAt: '2024-08-15T11:00:00.000Z',
  },
  {
    id: 'case_003',
    brand: 'Lenovo',
    model: 'ThinkPad T480',
    category: 'Display',
    symptoms: 'Screen flickers and shows lines on boot. External monitor works fine.',
    steps: 'Connected to external display to isolate panel vs GPU issue. Checked display cable connection inside the lid.',
    solution: 'Reseated display cable connector. Updated GPU driver. Screen is now stable.',
    sourceType: 'sample',
    createdAt: '2024-08-20T09:30:00.000Z',
  },
  {
    id: 'case_004',
    brand: 'Acer',
    model: 'Aspire 5',
    category: 'Power / Boot',
    symptoms: 'Laptop will not boot. Screen stays black, power LED is on but no display.',
    steps: 'Tested RAM sticks one by one. Tried booting from USB. Suspected CMOS issue as date and time reset on every power cycle.',
    solution: 'Replaced CMOS battery (CR2032). Laptop boots normally and retains BIOS settings.',
    sourceType: 'sample',
    createdAt: '2024-08-25T14:00:00.000Z',
  },
  {
    id: 'case_005',
    brand: 'HP',
    model: 'EliteBook 840',
    category: 'Keyboard / Input',
    symptoms: 'Keyboard not responding. Several keys completely unresponsive. No water or physical damage visible.',
    steps: 'Tested with external USB keyboard which worked fine. Ran keyboard diagnostics. Reseated ribbon cable.',
    solution: 'Replaced keyboard module. All keys functioning correctly.',
    sourceType: 'sample',
    createdAt: '2024-09-02T10:30:00.000Z',
  },
  {
    id: 'case_006',
    brand: 'Dell',
    model: 'Latitude 7480',
    category: 'Wi-Fi / Network',
    symptoms: 'Wi-Fi disconnects randomly every few minutes. Shows limited connectivity. Ethernet connection is stable.',
    steps: 'Updated Wi-Fi drivers. Checked adapter settings for power management. Ran network diagnostics. Driver update did not resolve the issue.',
    solution: 'Replaced Wi-Fi card (Intel 8265). Network connection is now stable.',
    sourceType: 'sample',
    createdAt: '2024-09-10T15:00:00.000Z',
  },
  {
    id: 'case_007',
    brand: 'Lenovo',
    model: 'IdeaPad 330',
    category: 'Overheating',
    symptoms: 'Loud fan noise and very high CPU temperature. System feels hot to touch on bottom panel.',
    steps: 'Monitored CPU temperature, reaching 95°C under load. Opened laptop, found extreme dust accumulation.',
    solution: 'Cleaned dust from cooling system and fan blades. Replaced thermal paste on CPU and GPU. Temperature now normal.',
    sourceType: 'sample',
    createdAt: '2024-09-18T12:00:00.000Z',
  },
  {
    id: 'case_008',
    brand: 'HP',
    model: '250 G7',
    category: 'Storage / OS',
    symptoms: 'Blue screen on startup. BSOD with different error codes. Windows fails to load normally.',
    steps: 'Ran Windows memory diagnostic. Tested HDD with CrystalDiskInfo, showed reallocated sectors. Attempted startup repair.',
    solution: 'Replaced failing HDD. Reinstalled Windows 11. Updated BIOS to latest version. System stable.',
    sourceType: 'sample',
    createdAt: '2024-09-25T09:00:00.000Z',
  },
  {
    id: 'case_009',
    brand: 'Dell',
    model: 'XPS 13',
    category: 'Battery',
    symptoms: 'Battery drains very quickly, from full charge to 5% in under 2 hours even with light use.',
    steps: 'Checked battery health using Dell SupportAssist. Battery wear level at 78%, well beyond acceptable threshold.',
    solution: 'Replaced worn-out battery pack. Battery now holds full charge and lasts approximately 8 hours.',
    sourceType: 'sample',
    createdAt: '2024-10-01T11:30:00.000Z',
  },
  {
    id: 'case_010',
    brand: 'Lenovo',
    model: 'ThinkPad E490',
    category: 'USB / Ports',
    symptoms: 'USB ports not working. Devices not detected when plugged in. Only the right-side USB-C port works.',
    steps: 'Tested multiple USB devices. Checked Device Manager for driver errors. Reinstalled USB drivers, issue persisted.',
    solution: 'Replaced USB controller board. All USB ports functioning correctly.',
    sourceType: 'sample',
    createdAt: '2024-10-08T14:30:00.000Z',
  },
];

// ── LocalStorage Keys ────────────────────────────────────────────────────────

export const STORAGE_KEY = 'fixmemory_cases';
export const STORAGE_SEEDED_KEY = 'fixmemory_seeded';

// ── Problem Categories ───────────────────────────────────────────────────────

export const PROBLEM_CATEGORIES = [
  'Power / Boot',
  'Overheating',
  'Display',
  'Keyboard / Input',
  'Wi-Fi / Network',
  'Storage / OS',
  'Battery',
  'USB / Ports',
  'Audio',
  'Other',
] as const;

// ── Example search suggestions ───────────────────────────────────────────────

export const SEARCH_SUGGESTIONS = [
  'HP Pavilion heats up and shuts down after 10 minutes',
  'Laptop screen flickers and shows lines on boot',
  'Dell laptop no power, blank screen',
  'Wi-Fi keeps disconnecting every few minutes',
  'Keyboard not working after spill',
];
