const { Client } = require('pg');
require('dotenv').config();

const encodedPassword = encodeURIComponent(process.env.DB_PASSWORD);
const projectID = 'yyzpcrladfsgspzhmago';

// IPv6 Address resolved from nslookup
const ipv6Host = '2406:da1c:f42:ae0c:6715:60e:2555:283e';

// List of potential connection strings to test
const configs = [
    {
        name: 'Direct (IPv6 - Hardcoded)',
        // MUST use brackets for IPv6 literal in URL
        connectionString: `postgres://postgres:${encodedPassword}@[${ipv6Host}]:5432/postgres?sslmode=require`,
    },
    {
        name: 'Pooler (Sydney) - User: postgres.projectid',
        connectionString: `postgres://postgres.${projectID}:${encodedPassword}@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true`,
    },
    {
        name: 'Pooler (Sydney) - User: postgres',
        connectionString: `postgres://postgres:${encodedPassword}@aws-0-ap-southeast-2.pooler.supabase.com:6543/postgres?sslmode=require&pgbouncer=true`,
    }
];

async function testConnection(config) {
    console.log(`\nTesting: ${config.name}...`);
    // Obfuscate password for log safety
    const safeString = config.connectionString.replace(encodedPassword, '********');
    console.log(`Target: ${safeString}`);

    const client = new Client({
        connectionString: config.connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 10000
    });

    try {
        await client.connect();
        const res = await client.query('SELECT NOW() as now, version()');
        console.log(`✅ SUCCESS! Connected to ${config.name}`);
        console.log(`   Time: ${res.rows[0].now}`);
        await client.end();
        return true;
    } catch (err) {
        console.error(`❌ FAILED: ${config.name}`);
        console.error(`   Error: ${err.message}`);
        if (err.code) console.error(`   Code: ${err.code}`);
        return false;
    }
}

async function runTests() {
    console.log('🔍 Starting EXHAUSTIVE Connection Tests (IPv6 Focused)...');

    let success = false;
    for (const config of configs) {
        if (await testConnection(config)) {
            success = true;
            console.log(`\n✨ Working configuration found: ${config.name}`);
            break;
        }
    }

    if (!success) {
        console.error('\n❌ All attempts failed.');
    }
}

runTests();
