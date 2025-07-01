const ipMap: Record<string, number> = {};
const deviceMap: Record<string, number> = {};

export function trackAndScoreIpOrDevice(ip: string, deviceFingerprint: string): number {
  let score = 0;
  ipMap[ip] = (ipMap[ip] || 0) + 1;
  deviceMap[deviceFingerprint] = (deviceMap[deviceFingerprint] || 0) + 1;

  if (ipMap[ip] > 3) score += 0.15;
  if (deviceMap[deviceFingerprint] > 3) score += 0.15;

  return score;
}

export function resetTracker(): void {
  Object.keys(ipMap).forEach(key => delete ipMap[key]);
  Object.keys(deviceMap).forEach(key => delete deviceMap[key]);
} 