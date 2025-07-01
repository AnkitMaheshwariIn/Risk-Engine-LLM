import { trackAndScoreIpOrDevice, resetTracker } from '../utils/ipDeviceTracker';

describe('IP and Device Tracker', () => {
  beforeEach(() => {
    // Clear the tracking maps before each test
    resetTracker();
  });

  test('should return 0 score for first-time IP and device', () => {
    const score = trackAndScoreIpOrDevice('192.168.1.1', 'device-123');
    expect(score).toBe(0);
  });

  test('should detect repeat IP after 3 occurrences', () => {
    // First 3 calls should return 0
    expect(trackAndScoreIpOrDevice('192.168.1.1', 'device-123')).toBe(0);
    expect(trackAndScoreIpOrDevice('192.168.1.1', 'device-456')).toBe(0);
    expect(trackAndScoreIpOrDevice('192.168.1.1', 'device-789')).toBe(0);
    
    // 4th call should return score for repeat IP
    const score = trackAndScoreIpOrDevice('192.168.1.1', 'device-999');
    expect(score).toBe(0.15);
  });

  test('should detect repeat device after 3 occurrences', () => {
    // First 3 calls should return 0
    expect(trackAndScoreIpOrDevice('192.168.1.1', 'device-123')).toBe(0);
    expect(trackAndScoreIpOrDevice('192.168.1.2', 'device-123')).toBe(0);
    expect(trackAndScoreIpOrDevice('192.168.1.3', 'device-123')).toBe(0);
    
    // 4th call should return score for repeat device
    const score = trackAndScoreIpOrDevice('192.168.1.4', 'device-123');
    expect(score).toBe(0.15);
  });

  test('should detect both repeat IP and device', () => {
    // Set up repeat IP
    trackAndScoreIpOrDevice('192.168.1.1', 'device-123');
    trackAndScoreIpOrDevice('192.168.1.1', 'device-456');
    trackAndScoreIpOrDevice('192.168.1.1', 'device-789');
    
    // Set up repeat device
    trackAndScoreIpOrDevice('192.168.1.2', 'device-999');
    trackAndScoreIpOrDevice('192.168.1.3', 'device-999');
    trackAndScoreIpOrDevice('192.168.1.4', 'device-999');
    
    // Both should be flagged
    const score = trackAndScoreIpOrDevice('192.168.1.1', 'device-999');
    expect(score).toBe(0.3); // 0.15 + 0.15
  });

  test('should handle multiple repeat IPs', () => {
    // Set up multiple IPs
    trackAndScoreIpOrDevice('192.168.1.1', 'device-123');
    trackAndScoreIpOrDevice('192.168.1.1', 'device-456');
    trackAndScoreIpOrDevice('192.168.1.1', 'device-789');
    
    trackAndScoreIpOrDevice('192.168.1.2', 'device-123');
    trackAndScoreIpOrDevice('192.168.1.2', 'device-456');
    trackAndScoreIpOrDevice('192.168.1.2', 'device-789');
    
    // Both IPs should be flagged
    const score = trackAndScoreIpOrDevice('192.168.1.1', 'device-999');
    expect(score).toBe(0.15); // Only IP 1 is flagged (device is new)
  });

  test('should handle edge cases', () => {
    // Empty strings
    expect(trackAndScoreIpOrDevice('', '')).toBe(0);
    
    // Same IP/device multiple times
    for (let i = 0; i < 5; i++) {
      trackAndScoreIpOrDevice('192.168.1.1', 'device-123');
    }
    
    const score = trackAndScoreIpOrDevice('192.168.1.1', 'device-123');
    expect(score).toBe(0.3); // Both IP and device are repeated
  });

  test('should maintain separate counts for different IPs and devices', () => {
    // Use different IPs and devices
    expect(trackAndScoreIpOrDevice('192.168.1.1', 'device-123')).toBe(0);
    expect(trackAndScoreIpOrDevice('192.168.1.2', 'device-456')).toBe(0);
    expect(trackAndScoreIpOrDevice('192.168.1.3', 'device-789')).toBe(0);
    
    // None should be flagged yet
    const score = trackAndScoreIpOrDevice('192.168.1.4', 'device-999');
    expect(score).toBe(0);
  });
}); 