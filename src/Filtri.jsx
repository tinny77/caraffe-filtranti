import React, { useEffect, useCallback, useRef } from 'react';
import { Typography } from '@material-tailwind/react';
import FiltriItem from './FiltriItem';

export default function Filtri({
	listaFiltri,
	currentFiltro,
	setCurrentFiltro,
	currentCaraffa,
	thisref,
}) {
	const getListaFiltri = useCallback(() => {
		//console.log("getListaFiltri");
		let filtri = listaFiltri.filter((f) => f.caraffe[currentCaraffa] === 1);
		filtri.length === 1 && setCurrentFiltro(filtri[0].asin);
		return filtri;
	}, [currentCaraffa]);

	const filtri = getListaFiltri();
	const totalFiltri = filtri.length;

	return (
		<>
<div
				ref={thisref}

			>
				{(listaFiltri && currentCaraffa ) && (
					<>
					<Typography
				variant="h3"
				color="white"
				className="pt-24 mb-0 text-2xl text-center"
			>
				Scegli un filtro
			</Typography>
				<div className="grid grid-flow-row grid-cols-2 lg:grid-cols-3 xl:auto-cols-fr gap-8 pt-6">


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
	)
}
				</div></>

	);
}
