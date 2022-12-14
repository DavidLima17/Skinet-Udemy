import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrComponentlessModule } from 'ngx-toastr';
import { BehaviorSubject, map } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Basket, IBasket, IBasketItem, IBasketTotals } from '../shared/models/basket';
import { IProduct } from '../shared/models/product';

@Injectable({
  providedIn: 'root'
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  private basketTotalSource = new BehaviorSubject<IBasketTotals>(null);
  basket$ = this.basketSource.asObservable();
  basketTotal$ = this.basketTotalSource.asObservable();

  constructor(private http: HttpClient) { }

  getBasket(id: string){
    return this.http.get(this.baseUrl + 'basket?id=' + id).pipe(
      map((basket: IBasket) => {
        this.basketSource.next(basket);
        this.calculateTotals();
      })
    );
  }

  setBasket(basket: IBasket){
    return this.http.post(this.baseUrl + 'basket', basket).subscribe((response: IBasket) => {
      this.basketSource.next(response);
      this.calculateTotals();
    }, error => {
      console.log(error);
    });
  }

  //helper method to return the value of BasketSource
  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1){
    const itemToAdd: IBasketItem = this.mapProductItemToBasketItem(item, quantity);
    let basket = this.getCurrentBasketValue();
    if (basket === null) {
      basket = this.createBasket();
    }
    basket.basketItems = this.addOrUpdateItem(basket.basketItems, itemToAdd, quantity);
    this.setBasket(basket);
  }

  incrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.basketItems.findIndex(x => x.id === item.id);
    basket.basketItems[foundItemIndex].quantity++;
    this.setBasket(basket);
  }

  decrementItemQuantity(item: IBasketItem){
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.basketItems.findIndex(x => x.id === item.id);
    if(basket.basketItems[foundItemIndex].quantity > 1){
      basket.basketItems[foundItemIndex].quantity--;
    }else{
      this.removeItemFromBasket(item);
    }
    this.setBasket(basket);
  }

  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if(basket.basketItems.some(x => x.id === item.id)){
      basket.basketItems = basket.basketItems.filter(i => i.id !== item.id);
      if(basket.basketItems.length > 0) {
        this.setBasket(basket);
      }else{
        this.deleteBasket(basket);
      }
    }
  }

  deleteBasket(basket: IBasket) {
    return this.http.delete(this.baseUrl + 'basket?id=' + basket.id).subscribe(() => {
      this.basketSource.next(null);
      this.basketTotalSource.next(null);
      localStorage.removeItem('basket_id');
    }, error => {
      console.error(error);
    });
  }

  private addOrUpdateItem(basketItems: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    console.log(basketItems);
    const index = basketItems.findIndex(i => i.id === itemToAdd.id);
    if(index === -1){
      itemToAdd.quantity = quantity;
      basketItems.push(itemToAdd);
    }else {
      basketItems[index].quantity += quantity;
    }

    return basketItems;
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private calculateTotals() {
    const basket = this.getCurrentBasketValue();
    const shipping = 0;
    const subtotal = basket.basketItems.reduce((a, b) => (b.price *b.quantity) + a, 0);
    const total = shipping + subtotal;
    this.basketTotalSource.next({shipping, total, subtotal});
  }

  private mapProductItemToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    };
  }
}

