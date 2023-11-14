import React from 'react';

import { Typography } from '@material-tailwind/react';


export default function Intro() {
	return (
		<div className="intro max-w-6xl mx-auto text-center text-5xl mb-10">
			<Typography variant="h1" className="mb-5">
				Caraffe filtranti?
			</Typography>
			<Typography variant="lead">

					Sai quanto spendi per acquistare acqua in bottiglia ogni mese?
					<br />
					Vuoi comparare velocemente le opzioni disponibili e capire in un
					attimo se conviene o meno?
				<br /><br />
					Qui hai una selezione di caraffe filtranti
					disponibili sul mercato e puoi confrontare le varie opzioni.
					<br />
					Inoltre, trovi un comodo link per l'acquisto su Amazon, che garantisce
					un processo di acquisto sicuro e affidabile.
			</Typography>
			<Typography variant="paragraph" className="mt-10">
					Alla fine della pagina, trovi un pratico e semplice{' '}
					<a href="#calcolatore" className="underline">
						calcolatore
					</a>{' '}
					che ti permette di stimare quanto potresti risparmiare nel tempo
					scegliendo una caraffa filtrante rispetto all'acquisto di bottiglie di
					acqua naturale, senza impazzire nel calcolo del costo dei filtri in base ai tuoi consumi.
					{/*  Puoi personalizzare il calcolo inserendo il costo al
					litro delle bottiglie e selezionando il tipo di caraffa che ti
					interessa. Otterrai una stima del costo iniziale della caraffa e dei
					suoi filtri, oltre al risparmio previsto nel corso del tempo. */}
			</Typography>
		</div>
	);
}
