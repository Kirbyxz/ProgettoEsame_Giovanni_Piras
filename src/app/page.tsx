'use client';

import { useEffect, useState } from 'react';
import SolarPanelCard from '@/components/SolarPanelCard';
import ManualEntryModal from '@/components/ManualEntryModal';
import { Grid } from 'lucide-react';

export default function Home() {
  const [plants, setPlants] = useState([]); // Stato per memorizzare la lista degli impianti
  const [isModalOpen, setIsModalOpen] = useState(false); // Stato per gestire l'apertura del popup di inserimento

  // Funzione per caricare tutti i dati degli impianti dal nostro backend
  const fetchPlants = async () => {
    const res = await fetch('/api/produzione');
    const data = await res.json();
    setPlants(data);
  };

  // Carico i dati all'avvio della pagina
  useEffect(() => {
    fetchPlants();
  }, []);

  return (
    <div>
      {/* Intestazione con logo e titolo del monitoraggio */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '30px', gap: '15px' }}>
        <Grid size={48} color="#eab308" />
        <h1 style={{ fontSize: '2.5rem', margin: 0 }}>
          SolarTech Monitor
        </h1>
      </div>

      {/* Bottoni d'azione principali */}
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <button onClick={() => setIsModalOpen(true)} className="btn btn-primary">
          + Aggiungi Lettura
        </button>
        <button onClick={fetchPlants} className="btn btn-secondary" style={{ marginLeft: '10px' }}>
          Aggiorna Dati
        </button>
      </div>

      {/* Griglia dove vengono mostrate le card di ogni impianto */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px', padding: '0 20px' }}>
        {plants.map((plant: any) => (
          <SolarPanelCard key={plant.id} plant={plant} />
        ))}
      </div>

      {/* Componente del modal per l'inserimento manuale */}
      <ManualEntryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onRefresh={fetchPlants}
      />

      {/* Footer con le informazioni aziendali fittizie di SolarTech */}
      <footer style={{
        marginTop: '60px',
        padding: '30px 20px',
        backgroundColor: '#374151',
        color: 'white',
        textAlign: 'center',
        borderTop: '5px solid #eab308'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ color: '#eab308', marginBottom: '10px' }}>SolarTech S.p.A.</h4>
            <p style={{ fontSize: '0.9rem', margin: '2px 0' }}>Sede Legale: Via dell'Energia, 12</p>
            <p style={{ fontSize: '0.9rem', margin: '2px 0' }}>00100 Roma (RM) - Italia</p>
          </div>
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ color: '#eab308', marginBottom: '10px' }}>Contatti</h4>
            <p style={{ fontSize: '0.9rem', margin: '2px 0' }}>Email: info@solartech.it</p>
            <p style={{ fontSize: '0.9rem', margin: '2px 0' }}>Tel: +39 06 1234567</p>
          </div>
          <div style={{ textAlign: 'left' }}>
            <h4 style={{ color: '#eab308', marginBottom: '10px' }}>Supporto</h4>
            <p style={{ fontSize: '0.9rem', margin: '2px 0' }}>H24: 800 900 800</p>
            <p style={{ fontSize: '0.9rem', margin: '2px 0' }}>Utente: Giovanni Piras</p>
          </div>
        </div>
        <div style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.7 }}>
          &copy; 2025 SolarTech Monitor. Tutti i diritti riservati.
        </div>
      </footer>
    </div>
  );
}
