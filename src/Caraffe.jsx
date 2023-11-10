import React, { useEffect } from 'react';

import ProductItem from './ProductItem';

export default function Caraffe({
	lista,
	setLista,
	car,
	setCar,
	getFiltroString,
}) {
	const remove = (selectedCar) => {
		setLista(
			(prevLista) =>
				prevLista
					.map((el) => {
						if (el.asin === selectedCar) {
							// Rimuovi l'intero elemento se l'asin corrisponde
							return null;
						} else if (selectedCar.includes('_')) {
							const [entryAsin, entryFiltro] = selectedCar.split('_');

							if (el.asin === entryAsin) {
								//Cerco il filtro
								const updFilters = el.filtri.filter((filtro) => {
									return getFiltroString(filtro.nome) !== '_' + entryFiltro;
								});
								el.filtri = updFilters;
							}
						}
						return el;
					})
					.filter(Boolean) // Rimuovi gli elementi null (quelli con asin corrispondente)
		);
	};

	useEffect(() => {
		const resizeHandler = () => {
			const elements = document.querySelectorAll('.product-col');
			let maxHeight = 0;
			let totalWidth = 0;

			elements.forEach((element) => {
				element.style.height = 'auto'; // Reset height before recalculating
				const elementHeight = element.offsetHeight;

				totalWidth +=
					element.offsetWidth +
					parseFloat(window.getComputedStyle(element).marginRight);

				if (elementHeight > maxHeight) {
					maxHeight = elementHeight;
				}
			});

			elements.forEach((element) => {
				element.style.height = `${maxHeight}px`;
			});

			const container = document.querySelector('.scroll-container');
			if (container) {
				container.style.height = `${maxHeight + 25}px`;
			}
			const itemscontainer = document.querySelector('.items-container');
			if (itemscontainer) {
				itemscontainer.style.height = `${maxHeight}px`;
				itemscontainer.style.width = `${totalWidth}px`;
			}
		};

		window.addEventListener('resize', resizeHandler);
		resizeHandler(); // Call the function on initial load

		return () => {
			window.removeEventListener('resize', resizeHandler);
		};
	}, [lista]);

	return (
		<div className="product-grid my-40">
			<div className="intro pr-5">
				Scorri orizzontalmente il riquadro a destra per visualizzare i diversi
				prodotti.
				<br />
				Puoi scartare un prodotto premendo la X, mentre cliccando nel riquadro
				lo selezionerai per il calcolatore.
				<br />
				<br />
				L'ordine è sempre casuale, per non influenzare la tua decisione!
			</div>
			<div className="items">
				<div className="scroll-container">
					<div className="items-container">
						{lista.flatMap((entry) => {
							if (entry.filtri.length > 1) {
								return entry.filtri.map((filtro) => (
									<ProductItem
										key={entry.asin + getFiltroString(filtro.nome)}
										lista={lista}
										entry={entry}
										filtro={filtro}
										filtrostring={getFiltroString(filtro.nome)}
										car={car}
										setCar={setCar}
										remove={remove}
									/>
								));
							} else {
								return (
									<ProductItem
										key={entry.asin}
										lista={lista}
										entry={entry}
										filtro={entry.filtri[0]}
										filtrostring={''}
										car={car}
										setCar={setCar}
										remove={remove}
									/>
								);
							}
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
