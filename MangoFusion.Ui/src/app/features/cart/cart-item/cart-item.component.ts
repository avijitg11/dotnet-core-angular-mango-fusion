import { Component, inject, input } from "@angular/core";
import { CartItem } from "../../../shared/models/cart.item";
import { environment } from "../../../../environments/environment";
import { CartService } from "../../../core/services/cart.service";


@Component({
    selector:'div[app-cart-item]',
    templateUrl:'./cart-item.component.html',
    styleUrls:['./cart-item.component.css']
})
export class CartItemComponent{
    private cartService = inject(CartService);
    cartItem = input.required<CartItem>();    
    baseUrl = environment.apiUrl;

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