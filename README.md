# Progetto Esame - SolarTech Monitor
Sviluppato da: Giovanni Piras

## Descrizione del Progetto
Questa piattaforma è stata creata per SolarTech con l'obiettivo di monitorare i parchi fotovoltaici dell'azienda. Il sistema permette di vedere quanto produce ogni impianto in tempo reale e incrocia questi dati con l'irraggiamento solare (preso tramite API esterna) per capire subito se un calo di produzione è dovuto al meteo o a un guasto tecnico.

## Funzionalità implementate
- **Dashboard principale**: Una panoramica di tutti gli impianti con i dati di produzione totale e media giornaliera.
- **Pagina di Dettaglio**: Una sezione dedicata per ogni singolo impianto.

- **Grafico Storico**: Visualizzazione dell'andamento della produzione tramite grafici a linee (Recharts) per monitorare i trend nel tempo.

- **Tabella Storica**: Elenco analitico di tutte le letture passate per un controllo puntuale dei dati inseriti.

- **Efficienza dinamica**: Il valore dell'efficienza cambia colore (Rosso/Giallo/Verde) in base a quanto sta rendendo l'impianto.

- **Rilevamento Guasti**: Se c'è tanto sole ma l'impianto produce poco, compare un avviso rosso di "POSSIBILE GUASTO".

- **Inserimento Manuale**: Un tasto per aggiungere nuove letture dei contatori scegliendo l'impianto da un menu a tendina.

- **Dati Meteo**: Integrazione con Open-Meteo per recuperare i dati di Irradiazione (MJ/m²) di ogni zona.

## Setup del Database
Il progetto si collega a un database MySQL chiamato `SolarTech`. 
Le tabelle utilizzate sono due:
1. `impianti`: contiene le anagrafiche dei parchi (nome, coordinate, capacità).
2. `produzione`: contiene le letture giornaliere (kwh, ore funzionamento).

Per farlo funzionare, bisogna configurare il file `.env.local` con le proprie credenziali (host, user, password).

## Note sullo sviluppo (Trasparenza AI)
Per realizzare questo MVP ho utilizzato l'intelligenza artificiale (ChatGPT) che mi ha aiutato soprattutto a:

- Ottimizzare la query SQL per il calcolo della media giornaliera e del performance ratio.
- [Link alla chat di supporto](https://chatgpt.com/share/696f4e41-be18-8010-a812-8b0e5aad0d56)

- Capire i dati e come calcolare i vari parametri dei pannelli fotovoltaici
- [Link alla chat di supporto](https://chatgpt.com/share/696f523b-67e8-8010-8240-6c814998eada)

- Ottimizzazione query per ricezione dei dati dal database, robusta con controlli sui Null
- [Link alla chat di supporto](https://chatgpt.com/share/696f5493-3378-8010-bc2d-c5429b07f2ca)

- Risoluzione errore Next.js 15
- [Link alla chat di supporto](https://chatgpt.com/share/696f5b18-8a60-8010-8c8b-ad9af2b48518)

## Come avviare il progetto
1. Installare i pacchetti con: `npm install`
2. Far partire il server con: `npm run dev`
3. Aprire il browser su: `http://localhost:3000`

ho utilizzato l'AI per la formattazione del testo.

Giovanni Piras.
