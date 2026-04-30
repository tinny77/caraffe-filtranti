import React from 'react';
import { Typography } from '@material-tailwind/react';
import ProductItem from './ProductItem';
import { FaArrowsSpin } from 'react-icons/fa6';

export default function Products({
	loading,
	listaCaraffe,
	currentCaraffa,
	handleProductClick,
}) {
	return (
		<section id="caraffe" className="section-panel mt-8 px-5 py-8 md:px-8 md:py-10">
			{loading ? (
				<Typography
					variant="lead"
					className="py-32 text-center text-2xl text-slate-700"
				>
					<FaArrowsSpin className="loader-spin" />
				</Typography>
			) : (
				<>
					<div className="mx-auto max-w-3xl text-center">
						<p className="section-kicker">Selezione caraffe</p>
						<Typography variant="h2" className="title section-title text-slate-950">
							Scegli tra i modelli di caraffe filtranti disponibili
						</Typography>
						<Typography variant="lead" className="mt-4 text-base leading-7 text-slate-600 md:text-lg">
							Ogni scheda mostra prezzo indicativo, capacità e valutazioni.
						</Typography>
					</div>
					<div className="grid grid-flow-row grid-cols-1 pt-8 gap-5 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
						{listaCaraffe.map((product) => {
							return (
								<ProductItem
									code={product.code}
									key={product.code + product.asin}
									product={product}
									currentCar={currentCaraffa}
									handleProductClick={handleProductClick}
								/>
							);
						})}
					</div>
				</>
			)}
		</section>
	);
}
