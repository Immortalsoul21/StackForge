const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log to console for dev
    if (process.env.NODE_ENV === 'development') {
        console.error(err);
    }

    // Handle PostgREST / Supabase errors
    // Duplicate key (Postgres code 23505)
    if (err.code === '23505') {
        error.message = 'Duplicate field value entered';
        error.statusCode = 400;
    }

    // Foreign key violation (Postgres code 23503)
    if (err.code === '23503') {
        error.message = 'Referenced resource not found';
        error.statusCode = 400;
    }

    // UUID type mismatch or similar (Postgres code 22P02)
    if (err.code === '22P02') {
        error.message = 'Invalid ID format';
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
    });
};

module.exports = errorHandler;
