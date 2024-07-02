export interface Product {
  id: string;
  name: string;
  price: number;
  img: string;
  description?: string;
  acabado?: {
    glossy: string;
    matte: string;
    transparent: string;
  };
}
