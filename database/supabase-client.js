const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase client configuration
// This is optional - only needed if you want to use Supabase-specific features
// like Storage, Realtime, or Supabase Auth

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

let supabase = null;

// Only create client if Supabase credentials are provided
if (supabaseUrl && supabaseServiceKey) {
    supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });
    console.log('✓ Supabase client initialized');
} else {
    console.log('ℹ Supabase client not initialized (credentials not provided)');
}

module.exports = supabase;
