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
