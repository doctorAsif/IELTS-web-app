export interface DeviceSlot {
  deviceId: string;
  deviceName: string;
  registeredAt: string;
  lastVerifiedAt: string;
}

export interface StudentLicense {
  licenseKey: string; // 16-char format: XXXX-XXXX-XXXX-XXXX
  studentEmail: string;
  studentName: string;
  maxDevices: number; // max 2 devices
  activeDevices: DeviceSlot[];
  issuedAt: string;
  expiresAt: string;
  lastOnlineSync: string;
  gracePeriodDays: number; // 30-60 days (default 45)
  status: 'active' | 'suspended' | 'expired';
}

export interface LocalLicenseStatus {
  hasLicense: boolean;
  status: 'active' | 'grace_period' | 'expired' | 'unlicensed';
  license?: StudentLicense;
  currentDeviceId: string;
  daysRemainingInGrace: number;
  message: string;
}

const STORAGE_KEY_LOCAL_LICENSE = 'akhl_student_license_v1';
const STORAGE_KEY_ALL_LICENSES = 'akhl_admin_all_licenses_v1';
const STORAGE_KEY_DEVICE_ID = 'akhl_hardware_device_uuid_v1';

const memoryFallback: Record<string, string> = {};
const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage.getItem(key);
      }
    } catch (e) {}
    return memoryFallback[key] || null;
  },
  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(key, value);
        return;
      }
    } catch (e) {}
    memoryFallback[key] = value;
  },
  removeItem: (key: string): void => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.removeItem(key);
        return;
      }
    } catch (e) {}
    delete memoryFallback[key];
  }
};

export class LicenseSyncEngine {
  /**
   * Retrieves or computes a unique hardware UUID slot identifier for this browser/device.
   */
  public static getDeviceId(): string {
    try {
      let id = safeStorage.getItem(STORAGE_KEY_DEVICE_ID);
      if (!id) {
        const platform = typeof navigator !== 'undefined'
          ? ((navigator as any).userAgentData?.platform || navigator.platform || 'desktop')
          : 'desktop';
        const randomPart = typeof crypto !== 'undefined' && crypto.randomUUID
          ? crypto.randomUUID().slice(0, 8)
          : Math.random().toString(36).substring(2, 10);
        id = `DEV-${platform.toUpperCase().replace(/[^A-Z]/g, '').slice(0, 3)}-${randomPart.toUpperCase()}`;
        safeStorage.setItem(STORAGE_KEY_DEVICE_ID, id);
      }
      return id;
    } catch (e) {
      return 'DEV-FALLBACK-001';
    }
  }

  public static getDeviceName(): string {
    if (typeof navigator === 'undefined') return 'Test Workstation';
    const ua = navigator.userAgent;
    if (/iPad|iPhone|iPod/.test(ua)) return 'Apple iOS Device';
    if (/Macintosh/.test(ua)) return 'macOS Workstation';
    if (/Windows/.test(ua)) return 'Windows PC';
    if (/Android/.test(ua)) return 'Android Device';
    if (/Linux/.test(ua)) return 'Linux Machine';
    return 'Desktop Browser';
  }

  /**
   * Evaluates local license status including offline grace period (30-60 days).
   */
  public static getLocalLicenseStatus(): LocalLicenseStatus {
    const deviceId = this.getDeviceId();
    try {
      const saved = safeStorage.getItem(STORAGE_KEY_LOCAL_LICENSE);
      if (!saved) {
        return {
          hasLicense: false,
          status: 'unlicensed',
          currentDeviceId: deviceId,
          daysRemainingInGrace: 0,
          message: 'No active student license found. Please enter your 16-character license key.'
        };
      }

      const license: StudentLicense = JSON.parse(saved);
      const isDeviceAuthorized = license.activeDevices.some(d => d.deviceId === deviceId);

      if (!isDeviceAuthorized) {
        return {
          hasLicense: true,
          status: 'unlicensed',
          license,
          currentDeviceId: deviceId,
          daysRemainingInGrace: 0,
          message: `This device (${deviceId}) is not authorized. License is bound to ${license.activeDevices.length}/${license.maxDevices} device slots.`
        };
      }

      const lastSyncTime = new Date(license.lastOnlineSync).getTime();
      const now = Date.now();
      const elapsedDays = Math.floor((now - lastSyncTime) / (1000 * 60 * 60 * 24));
      const graceDays = license.gracePeriodDays || 45;
      const daysRemaining = Math.max(0, graceDays - elapsedDays);

      if (daysRemaining <= 0) {
        return {
          hasLicense: true,
          status: 'expired',
          license,
          currentDeviceId: deviceId,
          daysRemainingInGrace: 0,
          message: `Offline grace period (${graceDays} days) has expired. Please connect to the internet to verify your license.`
        };
      }

      const isGrace = elapsedDays > 7; // after 7 days offline, warning state starts

      return {
        hasLicense: true,
        status: isGrace ? 'grace_period' : 'active',
        license,
        currentDeviceId: deviceId,
        daysRemainingInGrace: daysRemaining,
        message: isGrace
          ? `Operating in offline grace period. ${daysRemaining} days remaining before cloud re-verification required.`
          : 'License active & verified on authorized device slot.'
      };
    } catch (e) {
      return {
        hasLicense: false,
        status: 'unlicensed',
        currentDeviceId: deviceId,
        daysRemainingInGrace: 0,
        message: 'Error verifying license status.'
      };
    }
  }

  /**
   * Activates a 16-character license key and binds current hardware device slot.
   */
  public static activateLicense(keyInput: string, studentEmail?: string): { success: boolean; message: string; license?: StudentLicense } {
    const cleanKey = keyInput.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    const formattedKey = cleanKey.length === 16 && !cleanKey.includes('-')
      ? `${cleanKey.slice(0, 4)}-${cleanKey.slice(4, 8)}-${cleanKey.slice(8, 12)}-${cleanKey.slice(12, 16)}`
      : cleanKey;

    const deviceId = this.getDeviceId();
    const deviceName = this.getDeviceName();

    // Check existing licenses catalog or initialize default
    const allLicenses = this.getAllAdminLicenses();
    let license = allLicenses.find(l => l.licenseKey === formattedKey);

    if (!license) {
      // If it's a validly formatted key (e.g. AKHL-XXXX-XXXX-XXXX or XXXX-XXXX-XXXX-XXXX)
      if (/^[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(formattedKey)) {
        license = {
          licenseKey: formattedKey,
          studentEmail: studentEmail || 'student@akhl-ielts.com',
          studentName: studentEmail ? studentEmail.split('@')[0] : 'Enrolled Candidate',
          maxDevices: 2,
          activeDevices: [],
          issuedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          lastOnlineSync: new Date().toISOString(),
          gracePeriodDays: 45,
          status: 'active'
        };
        allLicenses.push(license);
      } else {
        return {
          success: false,
          message: 'Invalid license format. Expected 16-character format: XXXX-XXXX-XXXX-XXXX'
        };
      }
    }

    // Check hardware slot availability (Max 2 devices)
    const existingSlotIndex = license.activeDevices.findIndex(d => d.deviceId === deviceId);
    if (existingSlotIndex >= 0) {
      // Device is already registered, refresh lastVerifiedAt
      license.activeDevices[existingSlotIndex].lastVerifiedAt = new Date().toISOString();
      license.lastOnlineSync = new Date().toISOString();
    } else {
      if (license.activeDevices.length >= license.maxDevices) {
        return {
          success: false,
          message: `Device slot limit reached (${license.maxDevices} devices max). Please deauthorize an existing device from your account or admin portal.`
        };
      }

      license.activeDevices.push({
        deviceId,
        deviceName,
        registeredAt: new Date().toISOString(),
        lastVerifiedAt: new Date().toISOString()
      });
      license.lastOnlineSync = new Date().toISOString();
    }

    // Save locally and in admin mock database
    try {
      safeStorage.setItem(STORAGE_KEY_LOCAL_LICENSE, JSON.stringify(license));
      this.saveAdminLicenses(allLicenses);
    } catch (e) {
      console.warn('Failed saving license to storage:', e);
    }

    return {
      success: true,
      message: `License activated successfully! Bound to device slot ${license.activeDevices.length}/${license.maxDevices} (${deviceName}).`,
      license
    };
  }

  /**
   * Refreshes offline grace timestamp when online.
   */
  public static syncLicenseWithCloud(): LocalLicenseStatus {
    const local = this.getLocalLicenseStatus();
    if (!local.license) return local;

    local.license.lastOnlineSync = new Date().toISOString();
    const deviceId = this.getDeviceId();
    const slot = local.license.activeDevices.find(d => d.deviceId === deviceId);
    if (slot) slot.lastVerifiedAt = new Date().toISOString();

    try {
      safeStorage.setItem(STORAGE_KEY_LOCAL_LICENSE, JSON.stringify(local.license));
    } catch (e) {
      // ignore
    }

    return this.getLocalLicenseStatus();
  }

  /**
   * Deauthorizes a device slot (freeing it for another device).
   */
  public static deauthorizeDevice(deviceId: string): boolean {
    const all = this.getAllAdminLicenses();
    let found = false;

    all.forEach(lic => {
      const idx = lic.activeDevices.findIndex(d => d.deviceId === deviceId);
      if (idx >= 0) {
        lic.activeDevices.splice(idx, 1);
        found = true;
      }
    });

    if (found) {
      this.saveAdminLicenses(all);
      // If current device was deauthorized, clear local
      if (deviceId === this.getDeviceId()) {
        try {
          safeStorage.removeItem(STORAGE_KEY_LOCAL_LICENSE);
        } catch (e) {}
      }
    }

    return found;
  }

  /**
   * Admin CMS helpers
   */
  public static getAllAdminLicenses(): StudentLicense[] {
    try {
      const saved = safeStorage.getItem(STORAGE_KEY_ALL_LICENSES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // default
    }

    const defaults: StudentLicense[] = [
      {
        licenseKey: 'AKHL-9942-8812-4410',
        studentEmail: 'candidate.swb@gmail.com',
        studentName: 'Farhan Kibria',
        maxDevices: 2,
        activeDevices: [
          {
            deviceId: 'DEV-MAC-8A91F2',
            deviceName: 'macOS Workstation (M3 Pro)',
            registeredAt: '2026-08-15T10:00:00Z',
            lastVerifiedAt: new Date().toISOString()
          }
        ],
        issuedAt: '2026-08-15T10:00:00Z',
        expiresAt: '2027-08-15T10:00:00Z',
        lastOnlineSync: new Date().toISOString(),
        gracePeriodDays: 60,
        status: 'active'
      },
      {
        licenseKey: 'AKHL-7731-5520-1199',
        studentEmail: 'nusrat.ielts@yahoo.com',
        studentName: 'Nusrat Jahan',
        maxDevices: 2,
        activeDevices: [
          {
            deviceId: 'DEV-WIN-B9412A',
            deviceName: 'Windows PC (Lenovo Yoga)',
            registeredAt: '2026-08-20T14:30:00Z',
            lastVerifiedAt: new Date().toISOString()
          },
          {
            deviceId: 'DEV-IOS-C4819E',
            deviceName: 'Apple iOS Device (iPad Pro)',
            registeredAt: '2026-08-21T09:15:00Z',
            lastVerifiedAt: new Date().toISOString()
          }
        ],
        issuedAt: '2026-08-20T14:30:00Z',
        expiresAt: '2027-08-20T14:30:00Z',
        lastOnlineSync: new Date().toISOString(),
        gracePeriodDays: 45,
        status: 'active'
      }
    ];

    try {
      safeStorage.setItem(STORAGE_KEY_ALL_LICENSES, JSON.stringify(defaults));
    } catch (e) {}

    return defaults;
  }

  public static saveAdminLicenses(licenses: StudentLicense[]): void {
    try {
      safeStorage.setItem(STORAGE_KEY_ALL_LICENSES, JSON.stringify(licenses));
    } catch (e) {
      console.warn('Failed to save admin licenses:', e);
    }
  }

  public static generateNewLicenseKey(
    studentEmail: string,
    studentName: string,
    maxDevices: number = 2,
    graceDays: number = 45
  ): StudentLicense {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    const genPart = (len: number) => {
      let res = '';
      for (let i = 0; i < len; i++) res += chars.charAt(Math.floor(Math.random() * chars.length));
      return res;
    };

    const newKey = `AKHL-${genPart(4)}-${genPart(4)}-${genPart(4)}`;
    const newLicense: StudentLicense = {
      licenseKey: newKey,
      studentEmail,
      studentName,
      maxDevices,
      activeDevices: [],
      issuedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      lastOnlineSync: new Date().toISOString(),
      gracePeriodDays: graceDays,
      status: 'active'
    };

    const all = this.getAllAdminLicenses();
    all.unshift(newLicense);
    this.saveAdminLicenses(all);
    return newLicense;
  }

  /**
   * Extends offline grace period for a specific student license.
   */
  public static extendGracePeriod(licenseKey: string, additionalDays: number = 30): boolean {
    const all = this.getAllAdminLicenses();
    const lic = all.find(l => l.licenseKey === licenseKey);
    if (!lic) return false;

    lic.gracePeriodDays = Math.min(90, (lic.gracePeriodDays || 45) + additionalDays);
    lic.lastOnlineSync = new Date().toISOString();
    this.saveAdminLicenses(all);

    // If local student license matches, update it too
    const local = this.getLocalLicenseStatus();
    if (local.license?.licenseKey === licenseKey) {
      local.license.gracePeriodDays = lic.gracePeriodDays;
      local.license.lastOnlineSync = lic.lastOnlineSync;
      safeStorage.setItem(STORAGE_KEY_LOCAL_LICENSE, JSON.stringify(local.license));
    }

    return true;
  }

  /**
   * Batch generates licenses for an entire classroom cohort intake.
   */
  public static batchGenerateLicenses(
    count: number,
    cohortPrefix: string,
    graceDays: number = 45
  ): StudentLicense[] {
    const generated: StudentLicense[] = [];
    const all = this.getAllAdminLicenses();

    for (let i = 1; i <= count; i++) {
      const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      const genPart = (len: number) => {
        let res = '';
        for (let k = 0; k < len; k++) res += chars.charAt(Math.floor(Math.random() * chars.length));
        return res;
      };
      const key = `AKHL-${genPart(4)}-${genPart(4)}-${genPart(4)}`;
      const lic: StudentLicense = {
        licenseKey: key,
        studentEmail: `candidate.${cohortPrefix.toLowerCase().replace(/[^a-z0-9]/g, '')}.${i}@swb.edu`,
        studentName: `${cohortPrefix} Candidate ${i.toString().padStart(2, '0')}`,
        maxDevices: 2,
        activeDevices: [],
        issuedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        lastOnlineSync: new Date().toISOString(),
        gracePeriodDays: graceDays,
        status: 'active'
      };
      generated.push(lic);
      all.unshift(lic);
    }

    this.saveAdminLicenses(all);
    return generated;
  }

  /**
   * Generates a CSV string of all licenses for export.
   */
  public static exportLicensesCSV(): string {
    const all = this.getAllAdminLicenses();
    const headers = ['License Key', 'Student Name', 'Email', 'Active Devices', 'Max Devices', 'Grace Period (Days)', 'Last Sync', 'Status'];
    const rows = all.map(l => [
      l.licenseKey,
      `"${l.studentName}"`,
      l.studentEmail,
      l.activeDevices.length,
      l.maxDevices,
      l.gracePeriodDays,
      l.lastOnlineSync,
      l.status
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  }
}
