import { useEffect, useState, useRef, useContext } from 'react';
import { IconButton } from '@mui/material';
import Button from '../components/Button';
import './style/MakeCollection.scss';
import { fabric } from 'fabric';
import ColorLensIcon from '@mui/icons-material/ColorLens';
import GestureIcon from '@mui/icons-material/Gesture';
import GradientIcon from '@mui/icons-material/Gradient';
import html2canvas from 'html2canvas';
import { CartContext, CartContetType } from '../CartContext';
import { SketchPicker } from 'react-color';

class AddBorder extends fabric.Image.filters.BaseFilter {
	type = 'AddBorder';
	borderSize: number;
	borderColor: string;
	textureWidth: number;
	textureHeight: number;

	constructor(options: { borderSize?: number, borderColor?: string, textureWidth?: number, textureHeight?: number }) {
		super();
		this.borderSize = options.borderSize || 20;
		this.borderColor = options.borderColor || '#FFFFFF';
		this.textureWidth = options.textureWidth || 0;
		this.textureHeight = options.textureHeight || 0;
	}

	fragmentSource = `
	precision highp float;
	uniform sampler2D uTexture;
	uniform float uBorderSize;
	uniform vec4 uBorderColor;
	varying vec2 vTexCoord;
	uniform vec2 uTextureSize;

	void main() {
		vec4 color = texture2D(uTexture, vTexCoord);
		if (color.a == 0.0) {
			vec2 offset[8];
			offset[0] = vec2(-1.0, -1.0);
			offset[1] = vec2(0.0, -1.0);
			offset[2] = vec2(1.0, -1.0);
			offset[3] = vec2(-1.0, 0.0);
			offset[4] = vec2(1.0, 0.0);
			offset[5] = vec2(-1.0, 1.0);
			offset[6] = vec2(0.0, 1.0);
			offset[7] = vec2(1.0, 1.0);

			for (int i = 0; i < 8; i++) {
				vec4 sample = texture2D(uTexture, vTexCoord + offset[i] * uBorderSize / uTextureSize);
				if (sample.a > 0.0) {
					color = uBorderColor;
					break;
				}
			}
		}
		gl_FragColor = color;
	}
`;

	applyTo2d(options: { imageData: ImageData }) {
		const imageData = options.imageData;
		const data = imageData.data;
		const width = imageData.width;
		const height = imageData.height;
		const borderSize = this.borderSize;

		const copy = new Uint8ClampedArray(data);

		for (let y = 0; y < height; y++) {
			for (let x = 0; x < width; x++) {
				const index = (y * width + x) * 4;
				if (copy[index + 3] === 0) {
					let hasNeighbor = false;
					for (let dy = -borderSize; dy <= borderSize; dy++) {
						for (let dx = -borderSize; dx <= borderSize; dx++) {
							const nx = x + dx;
							const ny = y + dy;
							if (nx >= 0 && nx < width && ny >= 0 && ny < height) {
								const neighborIndex = (ny * width + nx) * 4;
								if (copy[neighborIndex + 3] > 0) {
									hasNeighbor = true;
									break;
								}
							}
						}
						if (hasNeighbor) break;
					}
					if (hasNeighbor) {
						data[index] = parseInt(this.borderColor.slice(1, 3), 16);
						data[index + 1] = parseInt(this.borderColor.slice(3, 5), 16);
						data[index + 2] = parseInt(this.borderColor.slice(5, 7), 16);
						data[index + 3] = 255;
					}
				}
			}
		}
	}

	isNeutralState() {
		return this.borderSize === 0;
	}

	getUniformLocations(gl: WebGLRenderingContext, program: WebGLProgram) {
		return {
			uTexture: gl.getUniformLocation(program, 'uTexture'),
			uBorderSize: gl.getUniformLocation(program, 'uBorderSize'),
			uBorderColor: gl.getUniformLocation(program, 'uBorderColor'),
			uTextureSize: gl.getUniformLocation(program, 'uTextureSize'),
		};
	}

	sendUniformData(gl: WebGLRenderingContext, uniformLocations: any) {
		gl.uniform1f(uniformLocations.uBorderSize, this.borderSize);
		const color = this.borderColor.match(/\w\w/g)?.map(x => parseInt(x, 16) / 255) ?? [1, 0, 0];
		gl.uniform4f(uniformLocations.uBorderColor, color[0], color[1], color[2], 1);
		gl.uniform2f(uniformLocations.uTextureSize, this.textureWidth, this.textureHeight);
	}
}

function MakeCollection() {
	const { cart, setCart } = useContext<CartContetType>(CartContext);
	const canvasRef = useRef<fabric.Canvas | null>(null);
	const [images, setImages] = useState<any[]>([]);
	const [colorPickerVisible, setColorPickerVisible] = useState(false);
	const [borderColor, setBorderColor] = useState('#7A11F9');
	const colorPickerRef = useRef<HTMLDivElement | null>(null);

	const handleColorChange = (color: any) => {
		setBorderColor(color.hex);
		const activeObject = canvasRef.current?.getActiveObject() as fabric.Image;
		if (activeObject) {
			const borderFilter = activeObject.filters?.find(filter => filter instanceof AddBorder) as AddBorder;
			if (borderFilter) {
				borderFilter.borderColor = color.hex;
				activeObject.applyFilters();
				canvasRef.current?.renderAll();
			}
		}
	};

	const handleScreenshot = async () => {
		const canvasElement = document.getElementById('canvas');
		if (canvasElement) {
			const screenshot = await html2canvas(canvasElement);
			const screenshotUrl = screenshot.toDataURL();
			console.log(screenshotUrl);
			setCart([...cart, { name: 'Colección personalizada', price: 12, img: screenshotUrl }]);
		}
	}

	useEffect(() => {

		const fetchData = async () => {
			const response = await fetch("data.json");
			const data = await response.json();
			setImages(data);
		};
		fetchData();

		const canvas = new fabric.Canvas('canvas', {
			selection: true,
		});

		canvasRef.current = canvas;

		const handleClickOutside = (event: MouseEvent) => {
			if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
				setColorPickerVisible(false);
			}
		};

		const handleKeyDown = (event: KeyboardEvent) => {

			if (event.key === 'Delete' || event.key === 'Backspace') {

				const activeObject = canvas.getActiveObject();

				if (activeObject) {
					canvas.remove(activeObject);
					canvas.renderAll();
				}
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleKeyDown);

		return () => {
			canvas.dispose();
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, []);

	const addToCanvas = async (image: { src: string }) => {
		try {
			fabric.Image.fromURL(image.src, (img) => {
				if (!img.width || !img.height) {
					console.error('Image width or height is undefined');
					return;
				}

				img.set({
					left: 100,
					top: 100,
					scaleX: 0.5,
					scaleY: 0.5,
					hasBorders: false,
					hasControls: true,
				});

				const borderFilter = new AddBorder({
					borderSize: 20,
					borderColor: borderColor,
					textureWidth: img.width,
					textureHeight: img.height
				});

				img.filters = [borderFilter];
				img.applyFilters();

				if (canvasRef.current) {
					canvasRef.current.add(img);
					canvasRef.current.setActiveObject(img);
					canvasRef.current.renderAll();
					console.log('Image added to canvas');
				}
			});
		} catch (error) {
			console.log('Error uploading image:', error);
		}
	};

	return (
		<>
			<main className="bg-color mt-h">
				<h2 className='title pt-8 text-center'>Crea tu colección</h2>
				<section className="container">
					<div className="content-canvas">
						<div className="action-canvas">
							<div className="color-picker-container">
								<IconButton onClick={() => setColorPickerVisible(!colorPickerVisible)}>
									<ColorLensIcon />
								</IconButton>
								{colorPickerVisible && (
									<div
										ref={colorPickerRef}
										style={{ position: 'absolute', zIndex: '2' }}>
										<SketchPicker color={borderColor} onChangeComplete={handleColorChange} />
									</div>
								)}
								<IconButton>
									<GestureIcon />
								</IconButton>
								<IconButton>
									<GradientIcon />
								</IconButton>
							</div>

						</div>
						<canvas id="canvas" width="467" height="750" ></canvas>
					</div>
					<div className="catalog-container text-center">
						<div className="catalog-categories"></div>
						<div id="catalog" className="container_catalog-img m-b">
							{images.map((image, index) => (
								<img
									key={index}
									src={image.src}
									alt="sticker"
									className="catalog-img"
									onClick={() => addToCanvas(image)}
								/>
							))}
						</div>
						<Button className="m-t" text="Agregar al carrito" onClick={handleScreenshot} variant='outlined' />
					</div>
				</section>
			</main>
		</>
	);
}

export default MakeCollection;
