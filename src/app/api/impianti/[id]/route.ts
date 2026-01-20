import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// Endpoint per recuperare i dettagli di un singolo impianto e il suo storico
// Qui ho avuto dei problemi con un errore di Next.js 15 che ho risolto cosi 
// Link alla chat : https://chatgpt.com/share/696f5b18-8a60-8010-8c8b-ad9af2b48518
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        // 1. Recupero i dati anagrafici dell'impianto
        const [plantRows] = await pool.query(
            'SELECT * FROM impianti WHERE id = ?',
            [id]
        );

        if ((plantRows as any[]).length === 0) {
            return NextResponse.json({ error: 'Impianto non trovato' }, { status: 404 });
        }

        // 2. Recupero lo storico delle ultime 30 letture (le più recenti)
        const [historyRows] = await pool.query(
            'SELECT data, kwh_prodotti, ore_funzionamento FROM produzione WHERE id_impianto = ? ORDER BY data DESC LIMIT 30',
            [id]
        );

        return NextResponse.json({
            plant: (plantRows as any[])[0],
            history: historyRows
        });
    } catch (error) {
        console.error('Errore DB:', error);
        return NextResponse.json({ error: 'Errore interno' }, { status: 500 });
    }
}
