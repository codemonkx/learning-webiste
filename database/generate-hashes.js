// Script to generate proper bcrypt hashes for seed data
const bcrypt = require('bcrypt');

async function generateHashes() {
    console.log('Generating bcrypt hashes for seed data...\n');

    const passwords = {
        'admin123': 'admin',
        'password123': 'students'
    };

    for (const [password, label] of Object.entries(passwords)) {
        const hash = await bcrypt.hash(password, 10);
        console.log(`${label} (${password}):`);
        console.log(hash);
        console.log('');
    }
}

generateHashes();
