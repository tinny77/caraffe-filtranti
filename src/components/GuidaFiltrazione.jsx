import React from 'react';
import { Typography } from '@material-tailwind/react';

const priorities = [
	{
		kicker: 'Alta priorità',
		title: 'PFAS e microinquinanti persistenti',
		text: "Se un filtro dichiara una riduzione di PFAS, PFOA, BPA o residui farmaceutici, il vantaggio pratico e spesso piu rilevante rispetto al semplice effetto sul gusto. Sono sostanze che conviene tenere d'occhio soprattutto quando vuoi ridurre microcontaminanti difficili da intercettare con soluzioni basilari.",
	},
	{
		kicker: 'Alta priorità',
		title: 'Metalli come piombo, mercurio e cadmio',
		text: "I filtri che coprono metalli pesanti hanno piu valore quando l'acqua passa in tubazioni vecchie o quando vuoi una protezione aggiuntiva su contaminanti che non migliorano solo sapore e odore, ma toccano la qualità complessiva dell'acqua.",
	},
	{
		kicker: 'Priorita utile',
		title: 'Cloro e sottoprodotti del trattamento',
		text: "Ridurre il cloro e alcuni sottoprodotti può avere senso per gusto, odore e comfort quotidiano. Non è la stessa priorità di PFAS o metalli, ma è una funzione utile se l'acqua di rubinetto ha un sapore netto o un odore che ti infastidisce.",
	},
	{
		kicker: 'Priorita bassa',
		title: 'Calcare: spesso è più una questione tecnica che sanitaria',
		text: 'In genere il calcare non è la prima cosa da inseguire in un filtro domestico: nelle acque potabili dure e spesso piu un tema di incrostazioni, bollitori e gusto che un contaminante da trattare come priorita sanitaria. Se il tuo obiettivo e bere meglio, di solito contano di più PFAS, metalli e altri microinquinanti dichiarati.',
	},
];

export const guideFaqs = [
	{
		question: 'Ha senso filtrare il calcare?',
		answer:
			'In molti casi no, almeno non come priorita principale. Il calcare e spesso piu un tema di incrostazioni, bollitori e gusto che un problema da inseguire prima di tutto in ottica di qualita dell&apos;acqua bevuta.',
	},
	{
		question:
			'Quali filtri sono piu utili se voglio fare una scelta piu mirata?',
		answer:
			'Sono in genere piu interessanti i filtri che dichiarano una riduzione di PFAS, metalli come piombo, mercurio e cadmio, oppure altri microinquinanti come BPA e residui farmaceutici. Sono voci che pesano di più del solo effetto anticalcare.',
	},
	{
		question: 'Ridurre il cloro serve davvero?',
		answer:
			'Si, puo servire soprattutto per migliorare gusto e odore dell&apos;acqua di rubinetto. è una funzione utile sul piano del comfort quotidiano, anche se di solito PFAS e metalli hanno una priorita pratica piu alta quando confronti due filtri.',
	},
];

export default function GuidaFiltrazione() {
	return (
		<section className="section-panel guide-panel mt-8 px-5 py-8 md:px-8 md:py-10">
			<div className="mx-auto max-w-3xl text-center">
				<p className="section-kicker">Guida rapida</p>
				<Typography variant="h2" className="title section-title text-slate-950">
					Cosa vale davvero la pena filtrare
				</Typography>
				<Typography
					variant="lead"
					className="mt-4 text-base leading-7 text-slate-600 md:text-lg"
				>
					Non tutte le diciture in etichetta hanno lo stesso peso. Se stai
					confrontando due filtri, conviene distinguere tra cio che migliora
					soprattutto comfort e gusto e cio che può avere un impatto piu utile
					sulla qualita dell\'acqua.
				</Typography>
			</div>

			<div className="guide-grid mx-auto mt-8 max-w-6xl">
				{priorities.map((item) => (
					<article key={item.title} className="guide-card">
						<p className="guide-card__kicker">{item.kicker}</p>
						<h3 className="guide-card__title">{item.title}</h3>
						<p className="guide-card__text">{item.text}</p>
					</article>
				))}
			</div>

			<div className="guide-note mx-auto mt-8 ">
				<p className="guide-note__title">Come leggere queste indicazioni</p>
				<p className="guide-note__text">
					Questa e una guida pratica per confrontare i filtri dichiarati dai
					produttori, non un parere tecnico sulla tua rete idrica. Se hai dubbi
					reali sulla qualita dell&apos;acqua di casa, il criterio migliore
					resta sempre il report del gestore locale o un&apos;analisi dedicata. Per
					un confronto d&apos;acquisto, pero, sapere che il calcare di solito e
					meno prioritario di PFAS e metalli aiuta a scegliere meglio.
				</p>
			</div>

			<div className="mx-auto mt-8 max-w-4xl text-center">
				<p className="section-kicker">FAQ</p>
				<Typography
					variant="h2"
					className="title text-3xl text-slate-950 md:text-4xl"
				>
					Domande utili prima di scegliere un filtro
				</Typography>
			</div>

			<div className="guide-faqs mx-auto mt-8 max-w-4xl">
				{guideFaqs.map((faq) => (
					<article key={faq.question} className="guide-faq">
						<h3 className="guide-faq__question">{faq.question}</h3>
						<p className="guide-faq__answer">{faq.answer}</p>
					</article>
				))}
			</div>
		</section>
	);
}
