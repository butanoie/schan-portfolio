import { describe, it, expect } from 'vitest';
import { rot13 } from '@/src/utils/obfuscation';

/**
 * Tests for ROT13/ROT5 obfuscation utilities.
 *
 * These tests verify that the ROT13/ROT5 cipher correctly encodes and decodes
 * text by rotating letters 13 positions and digits 5 positions, while leaving
 * special characters and spaces unchanged.
 */
describe('rot13', () => {
  /* ========================================================================
     BASIC LETTER ROTATION (ROT13)
     ======================================================================== */

  it('should rotate lowercase letters by 13 positions', () => {
    expect(rot13('a')).toBe('n');
    expect(rot13('b')).toBe('o');
    expect(rot13('m')).toBe('z');
    expect(rot13('n')).toBe('a');
  });

  it('should rotate uppercase letters by 13 positions', () => {
    expect(rot13('A')).toBe('N');
    expect(rot13('B')).toBe('O');
    expect(rot13('M')).toBe('Z');
    expect(rot13('N')).toBe('A');
  });

  it('should handle complete alphabet transformation', () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const expectedLower = 'nopqrstuvwxyzabcdefghijklm';
    expect(rot13(lowercase)).toBe(expectedLower);

    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const expectedUpper = 'NOPQRSTUVWXYZABCDEFGHIJKLM';
    expect(rot13(uppercase)).toBe(expectedUpper);
  });

  /* ========================================================================
     DIGIT ROTATION (ROT5)
     ======================================================================== */

  it('should rotate digits by 5 positions', () => {
    expect(rot13('0')).toBe('5');
    expect(rot13('1')).toBe('6');
    expect(rot13('5')).toBe('0');
    expect(rot13('9')).toBe('4');
  });

  it('should handle all digits correctly', () => {
    const digits = '0123456789';
    const expectedDigits = '5678901234';
    expect(rot13(digits)).toBe(expectedDigits);
  });

  /* ========================================================================
     SPECIAL CHARACTERS AND SPACES
     ======================================================================== */

  it('should leave special characters unchanged', () => {
    expect(rot13('@')).toBe('@');
    expect(rot13('.')).toBe('.');
    expect(rot13('!')).toBe('!');
    expect(rot13('-')).toBe('-');
    expect(rot13('+')).toBe('+');
    expect(rot13(':')).toBe(':');
    expect(rot13('?')).toBe('?');
  });

  it('should leave spaces unchanged', () => {
    expect(rot13(' ')).toBe(' ');
    expect(rot13('  ')).toBe('  ');
  });

  it('should preserve mixed special characters', () => {
    expect(rot13('!@#$%^&*()')).toBe('!@#$%^&*()');
  });

  /* ========================================================================
     EMAIL OBFUSCATION
     ======================================================================== */

  it('should obfuscate an email address correctly', () => {
    const email = 'sing@singchan.com';
    const obfuscated = rot13(email);

    // The expected result: s->f, i->v, n->a, g->t, @ unchanged, etc.
    expect(obfuscated).toBe('fvat@fvatpuna.pbz');
  });

  it('should deobfuscate an obfuscated email (reversible)', () => {
    const original = 'sing@singchan.com';
    const obfuscated = rot13(original);
    const deobfuscated = rot13(obfuscated);

    expect(deobfuscated).toBe(original);
  });

  it('should handle complex email with query parameters', () => {
    const email = 'mailto:sing@singchan.com?subject=Contact';
    const obfuscated = rot13(email);

    // Verify it's different from original
    expect(obfuscated).not.toBe(email);

    // Verify it can be reversed
    expect(rot13(obfuscated)).toBe(email);
  });

  /* ========================================================================
     PHONE NUMBER OBFUSCATION
     ======================================================================== */

  it('should obfuscate a phone number correctly', () => {
    const phone = 'tel:+1-604-773-2843';
    const obfuscated = rot13(phone);

    // The expected result with digits rotated
    expect(obfuscated).toBe('gry:+6-159-228-7398');
  });

  it('should deobfuscate an obfuscated phone number (reversible)', () => {
    const original = 'tel:+1-604-773-2843';
    const obfuscated = rot13(original);
    const deobfuscated = rot13(obfuscated);

    expect(deobfuscated).toBe(original);
  });

  it('should handle plain phone numbers', () => {
    const phone = '+1-604-773-2843';
    const obfuscated = rot13(phone);

    expect(obfuscated).toBe('+6-159-228-7398');
    expect(rot13(obfuscated)).toBe(phone);
  });

  /* ========================================================================
     MIXED CONTENT
     ======================================================================== */

  it('should handle mixed case and numbers', () => {
    const mixed = 'Test123';
    const obfuscated = rot13(mixed);

    // T->G, e->r, s->f, t->g, 1->6, 2->7, 3->8
    expect(obfuscated).toBe('Grfg678');
  });

  it('should handle complex strings with punctuation', () => {
    const complex = 'Hello, World! 123';
    const obfuscated = rot13(complex);

    // Should reverse correctly
    expect(rot13(obfuscated)).toBe(complex);
  });

  it('should handle URLs correctly', () => {
    const url = 'https://github.com/butanoie';
    const obfuscated = rot13(url);

    // Verify reversibility
    expect(rot13(obfuscated)).toBe(url);

    // Verify it's different (has letters and numbers)
    expect(obfuscated).not.toBe(url);
  });

  /* ========================================================================
     EDGE CASES
     ======================================================================== */

  it('should handle empty string', () => {
    expect(rot13('')).toBe('');
  });

  it('should handle only special characters', () => {
    const special = '!@#$%^&*()';
    expect(rot13(special)).toBe(special);
  });

  it('should handle only numbers', () => {
    const numbers = '0123456789';
    const rotated = '5678901234';
    expect(rot13(numbers)).toBe(rotated);
  });

  it('should handle only letters', () => {
    const letters = 'abcABC';
    const rotated = 'nopNOP';
    expect(rot13(letters)).toBe(rotated);
  });

  it('should handle only spaces', () => {
    expect(rot13('   ')).toBe('   ');
  });

  /* ========================================================================
     REVERSIBILITY (IDEMPOTENT PROPERTY)
     ======================================================================== */

  it('should be reversible - applying twice returns original', () => {
    const original = 'Hello World 123!';
    const encrypted = rot13(original);
    const decrypted = rot13(encrypted);

    expect(decrypted).toBe(original);
  });

  it('should handle very long strings', () => {
    const longString = 'a'.repeat(1000);
    const obfuscated = rot13(longString);
    const deobfuscated = rot13(obfuscated);

    expect(deobfuscated).toBe(longString);
    expect(obfuscated).toBe('n'.repeat(1000));
  });

  it('should handle unicode spaces (preserved as-is)', () => {
    const text = 'hello\nworld\ttab';
    const obfuscated = rot13(text);

    // Newlines and tabs should be preserved
    expect(obfuscated).toContain('\n');
    expect(obfuscated).toContain('\t');

    // Should be reversible
    expect(rot13(obfuscated)).toBe(text);
  });

  /* ========================================================================
     PRACTICAL USE CASES
     ======================================================================== */

  it('should obfuscate the actual resume contact email', () => {
    const email = 'sing@singchan.com';
    const obfuscated = rot13(email);

    // Should match the obfuscated version in the resume data
    expect(obfuscated).toBe('fvat@fvatpuna.pbz');
  });

  it('should obfuscate the actual resume contact phone', () => {
    const phone = '+1-604-773-2843';
    const obfuscated = rot13(phone);

    // Should match the obfuscated version in the resume data
    expect(obfuscated).toBe('+6-159-228-7398');
  });

  it('should handle mailto URI with encoded parameters', () => {
    const mailtoUri = 'mailto:sing@singchan.com?subject=Contact via Portfolio Site';
    const obfuscated = rot13(mailtoUri);

    // Should be reversible
    expect(rot13(obfuscated)).toBe(mailtoUri);
  });

  it('should handle tel URI', () => {
    const telUri = 'tel:+1-604-773-2843';
    const obfuscated = rot13(telUri);

    // Should be reversible
    expect(rot13(obfuscated)).toBe(telUri);
  });
});
