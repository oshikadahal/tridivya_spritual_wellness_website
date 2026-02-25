import { hashPassword, comparePassword, validatePasswordStrength } from '../../src/utils/password';

describe('Password Utility Functions', () => {
  describe('validatePasswordStrength', () => {
    it('should validate a strong password', () => {
      const result = validatePasswordStrength('StrongPass123!');
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject password without uppercase', () => {
      const result = validatePasswordStrength('strongpass123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one uppercase letter');
    });

    it('should reject password without lowercase', () => {
      const result = validatePasswordStrength('STRONGPASS123!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one lowercase letter');
    });

    it('should reject password without numbers', () => {
      const result = validatePasswordStrength('StrongPass!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one number');
    });

    it('should reject password without special characters', () => {
      const result = validatePasswordStrength('StrongPass123');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must contain at least one special character');
    });

    it('should reject password that is too short', () => {
      const result = validatePasswordStrength('Short1!');
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Password must be at least 8 characters long');
    });
  });

  describe('hashPassword & comparePassword', () => {
    it('should hash a password and compare successfully', async () => {
      const password = 'TestPassword123!';
      const hashed = await hashPassword(password);

      expect(hashed).not.toBe(password);
      
      const isMatch = await comparePassword(password, hashed);
      expect(isMatch).toBe(true);
    });

    it('should return false when comparing with wrong password', async () => {
      const password = 'TestPassword123!';
      const wrongPassword = 'WrongPassword123!';
      const hashed = await hashPassword(password);

      const isMatch = await comparePassword(wrongPassword, hashed);
      expect(isMatch).toBe(false);
    });

    it('should hash different strings to different hashes', async () => {
      const password1 = 'TestPassword123!';
      const password2 = 'TestPassword123!';

      const hash1 = await hashPassword(password1);
      const hash2 = await hashPassword(password2);

      expect(hash1).not.toBe(hash2); // Bcrypt adds salt, so hashes differ
    });
  });
});
