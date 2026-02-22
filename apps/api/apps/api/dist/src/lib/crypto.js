"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_1 = __importDefault(require("crypto"));
const env_1 = require("../config/env");
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
const getCipherKey = (password) => {
    return crypto_1.default.createHash('sha256').update(password).digest();
};
const encrypt = (text) => {
    const iv = crypto_1.default.randomBytes(IV_LENGTH);
    const key = getCipherKey(env_1.env.JWT_SECRET);
    const cipher = crypto_1.default.createCipheriv(ALGORITHM, key, iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const tag = cipher.getAuthTag();
    // Return Format: IV:TAG:ENCRYPTED
    return `${iv.toString('hex')}:${tag.toString('hex')}:${encrypted}`;
};
exports.encrypt = encrypt;
const decrypt = (text) => {
    const parts = text.split(':');
    if (parts.length !== 3) {
        throw new Error('Invalid encrypted text format');
    }
    const [ivHex, tagHex, encryptedHex] = parts;
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    const key = getCipherKey(env_1.env.JWT_SECRET);
    const decipher = crypto_1.default.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    let decrypted = decipher.update(encryptedHex, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};
exports.decrypt = decrypt;
//# sourceMappingURL=crypto.js.map