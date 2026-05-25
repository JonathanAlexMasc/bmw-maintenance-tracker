import { NextResponse } from 'next/server';
import { maintenanceItems, vehicle } from '@/lib/maintenance';

export function GET() {
    return NextResponse.json({
        vehicle,
        maintenanceItems,
    });
}
