import React from 'react';

import { Typography } from '@material-tailwind/react';

export default function Intro({ caraffeCount, filtriCount }) {
	return (
		<header className="hero-panel intro mx-auto mb-10 max-w-7xl overflow-hidden rounded-[2rem] px-6 py-8 md:px-10 md:py-12 lg:px-12 lg:py-14">
			<div className="grid items-center gap-10 lg:grid-cols-[1.35fr_minmax(280px,0.65fr)]">
				<div className="text-center lg:text-left">
					<p className="eyebrow mb-4">Confronto rapido per chi vuole spendere meglio</p>
					<Typography variant="h1" className="title hero-title text-balance text-slate-950">
						Caraffe filtranti a confronto, con filtri compatibili e stima del risparmio
					</Typography>
					<Typography variant="lead" className="mt-6 max-w-3xl text-base font-medium leading-8 text-slate-700 md:text-xl">
						Se vuoi capire quale caraffa filtrante puo avere senso per casa tua,
						qui trovi una selezione comparabile per prezzo, capacita, filtri
						compatibili e costo annuo stimato. Il calcolatore finale traduce i dati
						in una domanda concreta: rispetto all&apos;acqua in bottiglia, quanto spendi davvero?
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

				<div className="hero-aside rounded-[1.75rem] border border-white/70 bg-white/78 p-5 text-left shadow-2xl shadow-sky-950/10 backdrop-blur md:p-6">
					<p className="text-sm font-semibold uppercase tracking-[0.28em] text-sky-700">
						Cosa trovi in pagina
					</p>
					<div className="mt-5 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
						<div className="stat-card">
							<div className="stat-number">{caraffeCount}</div>
							<div className="stat-label">Caraffe selezionate</div>
						</div>
						<div className="stat-card">
							<div className="stat-number">{filtriCount}</div>
							<div className="stat-label">Filtri analizzati</div>
						</div>
						<div className="stat-card">
							<div className="stat-number">1</div>
							<div className="stat-label">Calcolatore per stimare il costo annuo</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
