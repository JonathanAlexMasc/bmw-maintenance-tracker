export type MaintenanceItem = {
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

export const currentMileage = 68420;

export const vehicle = {
    year: 2018,
    make: 'BMW',
    model: '340i xDrive',
    currentMileage,
};

export const maintenanceItems: MaintenanceItem[] = [
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

export function createMaintenanceItem(input: {
    title?: string;
    dueMileage?: number;
    estimatedCost?: number;
}): MaintenanceItem | null {
    const parsedDueMileage = Number(input.dueMileage);
    const parsedEstimatedCost = Number(input.estimatedCost ?? 0);

    if (!input.title || !Number.isFinite(parsedDueMileage)) {
        return null;
    }

    return {
        id: Date.now(),
        title: input.title,
        category: 'Custom',
        dueMileage: parsedDueMileage,
        intervalMiles: 7500,
        lastDoneMileage: currentMileage,
        lastDoneDate: new Date().toISOString().slice(0, 10),
        estimatedCost: Number.isFinite(parsedEstimatedCost) ? parsedEstimatedCost : 0,
        notes: 'Added from quick entry.',
    };
}
