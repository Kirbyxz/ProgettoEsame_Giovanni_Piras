import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Endpoint per recuperare i dati degli impianti e della produzione
export async function GET() {
    try {
        // Query complessa per calcolare totale, media e performance ratio nello stesso momento "Aiutato da ChatGPT"
        //Link alla chat "https://chatgpt.com/share/696f5493-3378-8010-bc2d-c5429b07f2ca"
        const [rows] = await pool.query(`
      SELECT 
    i.id, 
    i.nome_parco, 
    i.latitudine, 
    i.longitudine, 
    i.capacita_max_kw,

    SUM(p.kwh_prodotti) AS totale_kwh,
    AVG(p.kwh_prodotti) AS media_giornaliera,

    (SUM(p.kwh_prodotti) / NULLIF(SUM(p.ore_funzionamento), 0)) 
    / NULLIF(i.capacita_max_kw, 0) AS performance_ratio

FROM impianti i
LEFT JOIN produzione p 
    ON i.id = p.id_impianto
GROUP BY 
    i.id, 
    i.nome_parco, 
    i.latitudine, 
    i.longitudine, 
    i.capacita_max_kw;
    `);

        return NextResponse.json(rows);
    } catch (error) {
        console.error('Errore DB:', error);
        return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
    }
}

// Endpoint per salvare una nuova lettura inserita manualmente
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { id_impianto, data, kwh_prodotti, ore_funzionamento } = body;

        const [result] = await pool.execute(
            'INSERT INTO produzione (id_impianto, data, kwh_prodotti, ore_funzionamento) VALUES (?, ?, ?, ?)',
            [id_impianto, data, kwh_prodotti, ore_funzionamento]
        );

        return NextResponse.json({ success: true, id: (result as any).insertId });
    } catch (error) {
        console.error('Errore DB:', error);
        return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
    }
}
