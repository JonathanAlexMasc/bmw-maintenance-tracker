import { NextResponse } from 'next/server';
import { getGarage } from '@/lib/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
    return NextResponse.json(await getGarage());
}
