import React, { useState, useEffect } from 'react';

import {
	Card,
	CardHeader,
	CardBody,
	Typography,
	Chip,
	Button,
} from '@material-tailwind/react';

import sostanzeData from '../data/sostanze.json';

const formatCurrency = (value) =>
	new Intl.NumberFormat('it-IT', {
		style: 'currency',
		currency: 'EUR',
		maximumFractionDigits: 2,
	}).format(Number(value) || 0);

// Componente ProductItem
const FiltriItem = ({ code, filtro, currentFiltro, setCurrentFiltro }) => {
	const [sostanze, setSostanze] = useState(null);

	useEffect(() => {
		setSostanze(sostanzeData);
	}, []);

	const isItemSelected = code === currentFiltro;

	return (
		<Card
			className={`product-card mb-0 w-full rounded-[1.75rem] border p-6 text-left shadow-xl shadow-sky-950/5 ${
				isItemSelected
					? `border-sky-500 bg-sky-50/95`
					: `border-white/70 bg-white/88`
			}`}
			key={code}
		>
			<CardHeader
				floated={false}
				shadow={false}
				color="transparent"
				className="m-0 mb-4 rounded-none border-b border-slate-200/90 pb-4 text-left"
			>
				<div className="mb-3 flex items-center justify-between gap-3">
					<span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-800">
						{filtro.durata_mesi} {filtro.durata_mesi === 1 ? 'mese' : 'mesi'}
					</span>
					{isItemSelected && (
						<span className="inline-flex rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
							Attivo
						</span>
					)}
				</div>
				<Typography
					className="text-xl font-semibold text-slate-950"
				>
					{filtro.nome}
				</Typography>
				<Typography
					variant="h4"
					className="mt-3 text-3xl font-semibold text-slate-950"
				>
					{formatCurrency(filtro.costo)}
				</Typography>
				<p className="mt-2 text-sm leading-6 text-slate-600">
					Durata nominale: {filtro.durata_litri} litri o {filtro.durata_mesi}{' '}
					{filtro.durata_mesi === 1 ? 'mese' : 'mesi'}.
				</p>
				{filtro.note && (
					<p className="mt-3 text-sm leading-6 text-slate-500">{filtro.note}</p>
				)}
			</CardHeader>
			<CardBody className="p-0 mt-4">
				<Caratteristiche filtro={filtro} sostanze={sostanze} />
				<div className="mt-6 grid gap-3 sm:grid-cols-2">
					<Button
						type="button"
						onClick={() => setCurrentFiltro(code)}
						className={`rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-none ${
							isItemSelected ? '!bg-sky-700' : '!bg-sky-600'
						}`}
					>
						{isItemSelected ? 'Filtro selezionato' : 'Seleziona filtro'}
					</Button>
					<a href={filtro.url} target="_blank" rel="noreferrer">
						<Button className="w-full rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm font-semibold text-sky-900 shadow-none">
							Apri scheda prodotto
						</Button>
					</a>
				</div>
			</CardBody>
		</Card>
	);
};

// Componente Caratteristiche
const Caratteristiche = ({ filtro, sostanze }) => {
	const getEtichettaENota = (caratteristica, sostanze) => {
		const sostanza = sostanze[caratteristica];
		if (sostanza) {
			return {
				etichetta: sostanza.etichetta,
				nota: sostanza.nota || '',
			};
		}
		return {
			etichetta: caratteristica,
			nota: '',
		};
	};

	return (
		<div className="flex flex-wrap gap-2 text-xs mb-4 justify-start">
			{Object.entries(filtro.caratteristiche)
				.sort(([car1], [car2]) => car1.localeCompare(car2))
				.map(([caratteristica, valore]) => {
					const { etichetta, nota } = getEtichettaENota(
						caratteristica,
						sostanzeData
					);
					return (
						<React.Fragment key={caratteristica}>
							<Chip
								value={etichetta}
								className="rounded-full pill bg-slate-100 text-slate-700"
								variant={
									valore === 1 ? 'filled' : valore < 1 ? 'ghost' : 'outlined'
								}
							/>
							{nota && (
								<Typography
									variant="small"
									className="w-full font-normal text-slate-500"
								>
									{nota}
								</Typography>
							)}
						</React.Fragment>
					);
				})}
		</div>
	);
};

export default FiltriItem;
