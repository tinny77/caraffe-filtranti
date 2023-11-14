import React from 'react';
import {
	Card,
	CardBody,
	Typography,
	Button,
} from '@material-tailwind/react';
import { BsStarFill, BsStarHalf } from 'react-icons/bs';

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
const ProductItem = ({ code, product, currentCar, handleProductClick }) => {
	const isItemSelected = code === currentCar;

	return (
		<Card
			key={code}
			className={`product-col p-2 w-full _max-w-[90%] _mx-auto rounded-lg text-center shadow border-solid border-4 ${
				isItemSelected ? `border-blue-900 text-blue-800` : `border-white text-black`
			}`}
			onClick={() => handleProductClick(code)}
		>

			<CardBody>
				<Typography
					variant="h3"
					color={isItemSelected ? `blue-gray` : `blue-800`}
					className="mt-2 mb-6 text-2xl"
				>
					{product.custom_title}
				</Typography>
				<img
					src={product.image}
					className="max-w-fullrelative h-56 mx-auto mb-8"
					alt={product.title}
				/>
				<Typography>
					{product.capacita>0 && (
						<p className="rating">Capacità: {product.capacita} litri</p>
					)}
					<p className="rating">
						Rating: <Rating stars={product.rating} />{' '}
						<span>({product.rating_num})</span>
					</p>
				</Typography>
				<Typography
					variant="h4"
					color="black"
					className="mt-6 flex justify-center gap-1 text-3xl font-normal"
				>
					<span className="mt-2 text-sm">€</span>
					{JSON.stringify(product.price)}{' '}
				</Typography>
				<a href={product.link} target="_blank" rel="noreferrer">
					<Button className={`p-1 px-4 mt-5 rounded-md ${isItemSelected ? `bg-blue-800` : `bg-blue-gray-800`} `} >
						Vedi su Amazon
					</Button>
				</a>
			</CardBody>
		</Card>
	);
};

export default ProductItem;
