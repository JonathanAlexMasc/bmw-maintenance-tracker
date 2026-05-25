import { NextResponse } from 'next/server';
import { createMaintenanceItem, maintenanceItems } from '@/lib/maintenance';

export function GET() {
    return NextResponse.json({ maintenanceItems });
}

export async function POST(request: Request) {
    const item = createMaintenanceItem(await request.json());

    if (!item) {
        return NextResponse.json(
            { error: 'title and dueMileage are required' },
            { status: 400 },
        );
    }

    maintenanceItems.push(item);
    return NextResponse.json(item, { status: 201 });
}
