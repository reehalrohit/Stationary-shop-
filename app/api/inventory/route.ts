export const dynamic = 'force-dynamic'; 
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL || "",
  ssl: { rejectUnauthorized: false }
});

export async function GET() {
  try {
    if (!process.env.POSTGRES_URL) {
      return NextResponse.json({ items: [], error: 'No database connected' });
    }
    const client = await pool.connect();
    
    // 🔥 AUTOMATIC DATABASE UPGRADE: Adds the MRP column to your existing table
    try {
      await client.query(`ALTER TABLE inventory ADD COLUMN IF NOT EXISTS mrp NUMERIC DEFAULT 0;`);
      // Fixes your existing 57 items: temporarily sets their MRP equal to wholesale price 
      await client.query(`UPDATE inventory SET mrp = price WHERE mrp = 0;`);
    } catch (migrationError) {
      console.log('Migration notice:', migrationError);
    }

    const result = await client.query('SELECT * FROM inventory ORDER BY id DESC;');
    client.release();
    return NextResponse.json({ items: result.rows });
  } catch (error: any) {
    console.error('Database GET error:', error);
    return NextResponse.json({ items: [] });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { items } = await req.json();
    if (!items || !Array.isArray(items)) return NextResponse.json({ error: 'Invalid items list' }, { status: 400 });

    const client = await pool.connect();

    try {
      await client.query(`
        CREATE TABLE IF NOT EXISTS inventory (
          id SERIAL PRIMARY KEY,
          name TEXT UNIQUE NOT NULL,
          qty INTEGER NOT NULL,
          price NUMERIC NOT NULL,
          mrp NUMERIC DEFAULT 0
        );
      `);
      // Ensure column exists for new tables too
      await client.query(`ALTER TABLE inventory ADD COLUMN IF NOT EXISTS mrp NUMERIC DEFAULT 0;`);

      for (const item of items) {
        await client.query(`
          INSERT INTO inventory (name, qty, price, mrp)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT (name) 
          DO UPDATE SET 
            qty = inventory.qty + EXCLUDED.qty,
            price = EXCLUDED.price,
            mrp = EXCLUDED.mrp;
        `, [item.name, Number(item.qty), Number(item.price), Number(item.mrp || item.price)]);
      }

      client.release();
      return NextResponse.json({ success: true, count: items.length });
    } catch (dbError: any) {
      client.release();
      return NextResponse.json({ error: `Write Error: ${dbError.message}` }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ error: `Server Error: ${error.message}` }, { status: 500 });
  }
}
