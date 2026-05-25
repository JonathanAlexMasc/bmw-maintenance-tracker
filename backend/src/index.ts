import 'dotenv/config';
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

type MaintenanceItem = {
    id: number;
    title: string;
    category: string;
    dueMileage: number;
    intervalMiles: number;
    lastDoneMileage: number;
    lastDoneDate: string;
    estimatedCost: number;
    notes: string;
};

const currentMileage = 68420;

let maintenanceItems: MaintenanceItem[] = [
    {
        id: 1,
        title: 'Engine oil and filter',
        category: 'Drivetrain',
        dueMileage: 69500,
        intervalMiles: 7500,
        lastDoneMileage: 62000,
        lastDoneDate: '2025-11-12',
        estimatedCost: 145,
        notes: 'Use BMW LL-01 5W-30 and inspect for leaks.',
    },
    {
        id: 2,
        title: 'Brake fluid flush',
        category: 'Brakes',
        dueMileage: 68200,
        intervalMiles: 24000,
        lastDoneMileage: 44200,
        lastDoneDate: '2024-04-20',
        estimatedCost: 185,
        notes: 'Two-year service item. Check pedal feel after bleed.',
    },
    {
        id: 3,
        title: 'Cabin microfilter',
        category: 'Comfort',
        dueMileage: 71000,
        intervalMiles: 15000,
        lastDoneMileage: 56000,
        lastDoneDate: '2025-06-04',
        estimatedCost: 75,
        notes: 'Charcoal filter preferred before summer.',
    },
];

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
}));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes (to be implemented)
app.get('/api/v1/status', (req, res) => {
    res.json({ message: 'API running', env: process.env.NODE_ENV });
});

app.get('/api/v1/garage', (req, res) => {
    res.json({
        vehicle: {
            year: 2018,
            make: 'BMW',
            model: '340i xDrive',
            currentMileage,
        },
        maintenanceItems,
    });
});

app.post('/api/v1/maintenance-items', (req, res) => {
    const { title, dueMileage, estimatedCost } = req.body as {
        title?: string;
        dueMileage?: number;
        estimatedCost?: number;
    };

    const parsedDueMileage = Number(dueMileage);
    const parsedEstimatedCost = Number(estimatedCost ?? 0);

    if (!title || !Number.isFinite(parsedDueMileage)) {
        res.status(400).json({ error: 'title and dueMileage are required' });
        return;
    }

    const item: MaintenanceItem = {
        id: Date.now(),
        title,
        category: 'Custom',
        dueMileage: parsedDueMileage,
        intervalMiles: 7500,
        lastDoneMileage: currentMileage,
        lastDoneDate: new Date().toISOString().slice(0, 10),
        estimatedCost: Number.isFinite(parsedEstimatedCost) ? parsedEstimatedCost : 0,
        notes: 'Added from quick entry.',
    };

    maintenanceItems = [...maintenanceItems, item];
    res.status(201).json(item);
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    void req;
    void next;
    console.error('Error:', err);
    res.status(500).json({
        error: err.message || 'Internal server error',
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on http://localhost:${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});

export default app;
