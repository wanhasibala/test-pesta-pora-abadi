import { NextRequest, NextResponse } from 'next/server';
import { getTransactions, createTransaction } from '@/lib/db';

export async function GET() {
  try {
    const transactions = getTransactions();
    return NextResponse.json({ success: true, data: transactions });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch transactions' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, type, quantity, note } = body;

    if (!itemId || !type || !quantity) {
      return NextResponse.json({ success: false, error: 'itemId, type, and quantity are required' }, { status: 400 });
    }
    if (!['borrow', 'restock', 'return'].includes(type)) {
      return NextResponse.json({ success: false, error: 'Invalid transaction type' }, { status: 400 });
    }
    if (Number(quantity) <= 0) {
      return NextResponse.json({ success: false, error: 'Quantity must be positive' }, { status: 400 });
    }

    const result = createTransaction({ itemId, type, quantity: Number(quantity), note });
    if ('error' in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true, data: result }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create transaction' }, { status: 500 });
  }
}
