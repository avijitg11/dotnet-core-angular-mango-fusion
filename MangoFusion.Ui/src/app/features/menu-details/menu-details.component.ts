import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { MenuItem } from "../../shared/models/menu.item";
import { MenuItemService } from "../../core/services/menuitem.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute, RouterLink } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { RoutePaths } from "../../shared/models/route.path";
import { CartItem } from "../../shared/models/cart.item";
import { CartService } from "../../core/services/cart.service";

@Component({
    selector:'app-menu-details',
    templateUrl:'./menu-details.component.html',
    styleUrls:['./menu-details.component.css'],
    imports:[RouterLink]
})
export class MenuDetailsComponent implements OnInit{
    private destroyRef = inject(DestroyRef);
    private menuItemService = inject(MenuItemService);
    private cartService = inject(CartService);
    private route = inject(ActivatedRoute);
    private toastr = inject(ToastrService);
    private price = 0;
    baseUrl = environment.apiUrl;
    routePaths = RoutePaths;
    isItemNotFound = signal(false);
    isError = signal(false);
    showLoader = signal(true);
    quantity = signal(1);
    subTotal = signal(1);
    menuItem = signal<MenuItem>({
        id: 0,
        name: '',
        price: 0,
        image: '',
        category:'',
        description:'',
        rating:0,
        specialTag:''
    });;
    
    ngOnInit(): void {
        const id = Number(this.route.snapshot.paramMap.get('id') ?? 0);
        this.menuItemService.getMenuItemById(id)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
            next: (response)=>{
                if(response.isSuccess){
                    this.menuItem.set(response.result);
                    this.price = response.result.price;
                    this.subTotal.set(this.price);
                }
                else{
                    this.isError.set(true);
                    this.showLoader.set(false);
                }
            },
            error: (err)=>{
                if(err.error.errorMessage[0].toLowerCase().includes('Item not found with id'.toLowerCase()))
                {
                    this.isItemNotFound.set(true);
                }
                else{
                    this.isError.set(true);
                }                
                this.showLoader.set(false);
            },
            complete:()=>{
                this.isError.set(false);
                this.showLoader.set(false);
                this.isItemNotFound.set(false);
            }
        });
    }

    onPlusQuantity(){
        if(this.quantity()<10)
        {
            this.quantity.set(this.quantity()+1);
            this.subTotal.set(this.quantity()*this.price);
        }            
        else
        {
            this.toastr.info('You can not add more than 10.');
        }            
    }

    onMinusQuantity(){
        if(this.quantity()>1)
        {
            this.quantity.set(this.quantity()-1);
            this.subTotal.set(this.quantity()*this.price);
        }
        else{
            this.toastr.info('You can not reduce less than 1.');
        }            
    }

    onAddToCart(){
        const cartItem : CartItem = {
            id:this.menuItem().id,
            name:this.menuItem().name,
            image:this.menuItem().image,
            price:this.menuItem().price,
            quantity:this.quantity(),
            isQuantityFixed:true
        }
        this.cartService.addToCart(cartItem);
    }
}