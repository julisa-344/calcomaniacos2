import React from 'react';
import { useEffect, useState } from "react";
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '../firebase-config';

interface ImageCatalogProps {
	onSelectImage: (src: string) => void;
}

const ImageCatalog: React.FC<ImageCatalogProps> = ({ onSelectImage }) => {
	const [images, setImages] = useState<any[]>([]);

	useEffect(() => {
		const fetchData = async () => {
		  const querySnapshot = await getDocs(collection(firestore, 'images'));
		  const data = querySnapshot.docs.map(doc => doc.data());
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