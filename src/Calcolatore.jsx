import React, { useState, useEffect } from 'react';

import { Card, CardBody, Typography, Slider } from '@material-tailwind/react';

export default function Calcolatore({
	listaCaraffe,
	currentCaraffa,
	setCurrentCaraffa,
	listaFiltri,
	currentFiltro,
	setCurrentFiltro,
	thisref,
}) {
	const [eurlit, setEurlit] = useState(0.35);
	const [daylit, setDaylit] = useState(2);
	const [yearCost, setYearCost] = useState(0);
	const [startCost, setStartCost] = useState('');
	const [newYearCost, setNewYearCost] = useState('');
	const [durataMesi, setDurataMesi] = useState(0);
	const [durataLitri, setDurataLitri] = useState(0);
	const filters = useState(1);
	const [newYearCostNotes, setNewYearCostNotes] = useState('');

	const Drops = ({ litres }) => {
		let icons = [];
		let fullIcons = Math.floor(litres);
		let halfIcon = litres % 1 === 0.5;

		for (let i = 0; i < fullIcons; i++) {
			icons.push(
				<img
					key={i}
					src="/img/water-full.svg"
					className="water-drop"
					alt="rating"
				/>
			);
		}

		if (halfIcon) {
			icons.push(
				<img
					key={fullIcons}
					src="/img/water-half.svg"
					className="water-drop"
					alt="water drop"
				/>
			);
		}

		return <div>{icons}</div>;
	};

	const Coins = ({ amount }) => {
		let coins = [];
		let totcoins = Math.floor(amount * 10);

		for (let i = 1; i < totcoins; i++) {
			coins.push(
				<img key={i} src="/img/coin.svg" className="coin" alt="coins" />
			);
		}

		return <div>{coins}</div>;
	};

	const updCurrentCaraffa = (e) => {
		setCurrentCaraffa(e.target.value);
	};

	const updCurrentFiltro = (e) => {
		setCurrentFiltro(e.target.value);
	};
	const manageEurLit = (e) => {
		let val = e.target.value;
		let newval = val.replace(',', '.').replace(' ', '');
		setEurlit(parseFloat(newval));
	};
	const manageDayLit = (e) => {
		let val = e.target.value;
		setDaylit(val);
	};

	useEffect(() => {
		manageNewCost();
	}, [currentCaraffa, currentFiltro, daylit, durataMesi]);

	useEffect(() => {
		const costo_annuale = Math.round(eurlit * daylit * 365);
		setYearCost(costo_annuale);
	}, [eurlit, daylit]);

	const manageNewCost = () => {
		const currentC = listaCaraffe.find((item) => item.code === currentCaraffa);
		const currentF = listaFiltri.find((item) => item.asin === currentFiltro);

		currentC && setStartCost(currentC.price);

		if (currentF) {
			let prezzo_filtro = 0;

			setDurataMesi(currentF.durata_mesi);
			setDurataLitri(currentF.durata_litri);
			prezzo_filtro = Number(currentF.costo);

			//Calcolo costo filtri annuale
			let durata_filtro_mesi = currentF.durata_mesi;
			let durata_filtro_giorni = durata_filtro_mesi * 30;
			let durata_filtro_litri = currentF.durata_litri;
			//console.log(durata_filtro_giorni);
			let filtri = 12 / durata_filtro_mesi;

			setNewYearCostNotes(
				`Ogni filtro ha un costo di € ${prezzo_filtro} e una durata di massimo ${durataMesi} ${
					durataMesi === 1 ? `mese` : `mesi`
				}. Il consumo previsto nel periodo di ${durataMesi} ${
					durataMesi === 1 ? `mese` : `mesi`
				} è di ${
					daylit * (durataMesi * 30)
				} litri, inferiori al limite di ${durataLitri} litri per ogni filtro. Verranno quindi consumati circa ${
					12 / durataMesi
				} filtri all'anno (questo perché il filtro andrà comunque cambiato ogni ${
					durataMesi === 1 ? `mese` : `${durataMesi} mesi`
				}).`
			);

			//Se consumo più litri, il filtro dura meno...
			if (daylit * durata_filtro_giorni > durata_filtro_litri) {
				durata_filtro_giorni = durataLitri / daylit;
				filtri = 365 / durata_filtro_giorni;
				setNewYearCostNotes(
					`Ogni filtro ha un costo di € ${prezzo_filtro} e una durata di massimo ${durataMesi} ${
						durataMesi === 1 ? `mese` : `mesi`
					}. Il consumo previsto nel periodo di ${durataMesi} ${
						durataMesi === 1 ? `mese` : `mesi`
					} è di ${
						daylit * (durata_filtro_mesi * 30)
					} litri, superiori al limite di ${durataLitri} litri per ogni filtro, per cui ogni filtro dovrà essere sostituito ogni ${durata_filtro_giorni.toFixed(
						0
					)} giorni${
						durata_filtro_giorni > 90
							? ` (verificare che i filtri non abbiano un periodo temporale massimo di utilizzo)`
							: ``
					}, per un consumo di circa ${filtri.toFixed(0)} filtri all'anno.`
				);
			}

			setNewYearCost((filtri * prezzo_filtro).toFixed(0));
			//setFilters(filtri.toFixed(0));
		} else {
			setNewYearCost(null);
			setNewYearCostNotes('');
		}
	};

	return (
		<div className="pt-24" ref={thisref} id="calcolatore">
			<Typography
				variant="h3"
				color="white"
				className="title mt-24 mb-0 text-2xl text-center"
			>
				Calcola
			</Typography>
			<Card
				className="max-w-4xl mx-auto text-center text-white mt-6 border border-blue bg-blue-800"
				color="transparent"
				shadow={false}
			>
				<CardBody>
					<Typography variant="lead" color="white" className="mb-2 cursive">
						Litri bevuti al giorno: {daylit}
					</Typography>

					<Drops litres={daylit} />
					<div className="flex w-96 max-w-full flex-col gap-8 my-5 mx-auto mb-10">
						<Slider
							size="lg"
							name="daylit"
							id="daylit"
							color="blue"
							value={daylit}
							min="0.5"
							max="10"
							step="0.5"
							onChange={(e) => manageDayLit(e)}
						/>
					</div>
					<Typography variant="lead" color="white" className="cursive">
						Costo acqua in bottiglia al litro: € {eurlit}
					</Typography>
					<Coins amount={eurlit} className="mt-2" />
					<div className="flex w-96 max-w-full flex-col gap-8 my-5 mx-auto">
						<Slider
							size="lg"
							color="blue"
							id="eurlit"
							name="eurlit"
							min="0.20"
							max="1"
							value={eurlit}
							step="0.05"
							onChange={(e) => manageEurLit(e)}
						/>
					</div>
				</CardBody>
			</Card>

			<Card
				className="max-w-4xl mx-auto text-center text-white p-5 shadow-lg mt-6 border border-blue"
				color="blue"
				variant="gradient"
			>
				<CardBody>
					<Typography variant="h4" color="white" className="mb-2">
						Costo annuale acqua in bottiglia: <span>€ {yearCost}</span>
					</Typography>
					<hr className="my-8 border-blue-gray-50" />
					<Typography variant="lead" color="white" className="cursive mb-2">
						Scegli caraffa e filtri
					</Typography>

					<div className="max-w-md text-white mx-auto">
						<select
							label="Caraffa"
							size="lg"
							color="white"
							onChange={(e) => updCurrentCaraffa(e)}
							value={currentCaraffa}
							className="text-blue-800 border bg-white text-sm rounded-lg block w-full p-2.5 text-center"
						>
							{/*!currentCaraffa && (
							<Option value="" key="0">
								Seleziona...
							</Option>
						)*/}
							{listaCaraffe
								.slice()
								.sort((a, b) => {
									if (a.custom_title < b.custom_title) {
										return -1;
									}
									if (a.custom_title > b.custom_title) {
										return 1;
									}
									return 0;
								})
								.map((entry) => (
									<option key={entry.code} value={entry.code}>
										{entry.custom_title}
									</option>
								))}
						</select>
					</div>
					{filters && (
						<div className="max-w-md mt-2 text-white mx-auto">
							<select
								label="Filtro"
								size="lg"
								color="white"
								onChange={(e) => updCurrentFiltro(e)}
								value={currentFiltro}
								className="text-blue-800 border bg-white text-sm rounded-lg block w-full p-2.5 text-center"
							>
								{!currentFiltro && (
									<option value="" key="00">
										Seleziona...
									</option>
								)}
								{listaFiltri
									.filter((f) => f.caraffe[currentCaraffa] === 1)
									.map((entry) => (
										<option key={entry.asin} value={entry.asin}>
											{entry.nome}
										</option>
									))}
							</select>
						</div>
					)}
					{currentCaraffa && (
						<>
							{/* <Coins amount={startCost} /> */}
							<Typography className="pt-4 pb-2 mt-4" variant="h4" color="white">
								<label>Costo caraffa:</label>
								<span>€ {startCost}</span>
							</Typography>

							{listaFiltri && newYearCost ? (
								<>
									<Typography variant="h4" color="white">
										<label>Costo annuale filtri:</label>
										<span>€ {newYearCost}</span>
									</Typography>
									<Typography
										variant="paragraph"
										color="white"
										className="leading-none text-justify mt-8"
									>
										{newYearCostNotes}
									</Typography>
								</>
							) : (
								''
							)}
						</>
					)}
				</CardBody>
			</Card>
		</div>
	);
}
