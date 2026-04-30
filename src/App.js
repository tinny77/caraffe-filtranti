import React, { useEffect, useRef, useState } from 'react';
import { Typography } from '@material-tailwind/react';

import caraffeData from './data/caraffe.json';
import filtriData from './data/filtri.json';

import Intro from './components/Intro';
import Products from './components/Products';
import Filtri from './components/Filtri';
import Calcolatore from './components/Calcolatore';

const pageTitle =
	'Caraffe filtranti: confronto, filtri compatibili e calcolatore risparmio';
const pageDescription =
	"Confronta caraffe filtranti, compatibilita dei filtri, capacita e costi annuali. Usa il calcolatore per stimare quanto puoi risparmiare rispetto all'acqua in bottiglia.";

const upsertMetaTag = (selector, attributes) => {
	let element = document.head.querySelector(selector);

	if (!element) {
		element = document.createElement('meta');
		document.head.appendChild(element);
	}

	Object.entries(attributes).forEach(([key, value]) => {
		element.setAttribute(key, value);
	});
};

const upsertLinkTag = (selector, attributes) => {
	let element = document.head.querySelector(selector);

	if (!element) {
		element = document.createElement('link');
		document.head.appendChild(element);
	}

	Object.entries(attributes).forEach(([key, value]) => {
		element.setAttribute(key, value);
	});
};

function App() {
	const [loading, setLoading] = useState(true);
	const [caraffe, setCaraffe] = useState([]);
	const [selectedCaraffa, setSelectedCaraffa] = useState(null);
	const [filtri, setFiltri] = useState([]);
	const [selectedFiltro, setSelectedFiltro] = useState(null);
	const filterRef = useRef(null);
	const calcRef = useRef(null);

	const resetCalcoloFiltri = () => {
		setSelectedFiltro(null);
	};

	const handleProductClick = (code) => {
		setSelectedCaraffa(code);
		resetCalcoloFiltri();
	};

	useEffect(() => {
		resetCalcoloFiltri();
	}, [selectedCaraffa]);

	useEffect(() => {
		const fetchCaraffe = async () => {
			const caraffeArray = [];

			for (const entry of caraffeData) {
				const caraffaAmznData = await import(`./data/caraffe/${entry.file}`);
				const caraffaData = caraffeData.find(
					(car) => car.asin === caraffaAmznData.product.asin,
				);

				caraffeArray.push({
					asin: caraffaData.asin,
					code: caraffaData.code,
					custom_title: caraffaData.title,
					title: caraffaAmznData.product.title,
					link: caraffaAmznData.product.link,
					price: caraffaAmznData.product.buybox_winner.price.value,
					capacita: caraffaData.capacita,
					rating: caraffaAmznData.product.rating,
					rating_num: caraffaAmznData.product.ratings_total,
					image: caraffaAmznData.product.main_image.link,
				});
			}

			setCaraffe(caraffeArray);
			setLoading(false);
		};

		fetchCaraffe();
		setFiltri(filtriData);
	}, []);

	useEffect(() => {
		const siteUrl = window.location.href;
		const origin = window.location.origin;

		document.title = pageTitle;
		upsertMetaTag('meta[name="description"]', {
			name: 'description',
			content: pageDescription,
		});
		upsertMetaTag('meta[property="og:title"]', {
			property: 'og:title',
			content: pageTitle,
		});
		upsertMetaTag('meta[property="og:description"]', {
			property: 'og:description',
			content: pageDescription,
		});
		upsertMetaTag('meta[property="og:url"]', {
			property: 'og:url',
			content: siteUrl,
		});
		upsertMetaTag('meta[property="og:locale"]', {
			property: 'og:locale',
			content: 'it_IT',
		});
		upsertMetaTag('meta[property="og:site_name"]', {
			property: 'og:site_name',
			content: 'Caraffe filtranti',
		});
		upsertMetaTag('meta[name="twitter:title"]', {
			name: 'twitter:title',
			content: pageTitle,
		});
		upsertMetaTag('meta[name="twitter:description"]', {
			name: 'twitter:description',
			content: pageDescription,
		});
		upsertLinkTag('link[rel="canonical"]', {
			rel: 'canonical',
			href: siteUrl,
		});

		const existingSchema = document.getElementById('seo-structured-data');
		if (existingSchema) {
			existingSchema.remove();
		}

		const schema = {
			'@context': 'https://schema.org',
			'@graph': [
				{
					'@type': 'WebSite',
					name: 'Caraffe filtranti',
					url: origin,
					description: pageDescription,
					inLanguage: 'it-IT',
				},
				{
					'@type': 'CollectionPage',
					name: pageTitle,
					url: siteUrl,
					description: pageDescription,
					inLanguage: 'it-IT',
					mainEntity: {
						'@type': 'ItemList',
						itemListElement: caraffeData.map((caraffa, index) => ({
							'@type': 'ListItem',
							position: index + 1,
							name: caraffa.title,
						})),
					},
				},
				{
					'@type': 'FAQPage',
					mainEntity: [
						{
							'@type': 'Question',
							name: 'Come scegliere una caraffa filtrante?',
							acceptedAnswer: {
								'@type': 'Answer',
								text: 'Conviene confrontare capacita, prezzo iniziale, disponibilita dei filtri compatibili e costo annuale stimato in base ai litri bevuti ogni giorno.',
							},
						},
						{
							'@type': 'Question',
							name: 'Quanto incide il costo dei filtri nel tempo?',
							acceptedAnswer: {
								'@type': 'Answer',
								text: "Il costo dei filtri puo cambiare molto da un modello all'altro. Per questo il sito stima il consumo annuo in base a durata in mesi, durata in litri e abitudini di consumo.",
							},
						},
						{
							'@type': 'Question',
							name: 'Il confronto serve anche per stimare il risparmio rispetto alle bottiglie?',
							acceptedAnswer: {
								'@type': 'Answer',
								text: "Si. Il calcolatore confronta il costo annuo dell'acqua in bottiglia con il costo della caraffa e dei filtri compatibili per stimare convenienza e tempi di rientro.",
							},
						},
					],
				},
			],
		};

		const schemaScript = document.createElement('script');
		schemaScript.type = 'application/ld+json';
		schemaScript.id = 'seo-structured-data';
		schemaScript.text = JSON.stringify(schema);
		document.head.appendChild(schemaScript);

		return () => {
			const mountedSchema = document.getElementById('seo-structured-data');
			if (mountedSchema) {
				mountedSchema.remove();
			}
		};
	}, []);

	return (
		<div className="site-shell font-sans subpixel-antialiased text-slate-900">
			<div className="ambient-glow ambient-glow-left" aria-hidden="true" />
			<div className="ambient-glow ambient-glow-right" aria-hidden="true" />
			<main className="mx-auto max-w-7xl px-4 pb-10 pt-10 md:px-6 lg:px-8 lg:pt-14">
				<Intro
					caraffeCount={caraffeData.length}
					filtriCount={filtriData.length}
				/>
				{caraffeData.length ? (
					<>
						<Calcolatore
							listaCaraffe={caraffe}
							currentCaraffa={selectedCaraffa}
							setCurrentCaraffa={setSelectedCaraffa}
							listaFiltri={filtri}
							currentFiltro={selectedFiltro}
							setCurrentFiltro={setSelectedFiltro}
							thisref={calcRef}
							loading={loading}
						/>

						<Products
							listaCaraffe={caraffe}
							currentCaraffa={selectedCaraffa}
							handleProductClick={handleProductClick}
							loading={loading}
						/>

						<Filtri
							listaFiltri={filtri}
							currentFiltro={selectedFiltro}
							setCurrentFiltro={setSelectedFiltro}
							currentCaraffa={selectedCaraffa}
							thisref={filterRef}
							loading={loading}
						/>
						{!loading && (
							<footer className="mx-auto mt-16 max-w-4xl rounded-3xl border border-white/60 bg-white/70 px-6 py-5 text-center text-sm text-slate-600 shadow-lg shadow-sky-950/5 backdrop-blur text-balance">
								Dati comparativi e stime orientative. Verifica sempre
								compatibilita, condizioni di acquisto e specifiche del
								produttore prima di comprare.
							</footer>
						)}
					</>
				) : (
					<Typography
						variant="lead"
						className="section-panel mt-10 p-10 text-center text-2xl text-slate-800"
					>
						Dati mancanti
					</Typography>
				)}
			</main>
		</div>
	);
}

export default App;
