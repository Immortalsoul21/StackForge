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


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
