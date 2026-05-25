import garageData from '@/data/garage.json';

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
    source?: string;
};

export type ServiceRecord = {
    id: string;
    date: string;
    mileage: number | null;
    provider: string;
    location: string;
    services: string[];
    source: string;
    flag?: 'damage' | 'mileage_inconsistency';
};

export type ResearchSource = {
    label: string;
    url: string;
};

export type Vehicle = {
    year: number;
    make: string;
    model: string;
    series: string;
    vin: string;
    body: string;
    engine: string;
    fuel: string;
    drive: string;
    color: string;
    currentMileage: number;
    currentMileageSource: string;
    notes: string[];
};

export type GarageData = {
    vehicle: Vehicle;
    maintenanceItems: MaintenanceItem[];
    serviceRecords: ServiceRecord[];
    researchSources: ResearchSource[];
};

export const garage = garageData as GarageData;
export const vehicle = garage.vehicle;
export const currentMileage = vehicle.currentMileage;
export const maintenanceItems: MaintenanceItem[] = [...garage.maintenanceItems];
export const serviceRecords = garage.serviceRecords;
export const researchSources = garage.researchSources;

export function createMaintenanceItem(input: {
    title?: string;
    dueMileage?: number;
    estimatedCost?: number;
}): MaintenanceItem | null {
    const parsedDueMileage = Number(input.dueMileage);
    const parsedEstimatedCost = Number(input.estimatedCost ?? 0);

    if (!input.title?.trim() || !Number.isFinite(parsedDueMileage)) {
        return null;
    }

    return {
        id: Date.now(),
        title: input.title.trim(),
        category: 'Custom',
        dueMileage: parsedDueMileage,
        intervalMiles: 7500,
        lastDoneMileage: currentMileage,
        lastDoneDate: new Date().toISOString().slice(0, 10),
        estimatedCost: Number.isFinite(parsedEstimatedCost) ? parsedEstimatedCost : 0,
        notes: 'Added from quick entry.',
    };
}
