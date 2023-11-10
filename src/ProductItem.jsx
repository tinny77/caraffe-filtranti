import React, { useState, useEffect } from 'react';
import sostanze from './data/sostanze.json';
import { BsStarFill, BsStarHalf } from 'react-icons/bs';

// Componente Caratteristiche
const Caratteristiche = ({ filtro, sostanzeData }) => {
	const getEtichettaENota = (caratteristica, sostanzeData) => {
		const sostanza = sostanzeData[caratteristica];
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
		<div className="caratteristiche mt-5" key={filtro.nome}>
			<table className="mx-auto">
				{Object.entries(filtro.caratteristiche)
					.sort(([car1], [car2]) => car1.localeCompare(car2))
					.map(([caratteristica, valore]) => {
						const { etichetta, nota } = getEtichettaENota(
							caratteristica,
							sostanzeData
						);
						return (
							<React.Fragment key={caratteristica}>
								<tr>
									<td style={{ textAlign: 'left' }}>{etichetta}</td>
									<td>{valore === 1 ? '✅' : valore < 1 ? '❌' : '✓'}</td>
								</tr>
								{nota && (
									<tr>
										<td colSpan="2" style={{ display: 'table-cell' }}>
											<small>{nota}</small>
										</td>
									</tr>
								)}
							</React.Fragment>
						);
					})}
			</table>
		</div>
	);
};

// Componente Rating
const Rating = ({ stars }) => {
	let rating = [];
	let fullIcon = Math.floor(stars);
	let halfIcon = stars % 1 === 0.5;

	for (let i = 0; i < fullIcon; i++) {
		rating.push(<BsStarFill className="rating-star" key={i} />);
	}

	if (halfIcon) {
		rating.push(<BsStarHalf className="rating-star" key={stars + 1} />);
	}

	return <div>{rating}</div>;
};

// Componente ProductItem
const ProductItem = ({
	lista,
	entry,
	filtro,
	filtrostring,
	car,
	setCar,
	remove,
}) => {
	const [sostanzeData, setSostanzeData] = useState({});

	useEffect(() => {
		setSostanzeData(sostanze);
	}, []);

	const isItemSelected =
		entry.asin === car || entry.asin + filtrostring === car;

	return (
		<div
			key={entry.asin + filtrostring}
			className={`product-col p-4 border border-white rounded-lg text-center shadow ${
				isItemSelected && `selected`
			}`}
			onClick={() => setCar(entry.asin + filtrostring)}
		>
			<div style={{ height: 60 }}>
				<h2 className="text-xl">{entry.custom_title}</h2>
				<p>{filtro.nome}</p>
			</div>

			<div className="img-container rounded-md my-12">
				<img src={entry.image} className="max-w-full" alt={entry.title} />
			</div>
			<p>€ {JSON.stringify(entry.price)}</p>
			<p className="rating">
				Rating: <Rating stars={entry.rating} />{' '}
				<span>({entry.rating_num})</span>
			</p>

			{/* Utilizza il componente Caratteristiche */}
			<Caratteristiche filtro={filtro} sostanzeData={sostanzeData} />

			<a href={entry.link} target="_blank" rel="noreferrer">
				<button className="bg-gray-800 p-1 px-4 mt-5 rounded-md">
					ACQUISTA
				</button>
			</a>
			{lista.length > 1 && (
				<span
					className="close"
					onClick={() => remove(entry.asin + filtrostring)}
					title="Scarta"
				>
					&times;
				</span>
			)}
		</div>
	);
};

export default ProductItem;
