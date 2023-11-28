import React, { useState, useEffect, useRef } from 'react';
import { Typography } from '@material-tailwind/react';

import caraffeData from './data/caraffe.json';
import filtriData from './data/filtri.json';

import Intro from './components/Intro';
import Products from './components/Products';
import Filtri from './components/Filtri';
import Calcolatore from './components/Calcolatore';

const shuffleArray = (array) => {
	return array.sort(function () {
		return Math.random() - 0.5;
	});
};

function App() {
	const [loading, setLoading] = useState(true);
	const [caraffe, setCaraffe] = useState([]);
	const [selectedCaraffa, setSelectedCaraffa] = useState(null);
	const [filtri, setFiltri] = useState([]);
	const [selectedFiltro, setSelectedFiltro] = useState(null);
	const filterRef = useRef(null);
	const calcRef = useRef(null);
	//const scrollToFilters = () => filterRef.current.scrollIntoView();
	//const scrollToCalc = () => calcRef.current.scrollIntoView();

	const handleProductClick = (code) => {
		setSelectedCaraffa(code);
		resetCalcoloFiltri();
		//scrollToFilters();
	};

	const resetCalcoloFiltri = () => {
		setSelectedFiltro(null);
	};

	/*useEffect(() => {
		selectedFiltro && scrollToCalc();
		selectedCaraffa && scrollToFilters();
	}, [selectedFiltro, selectedCaraffa]);*/

	useEffect(() => {
		resetCalcoloFiltri();
	}, [selectedCaraffa]);

	useEffect(() => {
		const fetchCaraffe = async () => {
			const caraffeArray = [];
			const shuffledCaraffeData = shuffleArray(caraffeData);

			for (const entry of shuffledCaraffeData) {
				const caraffaAmznData = await import(`./data/caraffe/${entry.file}`);

				const caraffaData = caraffeData.find(
					(car) => car.asin === caraffaAmznData.product.asin
				);
				const caraffeItem = {
					asin: caraffaData.asin,
					code: caraffaData.code,
					custom_title: caraffaData.title,
					title: caraffaAmznData.product.title,
					link: caraffaAmznData.product.link,
					price: caraffaAmznData.product.buybox_winner.price.value,
					capacita: caraffaData.capacita,
					rating: caraffaAmznData.product.rating,
					rating_num: caraffaAmznData.product.ratings_total,
					image: caraffaAmznData.product.main_image.link,
				};

				caraffeArray.push(caraffeItem);
			}
			setTimeout(() => {
				setLoading(false);
			}, 2500);

			setCaraffe(caraffeArray);
		};

		fetchCaraffe();
		setFiltri(filtriData);
	}, []);

	return (
		<div className="container mx-auto font-sans subpixel-antialiased text-white px-5 m-0 pt-24 pb-2">
			<Intro />
			{caraffeData.length ? (
				<>
					<Products
						listaCaraffe={caraffe}
						currentCaraffa={selectedCaraffa}
						handleProductClick={handleProductClick}
						loading={loading}
					/>

					<Filtri
						listaFiltri={filtri}
						currentFiltro={selectedFiltro}
						setCurrentFiltro={setSelectedFiltro}
						currentCaraffa={selectedCaraffa}
						thisref={filterRef}
						loading={loading}
					/>

					<Calcolatore
						listaCaraffe={caraffe}
						currentCaraffa={selectedCaraffa}
						setCurrentCaraffa={setSelectedCaraffa}
						listaFiltri={filtri}
						currentFiltro={selectedFiltro}
						setCurrentFiltro={setSelectedFiltro}
						thisref={calcRef}
						loading={loading}
					/>
					{!loading && (
						<footer className="text-center text-xs text-blue-200 mt-20 py-2">
							Realizzato da{' '}
							<a
								href="http://www.filippotinnirello.it/"
								target="_blank"
								rel="noreferrer"
							>
								Filippo Tinnirello
							</a>
						</footer>
					)}
				</>
			) : (
				<Typography
					variant="lead"
					color="white"
					className="title pt-24 mb-0 text-2xl text-center"
				>
					Dati mancanti
				</Typography>
			)}
		</div>
	);
}

export default App;
