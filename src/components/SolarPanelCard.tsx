'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Plant {
    id: number;
    nome_parco: string;
    capacita_max_kw: number;
    totale_kwh: number;
    media_giornaliera: number;
    performance_ratio: number;
    latitudine: number;
    longitudine: number;
}

export default function SolarPanelCard({ plant }: { plant: Plant }) {
    const [radiation, setRadiation] = useState<number | null>(null);

    // Effettuo una chiamata API per recuperare i dati meteo in tempo reale per le coordinate dell'impianto
    useEffect(() => {
        async function fetchMeteo() {
            try {
                const res = await fetch(`/api/meteo?lat=${plant.latitudine}&lon=${plant.longitudine}`);
                const data = await res.json();
                if (data.daily?.shortwave_radiation_sum) {
                    setRadiation(data.daily.shortwave_radiation_sum[0]);
                }
            } catch (e) {
                console.error("Errore irraggiamento:", e);
            }
        }
        fetchMeteo();
    }, [plant.id, plant.latitudine, plant.longitudine]);

    // LOGICA DI CONTROLLO: Se l'irraggiamento è alto ma la produzione è quasi nulla, segnalo un possibile guasto tecnico
    const isBroken = radiation !== null && radiation > 5 && plant.performance_ratio < 0.1;

    //Infine il riempimento della card
    return (
        <div className="card">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{plant.nome_parco}</h2>
            <hr style={{ margin: '10px 0' }} />

            <p><b>Produzione Totale:</b> {Number(plant.totale_kwh || 0).toFixed(2)} kWh</p>
            <p><b>Media Giornaliera:</b> {Number(plant.media_giornaliera || 0).toFixed(2)} kWh</p>

            {/* Coloro l'efficienza in base al rendimento: Verde (OK), Giallo (Medio), Rosso (Basso) */}
            <p>
                <b>Efficienza:</b>
                <span style={{
                    color: plant.performance_ratio >= 0.7 ? '#22c55e' : (plant.performance_ratio >= 0.4 ? '#eab308' : '#ef4444'),
                    fontWeight: 'bold',
                    marginLeft: '5px'
                }}>
                    {(Number(plant.performance_ratio || 0) * 100).toFixed(1)}%
                </span>
            </p>

            <p><b>Irraggiamento Solare:</b> {radiation ? `${radiation} MJ/m²` : 'Caricando...'}</p>

            {/* Messaggio di allerta che compare solo se il sistema rileva un'anomalia grave */}
            {isBroken && (
                <div style={{ backgroundColor: 'red', color: 'white', padding: '10px', marginTop: '10px', fontWeight: 'bold', textAlign: 'center' }}>
                    ALLARME GUASTO: Irradiazione Alta / Produzione Bassa!
                </div>
            )}

            <div style={{ marginTop: '15px' }}>
                <Link href={`/impianto/${plant.id}`} className="btn btn-secondary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', fontSize: '0.9rem' }}>
                    Vedi Storico e Grafici →
                </Link>
            </div>
        </div>
    );
}
