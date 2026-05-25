import { Prisma } from '@prisma/client';
import {
    garage,
    maintenanceItems as fallbackMaintenanceItems,
    researchSources as fallbackResearchSources,
    serviceRecords as fallbackServiceRecords,
    vehicle as fallbackVehicle,
    type GarageData,
    type MaintenanceItem,
    type ResearchSource,
    type ServiceRecord,
    type Vehicle,
} from '@/lib/maintenance';
import { prisma } from '@/lib/prisma';

type MaintenanceInput = {
    title?: string;
    dueMileage?: number;
    estimatedCost?: number;
};

function hasDatabaseUrl() {
    return Boolean(process.env.DATABASE_URL);
}

function parseServices(value: Prisma.JsonValue): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function parseNotes(value: Prisma.JsonValue): string[] {
    return Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string') : [];
}

function toVehicle(vehicle: Awaited<ReturnType<typeof prisma.vehicle.findFirst>>): Vehicle | null {
    if (!vehicle) {
        return null;
    }

    return {
        year: vehicle.year,
        make: vehicle.make,
        model: vehicle.model,
        series: vehicle.series,
        vin: vehicle.vin,
        body: vehicle.body,
        engine: vehicle.engine,
        fuel: vehicle.fuel,
        drive: vehicle.drive,
        color: vehicle.color,
        currentMileage: vehicle.currentMileage,
        currentMileageSource: vehicle.currentMileageSource,
        notes: parseNotes(vehicle.notes),
    };
}

function toServiceRecord(record: Awaited<ReturnType<typeof prisma.serviceRecord.findMany>>[number]): ServiceRecord {
    return {
        id: record.id,
        date: record.date,
        mileage: record.mileage,
        provider: record.provider,
        location: record.location,
        services: parseServices(record.services),
        source: record.source,
        flag:
            record.flag === 'damage' || record.flag === 'mileage_inconsistency'
                ? record.flag
                : undefined,
    };
}

function toMaintenanceItem(
    item: Awaited<ReturnType<typeof prisma.maintenanceItem.findMany>>[number],
): MaintenanceItem {
    return {
        id: item.id,
        title: item.title,
        category: item.category,
        dueMileage: item.dueMileage,
        intervalMiles: item.intervalMiles,
        lastDoneMileage: item.lastDoneMileage,
        lastDoneDate: item.lastDoneDate,
        estimatedCost: item.estimatedCost,
        notes: item.notes,
        source: item.source ?? undefined,
    };
}

function toResearchSource(source: Awaited<ReturnType<typeof prisma.researchSource.findMany>>[number]): ResearchSource {
    return {
        label: source.label,
        url: source.url,
    };
}

async function getDatabaseGarage(): Promise<GarageData | null> {
    const [dbVehicle, dbMaintenanceItems, dbServiceRecords, dbResearchSources] = await Promise.all([
        prisma.vehicle.findFirst(),
        prisma.maintenanceItem.findMany({ orderBy: [{ dueMileage: 'asc' }, { id: 'asc' }] }),
        prisma.serviceRecord.findMany({ orderBy: [{ date: 'asc' }, { id: 'asc' }] }),
        prisma.researchSource.findMany({ orderBy: { label: 'asc' } }),
    ]);

    const vehicle = toVehicle(dbVehicle);

    if (!vehicle) {
        return null;
    }

    return {
        vehicle,
        maintenanceItems: dbMaintenanceItems.map(toMaintenanceItem),
        serviceRecords: dbServiceRecords.map(toServiceRecord),
        researchSources: dbResearchSources.map(toResearchSource),
    };
}

export async function getGarage(): Promise<GarageData> {
    if (!hasDatabaseUrl()) {
        return garage;
    }

    try {
        return (await getDatabaseGarage()) ?? garage;
    } catch (error) {
        console.error('Falling back to seed data because the database query failed.', error);
        return garage;
    }
}

export async function getMaintenanceItems(): Promise<MaintenanceItem[]> {
    return (await getGarage()).maintenanceItems;
}

export async function getServiceRecords(): Promise<ServiceRecord[]> {
    return (await getGarage()).serviceRecords;
}

export async function createMaintenanceItem(input: MaintenanceInput): Promise<MaintenanceItem | null> {
    const parsedDueMileage = Number(input.dueMileage);
    const parsedEstimatedCost = Number(input.estimatedCost ?? 0);

    if (!input.title?.trim() || !Number.isFinite(parsedDueMileage)) {
        return null;
    }

    const item = {
        title: input.title.trim(),
        category: 'Custom',
        dueMileage: parsedDueMileage,
        intervalMiles: 7500,
        lastDoneMileage: fallbackVehicle.currentMileage,
        lastDoneDate: new Date().toISOString().slice(0, 10),
        estimatedCost: Number.isFinite(parsedEstimatedCost) ? parsedEstimatedCost : 0,
        notes: 'Added from quick entry.',
    };

    if (!hasDatabaseUrl()) {
        const fallbackItem = {
            id: Math.max(...fallbackMaintenanceItems.map((maintenanceItem) => maintenanceItem.id)) + 1,
            ...item,
        };

        fallbackMaintenanceItems.push(fallbackItem);
        return fallbackItem;
    }

    try {
        return toMaintenanceItem(await prisma.maintenanceItem.create({ data: item }));
    } catch (error) {
        console.error('Unable to create maintenance item in the database.', error);
        return null;
    }
}

export async function updateMaintenanceItem(
    id: number,
    input: Partial<Pick<MaintenanceItem, 'dueMileage' | 'lastDoneDate' | 'lastDoneMileage'>>,
): Promise<MaintenanceItem | null> {
    if (!hasDatabaseUrl()) {
        const itemIndex = fallbackMaintenanceItems.findIndex((item) => item.id === id);

        if (itemIndex < 0) {
            return null;
        }

        fallbackMaintenanceItems[itemIndex] = {
            ...fallbackMaintenanceItems[itemIndex],
            ...input,
        };

        return fallbackMaintenanceItems[itemIndex];
    }

    try {
        return toMaintenanceItem(await prisma.maintenanceItem.update({ where: { id }, data: input }));
    } catch (error) {
        console.error('Unable to update maintenance item in the database.', error);
        return null;
    }
}

export { fallbackResearchSources, fallbackServiceRecords };
