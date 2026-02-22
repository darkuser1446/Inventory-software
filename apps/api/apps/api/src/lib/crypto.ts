import crypto from 'crypto';
import { env } from '../config/env';

// Use a consistent key for encryption/decryption. 
// In production, this should be a separate secret. For now, we derive it from JWT_SECRET or fallback.
// Ideally, add ENCRYPTION_KEY to env.
// We'll use scrypt to derive a 32-byte key from JWT_SECRET + salt if not provided.
// For simplicity here, we assume JWT_SECRET is long enough or we pad/hash it.

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 16;
const TAG_LENGTH = 16;

// Derive a key from the secret. This is a simple implementation.
// Better to store a 32-byte hex string in ENCRYPTION_KEY.
const getCipherKey = (password: string) => {
    return crypto.createHash('sha256').update(password).digest();

}

export const encrypt = (text: string): string => {
    const iv = crypto.randomBytes(IV_LENGTH);
    const key = getCipherKey(env.JWT_SECRET);
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const tag = cipher.getAuthTag();

    // Return Format: IV:TAG:ENCRYPTED
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
};

export const decrypt = (text: string): string => {
    const parts = text.split(':');
    if (parts.length !== 3) {
        throw new Error('Invalid encrypted text format');
    }

    const [ivHex, tagHex, encryptedHex] = parts;

    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const key = getCipherKey(env.JWT_SECRET);

    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return decrypted;
};
