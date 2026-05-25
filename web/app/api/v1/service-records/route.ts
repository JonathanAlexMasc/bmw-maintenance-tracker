import { NextResponse } from 'next/server';
import { serviceRecords } from '@/lib/maintenance';

export function GET() {
    return NextResponse.json({ serviceRecords });
}
