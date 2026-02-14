import { Component, DestroyRef, inject, OnInit, signal } from "@angular/core";
import { environment } from "../../../environments/environment";
import { MenuItem } from "../../shared/models/menu.item";
import { MenuItemService } from "../../core/services/menuitem.service";
import { takeUntilDestroyed } from "@angular/core/rxjs-interop";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";

@Component({
    selector:'app-menu-details',
    templateUrl:'./menu-details.component.html',
    styleUrls:['./menu-details.component.css']
})
export class MenuDetailsComponent implements OnInit{
    menuItem = signal<MenuItem | null>(null);
    baseUrl = environment.apiUrl;
    private destroyRef = inject(DestroyRef);
    private menuItemService = inject(MenuItemService);
    private route = inject(ActivatedRoute);
    private toastr = inject(ToastrService);
    isItemNotFound = signal(false);
    isError = signal(false);
    showLoader = signal(true);
    quantity = signal(1);
    subTotal = signal(1);
    private price = 0;

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
}