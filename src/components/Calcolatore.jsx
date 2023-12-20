import React, { useReducer, useEffect, useCallback } from 'react';

import { Card, CardBody, Typography, Slider } from '@material-tailwind/react';

const initialState = {
	eurlit: 0.35,
	daylit: 2,
	yearCost: 0,
	startCost: '',
	newYearCost: '',
	durataMesi: 0,
	durataLitri: 0,
	newYearCostNotes: '',
};

const reducer = (state, action) => {
	switch (action.type) {
		case 'SET_START_COST':
			return { ...state, startCost: action.payload };
		case 'SET_EURLIT':
			return { ...state, eurlit: action.payload };
		case 'SET_DAYLIT':
			return { ...state, daylit: action.payload };
		case 'SET_MONTHS':
			return { ...state, durataMesi: action.payload };
		case 'SET_LITRES':
			return { ...state, durataLitri: action.payload };
		case 'SET_BOTTLED_YEAR_COST':
			return { ...state, yearCost: action.payload };
		case 'SET_YEAR_COST':
			return { ...state, newYearCost: action.payload };
		case 'SET_YEAR_COST_NOTES':
			return { ...state, newYearCostNotes: action.payload };
		default:
			return state;
	}
};

export default function Calcolatore({
	listaCaraffe,
	currentCaraffa,
	setCurrentCaraffa,
	listaFiltri,
	currentFiltro,
	setCurrentFiltro,
	thisref,
	loading,
}) {
	const [state, dispatch] = useReducer(reducer, initialState);
	const {
		eurlit,
		daylit,
		yearCost,
		startCost,
		newYearCost,
		durataMesi,
		durataLitri,
		newYearCostNotes,
	} = state;

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
		dispatch({ type: 'SET_EURLIT', payload: parseFloat(newval) });
	};
	const manageDayLit = (e) => {
		let val = e.target.value;
		dispatch({ type: 'SET_DAYLIT', payload: val });
	};

	const manageNewCost = useCallback(() => {
		const currentC = listaCaraffe.find((item) => item.code === currentCaraffa);
		const currentF = listaFiltri.find((item) => item.asin === currentFiltro);

		currentC && dispatch({ type: 'SET_START_COST', payload: currentC.price });

		if (currentF) {
			let prezzo_filtro = 0;

			dispatch({ type: 'SET_MONTHS', payload: currentF.durata_mesi });
			dispatch({ type: 'SET_LITRES', payload: currentF.durata_litri });
			prezzo_filtro = Number(currentF.costo);

			//Calcolo costo filtri annuale
			let durata_filtro_mesi = currentF.durata_mesi;
			let durata_filtro_giorni = durata_filtro_mesi * 30;
			let durata_filtro_litri = currentF.durata_litri;
			//console.log(durata_filtro_giorni);
			let filtri = 12 / durata_filtro_mesi;

			dispatch({
				type: 'SET_YEAR_COST_NOTES',
				payload: `Ogni filtro ha un costo di € ${prezzo_filtro} e una durata di massimo ${durataMesi} ${
					durataMesi === 1 ? `mese` : `mesi`
				}. Il consumo previsto nel periodo di ${durataMesi} ${
					durataMesi === 1 ? `mese` : `mesi`
				} è di ${
					daylit * (durataMesi * 30)
				} litri, inferiori al limite di ${durataLitri} litri per ogni filtro. Verranno quindi consumati circa ${
					12 / durataMesi
				} filtri all'anno (questo perché il filtro andrà comunque cambiato ogni ${
					durataMesi === 1 ? `mese` : `${durataMesi} mesi`
				}).`,
			});

			//Se consumo più litri, il filtro dura meno...
			if (daylit * durata_filtro_giorni > durata_filtro_litri) {
				durata_filtro_giorni = durataLitri / daylit;
				filtri = 365 / durata_filtro_giorni;

				dispatch({
					type: 'SET_YEAR_COST_NOTES',
					payload: `Ogni filtro ha un costo di € ${prezzo_filtro} e una durata di massimo ${durataMesi} ${
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
					}, per un consumo di circa ${filtri.toFixed(0)} filtri all'anno.`,
				});
			}

			dispatch({
				type: 'SET_YEAR_COST',
				payload: (filtri * prezzo_filtro).toFixed(0),
			});
		} else {
			dispatch({
				type: 'SET_YEAR_COST',
				payload: null,
			});
			dispatch({
				type: 'SET_YEAR_COST_NOTES',
				payload: '',
			});
		}
	}, [
		currentCaraffa,
		currentFiltro,
		daylit,
		durataLitri,
		durataMesi,
		listaCaraffe,
		listaFiltri,
	]);

	useEffect(() => {
		manageNewCost();
	}, [currentCaraffa, currentFiltro, daylit, durataMesi, manageNewCost]);

	useEffect(() => {
		const costo_annuale = Math.round(eurlit * daylit * 365);
		dispatch({
			type: 'SET_BOTTLED_YEAR_COST',
			payload: costo_annuale,
		});
	}, [eurlit, daylit]);

	return (
		<>
			{!loading && (
				<div className="pt-24 mt-24" ref={thisref} id="calcolatore">
					<Typography
						variant="h3"
						color="white"
						className="title  mb-0 text-2xl text-center"
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
								Costo annuale acqua in bottiglia:{' '}
								<strong className="text-white p-2 px-4 border border-blue bg-blue-800 rounded-lg block md:inline-block mt-2 md:m-0">
									€ {yearCost}
								</strong>
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
									value={currentCaraffa || ''}
									className="text-blue-800 border bg-white text-sm rounded-lg block w-full p-2.5 py-3 text-center"
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

							<div className="max-w-md mt-2 text-white mx-auto">
								<select
									label="Filtro"
									size="lg"
									color="white"
									onChange={(e) => updCurrentFiltro(e)}
									value={currentFiltro || ''}
									className="text-blue-800 border bg-white text-sm rounded-lg block w-full p-2.5 py-3 text-center"
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

							{currentCaraffa && (
								<>
									{/* <Coins amount={startCost} /> */}
									<Typography
										className="pt-4 pb-2 mb-4 mt-6"
										variant="h4"
										color="white"
									>
										Costo caraffa:{' '}
										<strong className="text-white p-2 px-4 border border-blue bg-blue-800 rounded-lg block md:inline-block mt-2 md:m-0">
											€ {startCost}
										</strong>
									</Typography>

									{listaFiltri && newYearCost ? (
										<>
											<Typography variant="h4" color="white">
												Costo annuale filtri:{' '}
												<strong className="text-white p-2 px-4 border border-blue bg-blue-800 rounded-lg block md:inline-block mt-2 md:m-0">
													€ {newYearCost}
												</strong>
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
			)}
		</>
	);
}
