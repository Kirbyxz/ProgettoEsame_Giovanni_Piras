import { NextResponse } from 'next/server';

// Proxy per recuperare i dati meteo (irraggiamento solare) evitando problemi di CORS o API Key esposte
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
        return NextResponse.json({ error: 'Coordinate mancanti' }, { status: 400 });
    }

    try {
        // Chiamata a Open-Meteo per recuperare la radiazione solare giornaliera (shortwave_radiation_sum)
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=shortwave_radiation_sum&timezone=auto`
        );
        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Errore API Meteo' }, { status: 500 });
    }
}
