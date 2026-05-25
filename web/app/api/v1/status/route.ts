import { NextResponse } from 'next/server';

export function GET() {
    return NextResponse.json({
        message: 'API running',
        env: process.env.NODE_ENV,
    });
}
