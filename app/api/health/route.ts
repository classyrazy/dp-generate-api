import { NextResponse } from 'next/server';
import chromium from '@sparticuz/chromium';

export async function GET() {
  try {
    // Test chromium availability
    const executablePath = await chromium.executablePath();
    
    return NextResponse.json({
      status: 'ok',
      environment: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
      chromiumPath: executablePath ? 'Available' : 'Not Available',
      chromiumArgs: chromium.args.length,
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      environment: process.env.NODE_ENV,
      isVercel: !!process.env.VERCEL,
    });
  }
}
