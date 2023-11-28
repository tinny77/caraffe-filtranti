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
		<>
			{loading ? (
				<Typography
					variant="lead"
					color="white"
					className="py-48 text-2xl text-center"
				>
					<FaArrowsSpin className="loader-spin" />
				</Typography>
			) : (
				<>
					<Typography
						variant="h3"
						color="white"
						className="title pt-24 mb-0 text-2xl text-center"
					>
						Scegli una caraffa
					</Typography>
					<div className="grid grid-flow-row grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 pt-6 gap-8">
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
		</>
	);
}
