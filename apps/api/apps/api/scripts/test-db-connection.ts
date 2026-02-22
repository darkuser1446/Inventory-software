
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const logFile = 'db-error.log';
// Clear log
fs.writeFileSync(logFile, '');

async function log(msg: string) {
    console.log(msg);
    fs.appendFileSync(logFile, msg + '\n');
}

async function testConnection(password: string, host: string, dbName: string) {
    const url = `postgresql://postgres:${password}@${host}:5432/${dbName}?schema=public`;
    log(`\n----------------------------------------`);
    log(`Testing: postgres:****@${host}:5432/${dbName}`);

    const prisma = new PrismaClient({
        datasources: {
            db: {
                url: url,
            },
        },
        log: [],
    });

    try {
        await prisma.$connect();
        log(`✅ SUCCESS! Connected to ${dbName} at ${host} with password ending in ...${password.slice(-3)}`);

        // If connected to 'postgres' or 'oms_db', list databases if possible (raw query)
        try {
            const dbs = await prisma.$queryRawUnsafe('SELECT datname FROM pg_database;');
            log(`Databases: ${JSON.stringify(dbs)}`);
        } catch (e: any) {
            log(`Could not list databases: ${e.message}`);
        }

        await prisma.$disconnect();
        return true;
    } catch (e: any) {
        log(`❌ Failed: ${e.message}`);
        await prisma.$disconnect();
        return false;
    }
}

async function main() {
    // Passwords to try
    const passwords = ['postgres', 'postgrespassword', 'password', 'admin', 'root'];
    // Hosts to try
    const hosts = ['localhost', '127.0.0.1', '::1'];
    // DBs to try
    const dbs = ['postgres', 'oms_db'];

    let anySuccess = false;

    // Outer loop: passwords (most likely cause)
    for (const p of passwords) {
        // Try connecting to default 'postgres' DB first (it should always exist)
        // on localhost
        if (await testConnection(p, 'localhost', 'postgres')) {
            anySuccess = true;
            // If success, try oms_db
            log(`\nCredentials valid for 'postgres' DB. Checking 'oms_db'...`);
            if (await testConnection(p, 'localhost', 'oms_db')) {
                log(`\n🎉 FULL SUCCESS! 'oms_db' is accessible with password "${p}"`);
                process.exit(0);
            } else {
                log(`\n⚠️ Auth worked but 'oms_db' access failed (maybe it doesn't exist?).`);
                // process.exit(0); // Exit to report partial success
            }
            break; // Stop testing other passwords if one worked for postgres
        }
    }

    if (!anySuccess) {
        log('\n❌ All attempts failed.');
        process.exit(1);
    }
}

main().catch(e => log(e.toString()));
