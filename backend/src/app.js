const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const errorHandler = require('./middlewares/errorMiddleware');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

app.use(helmet());
app.use(express.json());

const allowedOrigins = [
    'http://localhost',
    'http://127.0.0.1',
    'http://13.218.231.87'
];

app.use(cors({
    origin: function (origin, callback) {
        if (!origin) return callback(null, true);

        const isAllowed = allowedOrigins.some(allowed =>
            origin.startsWith(allowed)
        );

        if (isAllowed) return callback(null, true);

        console.error('Blocked by CORS:', origin);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors());

// Debug (temporary)
app.use((req, res, next) => {
    console.log('Origin:', req.headers.origin);
    next();
});

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.use(errorHandler);

module.exports = app;
