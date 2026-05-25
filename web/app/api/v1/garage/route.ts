import { NextResponse } from 'next/server';
import { maintenanceItems, researchSources, serviceRecords, vehicle } from '@/lib/maintenance';

export function GET() {
    return NextResponse.json({
        vehicle,
        maintenanceItems,
        serviceRecords,
        researchSources,
    });
}
