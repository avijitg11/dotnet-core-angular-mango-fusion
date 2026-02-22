import { Component, effect, inject, input, signal } from "@angular/core";
import { MenuItem } from "../../../shared/models/menu.item";
import { environment } from "../../../../environments/environment";
import { RouterLink } from "@angular/router";
import { RoutePaths } from "../../../shared/models/route.path";
import { CartService } from "../../../core/services/cart.service";
import { CartItem } from "../../../shared/models/cart.item";
import { RatingComponent } from "../../../shared/components/rating/rating.component";


@Component({
    selector:'app-menu-item',
    templateUrl: './menu-item.component.html',
    imports: [RouterLink,RatingComponent]
})
export class MenuItemComponent{
    private cartService = inject(CartService);
    menuItem = input.required<MenuItem>();
    baseUrl = environment.apiUrl;
    routePaths = RoutePaths;
    rating = signal(0);

    constructor() {
        effect(() => {
            const detail = this.menuItem();
            this.rating.set(
                detail?.rating == null ? 0 : +detail.rating
            );
        });
    }

    onAddToCart(){
        const cartItem : CartItem = {
            id:this.menuItem().id,
            name:this.menuItem().name,
            image:this.menuItem().image,
            price:this.menuItem().price,
            quantity:1,
            isQuantityFixed:false,
            rating:this.menuItem().rating
        }
        this.cartService.addToCart(cartItem);
    }
}