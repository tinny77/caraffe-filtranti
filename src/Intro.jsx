import React from 'react';

export default function Intro() {
	return (
		<div className="intro max-w-6xl mx-auto text-center">
			<h1 className="text-5xl mb-10">La tua guida alle caraffe filtranti!</h1>

			<p>
				Spendi cifre considerevoli per acquistare acqua in bottiglia ogni mese?
				<br />
				Vuoi comparare velocemente le opzioni disponibili e capire senza per
				troppo tempo se conviene o meno?
			</p>

			<p>
				Qui trovi una selezione dei migliori tipi di caraffe filtranti
				disponibili sul mercato e potrai confrontare le varie opzioni in base
				alle tue esigenze specifiche.
				<br />
				Inoltre, offriamo un comodo link diretto per l'acquisto su Amazon, che
				garantisce un processo di acquisto sicuro e affidabile.
			</p>

			<p>
				Alla fine della pagina, troverai un pratico e semplice{' '}
				<a href="#calcolatore" className="underline">
					calcolatore
				</a>{' '}
				che ti permetterà di stimare quanto potresti risparmiare nel tempo
				scegliendo una caraffa filtrante rispetto all'acquisto di bottiglie di
				acqua naturale. Puoi personalizzare il calcolo inserendo il costo al
				litro delle bottiglie e selezionando il tipo di caraffa che ti
				interessa. Otterrai una stima del costo iniziale della caraffa e dei
				suoi filtri, oltre al risparmio previsto nel corso del tempo.
			</p>
		</div>
	);
}
