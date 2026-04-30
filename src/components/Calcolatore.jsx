import React, { useReducer, useEffect, useCallback, useState } from 'react';

import { Typography, Slider } from '@material-tailwind/react';
import FiltriItem from './FiltriItem';

const formatCurrency = (value) =>
	new Intl.NumberFormat('it-IT', {
		style: 'currency',
		currency: 'EUR',
		maximumFractionDigits: 0,
	}).format(Number(value) || 0);

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
	const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
	const { eurlit, daylit, yearCost, startCost, newYearCost, newYearCostNotes } =
		state;
	const filterAnnualCost = Number(newYearCost) || 0;
	const annualSavings = currentFiltro ? yearCost - filterAnnualCost : 0;
	const firstYearSavings = currentFiltro && currentCaraffa
		? yearCost - (filterAnnualCost + Number(startCost || 0))
		: 0;
	const annualLitres = Math.round(daylit * 365);
	const availableFilters = listaFiltri.filter(
		(filtro) => filtro.caraffe[currentCaraffa] === 1,
	);
	const selectedCaraffaEntry = listaCaraffe.find(
		(caraffa) => caraffa.code === currentCaraffa,
	);
	const selectedFiltroEntry = listaFiltri.find(
		(filtro) => filtro.asin === currentFiltro,
	);
	const dayLitPresets = [1.5, 2, 3, 4];
	const euroLitPresets = [0.3, 0.45, 0.6, 0.8];

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
					alt="Litro d'acqua"
				/>,
			);
		}

		if (halfIcon) {
			icons.push(
				<img
					key={fullIcons}
					src="/img/water-half.svg"
					className="water-drop"
					alt="Mezzo litro d'acqua"
				/>,
			);
		}

		return <div>{icons}</div>;
	};

	const Coins = ({ amount }) => {
		let coins = [];
		let totcoins = Math.floor(amount * 10);

		for (let i = 1; i < totcoins; i++) {
			coins.push(
				<img key={i} src="/img/coin.svg" className="coin" alt="Costo" />,
			);
		}

		return <div>{coins}</div>;
	};

	const updCurrentCaraffa = (e) => {
		setCurrentCaraffa(e.target.value);
	};

	const manageEurLit = (e) => {
		let val = e.target.value;
		let newval = val.replace(',', '.').replace(' ', '');
		dispatch({ type: 'SET_EURLIT', payload: parseFloat(newval) });
	};

	const manageDayLit = (e) => {
		let val = e.target.value;
		dispatch({ type: 'SET_DAYLIT', payload: parseFloat(val) });
	};

	const setDayLitPreset = (value) => {
		dispatch({ type: 'SET_DAYLIT', payload: value });
	};

	const setEurLitPreset = (value) => {
		dispatch({ type: 'SET_EURLIT', payload: value });
	};

	const openFilterModal = () => {
		if (!currentCaraffa) {
			return;
		}

		if (availableFilters.length === 1) {
			setCurrentFiltro(availableFilters[0].asin);
			setIsFilterModalOpen(false);
			return;
		}

		const calculatorTop = thisref?.current?.getBoundingClientRect().top;
		if (typeof calculatorTop === 'number') {
			window.scrollTo({
				top: Math.max(window.scrollY + calculatorTop - 24, 0),
				behavior: 'smooth',
			});
		}

		setIsFilterModalOpen(true);
	};

	const closeFilterModal = useCallback(() => {
		setIsFilterModalOpen(false);
	}, []);

	const handleModalFilterSelect = (asin) => {
		setCurrentFiltro(asin);
		setIsFilterModalOpen(false);
	};

	const manageNewCost = useCallback(() => {
		const currentC = listaCaraffe.find((item) => item.code === currentCaraffa);
		const currentF = listaFiltri.find((item) => item.asin === currentFiltro);

		currentC && dispatch({ type: 'SET_START_COST', payload: currentC.price });

		if (currentF) {
			let prezzoFiltro = Number(currentF.costo);
			const durataFiltroMesi = currentF.durata_mesi;
			const durataFiltroLitri = currentF.durata_litri;
			let durataFiltroGiorni = durataFiltroMesi * 30;
			let filtri = 12 / durataFiltroMesi;

			dispatch({ type: 'SET_MONTHS', payload: durataFiltroMesi });
			dispatch({ type: 'SET_LITRES', payload: durataFiltroLitri });

			let notes = `Ogni filtro ha un costo di € ${prezzoFiltro} e una durata di massimo ${durataFiltroMesi} ${
				durataFiltroMesi === 1 ? 'mese' : 'mesi'
			}. Il consumo previsto nel periodo di ${durataFiltroMesi} ${
				durataFiltroMesi === 1 ? 'mese' : 'mesi'
			} è di ${daylit * (durataFiltroMesi * 30)} litri, inferiori al limite di ${durataFiltroLitri} litri per ogni filtro. Verranno quindi consumati circa ${
				12 / durataFiltroMesi
			} filtri all'anno.`;

			if (daylit * durataFiltroGiorni > durataFiltroLitri) {
				durataFiltroGiorni = durataFiltroLitri / daylit;
				filtri = 365 / durataFiltroGiorni;
				notes = `Ogni filtro ha un costo di € ${prezzoFiltro} e una durata di massimo ${durataFiltroMesi} ${
					durataFiltroMesi === 1 ? 'mese' : 'mesi'
				}. Il consumo previsto nel periodo di ${durataFiltroMesi} ${
					durataFiltroMesi === 1 ? 'mese' : 'mesi'
				} è di ${daylit * (durataFiltroMesi * 30)} litri, superiori al limite di ${durataFiltroLitri} litri per ogni filtro, per cui ogni filtro dovrà essere sostituito ogni ${durataFiltroGiorni.toFixed(
					0,
				)} giorni, per un consumo di circa ${filtri.toFixed(0)} filtri all'anno.`;
			}

			dispatch({ type: 'SET_YEAR_COST', payload: (filtri * prezzoFiltro).toFixed(0) });
			dispatch({ type: 'SET_YEAR_COST_NOTES', payload: notes });
		} else {
			dispatch({ type: 'SET_YEAR_COST', payload: null });
			dispatch({ type: 'SET_YEAR_COST_NOTES', payload: '' });
		}
	}, [currentCaraffa, currentFiltro, daylit, listaCaraffe, listaFiltri]);

	useEffect(() => {
		manageNewCost();
	}, [currentCaraffa, currentFiltro, daylit, manageNewCost]);

	useEffect(() => {
		const costoAnnuale = Math.round(eurlit * daylit * 365);
		dispatch({ type: 'SET_BOTTLED_YEAR_COST', payload: costoAnnuale });
	}, [eurlit, daylit]);

	useEffect(() => {
		if (availableFilters.length === 1 && currentFiltro !== availableFilters[0].asin) {
			setCurrentFiltro(availableFilters[0].asin);
		}
	}, [availableFilters, currentFiltro, setCurrentFiltro]);

	useEffect(() => {
		if (!isFilterModalOpen) {
			return undefined;
		}

		const handleKeyDown = (event) => {
			if (event.key === 'Escape') {
				closeFilterModal();
			}
		};

		document.body.style.overflow = 'hidden';
		window.addEventListener('keydown', handleKeyDown);

		return () => {
			document.body.style.overflow = '';
			window.removeEventListener('keydown', handleKeyDown);
		};
	}, [closeFilterModal, isFilterModalOpen]);

	return (
		<>
			{!loading && (
				<section
					className="section-panel mt-8 px-5 py-8 md:px-8 md:py-10"
					ref={thisref}
					id="calcolatore"
				>
					<div className="mx-auto max-w-3xl text-center">
						<p className="section-kicker">Calcolatore risparmio</p>
						<Typography
							variant="h2"
							className="title section-title text-slate-950"
						>
							Stima il costo annuo e confrontalo con l'acqua in bottiglia
						</Typography>
						<Typography
							variant="lead"
							className="mt-4 text-base leading-7 text-slate-600 md:text-lg"
						>
							Imposta il tuo scenario, scegli la caraffa e leggi subito il costo
							stimato. Il flusso è più rapido e il risultato finale è più facile
							da capire a colpo d'occhio.
						</Typography>
						<div className="calculator-steps mt-8">
							<span className="calculator-step">1. Definisci il consumo</span>
							<span className="calculator-step">
								2. Scegli caraffa e filtro
							</span>
							<span className="calculator-step">3. Scopri il risparmio</span>
						</div>
					</div>

					<div className="calculator-layout mx-auto mt-8 max-w-6xl gap-6">
						<div className="calculator-box text-slate-900">
							<div className="calculator-box__body">
								<div className="calculator-control-card">
									<div className="calculator-control-card__head">
										<div>
											<p className="calculator-control-card__eyebrow">
												Scenario di consumo
											</p>
											<h3 className="calculator-control-card__title">
												Quanta acqua bevi ogni giorno?
											</h3>
										</div>
										<div className="calculator-chip calculator-chip--primary">
											{daylit} L al giorno
										</div>
									</div>
									<Drops litres={daylit} />
									<div className="calculator-slider-wrap">
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
									<div className="calculator-presets">
										{dayLitPresets.map((preset) => (
											<button
												key={preset}
												type="button"
												onClick={() => setDayLitPreset(preset)}
												className={`calculator-preset ${daylit === preset ? 'calculator-preset--active' : ''}`}
											>
												{preset} L
											</button>
										))}
									</div>
									<p className="calculator-helper-text">
										Per esempio: 2 L per una persona, 3-4 L per una famiglia.
									</p>
								</div>

								<div className="calculator-control-card calculator-control-card--soft">
									<div className="calculator-control-card__head">
										<div>
											<p className="calculator-control-card__eyebrow">
												Prezzo di confronto
											</p>
											<h3 className="calculator-control-card__title">
												Quanto paghi l'acqua in bottiglia?
											</h3>
										</div>
										<div className="calculator-chip">
											€ {eurlit.toFixed(2)} al litro
										</div>
									</div>
									<Coins amount={eurlit} />
									<div className="calculator-slider-wrap">
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
									<div className="calculator-presets">
										{euroLitPresets.map((preset) => (
											<button
												key={preset}
												type="button"
												onClick={() => setEurLitPreset(preset)}
												className={`calculator-preset ${eurlit === preset ? 'calculator-preset--active' : ''}`}
											>
												€ {preset.toFixed(2)}
											</button>
										))}
									</div>
									<p className="calculator-helper-text">
										Usa un valore medio realistico per il formato che compri più
										spesso.
									</p>
								</div>

								<div className="calculator-control-card calculator-control-card--selection">
									<div className="calculator-control-card__head">
										<div>
											<p className="calculator-control-card__eyebrow">
												Sistema filtrante
											</p>
											<h3 className="calculator-control-card__title">
												Abbina caraffa e filtro
											</h3>
										</div>
										<div className="calculator-selection-status">
											<span
												className={`calculator-selection-dot ${currentCaraffa ? 'calculator-selection-dot--active' : ''}`}
											/>
											<span
												className={`calculator-selection-dot ${currentFiltro ? 'calculator-selection-dot--active' : ''}`}
											/>
										</div>
									</div>

									<div className="grid gap-4 md:grid-cols-2">
										<div>
											<label
												htmlFor="caraffa-select"
												className="mb-2 block text-left text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
											>
												Caraffa
											</label>
											<select
												id="caraffa-select"
												onChange={(e) => updCurrentCaraffa(e)}
												value={currentCaraffa || ''}
												className="calculator-select block w-full rounded-2xl border border-slate-200 bg-white p-3 pr-12 text-left text-sm text-slate-900 shadow-sm"
											>
												<option value="">Seleziona una caraffa</option>
												{listaCaraffe
													.slice()
													.sort((a, b) =>
														a.custom_title.localeCompare(b.custom_title),
													)
													.map((entry) => (
														<option key={entry.code} value={entry.code}>
															{entry.custom_title}
														</option>
													))}
											</select>
										</div>
										<div>
											<label
												htmlFor="filtro-trigger"
												className="mb-2 block text-left text-sm font-semibold uppercase tracking-[0.2em] text-slate-500"
											>
												Filtro
											</label>
											<button
												id="filtro-trigger"
												type="button"
												onClick={openFilterModal}
												className="calculator-select-trigger flex w-full items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-left text-sm text-slate-900 shadow-sm"
												disabled={!currentCaraffa}
												aria-haspopup="dialog"
												aria-expanded={isFilterModalOpen}
											>
												<span className={`calculator-select-trigger__value ${selectedFiltroEntry ? '' : 'calculator-select-trigger__value--placeholder'}`}>
													{!currentCaraffa
														? 'Prima scegli una caraffa'
														: selectedFiltroEntry
															? selectedFiltroEntry.nome
															: 'Seleziona'}
												</span>
												<span className="calculator-select-trigger__meta" hidden>
													{currentCaraffa ? `${availableFilters.length} opzioni` : 'Selezione bloccata'}
												</span>
											</button>

										</div>
									</div>

									<div className="calculator-status-row">
										<div className="calculator-status-pill">
											<span className="calculator-status-pill__label">
												Caraffa scelta
											</span>
											<span className="calculator-status-pill__value">
												{selectedCaraffaEntry
													? selectedCaraffaEntry.custom_title
													: 'Nessuna'}
											</span>
										</div>
										<div className="calculator-status-pill">
											<span className="calculator-status-pill__label">
												Filtro scelto
											</span>
											<span className="calculator-status-pill__value">
												{selectedFiltroEntry
													? selectedFiltroEntry.nome
													: 'Nessuno'}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div className="calculator-results mx-auto max-w-5xl">
							<div className="calculator-results__body">
								<div className="calculator-results__headline">
									<span className="calculator-results__label">
										Costo annuale acqua in bottiglia
									</span>
									<span className="calculator-results__value">
										{formatCurrency(yearCost)}
									</span>
								</div>
								<div className="calculator-summary-strip">
									<div className="calculator-summary-pill">
										<span className="calculator-summary-pill__label">
											Litri annui stimati
										</span>
										<strong className="calculator-summary-pill__value">
											{annualLitres}
										</strong>
									</div>
									<div className="calculator-summary-pill">
										<span className="calculator-summary-pill__label">
											Prezzo medio
										</span>
										<strong className="calculator-summary-pill__value">
											€ {eurlit.toFixed(2)}/L
										</strong>
									</div>
								</div>
								<hr className="my-8 border-white/10" />

								{currentCaraffa ? (
									<>
										<div className="calculator-results__grid">
											<div className="calculator-metric">
												<p className="calculator-metric__label">
													Costo caraffa
												</p>
												<p className="calculator-metric__value">
													{formatCurrency(startCost)}
												</p>
											</div>
											{currentFiltro ? (
												<div className="calculator-metric">
													<p className="calculator-metric__label">
														Costo annuale filtri
													</p>
													<p className="calculator-metric__value">
														{formatCurrency(newYearCost)}
													</p>
												</div>
											) : (
												<div className="calculator-metric calculator-metric--muted">
													<p className="calculator-metric__label">
														Costo annuale filtri
													</p>
													<p className="calculator-metric__hint">
														Scegli un filtro per vedere il costo ricorrente
													</p>
												</div>
											)}
										</div>

										{currentFiltro ? (
											<>
												<div className="calculator-highlight">
													<p className="calculator-highlight__eyebrow">
														Lettura rapida
													</p>
													<h3 className="calculator-highlight__title">
														{annualSavings >= 0
															? `Risparmio annuo stimato di ${formatCurrency(annualSavings)}`
															: `Costo annuo superiore di ${formatCurrency(Math.abs(annualSavings))}`}
													</h3>
													<p className="calculator-highlight__text">
														Nel primo anno il confronto include anche il costo
														iniziale della caraffa.
													</p>
												</div>
												<div className="mt-8 grid gap-4 md:grid-cols-3">
													{' '}
													<div className="calculator-metric">
														<p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
															Litri annui stimati
														</p>
														<p className="mt-3 text-3xl font-semibold text-white">
															{annualLitres}
														</p>
													</div>
													<div className="calculator-metric">
														<p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
															Risparmio annuo{' '}
														</p>
														<p className="mt-3 text-3xl font-semibold text-white">
															{formatCurrency(annualSavings)}
														</p>
													</div>
													<div className="calculator-metric">
														<p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-200">
															Saldo primo anno
														</p>
														<p className="mt-3 text-3xl font-semibold text-white">
															{formatCurrency(firstYearSavings)}
														</p>
													</div>
												</div>
												<Typography
													variant="paragraph"
													color="white"
													className="calculator-note mt-8 text-left leading-7 text-slate-200"
												>
													{newYearCostNotes}
												</Typography>
											</>
										) : (
											<p className="mt-8 text-sm leading-7 text-slate-300">
												Seleziona un filtro compatibile per visualizzare costo
												annuo, risparmio stimato e dettaglio del calcolo.
											</p>
										)}
									</>
								) : (
									<div className="calculator-empty-state">
										<p className="calculator-empty-state__eyebrow">
											Pronto a partire
										</p>
										<h3 className="calculator-empty-state__title">
											Scegli una caraffa per vedere il confronto completo
										</h3>
										<p className="calculator-empty-state__text">
											Il pannello mostrerà costo iniziale, costo annuale dei
											filtri e risparmio stimato rispetto all'acqua in
											bottiglia.
										</p>
									</div>
								)}
							</div>
						</div>
					</div>

					{isFilterModalOpen && currentCaraffa && (
						<div
							className="filter-modal"
							role="dialog"
							aria-modal="true"
							aria-labelledby="filter-modal-title"
						>
							<button
								type="button"
								className="filter-modal__backdrop"
								onClick={closeFilterModal}
								aria-label="Chiudi finestra filtri"
							/>
							<div className="filter-modal__positioner">
								<div className="filter-modal__panel">
									<div className="filter-modal__header">
										<div>
											<p className="section-kicker">Filtri compatibili</p>
											<h3 id="filter-modal-title" className="title text-3xl text-slate-950">
												Scegli il filtro per {selectedCaraffaEntry?.custom_title}
											</h3>
											<p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 md:text-base">
												Confronta qui le stesse schede mostrate nella sezione filtri e seleziona quella piu adatta al tuo consumo.
											</p>
										</div>
										<button
											type="button"
											onClick={closeFilterModal}
											className="filter-modal__close"
										>
											Chiudi
										</button>
									</div>
									<div className="filter-modal__body">
										<div className="grid flex-1 gap-5 pt-2 text-center lg:grid-cols-2 xl:grid-cols-3">
											{availableFilters.map((product) => (
												<FiltriItem
													code={product.asin}
													key={product.asin}
													filtro={product}
													currentFiltro={currentFiltro}
													setCurrentFiltro={handleModalFilterSelect}
												/>
											))}
										</div>
									</div>
								</div>
							</div>
						</div>
					)}
				</section>
			)}
		</>
	);
}
