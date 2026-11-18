import { NextRequest, NextResponse } from 'next/server';
import { getItemById, updateItem, deleteItem } from '@/lib/db';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getItemById(id);
  if (!item) return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: item });
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const item = updateItem(id, body);
    if (!item) return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: item });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to update item' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const deleted = deleteItem(id);
  if (!deleted) return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
  return NextResponse.json({ success: true, data: { deleted: true } });
}
