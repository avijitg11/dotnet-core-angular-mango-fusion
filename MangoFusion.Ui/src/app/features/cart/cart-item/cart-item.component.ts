import { Component, effect, inject, input, signal } from "@angular/core";
import { CartItem } from "../../../shared/models/cart.item";
import { environment } from "../../../../environments/environment";
import { CartService } from "../../../core/services/cart.service";
import { RatingComponent } from "../../../shared/components/rating/rating.component";


@Component({
    selector:'div[app-cart-item]',
    templateUrl:'./cart-item.component.html',
    imports:[RatingComponent]
})
export class CartItemComponent{
    private cartService = inject(CartService);
    cartItem = input.required<CartItem>();    
    baseUrl = environment.apiUrl;
    rating = signal(0);
    
    constructor() {
        effect(() => {
            const detail = this.cartItem();
            this.rating.set(
                detail?.rating == null ? 0 : +detail.rating
            );
        });
    }
    
    onAddItem(){
        this.cartItem().quantity += 1; 
        this.cartItem().isQuantityFixed = true; 
        this.cartService.addToCart(this.cartItem());
    }

    onReduceItem(){
        this.cartItem().quantity -= 1; 
        this.cartItem().isQuantityFixed = true; 
        this.cartService.addToCart(this.cartItem());
    }

    onRemoveItem(){
        this.cartItem().quantity = 0; 
        this.cartItem().isQuantityFixed = true; 
        this.cartService.addToCart(this.cartItem());
    }
}