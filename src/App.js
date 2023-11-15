import React, { useState, useEffect, useRef } from 'react';

import caraffeData from './data/caraffe.json';
import filtriData from './data/filtri.json';

import Intro from './Intro';
import Product from './Product';
import Filtri from './Filtri';
import Calcolatore from './Calcolatore';

const shuffleArray = (array) => {
	return array.sort(function () {
		return Math.random() - 0.5;
	});
};

function App() {
	const [caraffe, setCaraffe] = useState([]);
	const [selectedCaraffa, setSelectedCaraffa] = useState(null);
	const [filtri, setFiltri] = useState([]);
	const [selectedFiltro, setSelectedFiltro] = useState(null);
	const filterRef = useRef(null);
	const calcRef = useRef(null);
	const scrollToFilters = () => filterRef.current.scrollIntoView();
	const scrollToCalc = () => calcRef.current.scrollIntoView();

	const handleProductClick = (code) => {
		setSelectedCaraffa(code);
		resetCalcoloFiltri();
		scrollToFilters();
		//ref.current?.scrollIntoView({ behavior: 'smooth' });
	};

	const resetCalcoloFiltri = () => {
		setSelectedFiltro(null);
	};

	useEffect(() => {
		selectedFiltro && scrollToCalc();
		selectedCaraffa && scrollToFilters();
	}, [selectedFiltro, selectedCaraffa]);

	useEffect(() => {
		resetCalcoloFiltri();
	}, [selectedCaraffa]);

	useEffect(() => {
		const fetchCaraffe = async () => {
			const caraffeArray = await Promise.all(
				shuffleArray(caraffeData).map(async (entry) => {
					const caraffaAmznData = await import(`./data/caraffe/${entry.file}`);
					const caraffaData = caraffeData.find(
						(car) => car.asin === caraffaAmznData.product.asin
					);
					return {
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
				})
			);
			setCaraffe(caraffeArray);
		};

		fetchCaraffe();
		setFiltri(filtriData);
	}, []);

	return (
		<div className="container mx-auto font-sans subpixel-antialiased text-white px-5 m-0 pt-24 pb-2">
			<Intro />
			{caraffeData.length > 0 && (
				<>
					<Product
						listaCaraffe={caraffe}
						currentCaraffa={selectedCaraffa}
						handleProductClick={handleProductClick}
					/>

					<Filtri
						listaFiltri={filtri}
						currentFiltro={selectedFiltro}
						setCurrentFiltro={setSelectedFiltro}
						currentCaraffa={selectedCaraffa}
						thisref={filterRef}
					/>

					<Calcolatore
						listaCaraffe={caraffe}
						currentCaraffa={selectedCaraffa}
						setCurrentCaraffa={setSelectedCaraffa}
						listaFiltri={filtri}
						currentFiltro={selectedFiltro}
						setCurrentFiltro={setSelectedFiltro}
						thisref={calcRef}
					/>
					<footer className="text-center text-xs text-blue-200 mt-20 py-2">
						Realizzato da{' '}
						<a href="https://www.filippotinnirello.it/" target="_blank">
							Filippo Tinnirello
						</a>
					</footer>
				</>
			)}
		</div>
	);
}

export default App;
