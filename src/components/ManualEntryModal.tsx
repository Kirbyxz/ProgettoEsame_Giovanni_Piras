'use client';

import { useState, useEffect } from 'react';

// Finestra pop-up per inserire manualmente i dati di produzione letti dal contatore
export default function ManualEntryModal({ isOpen, onClose, onRefresh }: { isOpen: boolean, onClose: () => void, onRefresh: () => void }) {
    const [plants, setPlants] = useState<{ id: number, nome_parco: string }[]>([]);
    const [formData, setFormData] = useState({
        id_impianto: '',
        data: new Date().toISOString().split('T')[0],
        kwh_prodotti: '',
        ore_funzionamento: ''
    });

    // Carico la lista degli impianti disponibili dal database per popolare il menu a tendina
    useEffect(() => {
        if (isOpen) {
            fetch('/api/produzione')
                .then(res => res.json())
                .then(data => setPlants(data))
                .catch(err => console.error(err));
        }
    }, [isOpen]);

    if (!isOpen) return null;

    // Invio i dati al backend tramite una richiesta POST
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/produzione', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });
        // Aggiorno la dashboard principale e chiudo il modal
        onRefresh();
        onClose();
    };

    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 100 }}>
            {/* Semplice contenitore bianco per il form */}
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
                <h2>Aggiungi Nuova Lettura</h2>
                <form onSubmit={handleSubmit}>
                    {/* Selettore dinamico degli impianti per evitare errori di inserimento ID manuali */}
                    <div style={{ marginBottom: '10px' }}>
                        <label>Impianto:</label><br />
                        <select
                            style={{ width: '100%', border: '1px solid #ccc' }}
                            value={formData.id_impianto}
                            onChange={e => setFormData({ ...formData, id_impianto: e.target.value })}
                            required
                        >
                            <option value="">Scegli...</option>
                            {plants.map(p => <option key={p.id} value={p.id}>{p.nome_parco}</option>)}
                        </select>
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Data:</label><br />
                        <input
                            type="date"
                            style={{ width: '100%', border: '1px solid #ccc' }}
                            value={formData.data}
                            onChange={e => setFormData({ ...formData, data: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>kWh Prodotti:</label><br />
                        <input
                            type="number"
                            style={{ width: '100%', border: '1px solid #ccc' }}
                            value={formData.kwh_prodotti}
                            onChange={e => setFormData({ ...formData, kwh_prodotti: e.target.value })}
                            required
                        />
                    </div>
                    <div style={{ marginBottom: '10px' }}>
                        <label>Ore Funzionamento:</label><br />
                        <input
                            type="number"
                            style={{ width: '100%', border: '1px solid #ccc' }}
                            value={formData.ore_funzionamento}
                            onChange={e => setFormData({ ...formData, ore_funzionamento: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ marginRight: '10px' }}>Salva</button>
                    <button type="button" onClick={onClose} className="btn btn-secondary">Chiudi</button>
                </form>
            </div>
        </div>
    );
}
