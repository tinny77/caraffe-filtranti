import React from 'react';

import { Typography } from '@material-tailwind/react';

export default function Intro({ caraffeCount, filtriCount }) {
	return (
		<header className="hero-panel intro mx-auto mb-10 overflow-hidden rounded-[2rem] px-6 py-8 md:px-10 md:py-12 lg:px-12 lg:py-14">

				<div className="text-center lg:text-left">
					<p className="eyebrow mb-4">
						Confronto rapido per chi vuole spendere meglio
					</p>
					<Typography
						variant="h1"
						className="title hero-title text-balance text-slate-950"
					>
						Caraffe filtranti a confronto, con filtri compatibili e stima del
						risparmio
					</Typography>
					<Typography
						variant="lead"
						className="mt-6 max-w-3xl text-base font-medium leading-8 text-slate-700 md:text-xl"
					>
						Se vuoi capire quale caraffa filtrante può avere senso per casa tua,
						qui trovi una selezione comparabile per prezzo, capacita, filtri
						compatibili e costo annuo stimato. Il calcolatore finale traduce i
						dati in una domanda concreta: rispetto all&apos;acqua in bottiglia,
						quanto spendi davvero?
					</Typography>
					<div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
						<a href="#caraffe" className="hero-cta hero-cta-primary">
							Confronta le caraffe
						</a>
						<a href="#calcolatore" className="hero-cta hero-cta-secondary">
							Vai al calcolatore
						</a>
					</div>

			</div>
		</header>
	);
}
