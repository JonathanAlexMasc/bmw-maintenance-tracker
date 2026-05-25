import { NextResponse } from 'next/server';
import { getServiceRecords } from '@/lib/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json({ serviceRecords: await getServiceRecords() });
}
