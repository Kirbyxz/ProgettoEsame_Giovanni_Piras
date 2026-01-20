'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ArrowLeft, MapPin, Zap } from 'lucide-react';

export default function ImpiantoDettaglio({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/impianti/${id}`)
            .then(res => res.json())
            .then(json => {
                setData(json);
                setLoading(false);
            });
    }, [id]);

    if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Caricamento dettagli...</div>;
    if (!data || !data.plant) return <div style={{ textAlign: 'center', padding: '50px' }}>Impianto non trovato.</div>;

    const { plant, history } = data;

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
            {/* Intestazione e Pulsante Torna Indietro */}
            <Link href="/" style={{ textDecoration: 'none', color: '#374151', display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                <ArrowLeft size={20} style={{ marginRight: '5px' }} /> Torna alla Dashboard
            </Link>

            <div className="card" style={{ padding: '30px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ margin: 0, fontSize: '2.5rem' }}>{plant.nome_parco}</h1>
                        <p style={{ display: 'flex', alignItems: 'center', color: '#6b7280', marginTop: '10px' }}>
                            <MapPin size={16} style={{ marginRight: '5px' }} />
                            Coordinate: {plant.latitudine}, {plant.longitudine}
                        </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <span style={{ backgroundColor: '#eab308', color: 'white', padding: '5px 15px', borderRadius: '20px', fontWeight: 'bold' }}>
                            {plant.capacita_max_kw} kWp
                        </span>
                    </div>
                </div>

                <hr style={{ margin: '30px 0' }} />

                {/* Sezione Grafico Storico */}
                <h3 style={{ marginBottom: '20px' }}>Andamento Produzione (Ultimi Inserimenti)</h3>
                <div style={{ width: '100%', height: '300px', backgroundColor: '#f9fafb', padding: '10px', borderRadius: '8px' }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[...history].reverse()}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="data"
                                tick={{ fontSize: 12 }}
                                tickFormatter={(str) => new Date(str).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })}
                            />
                            <YAxis tick={{ fontSize: 12 }} label={{ value: 'kWh', angle: -90, position: 'insideLeft' }} />
                            <Tooltip
                                labelFormatter={(label) => `Data: ${new Date(label).toLocaleDateString('it-IT')}`}
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Line
                                type="monotone"
                                dataKey="kwh_prodotti"
                                name="Produzione (kWh)"
                                stroke="#eab308"
                                strokeWidth={3}
                                dot={{ r: 4, fill: '#eab308' }}
                                activeDot={{ r: 6 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Tabella Storico Analitico */}
                <h3 style={{ marginTop: '40px', marginBottom: '20px' }}>Log Ultime Letture</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                            <th style={{ padding: '10px' }}>Data</th>
                            <th style={{ padding: '10px' }}>kWh Prodotti</th>
                            <th style={{ padding: '10px' }}>Ore Lavoro</th>
                            <th style={{ padding: '10px' }}>Resa</th>
                        </tr>
                    </thead>
                    <tbody>
                        {history.map((row: any, i: number) => (
                            <tr key={i} style={{ borderBottom: '1px solid #f3f4f6' }}>
                                <td style={{ padding: '10px' }}>{new Date(row.data).toLocaleDateString('it-IT')}</td>
                                <td style={{ padding: '10px', fontWeight: 'bold' }}>{row.kwh_prodotti} kWh</td>
                                <td style={{ padding: '10px' }}>{row.ore_funzionamento} h</td>
                                <td style={{ padding: '10px' }}>
                                    {(row.kwh_prodotti / row.ore_funzionamento).toFixed(2)} kWh/h
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer in fondo alla pagina */}
            <div style={{ marginTop: '40px', textAlign: 'center', opacity: 0.5, fontSize: '0.8rem' }}>
                SolarTech Monitor Internal Tools - Sviluppato da Giovanni Piras
            </div>
        </div>
    );
}
