// Next.js API route for fetching pNodes
// This allows server-side fetching and caching

import { NextResponse } from 'next/server';
import { fetchPNodes } from '@/lib/pnode-api';

export const dynamic = 'force-dynamic'; // Always fetch fresh data
export const revalidate = 0; // No caching

export async function GET() {
  try {
    const pNodes = await fetchPNodes();
    return NextResponse.json({ pNodes, timestamp: Date.now() });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pNodes', pNodes: [] },
      { status: 500 }
    );
  }
}

