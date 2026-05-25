import { PrismaClient } from '@prisma/client';
import garageData from '../data/garage.json';

const prisma = new PrismaClient();

function sourceId(label: string) {
    return label
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

async function main() {
    const garage = garageData;

    await prisma.vehicle.upsert({
        where: { vin: garage.vehicle.vin },
        update: garage.vehicle,
        create: garage.vehicle,
    });

    for (const item of garage.maintenanceItems) {
        await prisma.maintenanceItem.upsert({
            where: { id: item.id },
            update: item,
            create: item,
        });
    }

    for (const record of garage.serviceRecords) {
        await prisma.serviceRecord.upsert({
            where: { id: record.id },
            update: record,
            create: record,
        });
    }

    for (const source of garage.researchSources) {
        await prisma.researchSource.upsert({
            where: { id: sourceId(source.label) },
            update: source,
            create: {
                id: sourceId(source.label),
                ...source,
            },
        });
    }
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (error) => {
        console.error(error);
        await prisma.$disconnect();
        process.exit(1);
    });
