import React from 'react';
import { useEffect, useState } from "react";

interface ImageCatalogProps {
	onSelectImage: (src: string) => void;
}

const ImageCatalog: React.FC<ImageCatalogProps> = ({ onSelectImage }) => {
	const [images, setImages] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
			const response = await fetch("data.json");
			const data = await response.json();
			setImages(data);
		};
		fetchData();
	}, []);

	return (
		<div className="catalog-container">
			<div className="catalog-categories"></div>
			<div id="catalog" className="container_catalog-img">
				{images.map((image, index) => (
					<img
						key={index}
						src={image.src}
						alt={`Imagen de ${image.categoria}`}
						className="catalog-img"
						onClick={() => onSelectImage(image.src)}
					/>
				))}
			</div>
		</div>
	);
};

export default ImageCatalog;