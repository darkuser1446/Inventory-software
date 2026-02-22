
console.log('Checking Environment Variables...');
console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Defined' : 'Undefined');
if (process.env.DATABASE_URL) {
    const url = process.env.DATABASE_URL;
    // Mask password
    const masked = url.replace(/:([^:@]+)@/, ':****@');
    console.log('DATABASE_URL Value:', masked);
}
