import React, { useState, useEffect } from 'react';

export default function Calcolatore({
	lista,
	mainfile,
	car,
	setCar,
	getFiltroString,
}) {
	const [eurlit, setEurlit] = useState(0.35);
	const [daylit, setDaylit] = useState(2);
	const [yearCost, setYearCost] = useState(0);
	const [startCost, setStartCost] = useState('');
	const [newYearCost, setNewYearCost] = useState('');
	const [durataMesi, setDurataMesi] = useState(0);
	const [durataLitri, setDurataLitri] = useState(0);
	const [filters, setFilters] = useState(1);
	const [newYearCostNotes, setNewYearCostNotes] = useState('');

	const Drops = ({ litres }) => {
		let icons = [];
		let fullIcons = Math.floor(litres);
		let halfIcon = litres % 1 === 0.5;

		for (let i = 0; i < fullIcons; i++) {
			icons.push(
				<img key={i} src="/img/water-full.svg" className="water-drop" />
			);
		}

		if (halfIcon) {
			icons.push(
				<img key={fullIcons} src="/img/water-half.svg" className="water-drop" />
			);
		}

		return <div>{icons}</div>;
	};

	const Coins = ({ amount }) => {
		let coins = [];
		let totcoins = Math.floor(amount * 10);

		for (let i = 1; i < totcoins; i++) {
			coins.push(<img key={i} src="/img/coin.svg" className="coin" />);
		}

		return <div>{coins}</div>;
	};

	const Filters = ({ number }) => {
		let filters = [];

		for (let i = 0; i < number; i++) {
			filters.push(<img key={i} src="/img/filter.svg" className="filter" />);
		}

		return <div>{filters}</div>;
	};

	const manageEurLit = (e) => {
		let val = e.target.value;
		let newval = val.replace(',', '.').replace(' ', '');
		setEurlit(parseFloat(newval));
	};
	const manageDayLit = (e) => {
		let val = e.target.value;
		//let newval = parseFloat(val.replace(',', '.').replace(' ', ''));
		setDaylit(val);
	};

	const manageNewCost = (e) => {
		let providedAsin = e.target.value;
		setCar(providedAsin);
		let [actualAsin, filtroNome] = providedAsin.split('_'); // Dividi l'input in asin e filtroNome se c'è un underscore

		const matchingCaraffa = lista.find(
			(item) => item.asin === (filtroNome ? actualAsin : providedAsin)
		);

		if (matchingCaraffa) {
			setStartCost(matchingCaraffa.price);

			if (filtroNome) {
				const filtro = matchingCaraffa.filtri.find(
					(f) => getFiltroString(f.nome) === getFiltroString(filtroNome)
				);

				let prezzo_filtro = 0;

				if (filtro) {
					// Utilizza i valori del filtro per il calcolo
					setDurataMesi(filtro.durata_mesi);
					setDurataLitri(filtro.durata_litri);
					prezzo_filtro = filtro.costo;
					//console.log(`Durata mesi:  ${durataMesi}`);
					//console.log(`Durata litri:  ${durataLitri}`);
				}
				//Calcolo costo filtri annuale
				let durata_filtro_giorni = durataMesi * 30;
				let filtri = 12 / durataMesi;
				setNewYearCostNotes(
					`Ogni filtro ha un costo di € ${prezzo_filtro} e una durata di massimo ${durataMesi} mesi.\nIl consumo previsto nel periodo di ${durataMesi} mesi è di ${
						daylit * (durataMesi * 30)
					} litri, inferiori al limite di ${durataLitri} litri per ogni filtro. Verranno quindi consumati circa ${
						12 / durataMesi
					} filtri all'anno (questo perché il filtro andrà comunque cambiato ogni ${durataMesi} mesi).`
				);
				//Se consumo più litri, il filtro dura meno...
				if (daylit * durata_filtro_giorni > durataLitri) {
					durata_filtro_giorni = durataLitri / daylit;
					filtri = 365 / durata_filtro_giorni;
					setNewYearCostNotes(
						`Ogni filtro ha un costo di € ${prezzo_filtro} e una durata di massimo ${durataMesi} mesi.\nIl consumo previsto nel periodo di ${durataMesi} mesi è di ${
							daylit * (durataMesi * 30)
						} litri, superiori al limite di ${durataLitri} litri per ogni filtro, per cui ogni filtro dovrà essere sostituito ogni ${durata_filtro_giorni.toFixed(
							0
						)} giorni, per un consumo di circa ${(
							365 / durata_filtro_giorni
						).toFixed(0)} filtri all'anno.`
					);
				}
				/*console.log(
					`365 / ${durata_filtro_giorni} * ${prezzo_filtro} ---- daylit: ${daylit}`
				);*/
				setNewYearCost(
					((365 / durata_filtro_giorni) * prezzo_filtro).toFixed(0)
				);
				setFilters(filtri.toFixed(0));
			} else {
				setDurataMesi(null);
				setDurataLitri(null);
			}
		}
	};

	useEffect(() => {
		if (car) {
			manageNewCost({ target: { value: car } });
		}
	}, [lista, car, manageNewCost, daylit]);
	useEffect(() => {
		const costo_annuale = Math.round(eurlit * daylit * 365);
		setYearCost(costo_annuale);
	}, [eurlit, daylit]);

	return (
		<form className="max-w-6xl mx-auto text-center" id="calcolatore">
			<div className="row">
				<label>Litri bevuti al giorno: {daylit} </label>
				<br />
				<Drops litres={daylit} />
				<input
					name="daylit"
					id="daylit"
					type="range"
					value={daylit}
					min="0.5"
					max="10"
					step="0.5"
					onChange={(e) => manageDayLit(e)}
				/>
			</div>
			<div className="card rounded-lg bg-white text-sky-900 shadow-lg p-10 mt-5 mb-10">
				<h1 className="text-4xl font-bold mb-4">
					Spesa attuale (acqua in bottiglia)
				</h1>
				<div className="row">
					<label>Costo al litro: € {eurlit}</label>
					<br />
					<Coins amount={eurlit} />
					<input
						type="range"
						id="eurlit"
						name="eurlit"
						min="0.20"
						max="1"
						value={eurlit}
						step="0.05"
						onChange={(e) => manageEurLit(e)}
					/>
				</div>
				<div className="row underline">
					<label>Costo annuale acqua in bottiglia</label>
					<span>€ {yearCost}</span>
				</div>
			</div>
			<div className="card rounded-lg bg-white text-sky-900 shadow-lg p-10">
				<h1 className="text-4xl font-bold mb-4">
					Spesa futura (acqua filtrata)
				</h1>
				<div className="row mb-2">
					<label>Caraffa</label>
					<select onChange={(e) => manageNewCost(e)}>
						{!car && (
							<option value="" selected>
								Seleziona...
							</option>
						)}
						{lista.flatMap((entry) =>
							entry.filtri.length > 1
								? entry.filtri.map((filtro) => (
										<option
											key={`${entry.asin}${getFiltroString(filtro.nome)}`}
											value={`${entry.asin}${getFiltroString(filtro.nome)}`}
											selected={
												`${entry.asin}${getFiltroString(filtro.nome)}` === car
											}
										>
											{entry.custom_title} - {filtro.nome}
										</option>
								  ))
								: [
										<option
											key={entry.asin}
											value={entry.asin}
											selected={entry.asin === car}
										>
											{entry.custom_title}
										</option>,
								  ]
						)}
					</select>
				</div>
				{car && (
					<>
						{/* <Coins amount={startCost} /> */}
						<div className="row underline py-4">
							<label>Costo iniziale caraffa</label>
							<span>€ {startCost}</span>
						</div>

						{/* <Filters number={filters} /> */}

						<div className="row underline">
							<label>Costo annuale filtri</label>
							<span>€ {newYearCost}</span>
						</div>
						<div className="row">
							<br />
							<small className="text-block">{newYearCostNotes}</small>
						</div>
					</>
				)}
			</div>
		</form>
	);
}
