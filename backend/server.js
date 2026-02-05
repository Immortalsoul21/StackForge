const app = require('./src/app');
const dotenv = require('dotenv');
const supabase = require('./src/utils/supabase');

// Load env vars
dotenv.config();

const PORT = process.env.PORT || 5000;

// Simple check for Supabase variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
    console.warn('WARNING: Supabase credentials missing in .env');
}

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
    console.log('Using Supabase as the database provider');
});
