import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || "",
  ssl: { rejectUnauthorized: false }
});

// GET: Fetch all saved inventory items for the POS
export async function GET() {
  try {
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({ items: [], error: 'No database connected' });
    }
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM inventory ORDER BY id DESC;');
    client.release();
    return NextResponse.json({ items: result.rows });
  } catch (error: any) {
    console.error('Database GET error:', error);
    return NextResponse.json({ items: [] });
  }
}

// POST: Save or update scanned invoice items into the database
export async function POST(req: NextRequest) {
  try {
    // 1. Check if Vercel Postgres is actually linked
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({ error: 'Database not linked. Please create a Postgres database in the Vercel Storage tab.' }, { status: 500 });
    }

    const { items } = await req.json();

    if (!items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items list' }, { status: 400 });
    }

    let client;
    try {
      // 2. Attempt to connect to the database
      client = await pool.connect();
    } catch (connError: any) {
      return NextResponse.json({ error: `Connection failed: ${connError.message}` }, { status: 500 });
    }

    try {
      // 3. Create table and insert items
      await client.query(`
        CREATE TABLE IF NOT EXISTS inventory (
          id SERIAL PRIMARY KEY,
          name TEXT UNIQUE NOT NULL,
          qty INTEGER NOT NULL,
          price NUMERIC NOT NULL
        );
      `);

      for (const item of items) {
        await client.query(`
          INSERT INTO inventory (name, qty, price)
          VALUES ($1, $2, $3)
          ON CONFLICT (name) 
          DO UPDATE SET 
            qty = inventory.qty + EXCLUDED.qty,
            price = EXCLUDED.price;
        `, [item.name, Number(item.qty), Number(item.price)]);
      }

      client.release();
      return NextResponse.json({ success: true, count: items.length });
    } catch (dbError: any) {
      client.release();
      console.error('Database write error:', dbError);
      return NextResponse.json({ error: `Write Error: ${dbError.message}` }, { status: 500 });
    }
  } catch (error: any) {
    console.error('API error:', error);
    return NextResponse.json({ error: `Server Error: ${error.message}` }, { status: 500 });
  }
}
  
