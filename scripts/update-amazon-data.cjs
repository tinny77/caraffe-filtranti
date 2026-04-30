const fs = require('fs/promises');
const path = require('path');
const axios = require('axios');

const rootDir = path.resolve(__dirname, '..');
const caraffeIndexPath = path.join(rootDir, 'src/data/caraffe.json');
const caraffeDataDir = path.join(rootDir, 'src/data/caraffe');
const envPaths = ['.env.local', '.env'].map((fileName) => path.join(rootDir, fileName));

const loadEnvFile = async (filePath) => {
	try {
		const raw = await fs.readFile(filePath, 'utf8');
		raw.split(/\r?\n/).forEach((line) => {
			const trimmed = line.trim();
			if (!trimmed || trimmed.startsWith('#')) {
				return;
			}

			const separatorIndex = trimmed.indexOf('=');
			if (separatorIndex === -1) {
				return;
			}

			const key = trimmed.slice(0, separatorIndex).trim();
			const value = trimmed.slice(separatorIndex + 1).trim();
			if (!key || process.env[key]) {
				return;
			}

			process.env[key] = value.replace(/^['"]|['"]$/g, '');
		});
	} catch (error) {
		if (error.code !== 'ENOENT') {
			throw error;
		}
	}
};

const usage = `
Aggiorna i JSON locali delle caraffe interrogando Rainforest API.

Uso:
  node scripts/update-amazon-data.cjs
  node scripts/update-amazon-data.cjs larq zerowater

Variabili ambiente richieste:
  RAINFOREST_API_KEY        API key Rainforest

Variabili ambiente opzionali:
  RAINFOREST_API_URL        Default: https://api.rainforestapi.com/request
  RAINFOREST_AMAZON_DOMAIN  Default: amazon.it
  RAINFOREST_ASSOCIATE_ID   Default: 8vcue204-21
  RAINFOREST_CURRENCY       Default: eur
  RAINFOREST_LANGUAGE       Default: it_IT

Lo script prova a leggere anche .env.local e .env dalla root del progetto.
`;

const requestedCodes = process.argv.slice(2).filter((arg) => !arg.startsWith('-'));
const wantsHelp = process.argv.includes('--help') || process.argv.includes('-h');

const fail = (message) => {
	console.error(`\n[update:prices] ${message}\n`);
	process.exit(1);
};

const readCaraffeIndex = async () => {
	const raw = await fs.readFile(caraffeIndexPath, 'utf8');
	return JSON.parse(raw);
};

const fetchProductData = async (asin) => {
	const requiredApiKey = process.env.RAINFOREST_API_KEY;
	const apiUrl =
		process.env.RAINFOREST_API_URL || 'https://api.rainforestapi.com/request';
	const amazonDomain = process.env.RAINFOREST_AMAZON_DOMAIN || 'amazon.it';
	const associateId = process.env.RAINFOREST_ASSOCIATE_ID || '8vcue204-21';
	const currency = process.env.RAINFOREST_CURRENCY || 'eur';
	const language = process.env.RAINFOREST_LANGUAGE || 'it_IT';

	const response = await axios.get(apiUrl, {
		params: {
			api_key: requiredApiKey,
			type: 'product',
			amazon_domain: amazonDomain,
			asin,
			associate_id: associateId,
			currency,
			output: 'json',
			language,
		},
		timeout: 45000,
	});

	return response.data;
};

const sanitizeErrorMessage = (message) => {
	if (!message) {
		return 'Errore sconosciuto';
	}

	const apiKey = process.env.RAINFOREST_API_KEY;
	if (!apiKey) {
		return message;
	}

	return String(message).split(apiKey).join('[REDACTED]');
};

const validateResponse = (entry, data) => {
	if (!data || typeof data !== 'object') {
		throw new Error(`Risposta vuota per ${entry.code}`);
	}

	if (data.request_info && data.request_info.success === false) {
		throw new Error(`API ha restituito un errore per ${entry.code}`);
	}

	if (!data.product) {
		throw new Error(`Prodotto assente nella risposta per ${entry.code}`);
	}

	if (!data.product.buybox_winner || !data.product.buybox_winner.price) {
		console.warn(
			`[update:prices] Attenzione: prezzo non disponibile per ${entry.code}. Il file viene comunque aggiornato.`,
		);
	}
	if (data.product.asin !== entry.asin) {
		throw new Error(
			`ASIN inatteso per ${entry.code}: atteso ${entry.asin}, ricevuto ${data.product.asin}`,
		);
	}
};

const writeProductData = async (entry, data) => {
	const outputPath = path.join(caraffeDataDir, entry.file);
	await fs.writeFile(outputPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
	return outputPath;
};

const main = async () => {
	for (const envPath of envPaths) {
		await loadEnvFile(envPath);
	}

	if (wantsHelp) {
		console.log(usage.trim());
		return;
	}

	if (!process.env.RAINFOREST_API_KEY) {
		fail('Manca RAINFOREST_API_KEY. Salvala in .env.local oppure esportala nella shell e rilancia il comando.');
	}

	const caraffeIndex = await readCaraffeIndex();
	const selectedEntries = requestedCodes.length
		? caraffeIndex.filter((entry) => requestedCodes.includes(entry.code))
		: caraffeIndex;

	if (!selectedEntries.length) {
		fail('Nessuna caraffa trovata per i codici richiesti.');
	}

	const missingCodes = requestedCodes.filter(
		(code) => !caraffeIndex.some((entry) => entry.code === code),
	);
	if (missingCodes.length) {
		fail(`Codici non trovati: ${missingCodes.join(', ')}`);
	}

	console.log(
		`[update:prices] Aggiornamento di ${selectedEntries.length} caraffe da ${process.env.RAINFOREST_AMAZON_DOMAIN || 'amazon.it'}...`,
	);

	for (const entry of selectedEntries) {
		console.log(`[update:prices] -> ${entry.code} (${entry.asin})`);
		const data = await fetchProductData(entry.asin);
		validateResponse(entry, data);
		const outputPath = await writeProductData(entry, data);
		const price = data.product.buybox_winner?.price?.raw || 'n.d.';
		console.log(`[update:prices]    salvato ${outputPath} | prezzo ${price}`);
	}

	console.log('[update:prices] Aggiornamento completato.');
};

main().catch((error) => {
	fail(sanitizeErrorMessage(error.response?.data?.message || error.message));
});
