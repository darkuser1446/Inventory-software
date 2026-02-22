export function nanoid(length: number = 21): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const bytes = new Uint8Array(length);
    globalThis.crypto?.getRandomValues?.(bytes) ??
        bytes.forEach((_, i) => (bytes[i] = Math.floor(Math.random() * 256)));
    for (let i = 0; i < length; i++) {
        result += chars[bytes[i] % chars.length];
    }
    return result;
}
