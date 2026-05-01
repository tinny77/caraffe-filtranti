import React from 'react';
import {
	Card,
	CardBody,
	Typography,
	Button,
} from '@material-tailwind/react';
import { BsStarFill, BsStarHalf } from 'react-icons/bs';

const formatCurrency = (value) =>
	new Intl.NumberFormat('it-IT', {
		style: 'currency',
		currency: 'EUR',
		maximumFractionDigits: 2,
	}).format(Number(value) || 0);

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

	return <div className="flex items-center gap-1 text-amber-500">{rating}</div>;
};

// Componente ProductItem
const ProductItem = ({ code, product, currentCar, handleProductClick }) => {
	const isItemSelected = code === currentCar;

	return (
		<Card
			key={code}
			className={`product-card h-full w-full rounded-[1.75rem] border p-2 text-center shadow-xl shadow-sky-950/5 ${
				isItemSelected
					? `border-sky-500 bg-white text-sky-950`
					: `border-white/70 bg-white text-slate-900`
			}`}
			title={product.title}
		>
			<CardBody className="flex h-full flex-col p-4 md:p-5">
				<div className="mb-4 flex items-center justify-between gap-3 text-left">
					<span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-sky-800">
						{product.capacita > 0 ? `${product.capacita} L` : 'Capacita n.d.'}
					</span>
					{isItemSelected && (
						<span className="inline-flex rounded-full bg-sky-600 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white">
							Selezionata
						</span>
					)}
				</div>
				<Typography
					variant="h3"
					className="mt-2 min-h-[4.5rem] text-left text-2xl font-semibold leading-tight text-slate-950"
				>
					{product.custom_title}
				</Typography>
				<img
					src={product.image}
					className="mx-auto mb-6 h-56 max-w-full object-contain p-3"
					alt={product.title}
					loading="lazy"
					decoding="async"
				/>
				<Typography className="space-y-2 text-left text-sm leading-6 text-slate-600">
					{product.capacita > 0 && (
						<p className="rating">Capacita: {product.capacita} litri</p>
                    )}
                    {product.rating > 0 && (
					<p className="rating flex items-center gap-2">
						Rating: <Rating stars={product.rating} />{' '}
						<span>({product.rating_num})</span>
					</p>
                    )}
				</Typography>
				<Typography
					variant="h4"
					className="mt-6 text-left text-3xl font-semibold text-slate-950"
				>
					{formatCurrency(product.price)}
				</Typography>
				<p className="mt-2 text-left text-sm text-slate-500">
					Prezzo indicativo rilevato online. Verifica disponibilità e condizioni sullo store.
				</p>
				<div className="mt-6 grid gap-3 sm:grid-cols-2">
					<Button
						type="button"
						onClick={() => handleProductClick(code)}
						className={`rounded-xl px-4 py-3 text-sm font-semibold text-white shadow-none ${
							isItemSelected ? '!bg-sky-700' : '!bg-sky-600'
						}`}
					>
						{isItemSelected ? 'Caraffa selezionata' : 'Seleziona caraffa'}
					</Button>
					<a href={product.link} target="_blank" rel="noreferrer">
					<Button
							className="w-full rounded-xl border border-sky-200 bg-white px-4 py-3 text-sm font-semibold text-sky-900 shadow-none"
					>
						Vedi su Amazon
					</Button>
				</a>
				</div>
			</CardBody>
		</Card>
	);
};

export default ProductItem;
