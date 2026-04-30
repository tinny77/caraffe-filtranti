import React, { useCallback, useState, useEffect, memo } from 'react';
import { Typography } from '@material-tailwind/react';
import FiltriItem from './FiltriItem';

const Filtri = memo(function Filtri({
	listaFiltri,
	currentFiltro,
	setCurrentFiltro,
	currentCaraffa,
	thisref,
	loading,
}) {
	const [filtri, setFiltri] = useState([]);

	const getListaFiltri = useCallback(() => {
		//console.log("getListaFiltri");
		let filtri = listaFiltri.filter((f) => f.caraffe[currentCaraffa] === 1);
		filtri.length === 1 && setCurrentFiltro(filtri[0].asin);
		return filtri;
	}, [currentCaraffa, listaFiltri, setCurrentFiltro]);

	useEffect(() => {
		const updatedFiltri = getListaFiltri();
		setFiltri(updatedFiltri);
	}, [getListaFiltri]);

	return (
		<>
			{!loading && (
				<section ref={thisref} id="filtri" className="section-panel mt-8 px-5 py-8 md:px-8 md:py-10">
					{listaFiltri && currentCaraffa && (
						<>
							<div className="mx-auto max-w-3xl text-center">
								<p className="section-kicker">Filtri compatibili</p>
								<Typography variant="h2" className="title section-title text-slate-950">
									Scegli il filtro tra quelli compatibili
								</Typography>
								<Typography variant="lead" className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
									Confronta prezzo, durata e sostanze filtrate per capire quanto puo
									incidere ogni cartuccia sul costo annuo reale.
								</Typography>
							</div>
							<div className="grid flex-1 gap-5 pt-8 text-center lg:grid-cols-2 xl:grid-cols-3">
								{filtri.map((product) => {
									return (
										<FiltriItem
											code={product.asin}
											key={product.asin}
											filtro={product}
											currentFiltro={currentFiltro}
											setCurrentFiltro={setCurrentFiltro}
										/>
									);
								})}
							</div>
						</>
					)}
				</section>
			)}
		</>
	);
});

export default Filtri;
