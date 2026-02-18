import { Component, inject, input } from "@angular/core";
import { MenuItem } from "../../../shared/models/menu.item";
import { environment } from "../../../../environments/environment";
import { RouterLink } from "@angular/router";
import { RoutePaths } from "../../../shared/models/route.path";
import { CartService } from "../../../core/services/cart.service";
import { CartItem } from "../../../shared/models/cart.item";


@Component({
    selector:'app-menu-item',
    templateUrl: './menu-item.component.html',
    styleUrls: ['./menu-item.component.css'],
    imports: [RouterLink]
})
export class MenuItemComponent{
    cartService = inject(CartService);
    menuItem = input.required<MenuItem>();
    baseUrl = environment.apiUrl;
    routePaths = RoutePaths;


    onAddToCart(){
        const cartItem : CartItem = {
            id:this.menuItem().id,
            name:this.menuItem().name,
            image:this.menuItem().image,
            price:this.menuItem().price,
            quantity:1,
            isQuantityFixed:false
        }
        this.cartService.addToCart(cartItem);
    }
}