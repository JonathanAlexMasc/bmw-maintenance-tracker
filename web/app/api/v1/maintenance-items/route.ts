import { NextResponse } from 'next/server';
import { createMaintenanceItem, getMaintenanceItems } from '@/lib/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({ maintenanceItems: await getMaintenanceItems() });
}

export async function POST(request: Request) {
    const item = await createMaintenanceItem(await request.json());

    if (!item) {
        return NextResponse.json(
            { error: 'title and dueMileage are required' },
            { status: 400 },
        );
    }

    return NextResponse.json(item, { status: 201 });
}
