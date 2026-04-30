# Caraffe-filtranti

Project based on Create React App to showcase a list of water filtering pitchers, fetched from a local JSON file.

- Every pitcher refers to another local JSON file, updated from Amazon APIs every now and then to avoid too many requests, where there's all data related to every single product like ISIN code, name, pictures, rating, link.
- After selecting one pitcher, the app scans another JSON file for compatible filters and shows them with their characteristics.
- Finally, when a pitcher and a filter are selected, the user can interact with two sliders, one for the daily water consumption and another for the cost of bottled mineral water for comparison. Based on the chosen filter and the water consumption, the user will get a yearly estimate based on the number of filter will be needed, plus of course the cost of the pitcher itself.

## Aggiornamento automatico prezzi

I prezzi e i dati prodotto delle caraffe possono essere rigenerati dai relativi ASIN con Rainforest API.

1. Crea un file locale non versionato partendo da [.env.example](.env.example):
	`cp .env.example .env.local`
2. Inserisci la chiave in `.env.local` senza committare il file.
3. Aggiorna tutte le caraffe:
	`npm run update:prices`
4. Oppure aggiorna solo alcuni codici:
	`npm run update:prices -- larq zerowater`

Lo script legge [src/data/caraffe.json](src/data/caraffe.json), chiama l'endpoint prodotto e riscrive i file in [src/data/caraffe](src/data/caraffe).

Note di sicurezza:
- `.env.local` e gli altri file `.env` locali sono ignorati dal repository.
- Nel repository deve rimanere solo [.env.example](.env.example), senza valori sensibili.
- Lo script non stampa la chiave Rainforest e prova a redigerla anche dai messaggi di errore.
