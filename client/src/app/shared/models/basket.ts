import { v4 as uuid } from 'uuid';

export interface IBasket {
  id: string;
  basketItems: IBasketItem[];
}

export interface IBasketItem {
    id: number;
    productName: string;
    price: number;
    quantity: number;
    pictureUrl: string;
    brand: string;
    type: string;
}

export interface IBasketTotals {
  shipping: number;
  subtotal: number;
  total: number;
}

export class Basket implements IBasket{
  id = uuid();
  basketItems: IBasketItem[] = [];
}