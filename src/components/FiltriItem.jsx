import React, { useState, useEffect } from 'react';

import {
	Card,
	CardHeader,
	CardBody,
	Typography,
	Chip,
} from '@material-tailwind/react';

import sostanzeData from '../data/sostanze.json';

// Componente ProductItem
const FiltriItem = ({
	code,
	filtro,
	currentFiltro,
	setCurrentFiltro,
	totalFiltri,
}) => {
	const [sostanze, setSostanze] = useState(null);

	useEffect(() => {
		setSostanze(sostanzeData);
	}, []);

	const isItemSelected = code === currentFiltro;

	return (
		<Card
			variant="gradient"
			className={`product-card mb-6 w-full md:w-2/3 lg:w-1/3 inline-block p-6 md:m-2 lg:m-4 border-solid border-4 ${
				isItemSelected ? `border-blue-900 ` : `border-white`
			}`}
			key={code}
			onClick={() => setCurrentFiltro(code)}
		>
			<CardHeader
				floated={false}
				shadow={false}
				color="transparent"
				className="m-0 mb-4 rounded-none border-b border-white/10 text-center"
			>
				<Typography
					color={isItemSelected ? 'black' : 'blue-800'}
					className="font-normal uppercase"
				>
					<a href={filtro.url} target="_blank" rel="noreferrer">
						{filtro.nome}
					</a>
				</Typography>
				<Typography
					variant="h4"
					color={isItemSelected ? 'black' : 'blue-800'}
					className="mt-2 flex justify-center gap-1 text-2xl font-normal"
				>
					<span className="mt-2 text-sm">€</span>
					{filtro.costo.toFixed(2)}{' '}
				</Typography>
			</CardHeader>
			<CardBody className="p-0 mt-4">
				<Caratteristiche filtro={filtro} sostanze={sostanze} />
			</CardBody>
		</Card>
	);
};

// Componente Caratteristiche
const Caratteristiche = ({ filtro, setCurrentFiltro }) => {
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
		<div className="flex flex-wrap gap-2 text-xs mb-4 justify-center	">
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
								className="rounded-full pill"
								variant={
									valore === 1 ? 'filled' : valore < 1 ? 'ghost' : 'outlined'
								}
							/>
							{nota && (
								<Typography
									variant="small"
									color="white"
									className="font-normal"
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
