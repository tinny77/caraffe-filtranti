import React, { useState, useEffect } from 'react';

import Intro from './Intro';
import Caraffe from './Caraffe';
import Calcolatore from './Calcolatore';
import caraffeData from './data/caraffe.json';

const shuffleArray = (array) => {
	return array.sort(function () {
		return Math.random() - 0.5;
	});
};

const getFiltroString = (filtro = '') =>
	filtro ? '_' + filtro.toLowerCase().replace(/ /g, '') : '';

function App() {
	const [loadedData, setLoadedData] = useState([]);
	const [selectedCaraffa, setSelectedCaraffa] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			const loadedDataArray = await Promise.all(
				shuffleArray(caraffeData).map(async (entry) => {
					const response = await import(`./data/caraffe/${entry.file}`);
					const matchingCaraffe = caraffeData.find(
						(caraffe) => caraffe.asin === response.product.asin
					);
					return {
						asin: matchingCaraffe.asin,
						title: matchingCaraffe.title,
						link: response.product.link,
						price: response.product.buybox_winner.price.value,
						rating: response.product.rating,
						rating_num: response.product.ratings_total,
						image: response.product.main_image.link,
						custom_title: entry.title,
						filtri: matchingCaraffe.filtri,
					};
				})
			);
			setLoadedData(loadedDataArray);
		};

		fetchData();
	}, []);

	return (
		<div className="font-sans subpixel-antialiased text-white px-5 m-0 py-24">
			<Intro />
			{loadedData.length > 0 ? (
				<>
					<Caraffe
						lista={loadedData}
						setLista={setLoadedData}
						car={selectedCaraffa}
						setCar={setSelectedCaraffa}
						getFiltroString={getFiltroString}
					/>
					<Calcolatore
						lista={loadedData}
						mainfile={caraffeData}
						car={selectedCaraffa}
						setCar={setSelectedCaraffa}
						getFiltroString={getFiltroString}
					/>
				</>
			) : (
				<></>
			)}
		</div>
	);
}

export default App;
