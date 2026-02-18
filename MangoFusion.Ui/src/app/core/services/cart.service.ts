import { Injectable, signal, effect, inject } from '@angular/core';
import { CartItem } from '../../shared/models/cart.item';
import { ToastrService } from 'ngx-toastr';
import { LocalStorage } from '../../shared/models/localstorage';

@Injectable({
  providedIn: 'root'
})
export class CartService {
    private toastr = inject(ToastrService);
    private storageKey = LocalStorage.CART_ITEMS;
    private maxLimit = 10;

    cartItemList = signal<CartItem[]>(this.loadFromStorage());

    constructor() {
        effect(() => {
            const items = this.cartItemList(); 

            if (items.length > 0) {
                try {
                    localStorage.setItem(this.storageKey, JSON.stringify(items));
                } catch (error) {
                    console.error('Error saving cart to localStorage', error);
                }
            } else {
                localStorage.removeItem(this.storageKey);
            }
        });
    }

    addToCart(cartItem: CartItem) {
        const addedQty = cartItem.quantity ?? 1;

        this.cartItemList.update(items => {
            const existing = items.find(i => i.id === cartItem.id);

            if (existing) {
                // Calculate new quantity, considering fixed quantity flag
                const newQuantity = cartItem.isQuantityFixed !== true
                    ? existing.quantity + addedQty
                    : addedQty;

                if (newQuantity > this.maxLimit) {
                    this.toastr.error(
                        `Maximum quantity limit (${this.maxLimit}) reached for this item.`,
                        'Error'
                    );
                }
                else{
                    this.toastr.success(
                        `Cart updated successfully.`,
                        'Success'
                    );
                }

                // Map items and update quantity, then filter out any with quantity 0
                return items
                    .map(i =>
                    i.id === cartItem.id
                        ? {
                            ...i,
                            quantity: Math.min(newQuantity, this.maxLimit)
                        }
                        : i
                    )
                    .filter(i => i.quantity > 0); // Remove items with quantity 0
            }

            // Adding new item
            if (addedQty > this.maxLimit) {
                this.toastr.error(
                    `Maximum quantity limit (${this.maxLimit}) reached for this item.`,
                    'Error'
                );
            }
            else{
                this.toastr.success(
                    `Cart updated successfully.`,
                    'Success'
                );
            }

            return [
                ...items,
                {
                    ...cartItem,
                    quantity: Math.min(addedQty, this.maxLimit)
                }
            ].filter(i => i.quantity > 0); // Extra safety
        });
    }

    clearCart(showToastr:boolean){
        this.cartItemList.set([]);
        localStorage.removeItem(this.storageKey);
        if(showToastr){
            this.toastr.success(
                `Cart clear successfully.`,
                'Success'
            );
        }        
    }

    private loadFromStorage(): CartItem[] {
        const data = localStorage.getItem(this.storageKey);
        return data ? JSON.parse(data) : [];
    }
}
