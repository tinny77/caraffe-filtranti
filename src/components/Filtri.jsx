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

	const totalFiltri = filtri.length;

	return (
		<>
			{!loading && (
				<div ref={thisref}>
					{listaFiltri && currentCaraffa && (
						<>
							<Typography
								variant="h3"
								color="white"
								className="title pt-24 mb-0 text-2xl text-center"
							>
								Scegli un filtro
							</Typography>
							<div className="flex-1 flex-wrap pt-6 text-center">
								{filtri.map((product) => {
									return (
										<FiltriItem
											code={product.asin}
											key={product.asin}
											filtro={product}
											currentFiltro={currentFiltro}
											setCurrentFiltro={setCurrentFiltro}
											totalFiltri={totalFiltri}
										/>
									);
								})}
							</div>
						</>
					)}
				</div>
			)}
		</>
	);
});

export default Filtri;
