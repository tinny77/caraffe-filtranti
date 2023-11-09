import React, { useState, useEffect } from 'react';

export default function Calcolatore({ lista, mainfile, car, setCar }) {
	const [eurlit, setEurlit] = useState(0.35);
	const [daylit, setDaylit] = useState(2);
	const [yearCost, setYearCost] = useState(0);
	const [startCost, setStartCost] = useState('');
	const [newYearCost, setNewYearCost] = useState('');
	const [durataMesi,setDurataMesi] = useState(0);
	const [durataLitri,setDurataLitri] = useState(0);

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

		for (let i = 0; i < totcoins; i++) {
			coins.push(<img key={i} src="/img/coin.svg" className="coin" />);
		}

		return <div>{coins}</div>;
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

  const matchingObject = lista.find((item) => item.asin === (filtroNome ? actualAsin : providedAsin));

  if (matchingObject) {
    setStartCost(matchingObject.price);
    
    if (filtroNome) {
      const filtro = matchingObject.filtri.find(
        (f) =>
          f.nome.toLowerCase().replace(/ /g, '') === filtroNome.toLowerCase()
      );

      if (filtro) {
        // Utilizza i valori del filtro per il calcolo
        setDurataMesi(filtro.durata_mesi);
        setDurataLitri(filtro.durata_litri);
      }
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
	}, [lista, car, manageNewCost]);
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
					<label>Costo annuale </label>
					<span>€ {yearCost}</span>
				</div>
			</div>
			<div className="card rounded-lg bg-white text-sky-900 shadow-lg p-10">
				<h1 className="text-4xl font-bold mb-4">
					Spesa futura (acqua filtrata)
				</h1>
				<div className="row">
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
            key={`${entry.asin}_${filtro.nome.toLowerCase().replace(/ /g, '')}`}
            value={`${entry.asin}_${filtro.nome.toLowerCase().replace(/ /g, '')}`}
            selected={`${entry.asin}_${filtro.nome.toLowerCase().replace(/ /g, '')}` === car}
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
						<div className="row underline">
							<label>Costo iniziale</label>
							<span>€ {startCost}</span>
						</div>

						<div className="row underline">
							<label>Costo annuale successivo</label>
							<span
								className={
									newYearCost < yearCost ? 'text-green-600' : 'text-red-600'
								}
							>
								€ {newYearCost}
							</span>
						</div>
						<div className="row">
							<br />
							<small>
								Note su filtro incluso o meno, numero filtri utilizzati, ecc..
							</small>
							CARAFFA SELEZIONATA: {car}
						</div>
					</>
				)}
			</div>
		</form>
	);
}
