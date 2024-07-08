import { createContext, Dispatch, SetStateAction } from 'react';

type CartItemType = {
  name: string;
  price: number;
  img: string;
  tamano: string;
  acabado: string;
};

export type CartContetType = {
  cart: CartItemType[];
  setCart: Dispatch<SetStateAction<CartItemType[]>>;
};

export const CartContext = createContext<CartContetType>({
  cart: [],
  setCart: () => {},
});