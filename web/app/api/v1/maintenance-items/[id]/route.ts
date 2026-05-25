import { NextResponse } from 'next/server';
import { updateMaintenanceItem } from '@/lib/repository';

export const dynamic = 'force-dynamic';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    const id = Number(params.id);

    if (!Number.isInteger(id)) {
        return NextResponse.json({ error: 'valid maintenance item id is required' }, { status: 400 });
    }

    const item = await updateMaintenanceItem(id, await request.json());

    if (!item) {
        return NextResponse.json({ error: 'maintenance item not found' }, { status: 404 });
    }

    return NextResponse.json(item);
}
