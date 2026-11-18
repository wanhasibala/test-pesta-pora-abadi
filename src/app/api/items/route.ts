import { NextRequest, NextResponse } from 'next/server';
import { getItems, createItem } from '@/lib/db';
import { Item } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search')?.toLowerCase() || '';
    const status = searchParams.get('status') || '';
    const location = searchParams.get('location') || '';
    const category = searchParams.get('category') || '';
    const sortBy = searchParams.get('sortBy') || 'updatedAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';

    let items = getItems();

    if (search) items = items.filter(i => i.name.toLowerCase().includes(search) || i.category.toLowerCase().includes(search));
    if (status && status !== 'all') items = items.filter(i => i.status === status);
    if (location && location !== 'all') items = items.filter(i => i.location === location);
    if (category && category !== 'all') items = items.filter(i => i.category === category);

    items = items.sort((a, b) => {
      let aVal = a[sortBy as keyof Item];
      let bVal = b[sortBy as keyof Item];
      if (typeof aVal === 'string') aVal = aVal.toLowerCase();
      if (typeof bVal === 'string') bVal = bVal.toLowerCase();
      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return NextResponse.json({ success: true, data: items });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch items' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, category, stock, status, location } = body;

    if (!name || !category || stock === undefined || !status || !location) {
      return NextResponse.json({ success: false, error: 'All fields are required' }, { status: 400 });
    }
    if (stock < 0) return NextResponse.json({ success: false, error: 'Stock cannot be negative' }, { status: 400 });

    const item = createItem({ name, category, stock: Number(stock), status, location });
    return NextResponse.json({ success: true, data: item }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create item' }, { status: 500 });
  }
}
